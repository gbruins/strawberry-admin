import type { ApiUtils } from './types';

export default (utils: ApiUtils) => {
    return {
        send: (serviceId: string) => utils.$post('services/notify', null, { params: { id: serviceId } })
    }
}
