<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { required, maxLength } from '@vuelidate/validators';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import FormDialog from '@/components/FormDialog.vue';
import FormField from '@/components/FormField.vue';
import Format8601 from '@/components/Format8601.vue';
import useUpsertForm from '@/composables/useUpsertForm';
import { useMenus } from '@/composables/useLookups';

defineOptions({ name: 'MenuUpsertModal' });

const emit = defineEmits<{ success: [] }>();
const { t } = useI18n();
const menus = useMenus();

const upsert = useUpsertForm({
    resource: 'serviceMenu',
    defaults: () => ({
        title: '',
        description: '',
        published: false
    }),
    rules: () => ({
        title: { required, maxLength: maxLength(255) },
        description: { maxLength: maxLength(2000) }
    }),
    toPayload: (form) => ({ ...form, description: form.description || null }),
    successMessage: () => t('Menu saved successfully'),
    onSaved: () => emit('success')
});

// Read-only context from the loaded record, for the warnings below.
const services = computed<{ id: string, start_at: string }[]>(() => upsert.record?.services ?? []);
const productCount = computed(() => upsert.record?.product_count ?? 0);
const wasPublished = computed(() => !!upsert.record?.published);

const duplicateTitle = computed(() => {
    const title = upsert.form.title.trim().toLowerCase();

    return !!title && menus.items.value.some((m) => m.id !== upsert.editId && m.title.trim().toLowerCase() === title);
});

const unpublishWarning = computed(() => upsert.isEdit && wasPublished.value && !upsert.form.published && services.value.length > 0);
const emptyPublishWarning = computed(() => upsert.form.published && productCount.value === 0);

defineExpose({ show: upsert.show });
</script>

<template>
    <FormDialog
        v-model:open="upsert.open"
        :title="upsert.isEdit ? t('Update menu') : t('Create menu')"
        :busy="upsert.isBusy"
        content-class="sm:max-w-2xl"
        @submit="upsert.submit">
        <FormField :label="t('Title')" for="menu-title" :field="upsert.v$.title">
            <Input id="menu-title" v-model="upsert.form.title" />
        </FormField>

        <div v-if="duplicateTitle" class="text-sm text-amber-700" data-test="duplicate-title">
            {{ t('Another menu already has this title. You can still save.') }}
        </div>

        <FormField :label="t('Description')" for="menu-description" :field="upsert.v$.description">
            <Textarea id="menu-description" v-model="upsert.form.description" />
        </FormField>

        <div class="flex items-center gap-2">
            <Checkbox id="menu-published" v-model="upsert.form.published" />
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
    </FormDialog>
</template>
