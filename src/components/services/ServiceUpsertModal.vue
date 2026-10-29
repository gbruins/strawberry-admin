<script lang="ts">
export default {
    name: 'ServiceUpsertModal'
}
</script>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue } from '@vuelidate/validators';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import Overlay from '@/components/Overlay.vue';
import DateTimePicker from '@/components/DateTimePicker.vue';
import useApi from '@/composables/useApi';
import useToast from '@/composables/useToast';

const emit = defineEmits([
    'success'
]);

const { t } = useI18n();
const $apiCreate = useApi('service.create');
const $apiUpdate = useApi('service.update');
const $apiRead = useApi('service.read');
const $apiMenus = useApi('serviceMenu.search');
const menuOptions: Ref<{ value: string, label: string }[]> = ref([]);
const { successToast } = useToast();

const NO_MENU = '';

const open = ref(false);
const updateId: Ref<string | null> = ref(null);

const form = reactive({
    start_at: null,
    end_at: null,
    notes: '',
    inventory_count: 0,
    service_menu_id: null as string | null,
    max_per_order: 4,
});

const menuSelectValue = computed({
    get: () => form.service_menu_id ?? NO_MENU,
    set: (val: string) => {
        form.service_menu_id = val === NO_MENU ? null : val;
    }
});

const validationRules = {
    start_at: { required },
    end_at: {
        required,
        afterStartAt(value) {
            if(!value || !form.start_at) {
                return true;
            }

            return new Date(value).getTime() > new Date(form.start_at).getTime();
        },
    },
    notes: { },
    inventory_count: { required, minValue: minValue(1) },
    max_per_order: { required, minValue: minValue(1) },
};

const v$ = useVuelidate(validationRules, form);

function loadMenus() {
    return $apiMenus.tryCatch(
        async () => {
            const response = await $apiMenus.run({ _pageSize: 500, _sort: 'title' });

            menuOptions.value = [
                { value: NO_MENU, label: t('No menu') },
                ...(response.data || [])
                    .filter((m) => m.published)
                    .map((m) => ({ value: m.id, label: m.title }))
            ];
        }
    );
}

onMounted(loadMenus);

function getById(id: string) {
    return $apiRead.tryCatch(
        async () => {
            const response = await $apiRead.run(id);

            form.start_at = response.data?.start_at || null;
            form.end_at = response.data?.end_at || null;
            form.notes = response.data?.notes || '';
            form.inventory_count = response.data?.inventory_count || 0;
            form.service_menu_id = response.data?.service_menu_id || null;
            form.max_per_order = response.data?.max_per_order || 4;

            updateId.value = id;
        }
    );
}

function onStartAtChange(value) {
    // As a UI convenience, if end_at is not set, set it to the same as start_at + 1 hour
    if (!form.end_at || (new Date(form.end_at).getTime() < new Date(value).getTime())) {
        // add one hour to the ISO-8601 timestamp derived from the new start value
        const startDate = new Date(value || form.start_at);
        form.end_at = new Date(startDate.getTime() + 60 * 60 * 1000).toISOString();
    }
}

function onSubmit() {
    const api = updateId.value ? $apiUpdate : $apiCreate;
    const formData = updateId.value ? { id: updateId.value, ...form } : { ...form };

    return api.tryCatch(
        async () => {
            await api.run({
                ...formData
            });

            successToast({
                title: t('Service saved successfully')
            });

            hide();
            emit('success');
        }
    );
}

function hide() {
    open.value = false;
}

function resetData() {
    updateId.value = null;

    form.start_at = null;
    form.end_at = null;
    form.notes = '';
    form.inventory_count = 0;
    form.service_menu_id = null;
    form.max_per_order = 4;
}

function show(id) {
    resetData();

    if(id) {
        getById(id);
    }

    open.value = true;
}

defineExpose({
    show
});
</script>

<template>
    <Dialog v-model:open="open">
        <DialogContent class="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>{{ updateId ? t('Update service') : t('Create service') }}</DialogTitle>
            </DialogHeader>

            <Overlay :show="$apiCreate.isLoading.value || $apiUpdate.isLoading.value || $apiRead.isLoading.value">
                <div class="grid grid-cols-1 gap-4">
                    <!-- start at -->
                    <div class="grid gap-1.5">
                        <Label>{{ t('Start at') }}</Label>

                        <DateTimePicker
                            v-model="form.start_at"
                            @update:modelValue="onStartAtChange" />

                        <div v-if="v$.start_at.required.$invalid" class="text-sm text-destructive">{{ t('required') }}</div>
                    </div>

                    <!-- end at -->
                    <div class="grid gap-1.5">
                        <Label>{{ t('End at') }}</Label>

                        <DateTimePicker v-model="form.end_at" />

                        <div v-if="v$.end_at.required.$invalid" class="text-sm text-destructive">{{ t('required') }}</div>
                        <div v-else-if="v$.end_at.afterStartAt.$invalid" class="text-sm text-destructive">{{ t('must be after "Start at"') }}</div>
                    </div>

                    <!-- notes -->
                    <div class="grid gap-1.5">
                        <Label for="service-notes">{{ t('Notes') }}</Label>
                        <Input id="service-notes" v-model="form.notes" />
                    </div>

                    <!-- dough count -->
                    <div class="grid gap-1.5">
                        <Label for="service-inventory-count">{{ t('Dough count') }}</Label>

                        <Input
                            id="service-inventory-count"
                            v-model.number="form.inventory_count"
                            type="number"
                            min="0"
                            step="1" />

                        <div v-if="v$.inventory_count.required.$invalid" class="text-sm text-destructive">{{ t('required') }}</div>
                        <div v-else-if="v$.inventory_count.minValue.$invalid" class="text-sm text-destructive">{{ t('must be at least {min}', { min: 1 }) }}</div>
                    </div>

                    <!-- menu -->
                    <div class="grid gap-1.5">
                        <Label>{{ t('Menu') }}</Label>

                        <NativeSelect v-model="menuSelectValue" class="w-full">
                            <NativeSelectOption
                                v-for="option in menuOptions"
                                :key="option.value"
                                :value="option.value">{{ option.label }}</NativeSelectOption>
                        </NativeSelect>
                    </div>

                    <!-- max per order -->
                    <div class="grid gap-1.5">
                        <Label for="service-max-per-order">{{ t('Max pizzas per order') }}</Label>

                        <Input
                            id="service-max-per-order"
                            v-model.number="form.max_per_order"
                            type="number"
                            min="1"
                            step="1" />

                        <div v-if="v$.max_per_order.required.$invalid" class="text-sm text-destructive">{{ t('required') }}</div>
                        <div v-else-if="v$.max_per_order.minValue.$invalid" class="text-sm text-destructive">{{ t('must be at least {min}', { min: 1 }) }}</div>
                    </div>
                </div>
            </Overlay>

            <DialogFooter class="sm:justify-center">
                <Button :disabled="v$.$invalid" @click="onSubmit">{{ t('Submit') }}</Button>
                <Button variant="ghost" @click="hide">{{ t('Cancel') }}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
