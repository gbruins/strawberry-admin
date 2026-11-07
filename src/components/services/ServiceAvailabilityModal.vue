<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import FormDialog from '@/components/FormDialog.vue';
import useApi from '@/composables/useApi';
import useToast from '@/composables/useToast';

// Marks products on a service's menu as out of stock for that one service. Out-of-stock
// products stay on the storefront menu but can't be ordered; the next service starts with
// everything in stock again.

defineOptions({ name: 'ServiceAvailabilityModal' });

type Item = { id: string, title: string, limited: boolean, available: boolean };

const emit = defineEmits<{ success: [] }>();

const { t } = useI18n();
const $apiLoad = useApi('service.getAvailability');
const $apiSave = useApi('service.setAvailability');
const { successToast } = useToast();

const open = ref(false);
const serviceId = ref<string | null>(null);
const items = ref<Item[]>([]);

const isBusy = computed(() => $apiLoad.isLoading.value || $apiSave.isLoading.value);

// Pizzas first, then everything else, each in menu order
const groups = computed(() => [
    { key: 'pizza', label: t('Pizza'), items: items.value.filter((i) => i.limited) },
    { key: 'other', label: t('Other products'), items: items.value.filter((i) => !i.limited) }
].filter((group) => group.items.length));

function load() {
    return $apiLoad.tryCatch(async () => {
        const response = await $apiLoad.run(serviceId.value);
        items.value = (response.data || []).map(({ id, title, limited, available }: Item) => ({ id, title, limited, available }));
    });
}

function onSave() {
    if (isBusy.value) {
        return;
    }

    return $apiSave.tryCatch(async () => {
        await $apiSave.run(serviceId.value, items.value.filter((i) => !i.available).map((i) => i.id));
        successToast({ title: t('Stock saved') });
        open.value = false;
        emit('success');
    });
}

function show(id: string) {
    serviceId.value = id;
    items.value = [];
    load();
    open.value = true;
}

defineExpose({ show });
</script>

<template>
    <FormDialog
        v-model:open="open"
        :title="t('Stock for this service')"
        :busy="isBusy"
        :submit-label="t('Save')"
        @submit="onSave">
        <p class="text-sm text-muted-foreground">
            {{ t('Out-of-stock products stay on the menu but can\'t be ordered during this service.') }}
        </p>

        <p v-if="!isBusy && !items.length" class="text-center py-4 text-muted-foreground" data-test="no-products">
            {{ t('This service has no menu products.') }}
        </p>

        <section v-for="group in groups" :key="group.key" class="space-y-2">
            <h3 class="text-sm font-medium">{{ group.label }}</h3>

            <ul class="divide-y">
                <li v-for="item in group.items" :key="item.id" class="flex items-center justify-between gap-2 py-2" data-test="stock-row">
                    <Label :for="`stock-${item.id}`" class="grow font-normal">{{ item.title }}</Label>
                    <span class="text-sm" :class="item.available ? 'text-muted-foreground' : 'text-destructive'">
                        {{ item.available ? t('In stock') : t('Out of stock') }}
                    </span>
                    <Switch :id="`stock-${item.id}`" v-model="item.available" data-test="stock-switch" />
                </li>
            </ul>
        </section>
    </FormDialog>
</template>
