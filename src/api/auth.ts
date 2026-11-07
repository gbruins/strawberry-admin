import type { AxiosRequestConfig } from 'axios';
import type { ApiUtils } from './types';

// Login/logout/password-reset are no longer server routes — call supabase.auth.* directly
// (src/plugins/supabase.js) against Supabase Auth instead (contracts/admin-auth.md "Removed").
export default (utils: ApiUtils) => {
    return {
        me: (config?: AxiosRequestConfig) => {
            return utils.$get('admin/me', null, config);
        },
    }
}
