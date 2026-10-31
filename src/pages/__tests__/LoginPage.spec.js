import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import LoginPage from '../LoginPage.vue';

const signInWithPassword = vi.fn();
vi.mock('@/plugins/supabase', () => ({
    supabase: { auth: { signInWithPassword: (...args) => signInWithPassword(...args) } }
}));

const loadMe = vi.fn();
const updateAllowedStreetsState = vi.fn();
const updateProductTypesState = vi.fn();
const clearSession = vi.fn();
let storeState;
vi.mock('@/stores/app.js', () => ({
    useAppStore: () => storeState
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
                Input: { template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />', props: ['modelValue'] },
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

describe('LoginPage', () => {
    beforeEach(() => {
        signInWithPassword.mockReset();
        loadMe.mockReset();
        updateAllowedStreetsState.mockReset();
        updateProductTypesState.mockReset();
        clearSession.mockReset();
        push.mockReset();
        storeState = {
            loggedInUser: null,
            loadMe,
            updateAllowedStreetsState,
            updateProductTypesState,
            clearSession
        };
    });

    it('submits credentials to Supabase and redirects to the dashboard on success', async () => {
        signInWithPassword.mockResolvedValue({
            data: { user: { email: 'owner@example.com' } },
            error: null
        });

        const wrapper = mountLoginPage();
        await wrapper.find('#login-email').setValue('owner@example.com');
        await wrapper.find('#login-password').setValue('correct-password');
        await wrapper.find('form').trigger('submit.prevent');
        await flushMicrotasks();

        expect(signInWithPassword).toHaveBeenCalledWith({
            email: 'owner@example.com',
            password: 'correct-password'
        });
        expect(storeState.loggedInUser).toBe('owner@example.com');
        expect(loadMe).toHaveBeenCalledOnce();
        expect(updateAllowedStreetsState).toHaveBeenCalledOnce();
        expect(updateProductTypesState).toHaveBeenCalledOnce();
        expect(push).toHaveBeenCalledWith({ name: 'dashboard' });
    });

    it('clears the session and does not redirect when Supabase rejects the credentials', async () => {
        signInWithPassword.mockResolvedValue({
            data: null,
            error: new Error('Invalid login credentials')
        });

        const wrapper = mountLoginPage();
        await wrapper.find('#login-email').setValue('owner@example.com');
        await wrapper.find('#login-password').setValue('wrong-password');
        await wrapper.find('form').trigger('submit.prevent');
        await flushMicrotasks();

        expect(clearSession).toHaveBeenCalledOnce();
        expect(loadMe).not.toHaveBeenCalled();
        expect(push).not.toHaveBeenCalled();
    });
});

function flushMicrotasks() {
    return new Promise((resolve) => setTimeout(resolve, 0));
}
