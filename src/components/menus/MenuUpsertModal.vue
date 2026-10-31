<script lang="ts">
export default {
    name: 'MenuUpsertModal'
}
</script>

<script setup lang="ts">
import { ref, reactive, computed, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useVuelidate } from '@vuelidate/core';
import { required, maxLength } from '@vuelidate/validators';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import Overlay from '@/components/Overlay.vue';
import Format8601 from '@/components/Format8601.vue';
import useApi from '@/composables/useApi';
import useToast from '@/composables/useToast';

const emit = defineEmits(['success']);

const { t } = useI18n();
const $apiCreate = useApi('serviceMenu.create');
const $apiUpdate = useApi('serviceMenu.update');
const $apiRead = useApi('serviceMenu.read');
const $apiSearch = useApi('serviceMenu.search');
const { successToast } = useToast();

const open = ref(false);
const updateId: Ref<string | null> = ref(null);
const wasPublished = ref(false);
const productCount = ref(0);
const services: Ref<{ id: string, start_at: string, end_at: string }[]> = ref([]);
const otherTitles: Ref<string[]> = ref([]);

const form = reactive({
    title: '',
    description: '',
    published: false,
});

const validationRules = {
    title: { required, maxLength: maxLength(255) },
    description: { maxLength: maxLength(2000) },
    published: {},
};

const v$ = useVuelidate(validationRules, form);

const duplicateTitle = computed(() => {
    const title = form.title.trim().toLowerCase();
    return !!title && otherTitles.value.includes(title);
});

const unpublishWarning = computed(() => {
    return updateId.value && wasPublished.value && !form.published && services.value.length > 0;
});

const emptyPublishWarning = computed(() => form.published && productCount.value === 0);

function loadOtherTitles(excludeId: string | null) {
    return $apiSearch.tryCatch(
        async () => {
            const response = await $apiSearch.run({ _pageSize: 500 });

            otherTitles.value = (response.data || [])
                .filter((m) => m.id !== excludeId)
                .map((m) => m.title.trim().toLowerCase());
        }
    );
}

function getById(id: string) {
    return $apiRead.tryCatch(
        async () => {
            const response = await $apiRead.run(id);

            form.title = response.data?.title || '';
            form.description = response.data?.description || '';
            form.published = !!response.data?.published;
            wasPublished.value = form.published;
            productCount.value = response.data?.product_count || 0;
            services.value = response.data?.services || [];
            updateId.value = id;
        }
    );
}

function onSubmit() {
    const api = updateId.value ? $apiUpdate : $apiCreate;
    const data = { ...form, description: form.description || null };
    const formData = updateId.value ? { id: updateId.value, ...data } : data;

    return api.tryCatch(
        async () => {
            await api.run(formData);

            successToast({ title: t('Menu saved successfully') });

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
    wasPublished.value = false;
    productCount.value = 0;
    services.value = [];
    form.title = '';
    form.description = '';
    form.published = false;
    v$.value.$reset();
}

function show(id?: string) {
    resetData();
    loadOtherTitles(id || null);

    if(id) {
        getById(id);
    }

    open.value = true;
}

defineExpose({ show });
</script>

<template>
    <Dialog v-model:open="open">
        <DialogContent class="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>{{ updateId ? t('Update menu') : t('Create menu') }}</DialogTitle>
                <DialogDescription class="sr-only">{{ updateId ? t('Update menu') : t('Create menu') }}</DialogDescription>
            </DialogHeader>

            <Overlay :show="$apiCreate.isLoading.value || $apiUpdate.isLoading.value || $apiRead.isLoading.value">
                <div class="grid grid-cols-1 gap-4">
                    <div class="grid gap-1.5">
                        <Label for="menu-title">{{ t('Title') }}</Label>
                        <Input id="menu-title" v-model="form.title" />

                        <div v-if="v$.title.$dirty && v$.title.required.$invalid" class="text-sm text-destructive">{{ t('required') }}</div>
                        <div v-else-if="v$.title.$dirty && v$.title.maxLength.$invalid" class="text-sm text-destructive">{{ t('must be at most {max} characters', { max: 255 }) }}</div>
                    </div>

                    <div v-if="duplicateTitle" class="text-sm text-amber-700" data-test="duplicate-title">
                        {{ t('Another menu already has this title. You can still save.') }}
                    </div>

                    <div class="grid gap-1.5">
                        <Label for="menu-description">{{ t('Description') }}</Label>
                        <Textarea id="menu-description" v-model="form.description" />

                        <div v-if="v$.description.$dirty && v$.description.maxLength.$invalid" class="text-sm text-destructive">{{ t('must be at most {max} characters', { max: 2000 }) }}</div>
                    </div>

                    <div class="flex items-center gap-2">
                        <Checkbox id="menu-published" v-model="form.published" />
                        <Label for="menu-published">{{ t('Published') }}</Label>
                    </div>

                    <div v-if="emptyPublishWarning" class="text-sm text-amber-700" data-test="empty-warning">
                        {{ t('This menu has no products. Visitors will see an empty menu. You can still save.') }}
                    </div>

                    <div v-if="unpublishWarning" class="text-sm text-amber-700" data-test="unpublish-warning">
                        {{ t('Unpublishing hides this menu from visitors. These services use it:') }}
                        <ul class="list-disc ml-5">
                            <li v-for="svc in services" :key="svc.id">
                                <Format8601 :date="svc.start_at" />
                            </li>
                        </ul>
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
