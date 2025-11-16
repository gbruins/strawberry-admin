import axios from 'axios';
import qs from 'qs';
import isObject from 'lodash.isobject';
import Product from '@/api/product';

export default {
    install: (app) => {

        const baseURL = import.meta.env.VITE_API_BASE_URL;
        console.log('API Base URL:', baseURL);

        const axiosInstance = axios.create({
            baseURL: baseURL,
            // withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const utils = {};

        // GET
        utils.get = (url, params, config) => {
            const cfg = {
                paramsSerializer: (parameters) => {
                    return qs.stringify(parameters, { indices: false });
                    // return qs.stringify(parameters, { arrayFormat: 'brackets' });
                },
                ...config
            }

            if(isObject(params)) {
                cfg.params = params;
            }

            return axiosInstance.get(url, cfg);
        };

        utils.$get = async (url, params, config) => {
            const response = await utils.get(url, params, config);
            return response?.data;
        };


        // POST
        utils.post = (url, params, config) => {
            return axiosInstance.post(url, params, config);
        };

        utils.$post = async (url, params, config) => {
            const response = await utils.post(url, params, config);
            return response?.data;
        };


        // PUT
        utils.put = (url, params, config) => {
            return axiosInstance.put(url, params, config);
        };

        utils.$put = async (url, params, config) => {
            const response = await utils.put(url, params, config);
            return response?.data;
        };


        // DELETE
        utils.delete = (url, params, config) => {
            const cfg = { ...config };

            if(isObject(params)) {
                cfg.params = params;
            }

            return axiosInstance.delete(url, cfg);
        };

        utils.$delete = async (url, params, config) => {
            const response = await utils.delete(url, params, config);
            return response?.data;
        };


        // MISC
        utils.getCancelToken = () => {
            const { CancelToken } = axiosInstance;
            return CancelToken
        };

        utils.getCancelTokenSource = () => {
            return axiosInstance.CancelToken.source();
        };

        utils.makeCruds = (searchPath, singlePath) => {
            return {
                create: (data, config) => {
                    return utils.$post(singlePath, data, config);
                },

                read: (id, config) => {
                    return utils.$get(singlePath, { id }, config);
                },

                update: (id, data, config) => {
                    return utils.$put(singlePath, { id, ...data }, config);
                },

                delete: (id, config) => {
                    return utils.$delete(singlePath, { id }, config);
                },

                search: (params, config) => {
                    return utils.$get(searchPath, params, config);
                },
            }
        }

        app.provide('$api', {
            product: Product(utils, axiosInstance),
        });
    }
}
