<script lang="ts">
export default {
    name: 'ServiceUpsertModal'
}
</script>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue } from '@vuelidate/validators';
import FigFormInputText from '@/components/figleaf/form/text/FormText.vue';
import FigFormInputNumber from '@/components/figleaf/form/number/FormInputNumber.vue';
import FigLabelValueGroup from '@/components/figleaf/labelValueGroup/LabelValueGroup.vue';
import FigLabelValue from '@/components/figleaf/labelValueGroup/LabelValue.vue';
import FigButton from '@/components/figleaf/button/Button.vue';
import FigModal from '@/components/figleaf/modal/Modal.vue';
import FigOverlay from '@/components/figleaf/overlay/Overlay.vue';
import FigFormInputDate from '@/components/figleaf/form/date/FormInputDate.vue';
import useApi from '@/composables/useApi';
import useToast from '@/components/figleaf/toast/useToast';

const emit = defineEmits([
    'success'
]);

const { t } = useI18n();
const $apiCreate = useApi('service.create');
const $apiUpdate = useApi('service.update');
const $apiRead = useApi('service.read');
const $apiSearch = useApi('service.search');
const { successToast } = useToast();

const upsertModal = ref(null);
const updateId: Ref<string | null> = ref(null);

const form = reactive({
    start_at: null,
    end_at: null,
    notes: '',
    inventory_count: 0,
});

const validationRules = {
    start_at: { required },
    end_at: {
        required,
        afterStartAt(value) {
            if(!value || !form.start_at) {
                return true;
            }

            return new Date(value).getTime() > new Date(form.start_at).getTime();
        },
    },
    notes: { },
    inventory_count: { required, minValue: minValue(1) },
};

const v$ = useVuelidate(validationRules, form);

function getById(id: string) {
    return $apiRead.tryCatch(
        async () => {
            const response = await $apiRead.run(id);

            form.start_at = response.data?.start_at || null;
            form.end_at = response.data?.end_at || null;
            form.notes = response.data?.notes || '';
            form.inventory_count = response.data?.inventory_count || 0;

            updateId.value = id;
        }
    );
}

function onStartAtChange(value) {
    // As a UI convenience, if end_at is not set, set it to the same as start_at + 1 hour
    if (!form.end_at || (new Date(form.end_at).getTime() < new Date(value).getTime())) {
        // add one hour to the ISO-8601 timestamp derived from the new start value
        const startDate = new Date(value || form.start_at);
        form.end_at = new Date(startDate.getTime() + 60 * 60 * 1000).toISOString();
    }
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
                title: t('Service saved successfully')
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

    form.start_at = null;
    form.end_at = null;
    form.notes = '';
    form.inventory_count = 0;
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
            {{ updateId ? $t('Update service') : $t('Create service') }}
        </template>

        <fig-overlay :show="$apiCreate.isLoading.value || $apiUpdate.isLoading.value || $apiRead.isLoading.value">
            <fig-label-value-group display="block" density="md">
                <!-- start at -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Start at') }}</template>

                    <fig-form-input-date
                        v-model="form.start_at"
                        @update:modelValue="onStartAtChange" />

                    <template v-slot:error>
                        <div v-if="v$.start_at.required.$invalid">{{ $t('required') }}</div>
                    </template>
                </fig-label-value>

                <!-- end at -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('End at') }}</template>

                    <fig-form-input-date
                        v-model="form.end_at" />

                    <template v-slot:error>
                        <div v-if="v$.end_at.required.$invalid">{{ $t('required') }}</div>
                        <div v-else-if="v$.end_at.afterStartAt.$invalid">{{ $t('must be after "Start at"') }}</div>
                    </template>
                </fig-label-value>

                <!-- notes -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Notes') }}</template>
                    <fig-form-input-text
                        v-model="form.notes" />
                </fig-label-value>

                <!-- dough count -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Dough count') }}</template>

                    <fig-form-input-number
                        v-model="form.inventory_count"
                        :min="0"
                        :step="1" />

                    <template v-slot:error>
                        <div v-if="v$.inventory_count.required.$invalid">{{ $t('required') }}</div>
                        <div v-else-if="v$.inventory_count.minValue.$invalid">{{ $t('must be at least {min}', { min: 1 }) }}</div>
                    </template>
                </fig-label-value>
            </fig-label-value-group>
        </fig-overlay>

        <template v-slot:footer>
            <div class="flex items-center gap-4 w-full justify-center">
                <fig-button
                    variant="primary"
                    @click="onSubmit"
                    :disabled="v$.$invalid">{{ $t('Submit') }}</fig-button>

                <fig-button
                    variant="plain"
                    @click="hide">{{ $t('Cancel') }}</fig-button>
            </div>
        </template>
    </fig-modal>
</template>
