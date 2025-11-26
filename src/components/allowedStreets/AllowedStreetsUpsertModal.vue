<script lang="ts">
export default {
    name: 'AllowedStreetsUpsertModal'
}
</script>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/stores/app.js';
import FigFormInputText from '@/components/form/text/FormText.vue';
import FigFormCheckbox from '@/components/form/checkbox/FormCheckbox.vue';
import FigLabelValueGroup from '@/components/labelValueGroup/LabelValueGroup.vue';
import FigLabelValue from '@/components/labelValueGroup/LabelValue.vue';
import FigButton from '@/components/button/Button.vue';
import FigModal from '@/components/modal/Modal.vue';
import FigOverlay from '@/components/overlay/Overlay.vue';
import useApi from '@/composables/useApi';
import useToast from '@/components/toast/useToast';

const emit = defineEmits([
    'success'
]);

const { t } = useI18n();
const $apiCreate = useApi('allowedStreet.create');
const $apiUpdate = useApi('allowedStreet.update');
const $apiRead = useApi('allowedStreet.read');
const $apiSearch = useApi('allowedStreet.search');
const { successToast } = useToast();
const appStore = useAppStore();

const upsertModal = ref(null);
const updateId: Ref<string | null> = ref(null);

const form = reactive({
    street_name: '',
    active: true
});

function getById(id: string) {
    return $apiRead.tryCatch(
        async () => {
            const response = await $apiRead.run(id);

            form.street_name = response.data?.street_name || '';
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
                title: t('Allowed street saved successfully')
            });

            hide();
            appStore.updateAllowedStreetsState();
            emit('success');
        }
    );
}

function hide() {
    upsertModal.value.hide();
}

function resetData() {
    updateId.value = null;

    form.street_name = '';
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
            {{ updateId ? $t('Update allowed street') : $t('Create allowed street') }}
        </template>

        <fig-overlay :show="$apiCreate.isLoading.value || $apiUpdate.isLoading.value || $apiRead.isLoading.value">
            <fig-label-value-group display="block" density="md">
                <!-- street name -->
                <fig-label-value>
                    <template v-slot:label>{{ $t('Street name') }}</template>
                    <fig-form-input-text
                        v-model="form.street_name" />
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
