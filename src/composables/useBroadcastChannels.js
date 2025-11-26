
export default function useBroadcastChannels() {

    function getAllowedStreetsChannel() {
        return new BroadcastChannel('allowed_streets_channel');
    }

    function postToAllowedStreetsChannel(data, channel) {
        channel.postMessage(data);
    }

    return {
        getAllowedStreetsChannel,
        postToAllowedStreetsChannel
    }
}
