<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { KitchenTicket } from '@/utils/kitchenTickets';

// Completing is the one board action that's hard to undo (it emails the customer), so it gets
// a big, centered confirm rather than the small anchored PopConfirm used elsewhere — a kiosk
// tablet getting bumped by busy hands needs a more deliberate "are you sure" than a desk UI.

const props = defineProps<{
    /** The ticket awaiting confirmation; the dialog is open while this is set. */
    ticket: KitchenTicket | null;
}>();

const emit = defineEmits<{ confirm: [ticket: KitchenTicket], cancel: [] }>();
const { t } = useI18n();

function confirm() {
    if (props.ticket) {
        emit('confirm', props.ticket);
    }
}
</script>

<template>
    <Dialog :open="!!ticket" @update:open="(isOpen) => { if (!isOpen) emit('cancel') }">
        <DialogContent class="sm:max-w-md" :show-close-button="false">
            <DialogHeader>
                <DialogTitle class="text-xl">{{ t('Complete order #{code}?', { code: ticket?.pickup_code }) }}</DialogTitle>
                <DialogDescription class="text-base">
                    {{ t('This will send an email to the customer that the order is ready for pickup.') }}
                </DialogDescription>
            </DialogHeader>

            <DialogFooter class="sm:flex-col gap-2">
                <Button size="lg" class="h-16 text-lg w-full" @click="confirm">{{ t('Complete') }}</Button>
                <Button size="lg" variant="ghost" class="h-16 text-lg w-full" @click="emit('cancel')">{{ t('Cancel') }}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
