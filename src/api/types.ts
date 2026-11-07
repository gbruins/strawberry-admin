import type { AxiosRequestConfig, AxiosResponse } from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Params = Record<string, any> | null | undefined;
// Response bodies aren't typed per endpoint yet; `$`-methods return the parsed body.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiBody = any;

export interface Cruds {
    create: (data: Params, config?: AxiosRequestConfig) => Promise<ApiBody>;
    read: (id: string, config?: AxiosRequestConfig) => Promise<ApiBody>;
    update: (data: Params, config?: AxiosRequestConfig) => Promise<ApiBody>;
    delete: (id: string, config?: AxiosRequestConfig) => Promise<ApiBody>;
    search: (params?: Params, config?: AxiosRequestConfig) => Promise<ApiBody>;
}

/** The request helpers plugins/api.ts hands to each src/api/* module. */
export interface ApiUtils {
    get: (url: string, params?: Params, config?: AxiosRequestConfig) => Promise<AxiosResponse>;
    post: (url: string, params?: Params, config?: AxiosRequestConfig) => Promise<AxiosResponse>;
    put: (url: string, params?: Params, config?: AxiosRequestConfig) => Promise<AxiosResponse>;
    delete: (url: string, params?: Params, config?: AxiosRequestConfig) => Promise<AxiosResponse>;
    $get: (url: string, params?: Params, config?: AxiosRequestConfig) => Promise<ApiBody>;
    $post: (url: string, params?: Params, config?: AxiosRequestConfig) => Promise<ApiBody>;
    $put: (url: string, params?: Params, config?: AxiosRequestConfig) => Promise<ApiBody>;
    $delete: (url: string, params?: Params, config?: AxiosRequestConfig) => Promise<ApiBody>;
    makeCruds: (searchPath: string, singlePath: string) => Cruds;
}
