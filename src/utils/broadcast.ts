// Cross-tab owner logout. A BroadcastChannel never receives its own messages, but each call
// here returns a NEW channel object, so a listener in this same tab still receives a message
// posted through a different instance (see the 401 handler in plugins/api.js).

export type LogoutMessage = { type: 'logout' };

export function getLogoutChannel(): BroadcastChannel {
    return new BroadcastChannel('logout_channel');
}

export function postLogout(): void {
    const channel = getLogoutChannel();
    channel.postMessage({ type: 'logout' } satisfies LogoutMessage);
    channel.close();
}
