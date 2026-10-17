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
import FigFormInputText from '@/components/figleaf/form/text/FormText.vue';
import FigFormTextarea from '@/components/figleaf/form/textarea/FormTextarea.vue';
import FigFormCheckbox from '@/components/figleaf/form/checkbox/FormCheckbox.vue';
import FigLabelValueGroup from '@/components/figleaf/labelValueGroup/LabelValueGroup.vue';
import FigLabelValue from '@/components/figleaf/labelValueGroup/LabelValue.vue';
import FigButton from '@/components/figleaf/button/Button.vue';
import FigModal from '@/components/figleaf/modal/Modal.vue';
import FigOverlay from '@/components/figleaf/overlay/Overlay.vue';
import FigFormat8601 from '@/components/figleaf/format8601/Format8601.vue';
import useApi from '@/composables/useApi';
import useToast from '@/components/figleaf/toast/useToast';

const emit = defineEmits(['success']);

const { t } = useI18n();
const $apiCreate = useApi('serviceMenu.create');
const $apiUpdate = useApi('serviceMenu.update');
const $apiRead = useApi('serviceMenu.read');
const $apiSearch = useApi('serviceMenu.search');
const { successToast } = useToast();

const upsertModal = ref(null);
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
    upsertModal.value.hide();
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

    upsertModal.value.show();
}

defineExpose({ show });
</script>

<template>
    <fig-modal size="lg" ref="upsertModal">
        <template v-slot:header>
            {{ updateId ? $t('Update menu') : $t('Create menu') }}
        </template>

        <fig-overlay :show="$apiCreate.isLoading.value || $apiUpdate.isLoading.value || $apiRead.isLoading.value">
            <fig-label-value-group display="block" density="md">
                <fig-label-value>
                    <template v-slot:label>{{ $t('Title') }}</template>
                    <fig-form-input-text v-model="form.title" />

                    <template v-slot:error>
                        <div v-if="v$.title.required.$invalid">{{ $t('required') }}</div>
                        <div v-else-if="v$.title.maxLength.$invalid">{{ $t('must be at most {max} characters', { max: 255 }) }}</div>
                    </template>
                </fig-label-value>

                <div v-if="duplicateTitle" class="text-sm text-amber-700" data-test="duplicate-title">
                    {{ $t('Another menu already has this title. You can still save.') }}
                </div>

                <fig-label-value>
                    <template v-slot:label>{{ $t('Description') }}</template>
                    <fig-form-textarea v-model="form.description" />

                    <template v-slot:error>
                        <div v-if="v$.description.maxLength.$invalid">{{ $t('must be at most {max} characters', { max: 2000 }) }}</div>
                    </template>
                </fig-label-value>

                <fig-label-value>
                    <template v-slot:label>{{ $t('Published') }}</template>
                    <fig-form-checkbox v-model="form.published" binary />
                </fig-label-value>

                <div v-if="emptyPublishWarning" class="text-sm text-amber-700" data-test="empty-warning">
                    {{ $t('This menu has no products. Visitors will see an empty menu. You can still save.') }}
                </div>

                <div v-if="unpublishWarning" class="text-sm text-amber-700" data-test="unpublish-warning">
                    {{ $t('Unpublishing hides this menu from visitors. These services use it:') }}
                    <ul class="list-disc ml-5">
                        <li v-for="svc in services" :key="svc.id">
                            <fig-format8601 :date="svc.start_at" />
                        </li>
                    </ul>
                </div>
            </fig-label-value-group>
        </fig-overlay>

        <template v-slot:footer>
            <div class="flex items-center gap-4 w-full justify-center">
                <fig-button
                    variant="primary"
                    @click="onSubmit"
                    :disabled="v$.$invalid">{{ $t('Submit') }}</fig-button>

                <fig-button variant="plain" @click="hide">{{ $t('Cancel') }}</fig-button>
            </div>
        </template>
    </fig-modal>
</template>
