<script lang="ts">
export default {
    name: 'MenuProductsModal'
}
</script>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { ChevronUpIcon, ChevronDownIcon, Trash2Icon } from '@lucide/vue';
import Overlay from '@/components/Overlay.vue';
import useApi from '@/composables/useApi';
import useToast from '@/composables/useToast';

type Item = { id: string, title: string, published: boolean };

const emit = defineEmits(['success']);

const { t } = useI18n();
const $apiProducts = useApi('serviceMenu.getProducts');
const $apiSave = useApi('serviceMenu.setProducts');
const $apiAllProducts = useApi('product.search');
const { successToast } = useToast();

const NO_SELECTION = '';

const open = ref(false);
const menuId: Ref<string | null> = ref(null);
const menuTitle = ref('');
const items: Ref<Item[]> = ref([]);
const allProducts: Ref<Item[]> = ref([]);
const toAdd: Ref<string> = ref(NO_SELECTION);

const addOptions = computed(() => [
    { value: NO_SELECTION, label: t('Choose a product to add') },
    ...allProducts.value
        .filter((p) => !items.value.some((i) => i.id === p.id))
        .map((p) => ({ value: p.id, label: p.published ? p.title : `${p.title} (${t('unpublished')})` }))
]);

function load() {
    return $apiProducts.tryCatch(
        async () => {
            const [menuProducts, products] = await Promise.all([
                $apiProducts.run(menuId.value),
                $apiAllProducts.run({ _pageSize: 500, _sort: 'title:asc' })
            ]);

            items.value = (menuProducts.data || []).map(({ id, title, published }) => ({ id, title, published }));
            allProducts.value = (products.data || []).map(({ id, title, published }) => ({ id, title, published }));
        }
    );
}

function add() {
    const product = allProducts.value.find((p) => p.id === toAdd.value);

    if(product) {
        items.value.push(product);
    }

    toAdd.value = NO_SELECTION;
}

function remove(idx: number) {
    items.value.splice(idx, 1);
}

function move(idx: number, delta: number) {
    const target = idx + delta;

    if(target < 0 || target >= items.value.length) {
        return;
    }

    const [item] = items.value.splice(idx, 1);
    items.value.splice(target, 0, item);
}

function onSave() {
    return $apiSave.tryCatch(
        async () => {
            await $apiSave.run(menuId.value, items.value.map((i) => i.id));

            successToast({ title: t('Menu products saved successfully') });

            open.value = false;
            emit('success');
        }
    );
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
    <Dialog v-model:open="open">
        <DialogContent class="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>{{ t('Menu products') }}: {{ menuTitle }}</DialogTitle>
                <DialogDescription class="sr-only">{{ t('Menu products') }}: {{ menuTitle }}</DialogDescription>
            </DialogHeader>

            <Overlay :show="$apiProducts.isLoading.value || $apiSave.isLoading.value">
                <div class="flex items-center gap-2 mb-4">
                    <NativeSelect v-model="toAdd" class="grow w-full">
                        <NativeSelectOption
                            v-for="option in addOptions"
                            :key="option.value"
                            :value="option.value">{{ option.label }}</NativeSelectOption>
                    </NativeSelect>
                    <Button :disabled="toAdd === NO_SELECTION" @click="add">{{ t('Add') }}</Button>
                </div>

                <p v-if="!items.length" class="text-center py-4 text-muted-foreground" data-test="no-products">
                    {{ t('No products on this menu yet.') }}
                </p>

                <ol class="divide-y" data-test="product-list">
                    <li
                        v-for="(item, idx) in items"
                        :key="item.id"
                        class="flex items-center gap-2 py-2"
                        data-test="product-row">
                        <span class="w-8 text-right text-muted-foreground">{{ idx + 1 }}.</span>
                        <span class="grow">
                            {{ item.title }}
                            <span v-if="!item.published" class="text-amber-700 text-sm" data-test="unavailable">
                                ({{ t('unavailable: not published') }})
                            </span>
                        </span>
                        <Button
                            variant="ghost" size="icon"
                            :disabled="idx === 0"
                            data-test="move-up"
                            @click="move(idx, -1)">
                            <ChevronUpIcon />
                        </Button>
                        <Button
                            variant="ghost" size="icon"
                            :disabled="idx === items.length - 1"
                            data-test="move-down"
                            @click="move(idx, 1)">
                            <ChevronDownIcon />
                        </Button>
                        <Button
                            variant="destructive" size="icon"
                            data-test="remove"
                            @click="remove(idx)">
                            <Trash2Icon />
                        </Button>
                    </li>
                </ol>
            </Overlay>

            <DialogFooter class="sm:justify-center">
                <Button @click="onSave">{{ t('Save') }}</Button>
                <Button variant="ghost" @click="open = false">{{ t('Cancel') }}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
