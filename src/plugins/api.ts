import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type { App } from 'vue';
import type { ApiUtils, Params } from '@/api/types';
import qs from 'qs';
import Auth from '@/api/auth';
import Product from '@/api/product';
import ProductType from '@/api/product_type';
import Cart from '@/api/cart';
import Service from '@/api/service';
import ServiceMenu from '@/api/service_menu';
import EmailSubscriber from '@/api/email_subscriber';
import Notification from '@/api/notification';
import Kitchen from '@/api/kitchen';
import KitchenStation from '@/api/kitchen_station';
import Tenant from '@/api/tenant';
import { postLogout } from '@/utils/broadcast';
import { supabase } from '@/plugins/supabase';
import { useKitchenStationStore } from '@/stores/kitchenStation';
import router from '@/router';

export let axiosInstance: AxiosInstance;


const isObject = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object';


export default {
    install: (app: App) => {
        const baseURL = import.meta.env.VITE_API_BASE_URL;

        axiosInstance = axios.create({
            baseURL: baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Supabase Auth bearer token for the owner session (contracts/admin-auth.md) — OR a
        // kitchen station's own opaque session token, a completely separate, non-Supabase auth
        // domain (strawberry-admin/CLAUDE.md). The kitchen token takes priority whenever one
        // exists: a kitchen tablet is a dedicated kiosk that never also carries an owner login,
        // so this is a deterministic rule, not "whichever token happens to exist."
        axiosInstance.interceptors.request.use(async (config) => {
            const kitchenStore = useKitchenStationStore();

            if (kitchenStore.stationSessionToken) {
                config.headers.Authorization = `Bearer ${kitchenStore.stationSessionToken}`;
                return config;
            }

            const { data } = await supabase.auth.getSession();

            if (data?.session?.access_token) {
                config.headers.Authorization = `Bearer ${data.session.access_token}`;
            }

            return config;
        });

        // Filled in below; each src/api/* module receives it.
        const utils = {} as ApiUtils;

        // GET
        utils.get = (url: string, params?: Params, config?: AxiosRequestConfig) => {
            const cfg: AxiosRequestConfig = {
                paramsSerializer: (parameters: Record<string, unknown>) => {
                    // return qs.stringify(parameters, { indices: false });
                    return qs.stringify(parameters, { arrayFormat: 'brackets' });
                },
                ...config
            }

            if(isObject(params)) {
                cfg.params = params;
            }

            return axiosInstance.get(url, cfg);
        };

        utils.$get = async (url: string, params?: Params, config?: AxiosRequestConfig) => {
            const response = await utils.get(url, params, config);
            return response?.data;
        };


        // POST
        utils.post = (url: string, params?: Params, config?: AxiosRequestConfig) => {
            return axiosInstance.post(url, params, config);
        };

        utils.$post = async (url: string, params?: Params, config?: AxiosRequestConfig) => {
            const response = await utils.post(url, params, config);
            return response?.data;
        };


        // PUT
        utils.put = (url: string, params?: Params, config?: AxiosRequestConfig) => {
            return axiosInstance.put(url, params, config);
        };

        utils.$put = async (url: string, params?: Params, config?: AxiosRequestConfig) => {
            const response = await utils.put(url, params, config);
            return response?.data;
        };


        // DELETE
        utils.delete = (url: string, params?: Params, config?: AxiosRequestConfig) => {
            const cfg: AxiosRequestConfig = { ...config };

            if(isObject(params)) {
                cfg.params = params;
            }

            return axiosInstance.delete(url, cfg);
        };

        utils.$delete = async (url: string, params?: Params, config?: AxiosRequestConfig) => {
            const response = await utils.delete(url, params, config);
            return response?.data;
        };



        utils.makeCruds = (searchPath: string, singlePath: string) => {
            return {
                create: (data: Params, config?: AxiosRequestConfig) => {
                    return utils.$post(singlePath, data, config);
                },

                read: (id: string, config?: AxiosRequestConfig) => {
                    return utils.$get(singlePath, { id }, config);
                },

                update: (data: Params, config?: AxiosRequestConfig) => {
                    return utils.$put(singlePath, data, config);
                },

                delete: (id: string, config?: AxiosRequestConfig) => {
                    return utils.$delete(singlePath, { id }, config);
                },

                search: (params?: Params, config?: AxiosRequestConfig) => {
                    return utils.$get(searchPath, params, config);
                },
            }
        }

        app.provide('$api', {
            auth: Auth(utils),
            cart: Cart(utils),
            product: Product(utils),
            productType: ProductType(utils),
            service: Service(utils),
            serviceMenu: ServiceMenu(utils),
            emailSubscriber: EmailSubscriber(utils),
            notification: Notification(utils),
            kitchen: Kitchen(utils),
            kitchenStation: KitchenStation(utils),
            tenant: Tenant(utils)
        });

        axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response) {
                    const errorCode = parseInt(error?.response?.status, 10);

                    switch (errorCode) {
                        case 401: {
                            const kitchenStore = useKitchenStationStore();

                            // A station session expiring/being revoked is handled entirely
                            // separately from the owner's Supabase logout below — it must never
                            // touch supabase.auth or the owner's cross-tab logout broadcast.
                            if (kitchenStore.stationSessionToken) {
                                kitchenStore.clearSession();
                                router.push({ name: 'kitchen_login' });
                                break;
                            }

                            console.error('Unauthorized');
                            // Sign out of Supabase here directly, but this code does NOT also
                            // call appStore.clearSession() — that happens indirectly, via the
                            // 'logout' broadcast below being picked up by DefaultLayout.vue's
                            // OWN separate BroadcastChannel listener (mounted on every
                            // authenticated route), which calls clearSession() + redirects.
                            // Confirmed this actually works (independent QA review flagged it
                            // as worth checking): BroadcastChannel's "a channel doesn't receive
                            // its own posted messages" exclusion is per-OBJECT/port, not
                            // per-tab — postLogout() posts through a fresh channel instance,
                            // so this tab's own DefaultLayout listener (a different object) DOES
                            // receive it. This is fragile: if DefaultLayout's mount lifecycle or
                            // this channel-instance pattern ever changes, this tab's own state
                            // could stop clearing on a 401. If that behavior is ever touched,
                            // consider calling clearSession() directly here instead of relying
                            // on it.
                            supabase.auth.signOut();
                            postLogout();
                            break;
                        }
                    }
                }

                return Promise.reject(error);
            }
        );
    }
}
