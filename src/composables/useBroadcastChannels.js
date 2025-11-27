
export default function useBroadcastChannels() {

    function getLogoutChannel() {
        return new BroadcastChannel('logout_channel');
    }

    function postToChannel(data, channel) {
        console.log('Posting to channel:', channel, data);
        channel.postMessage(data);
    }

    return {
        getLogoutChannel,
        postToChannel
    }
}
