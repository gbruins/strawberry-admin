export default (utils) => {
    return {
        send: (serviceId) => utils.$post('services/notify', null, { params: { id: serviceId } })
    }
}
