import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import SubscribersPage from '../SubscribersPage.vue'

const search = vi.fn()
const del = vi.fn()
const count = vi.fn()

vi.mock('@/composables/useApi', () => ({
    default: (endpoint: string) => {
        const fn = endpoint === 'emailSubscriber.search' ? search : endpoint === 'emailSubscriber.delete' ? del : count
        return { isLoading: { value: false }, run: fn, tryCatch: (f: () => Promise<unknown>) => f() }
    }
}))

vi.mock('@/composables/useToast', () => ({
    default: () => ({ successToast: vi.fn(), errorToast: vi.fn(), addToast: vi.fn() })
}))

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } })

const stubs = {
    PageTitle: { template: '<div><slot /></div>' },
    Table: { template: '<table><slot /></table>' },
    TableHeader: { template: '<thead><slot /></thead>' },
    TableBody: { template: '<tbody><slot /></tbody>' },
    TableRow: { template: '<tr><slot /></tr>' },
    TableHead: { template: '<th><slot /></th>' },
    TableCell: { template: '<td><slot /></td>' },
    SortableTableHead: { template: '<th><slot /></th>' },
    Overlay: { template: '<div><slot /></div>' },
    DataPagination: { template: '<div></div>' },
    BooleanBadge: { template: '<span>{{ value ? "Subscribed" : "Unsubscribed" }}</span>', props: ['value', 'trueLabel', 'falseLabel'] },
    Format8601: { template: '<span></span>' },
    Button: { template: '<button><slot /></button>' },
    PopConfirm: { template: '<div><slot name="reference" /><button data-test="confirm" @click="$emit(\'confirm\')"></button></div>', emits: ['confirm'] }
}

function mountPage() {
    return mount(SubscribersPage, { global: { plugins: [i18n], stubs } })
}

describe('SubscribersPage', () => {
    beforeEach(() => {
        search.mockReset()
        del.mockReset()
        count.mockReset()
    })

    it('loads and renders the subscriber list and active count', async () => {
        search.mockResolvedValue({ data: [
            { id: 's1', email: 'a@example.com', status: 'subscribed', subscribed_at: '2026-01-01T00:00:00.000Z' }
        ], pagination: { total: 1 } })
        count.mockResolvedValue({ data: { activeCount: 1 } })

        const wrapper = mountPage()
        await flushPromises()

        expect(search).toHaveBeenCalled()
        expect(count).toHaveBeenCalled()
        expect(wrapper.text()).toContain('a@example.com')
        expect(wrapper.get('[data-test="active-count"]').text()).toContain('1')
    })

    it('removes a subscriber and refetches the list and count', async () => {
        search.mockResolvedValue({ data: [
            { id: 's1', email: 'a@example.com', status: 'subscribed', subscribed_at: '2026-01-01T00:00:00.000Z' }
        ], pagination: { total: 1 } })
        count.mockResolvedValue({ data: { activeCount: 1 } })
        del.mockResolvedValue({ data: {} })

        const wrapper = mountPage()
        await flushPromises()

        search.mockClear()
        count.mockClear()

        await wrapper.get('[data-test="confirm"]').trigger('click')
        await flushPromises()

        expect(del).toHaveBeenCalledWith('s1')
        expect(search).toHaveBeenCalled() // refetched
        expect(count).toHaveBeenCalled() // refetched
    })
})
