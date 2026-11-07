<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

withDefaults(defineProps<{
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    showConfirmButton?: boolean;
    showCancelButton?: boolean;
}>(), {
    side: 'top',
    align: 'center',
    showConfirmButton: true,
    showCancelButton: true
});

const emit = defineEmits<{
    confirm: [event: MouseEvent];
    cancel: [event: MouseEvent];
}>();

const { t } = useI18n();

const open = ref(false);
const cancelButton = ref<{ $el?: HTMLElement } | null>(null);

function onConfirmClick(event: MouseEvent) {
    open.value = false;
    emit('confirm', event);
}

function onCancelClick(event: MouseEvent) {
    open.value = false;
    emit('cancel', event);
}

// Focus Cancel, not Confirm, so a stray Enter doesn't confirm a destructive action.
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
                    ref="cancelButton"
                    variant="ghost"
                    size="sm"
                    @click="onCancelClick"><slot name="cancelLabel">{{ t('Cancel') }}</slot></Button>

                <Button
                    v-if="showConfirmButton"
                    variant="destructive"
                    size="sm"
                    @click="onConfirmClick"><slot name="confirmLabel">{{ t('OK') }}</slot></Button>
            </div>
        </PopoverContent>
    </Popover>
</template>
