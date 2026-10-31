<script lang="ts">
export default {
    name: 'ProductTypeUpsertModal'
}
</script>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/stores/app.js';
import slugify from 'slugify';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import Overlay from '@/components/Overlay.vue';
import useApi from '@/composables/useApi';
import useToast from '@/composables/useToast';

const emit = defineEmits([
    'success'
]);

const { t } = useI18n();
const $apiCreate = useApi('productType.create');
const $apiUpdate = useApi('productType.update');
const $apiRead = useApi('productType.read');
const { successToast } = useToast();
const appStore = useAppStore();

const open = ref(false);
const updateId = ref(null);

const form = reactive({
    name: '',
    description: '',
    ordinal: 1,
    published: true
});

function getById(id) {
    return $apiRead.tryCatch(
        async () => {
            const response = await $apiRead.run(id);

            form.name = response.data?.name || '';
            form.description = response.data?.description || '';
            form.ordinal = response.data?.ordinal || 1;
            form.published = response.data?.published !== undefined ? response.data.published : true;

            updateId.value = id;
        }
    );
}

function onSubmit() {
    const api = updateId.value ? $apiUpdate : $apiCreate;
    const formData = updateId.value ? { id: updateId.value, ...form } : { ...form };

    return api.tryCatch(
        async () => {
            await api.run({
                ...formData,
                slug: form.slug || slugify(form.name, { lower: true, strict: true })
            });

            successToast({
                title: t('Product type saved successfully')
            });

            hide();
            appStore.updateProductTypesState();
            emit('success');
        }
    );
}

function hide() {
    open.value = false;
}

function resetData() {
    updateId.value = null;

    form.name = '';
    form.description = '';
    form.ordinal = 1;
    form.published = true;
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
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{{ updateId ? t('Update product type') : t('Create product type') }}</DialogTitle>
                <DialogDescription class="sr-only">{{ updateId ? t('Update product type') : t('Create product type') }}</DialogDescription>
            </DialogHeader>

            <Overlay :show="$apiCreate.isLoading.value || $apiUpdate.isLoading.value || $apiRead.isLoading.value">
                <div class="grid grid-cols-1 gap-4">
                    <!-- name -->
                    <div class="grid gap-1.5">
                        <Label for="product-type-name">{{ t('Name') }}</Label>
                        <Input id="product-type-name" v-model="form.name" />
                    </div>

                    <!-- description -->
                    <div class="grid gap-1.5">
                        <Label for="product-type-description">{{ t('Description') }}</Label>
                        <Input id="product-type-description" v-model="form.description" />
                    </div>

                    <!-- published -->
                    <div class="flex items-center gap-2">
                        <Checkbox id="product-type-published" v-model="form.published" />
                        <Label for="product-type-published">{{ t('Published') }}</Label>
                    </div>
                </div>
            </Overlay>

            <DialogFooter class="sm:justify-center">
                <Button @click="onSubmit">{{ t('Submit') }}</Button>
                <Button variant="ghost" @click="hide">{{ t('Cancel') }}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
