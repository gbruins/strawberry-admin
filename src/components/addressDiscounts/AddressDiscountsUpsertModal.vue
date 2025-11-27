<script lang="ts">
export default {
    name: 'AddressDiscountsUpsertModal'
}
</script>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
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
const $apiCreate = useApi('addressDiscount.create');
const $apiUpdate = useApi('addressDiscount.update');
const $apiRead = useApi('addressDiscount.read');
const { successToast } = useToast();

const upsertModal = ref(null);
const updateId = ref(null);

const form = reactive({
    street_number: '',
    allowed_street_id: '',
    discount_percent: 0,
    active: true
});

function getById(id) {
    return $apiRead.tryCatch(
        async () => {
            const response = await $apiRead.run(id);

            form.street_number = response.data?.street_number || '';
            form.allowed_street_id = response.data?.allowed_street_id || '';
            form.discount_percent = response.data?.discount_percent || 0;
            form.active = response.data?.active !== undefined ? response.data.active : true;

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
                title: t('Address discount saved successfully')
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

    form.street_number = '';
    form.allowed_street_id = '';
    form.discount_percent = 0;
    form.active = true;
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
            {{ updateId ? $t('Update address discount') : $t('Create address discount') }}
        </template>

        <fig-overlay :show="$apiCreate.isLoading.value || $apiUpdate.isLoading.value || $apiRead.isLoading.value">
            <fig-label-value-group display="block" density="md">
                <!-- street number -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Street number') }}</template>
                    <fig-form-input-text
                        v-model="form.street_number" />
                </fig-label-value>

                <!-- street name -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Street name') }}</template>
                    <allowed-streets-select
                        v-model="form.allowed_street_id" />
                </fig-label-value>

                <!-- discount percentage -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Discount percentage') }}</template>
                    <fig-form-input-number
                        v-model="form.discount_percent"
                        :min="0"
                        :max="100"
                        :step="1" />
                </fig-label-value>

                <!-- active -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Active') }}</template>
                    <fig-form-checkbox
                        v-model="form.active"
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
