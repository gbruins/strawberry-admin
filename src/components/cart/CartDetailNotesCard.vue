<script>
export default {
    name: 'CartDetailNotesCard'
}
</script>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useApi from '@/composables/useApi.js';
import FigButton from '@/components/figleaf/button/Button.vue';
import FigIcon from '@/components/figleaf/icon/FigIcon.vue';
import FigTextCard from '@/components/figleaf/textCard/TextCard.vue';
import FigRowBuilder from '@/components/figleaf/rowBuilder/RowBuilder.vue';
import FigFormTextarea from '@/components/figleaf/form/textarea/FormTextarea.vue';
import FigOverlay from '@/components/figleaf/overlay/Overlay.vue';
import FigFormat8601 from '@/components/figleaf/format8601/Format8601.vue';
import FigIconLabel from '@/components/figleaf/iconLabel/IconLabel.vue';
import useToast from '@/components/figleaf/toast/useToast';

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
    <fig-text-card variant="white">
        <template v-slot:header_left>
            <fig-icon-label>
                <template v-slot:left>
                    <fig-icon
                        icon="notes"
                        width="26"
                        height="26"
                        :stroke-width="1" />
                </template>
                <div class="text-lg font-bold">{{ $t('Notes') }}</div>
            </fig-icon-label>
        </template>

        <div class="w-full">
            <fig-overlay :show="$apiUpdate.isLoading.value">
                <fig-row-builder
                    v-model="cartNotes"
                    @add="onAddNote"
                    @remove="onRemoveNote"
                    :sortable="false"
                    class="w-full">
                    <template v-slot:buttonLabel>{{ $t('Add note') }}</template>

                    <template v-slot:default="slotScope">
                        <div class="flex gap-2 w-full">
                            <div class="whitespace-nowrap">
                                <fig-format-8601 :date="slotScope.rowBuilder.created_at" />
                            </div>
                            <fig-form-textarea
                                v-model="slotScope.rowBuilder.note"
                                class="flex-grow"
                                rows="1" />
                        </div>
                    </template>

                    <template v-slot:addButtonRight>
                        <fig-button
                            v-if="cartNotes.length"
                            @click="onSaveNotes"
                            variant="primary"
                            size="sm"
                            icon="floppy">{{ $t('Save notes') }}</fig-button>
                    </template>
                </fig-row-builder>
            </fig-overlay>
        </div>
    </fig-text-card>
</template>
