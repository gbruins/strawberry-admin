<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { PencilIcon, Trash2Icon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import PopConfirm from '@/components/PopConfirm.vue';

// The edit / (extra actions) / confirm-delete button group shown in a list row. A button only
// renders when its handler is passed (`@edit`, `@delete`); extra row actions go in the default
// slot, between the two.

withDefaults(defineProps<{
    onEdit?: () => void;
    onDelete?: () => void;
    /** Hide the delete button for this row even though a handler is bound. */
    deletable?: boolean;
    editLabel?: string;
    deleteLabel?: string;
    deleteConfirm?: string;
}>(), {
    deletable: true
});

const { t } = useI18n();
</script>

<template>
    <div class="flex items-center justify-end gap-1">
        <Button
            v-if="onEdit"
            variant="ghost"
            size="icon"
            :aria-label="editLabel ?? t('Edit')"
            :title="editLabel ?? t('Edit')"
            @click="onEdit()">
            <PencilIcon />
        </Button>

        <slot />

        <PopConfirm v-if="onDelete && deletable" @confirm="onDelete()">
            <template #reference>
                <Button
                    variant="ghost"
                    size="icon"
                    class="text-destructive hover:text-destructive hover:bg-destructive/10"
                    :aria-label="deleteLabel ?? t('Delete')"
                    :title="deleteLabel ?? t('Delete')">
                    <Trash2Icon />
                </Button>
            </template>

            <slot name="delete-confirm">{{ deleteConfirm ?? t('Delete this item?') }}</slot>
        </PopConfirm>
    </div>
</template>
