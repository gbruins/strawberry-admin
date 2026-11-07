<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { required, minLength, maxLength, numeric } from '@vuelidate/validators';
import { Input } from '@/components/ui/input';
import FormDialog from '@/components/FormDialog.vue';
import FormField from '@/components/FormField.vue';
import useUpsertForm from '@/composables/useUpsertForm';

defineOptions({ name: 'KitchenStationUpsertModal' });

const emit = defineEmits<{ success: [] }>();
const { t } = useI18n();

// Create-only: stations have no edit endpoint (rename/PIN changes go through rotate-pin).
const upsert = useUpsertForm({
    endpoints: { create: 'kitchenStation.create' },
    defaults: () => ({ name: '', pin: '' }),
    rules: () => ({
        name: { required },
        pin: { required, minLength: minLength(4), maxLength: maxLength(6), numeric }
    }),
    // Kept open until dismissed — the owner needs to copy the generated station code.
    successToast: (response) => ({
        title: t('Station created: {code}', { code: response?.data?.station_code }),
        text: t('Give this code and PIN to the kitchen tablet to log in.'),
        timeout: 0
    }),
    onSaved: () => emit('success')
});

const pinMessages = { minLength: t('must be 4-6 digits'), maxLength: t('must be 4-6 digits'), numeric: t('must be 4-6 digits') };

defineExpose({ show: upsert.show });
</script>

<template>
    <FormDialog
        v-model:open="upsert.open"
        :title="t('Create kitchen station')"
        :busy="upsert.isBusy"
        @submit="upsert.submit">
        <FormField :label="t('Name')" for="kitchen-station-name" :field="upsert.v$.name">
            <Input id="kitchen-station-name" v-model="upsert.form.name" :placeholder="t('e.g. Kitchen Tablet')" />
        </FormField>

        <FormField :label="t('PIN (4-6 digits)')" for="kitchen-station-pin" :field="upsert.v$.pin" :messages="pinMessages">
            <Input id="kitchen-station-pin" v-model="upsert.form.pin" inputmode="numeric" maxlength="6" />
        </FormField>
    </FormDialog>
</template>
