<script setup lang="ts">
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { required, minValue } from '@vuelidate/validators';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import FormDialog from '@/components/FormDialog.vue';
import FormField from '@/components/FormField.vue';
import DateTimePicker from '@/components/DateTimePicker.vue';
import useUpsertForm from '@/composables/useUpsertForm';
import { useMenus } from '@/composables/useLookups';

defineOptions({ name: 'ServiceUpsertModal' });

const emit = defineEmits<{ success: [] }>();
const { t } = useI18n();
const menus = useMenus();

const NO_MENU = '';
const ONE_HOUR_MS = 60 * 60 * 1000;

const upsert = useUpsertForm({
    resource: 'service',
    defaults: () => ({
        start_at: null as string | null,
        end_at: null as string | null,
        notes: '',
        inventory_count: 0,
        service_menu_id: null as string | null,
        max_per_order: 4
    }),
    rules: (form) => ({
        start_at: { required },
        end_at: {
            required,
            afterStartAt: (value: string | null) => !value || !form.start_at || new Date(value) > new Date(form.start_at)
        },
        inventory_count: { required, minValue: minValue(1) },
        max_per_order: { required, minValue: minValue(1) }
    }),
    successMessage: () => t('Service saved successfully'),
    onSaved: () => emit('success')
});

// Only published menus can be attached; the service list flags an attached menu that later
// became unpublished or was deleted.
const menuOptions = computed(() => [
    { value: NO_MENU, label: t('No menu') },
    ...menus.items.value.filter((m) => m.published).map((m) => ({ value: m.id, label: m.title }))
]);

const menuSelectValue = computed({
    get: () => upsert.form.service_menu_id ?? NO_MENU,
    set: (value: string) => {
        upsert.form.service_menu_id = value === NO_MENU ? null : value;
    }
});

// Convenience: picking a start with no end (or an end before it) proposes start + 1 hour.
watch(() => upsert.form.start_at, (start) => {
    const { end_at } = upsert.form;

    if (start && (!end_at || new Date(end_at) < new Date(start))) {
        upsert.form.end_at = new Date(new Date(start).getTime() + ONE_HOUR_MS).toISOString();
    }
});

defineExpose({ show: upsert.show });
</script>

<template>
    <FormDialog
        v-model:open="upsert.open"
        :title="upsert.isEdit ? t('Update service') : t('Create service')"
        :busy="upsert.isBusy"
        content-class="sm:max-w-2xl"
        @submit="upsert.submit">
        <FormField :label="t('Start at')" :field="upsert.v$.start_at">
            <DateTimePicker v-model="upsert.form.start_at" />
        </FormField>

        <FormField
            :label="t('End at')"
            :field="upsert.v$.end_at"
            :messages="{ afterStartAt: t('must be after &quot;Start at&quot;') }">
            <DateTimePicker v-model="upsert.form.end_at" />
        </FormField>

        <FormField :label="t('Notes')" for="service-notes">
            <Input id="service-notes" v-model="upsert.form.notes" />
        </FormField>

        <FormField :label="t('Dough count')" for="service-inventory-count" :field="upsert.v$.inventory_count">
            <Input id="service-inventory-count" v-model.number="upsert.form.inventory_count" type="number" min="1" step="1" />
        </FormField>

        <FormField :label="t('Menu')" for="service-menu">
            <NativeSelect id="service-menu" v-model="menuSelectValue" class="w-full">
                <NativeSelectOption v-for="option in menuOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                </NativeSelectOption>
            </NativeSelect>
        </FormField>

        <FormField :label="t('Max pizzas per order')" for="service-max-per-order" :field="upsert.v$.max_per_order">
            <Input id="service-max-per-order" v-model.number="upsert.form.max_per_order" type="number" min="1" step="1" />
        </FormField>
    </FormDialog>
</template>
