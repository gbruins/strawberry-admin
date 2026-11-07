<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthCard from '@/components/AuthCard.vue';
import FormField from '@/components/FormField.vue';
import useAsyncAction from '@/composables/useAsyncAction';
import useToast from '@/composables/useToast';

const { t } = useI18n();
const { successToast } = useToast();
const appStore = useAppStore();

const email = ref('');
const sent = ref(false);
const canSubmit = computed(() => email.value.trim().length > 0);

const sendLink = useAsyncAction(async () => {
    await appStore.requestPasswordReset(email.value);
    sent.value = true;
    successToast({ title: t('Check your email'), text: t('If an account exists for that email, a reset link is on its way.') });
});
</script>

<template>
    <AuthCard :title="t('Forgot password')">
        <form v-if="!sent" class="grid grid-cols-1 gap-4" @submit.prevent="sendLink.run()">
            <FormField :label="t('Email')" for="forgot-email">
                <Input id="forgot-email" v-model="email" type="email" autocomplete="email" />
            </FormField>

            <Button type="submit" class="w-full" :disabled="!canSubmit || sendLink.isLoading.value">
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
    </AuthCard>
</template>
