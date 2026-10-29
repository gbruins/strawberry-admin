<script>
export default {
    name: 'CartDetailNotesCard'
}
</script>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useApi from '@/composables/useApi.js';
import { SaveIcon, PlusIcon, Trash2Icon, StickyNoteIcon } from '@lucide/vue';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Overlay from '@/components/Overlay.vue';
import PopConfirm from '@/components/PopConfirm.vue';
import Format8601 from '@/components/Format8601.vue';
import useToast from '@/composables/useToast';

const props = defineProps({
    cart: {
        type: Object
    }
});

const $apiUpdate = useApi('cart.notes.update');
const { t } = useI18n();
const { successToast } = useToast();

const cartNotes = ref([]);

async function onSaveNotes() {
    return $apiUpdate.tryCatch(
        async () => {
            await $apiUpdate.run(props.cart.id, cartNotes.value);

            successToast({
                title: t('Success'),
                text: t('Notes updated successfully')
            });
        }
    );
}

function onAddNote() {
    cartNotes.value.push({
        created_at: new Date().toISOString(),
        note: null
    })
}

function onRemoveNote(index) {
    cartNotes.value.splice(index, 1);
}

// TODO: add deep config?
watch(
    () => props.cart?.admin_order_notes,
    (val) => {
        cartNotes.value = Array.isArray(val) ? val : []
    }
);
</script>

<template>
    <Card>
        <CardHeader class="border-b">
            <CardTitle class="flex items-center gap-2 text-lg font-bold">
                <StickyNoteIcon class="size-6" />
                {{ t('Notes') }}
            </CardTitle>
        </CardHeader>

        <CardContent>
            <div class="w-full">
                <div v-if="cart?.customer_note" class="mb-4" data-test="customer-note">
                    <div class="text-sm font-bold">{{ t('Customer note') }}</div>
                    <p class="whitespace-pre-wrap break-words">{{ cart.customer_note }}</p>
                </div>

                <Overlay :show="$apiUpdate.isLoading.value">
                    <div class="flex flex-col gap-2 w-full">
                        <div
                            v-for="(row, index) in cartNotes"
                            :key="index"
                            class="flex gap-2 w-full items-start">
                            <div class="whitespace-nowrap pt-2 text-sm text-muted-foreground">
                                <Format8601 :date="row.created_at" />
                            </div>

                            <Textarea v-model="row.note" class="flex-grow" rows="1" />

                            <PopConfirm @confirm="onRemoveNote(index)">
                                <template v-slot:reference>
                                    <Button variant="ghost" size="icon" class="shrink-0">
                                        <Trash2Icon />
                                    </Button>
                                </template>
                                {{ t('Delete this row?') }}
                            </PopConfirm>
                        </div>
                    </div>

                    <div class="flex items-center pt-2" :class="{ 'pt-2': cartNotes.length }">
                        <Button variant="outline" size="sm" class="mr-3" @click="onAddNote">
                            <PlusIcon />
                            {{ t('Add note') }}
                        </Button>

                        <div class="flex-grow">
                            <Button
                                v-if="cartNotes.length"
                                size="sm"
                                @click="onSaveNotes">
                                <SaveIcon />
                                {{ t('Save notes') }}
                            </Button>
                        </div>
                    </div>
                </Overlay>
            </div>
        </CardContent>
    </Card>
</template>
