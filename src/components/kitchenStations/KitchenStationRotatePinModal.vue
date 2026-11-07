<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { required, minLength, maxLength, numeric } from '@vuelidate/validators';
import { Input } from '@/components/ui/input';
import FormDialog from '@/components/FormDialog.vue';
import FormField from '@/components/FormField.vue';
import useUpsertForm from '@/composables/useUpsertForm';

defineOptions({ name: 'KitchenStationRotatePinModal' });

const emit = defineEmits<{ success: [] }>();
const { t } = useI18n();
const stationId = ref<string | null>(null);

const upsert = useUpsertForm({
    endpoints: { create: 'kitchenStation.rotatePin' },
    defaults: () => ({ pin: '' }),
    rules: () => ({ pin: { required, minLength: minLength(4), maxLength: maxLength(6), numeric } }),
    toPayload: (form) => ({ id: stationId.value, pin: form.pin }),
    successMessage: () => t('PIN rotated — any logged-in tablet for this station must log in again'),
    onSaved: () => emit('success')
});

const pinMessages = { minLength: t('must be 4-6 digits'), maxLength: t('must be 4-6 digits'), numeric: t('must be 4-6 digits') };

function show(id: string) {
    stationId.value = id;
    upsert.show();
}

defineExpose({ show });
</script>

<template>
    <FormDialog
        v-model:open="upsert.open"
        :title="t('Rotate station PIN')"
        :busy="upsert.isBusy"
        @submit="upsert.submit">
        <FormField :label="t('New PIN (4-6 digits)')" for="rotate-pin" :field="upsert.v$.pin" :messages="pinMessages">
            <Input id="rotate-pin" v-model="upsert.form.pin" inputmode="numeric" maxlength="6" />
        </FormField>
    </FormDialog>
</template>
