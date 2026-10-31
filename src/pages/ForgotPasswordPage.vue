<script setup lang="ts">
import { reactive, computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import { supabase } from '@/plugins/supabase';
import useExceptionToast from '@/composables/useExceptionToast';
import useToast from '@/composables/useToast.js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const { t } = useI18n();
const { showExceptionToast } = useExceptionToast();
const { successToast } = useToast();

const form = reactive({ email: '' });
const isLoading = ref(false);
const sent = ref(false);

const buttonIsEnabled = computed(() => form.email?.trim().length > 0);

async function onSubmit() {
    isLoading.value = true;

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
            redirectTo: `${window.location.origin}/reset-password`
        });

        if (error) {
            throw error;
        }

        sent.value = true;
        successToast({ title: t('Check your email'), text: t('If an account exists for that email, a reset link is on its way.') });
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
                <CardTitle class="text-center text-xl">{{ t('Forgot password') }}</CardTitle>
            </CardHeader>

            <CardContent>
                <form v-if="!sent" class="grid grid-cols-1 gap-4" @submit.prevent="onSubmit">
                    <div class="grid gap-1.5">
                        <Label for="forgot-email">{{ t('Email') }}</Label>
                        <Input
                            id="forgot-email"
                            v-model="form.email"
                            type="email"
                            autocomplete="email" />
                    </div>

                    <Button
                        type="submit"
                        class="w-full"
                        :disabled="!buttonIsEnabled || isLoading">
                        {{ t('Send reset link') }}
                    </Button>

                    <RouterLink
                        :to="{ name: 'login' }"
                        class="text-sm text-center text-muted-foreground hover:underline">
                        {{ t('Back to login') }}
                    </RouterLink>
                </form>

                <p v-else class="text-sm text-center text-muted-foreground">
                    {{ t('If an account exists for that email, a reset link is on its way.') }}
                </p>
            </CardContent>
        </Card>
    </div>
</template>
