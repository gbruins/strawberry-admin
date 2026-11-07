<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ChevronUpIcon, ChevronDownIcon, Trash2Icon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import FormDialog from '@/components/FormDialog.vue';
import useApi from '@/composables/useApi';
import useToast from '@/composables/useToast';
import { useProducts } from '@/composables/useLookups';

defineOptions({ name: 'MenuProductsModal' });

type Item = { id: string, title: string, published: boolean };

const emit = defineEmits<{ success: [] }>();

const { t } = useI18n();
const $apiProducts = useApi('serviceMenu.getProducts');
const $apiSave = useApi('serviceMenu.setProducts');
const { successToast } = useToast();
const products = useProducts();

const NO_SELECTION = '';

const open = ref(false);
const menuId = ref<string | null>(null);
const menuTitle = ref('');
const items = ref<Item[]>([]);
const toAdd = ref(NO_SELECTION);

const isBusy = computed(() => $apiProducts.isLoading.value || $apiSave.isLoading.value);

const addOptions = computed(() => [
    { value: NO_SELECTION, label: t('Choose a product to add') },
    ...products.items.value
        .filter((p) => !items.value.some((i) => i.id === p.id))
        .map((p) => ({ value: p.id, label: p.published ? p.title : `${p.title} (${t('unpublished')})` }))
]);

function load() {
    return $apiProducts.tryCatch(async () => {
        const response = await $apiProducts.run(menuId.value);
        items.value = (response.data || []).map(({ id, title, published }: Item) => ({ id, title, published }));
    });
}

function add() {
    const product = products.byId.value.get(toAdd.value);

    if (product) {
        items.value.push({ id: product.id, title: product.title, published: product.published });
    }

    toAdd.value = NO_SELECTION;
}

function remove(idx: number) {
    items.value.splice(idx, 1);
}

function move(idx: number, delta: number) {
    const target = idx + delta;

    if (target < 0 || target >= items.value.length) {
        return;
    }

    const [item] = items.value.splice(idx, 1);
    items.value.splice(target, 0, item!);
}

function onSave() {
    if (isBusy.value) {
        return;
    }

    return $apiSave.tryCatch(async () => {
        await $apiSave.run(menuId.value, items.value.map((i) => i.id));
        successToast({ title: t('Menu products saved successfully') });
        open.value = false;
        emit('success');
    });
}

function show(menu: { id: string, title: string }) {
    menuId.value = menu.id;
    menuTitle.value = menu.title;
    items.value = [];
    toAdd.value = NO_SELECTION;
    load();
    open.value = true;
}

defineExpose({ show });
</script>

<template>
    <FormDialog
        v-model:open="open"
        :title="`${t('Menu products')}: ${menuTitle}`"
        :busy="isBusy"
        :submit-label="t('Save')"
        content-class="sm:max-w-2xl"
        @submit="onSave">
        <div class="flex items-center gap-2">
            <NativeSelect v-model="toAdd" class="grow w-full" :aria-label="t('Choose a product to add')">
                <NativeSelectOption v-for="option in addOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                </NativeSelectOption>
            </NativeSelect>
            <Button type="button" :disabled="toAdd === NO_SELECTION" @click="add">{{ t('Add') }}</Button>
        </div>

        <p v-if="!items.length" class="text-center py-4 text-muted-foreground" data-test="no-products">
            {{ t('No products on this menu yet.') }}
        </p>

        <ol class="divide-y" data-test="product-list">
            <li v-for="(item, idx) in items" :key="item.id" class="flex items-center gap-2 py-2" data-test="product-row">
                <span class="w-8 text-right text-muted-foreground">{{ idx + 1 }}.</span>
                <span class="grow">
                    {{ item.title }}
                    <span v-if="!item.published" class="text-amber-700 text-sm" data-test="unavailable">
                        ({{ t('unavailable: not published') }})
                    </span>
                </span>
                <Button
                    type="button" variant="ghost" size="icon"
                    :aria-label="t('Move up')" :disabled="idx === 0"
                    data-test="move-up" @click="move(idx, -1)">
                    <ChevronUpIcon />
                </Button>
                <Button
                    type="button" variant="ghost" size="icon"
                    :aria-label="t('Move down')" :disabled="idx === items.length - 1"
                    data-test="move-down" @click="move(idx, 1)">
                    <ChevronDownIcon />
                </Button>
                <Button
                    type="button" variant="ghost" size="icon"
                    class="text-destructive hover:text-destructive"
                    :aria-label="t('Remove')" data-test="remove" @click="remove(idx)">
                    <Trash2Icon />
                </Button>
            </li>
        </ol>
    </FormDialog>
</template>
