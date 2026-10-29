<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app.js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import useApi from '@/composables/useApi';

const $apiLogin = useApi('auth.login');
const router = useRouter();
const { t } = useI18n();
const appStore = useAppStore();

const form = reactive({
    username: '',
    password: ''
});

const buttonIsEnabled = computed(() => {
    return form.username?.trim().length && form.password?.trim().length;
});

function onSubmit() {
    return $apiLogin.tryCatch(
        async () => {
            const response = await $apiLogin.run({
                ...form
            });

            appStore.loggedInUser = response.data.username;
            appStore.updateAllowedStreetsState();
            appStore.updateProductTypesState();
            router.push({ name: 'dashboard' });
        },
        () => {
            appStore.loggedInUser = null;
        }
    );
}
</script>

<template>
    <div class="mx-auto w-96 mt-24">
        <Card>
            <CardHeader>
                <CardTitle class="text-center text-xl">{{ t('Login') }}</CardTitle>
            </CardHeader>

            <CardContent>
                <form class="grid grid-cols-1 gap-4" @submit.prevent="onSubmit">
                    <div class="grid gap-1.5">
                        <Label for="login-username">{{ t('Username') }}</Label>
                        <Input
                            id="login-username"
                            v-model="form.username"
                            autocomplete="username" />
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
                        :disabled="!buttonIsEnabled">
                        {{ t('Login') }}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
</template>
