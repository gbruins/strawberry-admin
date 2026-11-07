<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SaveIcon, PlusIcon, Trash2Icon, StickyNoteIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import SectionCard from '@/components/SectionCard.vue';
import Overlay from '@/components/Overlay.vue';
import PopConfirm from '@/components/PopConfirm.vue';
import Format8601 from '@/components/Format8601.vue';
import useApi from '@/composables/useApi';
import useToast from '@/composables/useToast';
import type { AdminOrderNote, Cart } from '@/types/cart';

const props = defineProps<{ cart: Cart }>();

const $apiUpdate = useApi('cart.notes.update');
const { t } = useI18n();
const { successToast } = useToast();

// A local working copy with a stable key per row. It used to alias the prop's own array, so
// edits changed the parent's data before Save, and rows were keyed by index, so deleting one
// could shift typed text into the wrong textarea.
type DraftNote = { created_at: string, note: string, key: number };

let nextKey = 0;
const notes = ref<DraftNote[]>([]);

watch(
    () => props.cart.admin_order_notes,
    (saved) => {
        notes.value = (Array.isArray(saved) ? saved : []).map(({ created_at, note }) => ({ created_at, note: note ?? '', key: nextKey++ }));
    },
    { immediate: true }
);

function onAddNote() {
    notes.value.push({ created_at: new Date().toISOString(), note: '', key: nextKey++ });
}

function onRemoveNote(index: number) {
    notes.value.splice(index, 1);
}

function onSaveNotes() {
    return $apiUpdate.tryCatch(async () => {
        const payload: AdminOrderNote[] = notes.value.map(({ created_at, note }) => ({ created_at, note: note || null }));
        await $apiUpdate.run(props.cart.id, payload);
        successToast({ title: t('Success'), text: t('Notes updated successfully') });
    });
}
</script>

<template>
    <SectionCard :title="t('Notes')" :icon="StickyNoteIcon">
        <div v-if="cart.customer_note" class="mb-4" data-test="customer-note">
            <div class="text-sm font-bold">{{ t('Customer note') }}</div>
            <p class="whitespace-pre-wrap break-words">{{ cart.customer_note }}</p>
        </div>

        <Overlay :show="$apiUpdate.isLoading.value">
            <div class="flex flex-col gap-2 w-full">
                <div v-for="(row, index) in notes" :key="row.key" class="flex gap-2 w-full items-start">
                    <div class="whitespace-nowrap pt-2 text-sm text-muted-foreground">
                        <Format8601 :date="row.created_at" />
                    </div>

                    <Textarea v-model="row.note" class="flex-grow" rows="1" :aria-label="t('Note')" />

                    <PopConfirm @confirm="onRemoveNote(index)">
                        <template #reference>
                            <Button variant="ghost" size="icon" class="shrink-0" :aria-label="t('Delete note')">
                                <Trash2Icon />
                            </Button>
                        </template>
                        {{ t('Delete this row?') }}
                    </PopConfirm>
                </div>
            </div>

            <div class="flex items-center gap-3 pt-2">
                <Button variant="outline" size="sm" @click="onAddNote">
                    <PlusIcon />
                    {{ t('Add note') }}
                </Button>

                <!-- Also shown once every note is removed, so the removal can be saved. -->
                <Button size="sm" :disabled="$apiUpdate.isLoading.value" @click="onSaveNotes">
                    <SaveIcon />
                    {{ t('Save notes') }}
                </Button>
            </div>
        </Overlay>
    </SectionCard>
</template>
