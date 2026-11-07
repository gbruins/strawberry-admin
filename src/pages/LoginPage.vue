<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, RouterLink } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthCard from '@/components/AuthCard.vue';
import FormField from '@/components/FormField.vue';
import useAsyncAction from '@/composables/useAsyncAction';

const router = useRouter();
const { t } = useI18n();
const appStore = useAppStore();

const form = reactive({
    email: '',
    password: ''
});

const canSubmit = computed(() => form.email.trim().length > 0 && form.password.trim().length > 0);

const login = useAsyncAction(async () => {
    await appStore.login(form.email, form.password);
    await router.push({ name: 'dashboard' });
});
</script>

<template>
    <AuthCard :title="t('Login')">
        <form class="grid grid-cols-1 gap-4" @submit.prevent="login.run()">
            <FormField :label="t('Email')" for="login-email">
                <Input id="login-email" v-model="form.email" type="email" autocomplete="email" />
            </FormField>

            <FormField :label="t('Password')" for="login-password">
                <Input id="login-password" v-model="form.password" type="password" autocomplete="current-password" />
            </FormField>

            <Button type="submit" class="w-full" :disabled="!canSubmit || login.isLoading.value">
                {{ t('Login') }}
            </Button>

            <RouterLink
                :to="{ name: 'forgot_password' }"
                class="text-sm text-center text-muted-foreground hover:underline">
                {{ t('Forgot your password?') }}
            </RouterLink>
        </form>
    </AuthCard>
</template>
