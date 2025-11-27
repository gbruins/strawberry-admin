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
import FigFormInputText from '@/components/figleaf/form/text/FormText.vue';
import FigFormInputNumber from '@/components/figleaf/form/number/FormInputNumber.vue';
import FigFormCheckbox from '@/components/figleaf/form/checkbox/FormCheckbox.vue';
import FigLabelValueGroup from '@/components/figleaf/labelValueGroup/LabelValueGroup.vue';
import FigLabelValue from '@/components/figleaf/labelValueGroup/LabelValue.vue';
import FigButton from '@/components/figleaf/button/Button.vue';
import FigModal from '@/components/figleaf/modal/Modal.vue';
import FigOverlay from '@/components/figleaf/overlay/Overlay.vue';
import AllowedStreetsSelect from '@/components/allowedStreets/AllowedStreetsSelect.vue';
import useApi from '@/composables/useApi';
import useToast from '@/components/figleaf/toast/useToast';

const emit = defineEmits([
    'success'
]);

const { t } = useI18n();
const $apiCreate = useApi('productType.create');
const $apiUpdate = useApi('productType.update');
const $apiRead = useApi('productType.read');
const { successToast } = useToast();
const appStore = useAppStore();

const upsertModal = ref(null);
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
    upsertModal.value.hide();
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

    upsertModal.value.show();
}

defineExpose({
    show
});
</script>

<template>
    <fig-modal
        size="lg"
        ref="upsertModal">
        <template v-slot:header>
            {{ updateId ? $t('Update product type') : $t('Create product type') }}
        </template>

        <fig-overlay :show="$apiCreate.isLoading.value || $apiUpdate.isLoading.value || $apiRead.isLoading.value">
            <fig-label-value-group display="block" density="md">
                <!-- name -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Name') }}</template>
                    <fig-form-input-text
                        v-model="form.name" />
                </fig-label-value>

                <!-- description -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Description') }}</template>
                    <fig-form-input-text
                        v-model="form.description" />
                </fig-label-value>

                <!-- published -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Published') }}</template>
                    <fig-form-checkbox
                        v-model="form.published"
                        binary />
                </fig-label-value>
            </fig-label-value-group>
        </fig-overlay>

        <template v-slot:footer>
            <div class="flex items-center gap-4 w-full justify-center">
                <fig-button
                    variant="primary"
                    @click="onSubmit">{{ $t('Submit') }}</fig-button>

                <fig-button
                    variant="plain"
                    @click="hide">{{ $t('Cancel') }}</fig-button>
            </div>
        </template>
    </fig-modal>
</template>
