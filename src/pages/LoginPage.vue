<script setup lang="ts">
import { reactive, computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, RouterLink } from 'vue-router';
import { useAppStore } from '@/stores/app.js';
import { supabase } from '@/plugins/supabase';
import useExceptionToast from '@/composables/useExceptionToast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const router = useRouter();
const { t } = useI18n();
const appStore = useAppStore();
const { showExceptionToast } = useExceptionToast();

const form = reactive({
    email: '',
    password: ''
});

const isLoading = ref(false);

const buttonIsEnabled = computed(() => {
    return form.email?.trim().length && form.password?.trim().length;
});

async function onSubmit() {
    isLoading.value = true;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password
        });

        if (error) {
            throw error;
        }

        appStore.loggedInUser = data.user.email;
        await appStore.loadMe();
        appStore.updateAllowedStreetsState();
        appStore.updateProductTypesState();
        router.push({ name: 'dashboard' });
    }
    catch (error) {
        console.error(error);
        showExceptionToast(error);
        appStore.clearSession();
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
                <CardTitle class="text-center text-xl">{{ t('Login') }}</CardTitle>
            </CardHeader>

            <CardContent>
                <form class="grid grid-cols-1 gap-4" @submit.prevent="onSubmit">
                    <div class="grid gap-1.5">
                        <Label for="login-email">{{ t('Email') }}</Label>
                        <Input
                            id="login-email"
                            v-model="form.email"
                            type="email"
                            autocomplete="email" />
                    </div>

                    <div class="grid gap-1.5">
                        <Label for="login-password">{{ t('Password') }}</Label>
                        <Input
                            id="login-password"
                            v-model="form.password"
                            type="password"
                            autocomplete="current-password" />
                    </div>

                    <Button
                        type="submit"
                        class="w-full"
                        :disabled="!buttonIsEnabled || isLoading">
                        {{ t('Login') }}
                    </Button>

                    <RouterLink
                        :to="{ name: 'forgot_password' }"
                        class="text-sm text-center text-muted-foreground hover:underline">
                        {{ t('Forgot your password?') }}
                    </RouterLink>
                </form>
            </CardContent>
        </Card>
    </div>
</template>
