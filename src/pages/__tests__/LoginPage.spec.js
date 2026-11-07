import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import LoginPage from '../LoginPage.vue';

// The Supabase/tenant-context sequence itself is covered by stores/__tests__/app.spec.ts —
// this only checks the page wires the form to appStore.login() and redirects on success.

const login = vi.fn();

vi.mock('@/stores/app', () => ({
    useAppStore: () => ({ login })
}));

const errorToast = vi.fn();

vi.mock('@/composables/useToast', () => ({
    default: () => ({ errorToast, successToast: vi.fn() })
}));

const push = vi.fn();

vi.mock('vue-router', async (importOriginal) => {
    const actual = await importOriginal();
    return { ...actual, useRouter: () => ({ push }) };
});

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });

function mountLoginPage() {
    return mount(LoginPage, {
        global: {
            plugins: [i18n],
            stubs: {
                Input: { template: '<input :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />', props: ['modelValue', 'id'] },
                Label: { template: '<label><slot /></label>' },
                Button: { template: '<button><slot /></button>' },
                Card: { template: '<div><slot /></div>' },
                CardHeader: { template: '<div><slot /></div>' },
                CardTitle: { template: '<div><slot /></div>' },
                CardContent: { template: '<div><slot /></div>' },
                RouterLink: { template: '<a><slot /></a>' }
            }
        }
    });
}

async function submit(wrapper, email, password) {
    await wrapper.find('#login-email').setValue(email);
    await wrapper.find('#login-password').setValue(password);
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();
}

describe('LoginPage', () => {
    beforeEach(() => {
        login.mockReset();
        errorToast.mockReset();
        push.mockReset();
    });

    it('logs in through the store and redirects to the dashboard on success', async () => {
        login.mockResolvedValue(undefined);

        await submit(mountLoginPage(), 'owner@example.com', 'correct-password');

        expect(login).toHaveBeenCalledWith('owner@example.com', 'correct-password');
        expect(push).toHaveBeenCalledWith({ name: 'dashboard' });
    });

    it('shows an error and does not redirect when login fails', async () => {
        login.mockRejectedValue(new Error('Invalid login credentials'));

        await submit(mountLoginPage(), 'owner@example.com', 'wrong-password');

        expect(errorToast).toHaveBeenCalledOnce();
        expect(push).not.toHaveBeenCalled();
    });
});
