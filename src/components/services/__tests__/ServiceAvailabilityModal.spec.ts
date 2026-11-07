import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import ServiceAvailabilityModal from '../ServiceAvailabilityModal.vue'

const getAvailability = vi.fn()
const setAvailability = vi.fn()

vi.mock('@/composables/useApi', () => ({
    default: (endpoint: string) => {
        const byEndpoint: Record<string, ReturnType<typeof vi.fn>> = {
            'service.getAvailability': getAvailability,
            'service.setAvailability': setAvailability
        }
        return { isLoading: { value: false }, run: byEndpoint[endpoint], tryCatch: (f: () => Promise<unknown>) => f() }
    }
}))

const successToast = vi.fn()
vi.mock('@/composables/useToast', () => ({
    default: () => ({ successToast, errorToast: vi.fn(), addToast: vi.fn() })
}))

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } })

const stubs = {
    FormDialog: { template: '<form @submit.prevent="$emit(\'submit\')"><slot /></form>', emits: ['submit'] },
    Switch: {
        props: ['modelValue'],
        emits: ['update:modelValue'],
        template: '<input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />'
    }
}

async function showModal() {
    const wrapper = mount(ServiceAvailabilityModal, { global: { plugins: [i18n], stubs } })
    ;(wrapper.vm as unknown as { show: (id: string) => void }).show('svc1')
    await flushPromises()
    return wrapper
}

describe('ServiceAvailabilityModal', () => {
    beforeEach(() => {
        getAvailability.mockReset()
        setAvailability.mockReset()
        successToast.mockReset()
        getAvailability.mockResolvedValue({ data: [
            { id: 'soda', title: 'Soda', limited: false, available: true },
            { id: 'cheese', title: 'Cheese', limited: true, available: true },
            { id: 'pepperoni', title: 'Pepperoni', limited: true, available: false }
        ] })
        setAvailability.mockResolvedValue({ data: [] })
    })

    it("loads the service's menu products, pizzas first", async () => {
        const wrapper = await showModal()

        expect(getAvailability).toHaveBeenCalledWith('svc1')
        expect(wrapper.findAll('h3').map((h) => h.text())).toEqual(['Pizza', 'Other products'])
        expect(wrapper.findAll('[data-test="stock-row"]').map((r) => r.find('label').text())).toEqual(['Cheese', 'Pepperoni', 'Soda'])
        expect(wrapper.findAll('[data-test="stock-row"]')[1]!.text()).toContain('Out of stock')
    })

    it('saves the products switched off as out of stock', async () => {
        const wrapper = await showModal()

        // Soda off, Pepperoni back on
        const switches = wrapper.findAll('[data-test="stock-switch"]')
        await switches[2]!.setValue(false)
        await switches[1]!.setValue(true)
        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(setAvailability).toHaveBeenCalledWith('svc1', ['soda'])
        expect(successToast).toHaveBeenCalled()
        expect(wrapper.emitted('success')).toHaveLength(1)
    })

    it('says so when the service has no menu products', async () => {
        getAvailability.mockResolvedValue({ data: [] })

        const wrapper = await showModal()

        expect(wrapper.find('[data-test="no-products"]').exists()).toBe(true)
    })
})
