import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from '../app'

const signInWithPassword = vi.fn()
const signOut = vi.fn()
const getSession = vi.fn()

vi.mock('@/plugins/supabase', () => ({
    supabase: {
        auth: {
            signInWithPassword: (...args: unknown[]) => signInWithPassword(...args),
            signOut: () => signOut(),
            getSession: () => getSession()
        }
    }
}))

const apiGet = vi.fn()

vi.mock('@/plugins/api', () => ({
    axiosInstance: { get: (...args: unknown[]) => apiGet(...args) }
}))

const resetLookups = vi.fn()

vi.mock('@/composables/useLookups', () => ({
    resetLookups: () => resetLookups()
}))

const me = { data: { data: { tenant_id: 't1', tenant_name: 'Strawberry', timezone: 'America/Chicago', role: 'owner' } } }

describe('appStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        signInWithPassword.mockReset()
        signOut.mockReset()
        getSession.mockReset()
        apiGet.mockReset()
        resetLookups.mockReset()
    })

    it('login signs in, then loads the tenant context', async () => {
        signInWithPassword.mockResolvedValue({ data: { user: { email: 'owner@example.com' } }, error: null })
        apiGet.mockResolvedValue(me)

        const store = useAppStore()
        await store.login('owner@example.com', 'pw')

        expect(signInWithPassword).toHaveBeenCalledWith({ email: 'owner@example.com', password: 'pw' })
        expect(apiGet).toHaveBeenCalledWith('/admin/me')
        expect(store.loggedInUser).toBe('owner@example.com')
        expect(store.tenantName).toBe('Strawberry')
        expect(store.timezone).toBe('America/Chicago')
    })

    it('login rejects and leaves no session when Supabase refuses the credentials', async () => {
        signInWithPassword.mockResolvedValue({ data: null, error: new Error('Invalid login credentials') })

        const store = useAppStore()

        await expect(store.login('owner@example.com', 'bad')).rejects.toThrow('Invalid login credentials')
        expect(apiGet).not.toHaveBeenCalled()
        expect(store.loggedInUser).toBeNull()
    })

    it('login clears the session if the tenant context fails to load', async () => {
        signInWithPassword.mockResolvedValue({ data: { user: { email: 'owner@example.com' } }, error: null })
        apiGet.mockRejectedValue(new Error('500'))

        const store = useAppStore()

        await expect(store.login('owner@example.com', 'pw')).rejects.toThrow('500')
        expect(store.loggedInUser).toBeNull()
    })

    it('logout clears local state and cached lookups even if Supabase sign-out fails', async () => {
        signInWithPassword.mockResolvedValue({ data: { user: { email: 'owner@example.com' } }, error: null })
        apiGet.mockResolvedValue(me)
        signOut.mockRejectedValue(new Error('network'))
        vi.spyOn(console, 'error').mockImplementation(() => {})

        const store = useAppStore()
        await store.login('owner@example.com', 'pw')
        await store.logout()

        expect(store.loggedInUser).toBeNull()
        expect(store.tenantId).toBeNull()
        expect(resetLookups).toHaveBeenCalled()
    })

    it('restoreSession retries on a later call after a failed tenant-context load', async () => {
        getSession.mockResolvedValue({ data: { session: { user: { email: 'owner@example.com' } } } })
        apiGet.mockRejectedValueOnce(new Error('500')).mockResolvedValueOnce(me)
        vi.spyOn(console, 'error').mockImplementation(() => {})

        const store = useAppStore()

        await store.restoreSession()
        expect(store.loggedInUser).toBeNull()

        await store.restoreSession()
        expect(store.loggedInUser).toBe('owner@example.com')
        expect(apiGet).toHaveBeenCalledTimes(2)
    })
})
