<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import FormField from '@/components/FormField.vue';
import PinPad from '@/components/kitchen/PinPad.vue';
import { useKitchenStationStore } from '@/stores/kitchenStation';
import useApi from '@/composables/useApi';

const MIN_PIN_LENGTH = 4;

const { t } = useI18n();
const router = useRouter();
const kitchenStore = useKitchenStationStore();
const $apiLogin = useApi('kitchen.login');

const stationCode = ref('');
const pin = ref('');
const loginError = ref(false);

const canSubmit = computed(() => stationCode.value.trim().length > 0 && pin.value.length >= MIN_PIN_LENGTH);

function onSubmit() {
    if (!canSubmit.value || $apiLogin.isLoading.value) {
        return;
    }

    loginError.value = false;

    return $apiLogin.tryCatch(
        async () => {
            const response = await $apiLogin.run({ station_code: stationCode.value.trim(), pin: pin.value });

            kitchenStore.setSession({
                stationSessionToken: response.data.station_session_token,
                tenantId: response.data.tenant_id,
                tenantName: response.data.tenant_name,
                stationName: response.data.station_name,
                realtimeJwt: response.data.realtime_jwt
            });

            router.push({ name: 'kitchen_board' });
        },
        () => {
            loginError.value = true;
            pin.value = '';
        }
    );
}
</script>

<template>
    <div class="flex items-center justify-center h-full">
        <Card class="w-full max-w-sm">
            <CardHeader>
                <CardTitle class="text-center text-xl">{{ t('Kitchen Login') }}</CardTitle>
            </CardHeader>

            <CardContent class="flex flex-col items-center gap-6">
                <FormField :label="t('Station code')" for="kitchen-station-code" class="w-full">
                    <Input
                        id="kitchen-station-code"
                        v-model="stationCode"
                        class="text-center text-2xl tracking-widest h-14 uppercase"
                        maxlength="12"
                        autocapitalize="characters"
                        autocomplete="off" />
                </FormField>

                <div class="h-8 text-2xl font-mono tracking-widest" aria-hidden="true">{{ '•'.repeat(pin.length) || ' ' }}</div>

                <div v-if="loginError" class="text-destructive text-sm" role="alert">{{ t('Invalid station code or PIN') }}</div>

                <PinPad v-model="pin" @submit="onSubmit">
                    <template #enter>{{ t('Log in') }}</template>
                </PinPad>
            </CardContent>
        </Card>
    </div>
</template>
