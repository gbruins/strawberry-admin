<script lang="ts">
export default {
    name: 'MenuProductsModal'
}
</script>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import FigButton from '@/components/figleaf/button/Button.vue';
import FigModal from '@/components/figleaf/modal/Modal.vue';
import FigOverlay from '@/components/figleaf/overlay/Overlay.vue';
import FigFormSelectNative from '@/components/figleaf/form/selectNative/FormSelectNative.vue';
import useApi from '@/composables/useApi';
import useToast from '@/components/figleaf/toast/useToast';

type Item = { id: string, title: string, published: boolean };

const emit = defineEmits(['success']);

const { t } = useI18n();
const $apiProducts = useApi('serviceMenu.getProducts');
const $apiSave = useApi('serviceMenu.setProducts');
const $apiAllProducts = useApi('product.search');
const { successToast } = useToast();

const modal = ref(null);
const menuId: Ref<string | null> = ref(null);
const menuTitle = ref('');
const items: Ref<Item[]> = ref([]);
const allProducts: Ref<Item[]> = ref([]);
const toAdd: Ref<string | null> = ref(null);

const addOptions = computed(() => [
    { value: null, label: t('Choose a product to add') },
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

    toAdd.value = null;
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

            modal.value.hide();
            emit('success');
        }
    );
}

function show(menu: { id: string, title: string }) {
    menuId.value = menu.id;
    menuTitle.value = menu.title;
    items.value = [];
    toAdd.value = null;
    load();
    modal.value.show();
}

defineExpose({ show });
</script>

<template>
    <fig-modal size="lg" ref="modal">
        <template v-slot:header>
            {{ $t('Menu products') }}: {{ menuTitle }}
        </template>

        <fig-overlay :show="$apiProducts.isLoading.value || $apiSave.isLoading.value">
            <div class="flex items-center gap-2 mb-4">
                <div class="grow">
                    <fig-form-select-native v-model="toAdd" :options="addOptions" />
                </div>
                <fig-button variant="primary" :disabled="!toAdd" @click="add">{{ $t('Add') }}</fig-button>
            </div>

            <p v-if="!items.length" class="text-center py-4" data-test="no-products">
                {{ $t('No products on this menu yet.') }}
            </p>

            <ol class="divide-y" data-test="product-list">
                <li
                    v-for="(item, idx) in items"
                    :key="item.id"
                    class="flex items-center gap-2 py-2"
                    data-test="product-row">
                    <span class="w-8 text-right">{{ idx + 1 }}.</span>
                    <span class="grow">
                        {{ item.title }}
                        <span v-if="!item.published" class="text-amber-700 text-sm" data-test="unavailable">
                            ({{ $t('unavailable: not published') }})
                        </span>
                    </span>
                    <fig-button
                        variant="plain" iconOnly icon="chevron-up"
                        :disabled="idx === 0"
                        data-test="move-up"
                        @click="move(idx, -1)" />
                    <fig-button
                        variant="plain" iconOnly icon="chevron-down"
                        :disabled="idx === items.length - 1"
                        data-test="move-down"
                        @click="move(idx, 1)" />
                    <fig-button
                        variant="danger" iconOnly icon="trash"
                        data-test="remove"
                        @click="remove(idx)" />
                </li>
            </ol>
        </fig-overlay>

        <template v-slot:footer>
            <div class="flex items-center gap-4 w-full justify-center">
                <fig-button variant="primary" @click="onSave">{{ $t('Save') }}</fig-button>
                <fig-button variant="plain" @click="modal.hide()">{{ $t('Cancel') }}</fig-button>
            </div>
        </template>
    </fig-modal>
</template>
