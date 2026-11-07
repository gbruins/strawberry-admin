// Rules about service windows ("openings"), shared by the Services page and anything else that
// needs to know which service is current/next. Pure functions: pass `now` explicitly.

export interface ServiceWindow {
    id: string;
    start_at: string | null;
    end_at: string | null;
}

const time = (iso: string | null | undefined) => (iso ? new Date(iso).getTime() : NaN);

export function serviceHasEnded(service: Pick<ServiceWindow, 'end_at'>, now: number): boolean {
    return time(service.end_at) < now;
}

/**
 * The soonest service that hasn't ended yet — the same "current or next" definition the public
 * /services/next endpoint uses (strawberry-server ServiceState.js): end_at in the future,
 * ordered by start_at ascending, first wins.
 */
export function nextUpcomingServiceId(services: ServiceWindow[], now: number): string | null {
    const upcoming = services
        .filter((s) => s.start_at && s.end_at && time(s.end_at) > now)
        .sort((a, b) => time(a.start_at) - time(b.start_at));

    return upcoming[0]?.id ?? null;
}

export type MenuProblem = 'deleted' | 'unpublished' | null;

/** Why a service's menu won't be shown to visitors, if it won't. A service with no menu is fine. */
export function menuProblem(
    menuId: string | null | undefined,
    menusById: Map<unknown, { published: boolean }>
): MenuProblem {
    if (!menuId) {
        return null;
    }

    const menu = menusById.get(menuId);

    if (!menu) {
        return 'deleted';
    }

    return menu.published ? null : 'unpublished';
}
