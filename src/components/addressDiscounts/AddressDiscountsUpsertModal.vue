<script>
export default {
    name: 'AddressDiscountsUpsertModal'
}
</script>

<script setup>
import { ref, watch, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import FigFormInputText from '@/components/form/text/FormText.vue';
import FigFormInputNumber from '@/components/form/number/FormInputNumber.vue';
// import FigFormSelect from '@/components/form/select/FormSelect.vue';
import FigFormCheckbox from '@/components/form/checkbox/FormCheckbox.vue';
import FigLabelValueGroup from '@/components/labelValueGroup/LabelValueGroup.vue';
import FigLabelValue from '@/components/labelValueGroup/LabelValue.vue';
import FigButton from '@/components/button/Button.vue';
import FigModal from '@/components/modal/Modal.vue';
import useApi from '@/composables/useApi';
import useToast from '@/components/toast/useToast';

const props = defineProps({
    data: {
        type: Object,
        default: () => {
            return {};
        }
    }
});

const emit = defineEmits([
    'success'
]);

const { t } = useI18n();
const $apiCreate = useApi('addressDiscount.create');
const $apiUpdate = useApi('addressDiscount.update');
const { successToast } = useToast();

const upsertModal = ref(null);
const isUpdate = ref(false);

const form = reactive({
    street_number: '',
    street_name: '',
    discount_percent: 0,
    active: true
});

function onSubmit() {
    const api = isUpdate.value ? $apiUpdate : $apiCreate;
    const formData = isUpdate.value ? { id: props.data.id, ...form } : { ...form };

    return api.tryCatch(
        async () => {
            await api.run({
                ...formData
            });

            successToast({
                title: t('Address discount saved successfully')
            });

            upsertModal.value.hide();

            emit('success');
        }
    );
}

function show() {
    upsertModal.value.show();
}

watch(
    () => props.data, (newVal) => {
        if(newVal) {
            form.street_number = newVal.street_number || '';
            form.street_name = newVal.street_name || '';
            form.discount_percent = newVal.discount_percent || 0;
            form.active = newVal.active !== undefined ? newVal.active : true;
        }
        else {
            form.street_number = '';
            form.street_name = '';
            form.discount_percent = 0;
            form.active = true;
        }

        isUpdate.value = newVal.id !== undefined;
    },
    { immediate: true }
);

defineExpose({
    show
});
</script>

<template>
    <fig-modal size="lg" ref="upsertModal">
        <template v-slot:header>
            {{ isUpdate ? $t('Update address discount') : $t('Create address discount') }}
        </template>

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
                <fig-form-input-text
                    v-model="form.street_name" />
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

        <template v-slot:footer>
            <fig-button
                variant="primary"
                @click="onSubmit">{{ $t('Submit') }}</fig-button>
        </template>
    </fig-modal>
</template>
