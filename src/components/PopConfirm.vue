<script setup>
import { ref, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

const props = defineProps({
    side: {
        type: String,
        default: 'top'
    },

    align: {
        type: String,
        default: 'center'
    },

    showConfirmButton: {
        type: Boolean,
        default: true
    },

    showCancelButton: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits([
    'confirm',
    'cancel'
]);

const { t } = useI18n();

const open = ref(false);
const cancelButton = ref(null);

function onConfirmClick(e) {
    open.value = false;
    emit('confirm', e);
}

function onCancelClick(e) {
    open.value = false;
    emit('cancel', e);
}

watch(open, async (isOpen) => {
    if (isOpen) {
        await nextTick();
        cancelButton.value?.$el?.focus();
    }
});
</script>


<template>
    <Popover v-model:open="open">
        <PopoverTrigger as-child>
            <slot name="reference"></slot>
        </PopoverTrigger>

        <PopoverContent :side="side" :align="align">
            <div class="text-sm">
                <slot></slot>
            </div>

            <div
                v-if="showConfirmButton || showCancelButton"
                class="flex items-center justify-end flex-nowrap gap-2">
                <Button
                    v-if="showCancelButton"
                    variant="ghost"
                    size="sm"
                    ref="cancelButton"
                    @click="onCancelClick"><slot name="cancelLabel">{{ t('cancel') }}</slot></Button>

                <Button
                    v-if="showConfirmButton"
                    variant="destructive"
                    size="sm"
                    @click="onConfirmClick"><slot name="confirmLabel">{{ t('OK') }}</slot></Button>
            </div>
        </PopoverContent>
    </Popover>
</template>
