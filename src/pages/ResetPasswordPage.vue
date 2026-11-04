<script setup lang="ts">
import { reactive, computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { supabase } from '@/plugins/supabase';
import { useAppStore } from '@/stores/app.js';
import useExceptionToast from '@/composables/useExceptionToast';
import useToast from '@/composables/useToast.js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Reached via the link in the email supabase.auth.resetPasswordForEmail() sends
// (ForgotPasswordPage.vue); Supabase's client parses the recovery token out of the URL on
// load and establishes a session automatically (detectSessionInUrl, default true), so by the
// time this page is interactive, supabase.auth.updateUser() below just works.
const { t } = useI18n();
const router = useRouter();
const appStore = useAppStore();
const { showExceptionToast } = useExceptionToast();
const { successToast } = useToast();

const form = reactive({ password: '', confirmPassword: '' });
const isLoading = ref(false);

const buttonIsEnabled = computed(() => {
    return form.password?.length >= 8 && form.password === form.confirmPassword;
});

async function onSubmit() {
    isLoading.value = true;

    try {
        const { error } = await supabase.auth.updateUser({ password: form.password });

        if (error) {
            throw error;
        }

        successToast({ title: t('Password updated'), text: t('You can now log in with your new password.') });
        appStore.clearSession();
        router.push({ name: 'login' });
    }
    catch (error) {
        console.error(error);
        showExceptionToast(error);
    }
    finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <div class="w-full max-w-96">
        <Card>
            <CardHeader>
                <CardTitle class="text-center text-xl">{{ t('Set a new password') }}</CardTitle>
            </CardHeader>

            <CardContent>
                <form class="grid grid-cols-1 gap-4" @submit.prevent="onSubmit">
                    <div class="grid gap-1.5">
                        <Label for="reset-password">{{ t('New password') }}</Label>
                        <Input
                            id="reset-password"
                            v-model="form.password"
                            type="password"
                            autocomplete="new-password" />
                    </div>

                    <div class="grid gap-1.5">
                        <Label for="reset-password-confirm">{{ t('Confirm password') }}</Label>
                        <Input
                            id="reset-password-confirm"
                            v-model="form.confirmPassword"
                            type="password"
                            autocomplete="new-password" />
                    </div>

                    <Button
                        type="submit"
                        class="w-full"
                        :disabled="!buttonIsEnabled || isLoading">
                        {{ t('Update password') }}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
</template>
