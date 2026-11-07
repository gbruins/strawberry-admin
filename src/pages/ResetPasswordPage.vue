<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthCard from '@/components/AuthCard.vue';
import FormField from '@/components/FormField.vue';
import useAsyncAction from '@/composables/useAsyncAction';
import useToast from '@/composables/useToast';

// Reached via the link in the email ForgotPasswordPage requests. Supabase's client parses the
// recovery token out of the URL on load and establishes a session (detectSessionInUrl), so by
// the time this page is interactive, appStore.updatePassword() just works.

const MIN_PASSWORD_LENGTH = 8;

const { t } = useI18n();
const router = useRouter();
const appStore = useAppStore();
const { successToast } = useToast();

const form = reactive({ password: '', confirmPassword: '' });

const mismatch = computed(() => form.confirmPassword.length > 0 && form.password !== form.confirmPassword);
const canSubmit = computed(() => form.password.length >= MIN_PASSWORD_LENGTH && form.password === form.confirmPassword);

const update = useAsyncAction(async () => {
    await appStore.updatePassword(form.password);
    successToast({ title: t('Password updated'), text: t('You can now log in with your new password.') });
    await router.push({ name: 'login' });
});
</script>

<template>
    <AuthCard :title="t('Set a new password')">
        <form class="grid grid-cols-1 gap-4" @submit.prevent="update.run()">
            <FormField
                :label="t('New password')"
                for="reset-password"
                :hint="t('At least {min} characters', { min: MIN_PASSWORD_LENGTH })">
                <Input id="reset-password" v-model="form.password" type="password" autocomplete="new-password" />
            </FormField>

            <FormField :label="t('Confirm password')" for="reset-password-confirm">
                <Input id="reset-password-confirm" v-model="form.confirmPassword" type="password" autocomplete="new-password" />
                <p v-if="mismatch" class="text-sm text-destructive" role="alert">{{ t('Passwords do not match') }}</p>
            </FormField>

            <Button type="submit" class="w-full" :disabled="!canSubmit || update.isLoading.value">
                {{ t('Update password') }}
            </Button>
        </form>
    </AuthCard>
</template>
