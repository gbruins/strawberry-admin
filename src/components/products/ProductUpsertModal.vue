<script lang="ts">
export default {
    name: 'ProductUpsertModal'
}
</script>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import FigFormInputText from '@/components/figleaf/form/text/FormText.vue';
import FigFormInputNumber from '@/components/figleaf/form/number/FormInputNumber.vue';
import FigFormCheckbox from '@/components/figleaf/form/checkbox/FormCheckbox.vue';
import FigLabelValueGroup from '@/components/figleaf/labelValueGroup/LabelValueGroup.vue';
import FigLabelValue from '@/components/figleaf/labelValueGroup/LabelValue.vue';
import FigButton from '@/components/figleaf/button/Button.vue';
import FigModal from '@/components/figleaf/modal/Modal.vue';
import FigOverlay from '@/components/figleaf/overlay/Overlay.vue';
import ProductTypeSelect from '@/components/productTypes/ProductTypeSelect.vue';
import useApi from '@/composables/useApi';
import useToast from '@/components/figleaf/toast/useToast';

const emit = defineEmits([
    'success'
]);

const { t } = useI18n();
const $apiCreate = useApi('product.create');
const $apiUpdate = useApi('product.update');
const $apiRead = useApi('product.read');
const $apiSearch = useApi('product.search');
const { successToast } = useToast();

const upsertModal = ref(null);
const updateId: Ref<string | null> = ref(null);

const form = reactive({
    title: '',
    description: '',
    product_type: null,
    base_price: 0,
    stripe_price_id: null,
    stripe_product_id: null,
    published: true
});

function getById(id: string) {
    return $apiRead.tryCatch(
        async () => {
            const response = await $apiRead.run(id);

            form.title = response.data?.title || '';
            form.description = response.data?.description || '';
            form.product_type = response.data?.product_type || null;
            form.base_price = response.data?.base_price || 0;
            form.stripe_price_id = response.data?.stripe_price_id || null;
            form.stripe_product_id = response.data?.stripe_product_id || null;
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
                ...formData
            });

            successToast({
                title: t('Product saved successfully')
            });

            hide();
            emit('success');
        }
    );
}

function hide() {
    upsertModal.value.hide();
}

function resetData() {
    updateId.value = null;

    form.title = '';
    form.description = '';
    form.product_type = null;
    form.base_price = 0;
    form.stripe_price_id = null;
    form.stripe_product_id = null;
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
            {{ updateId ? $t('Update product') : $t('Create product') }}
        </template>

        <fig-overlay :show="$apiCreate.isLoading.value || $apiUpdate.isLoading.value || $apiRead.isLoading.value">
            <fig-label-value-group display="block" density="md">
                <!-- title -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Title') }}</template>
                    <fig-form-input-text
                        v-model="form.title" />
                </fig-label-value>

                <!-- description -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Description') }}</template>
                    <fig-form-input-text
                        v-model="form.description" />
                </fig-label-value>

                <!-- product type -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Product type') }}</template>
                    <product-type-select
                        v-model="form.product_type"
                        :clearable="true" />
                </fig-label-value>

                <!-- base price -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Base price') }}</template>
                    <fig-form-input-number
                        v-model="form.base_price"
                        :min="0"
                        :step="1" />
                </fig-label-value>

                <!-- stripe price id -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Stripe price ID') }}</template>
                    <fig-form-input-text
                        v-model="form.stripe_price_id" />
                </fig-label-value>

                <!-- stripe product id -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Stripe product ID') }}</template>
                    <fig-form-input-text
                        v-model="form.stripe_product_id" />
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
            <div class="flex items-center gap-4">
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
