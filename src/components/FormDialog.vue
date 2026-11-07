<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Overlay from '@/components/Overlay.vue';

// Shell for every create/edit dialog: a real <form> (so Enter submits), a busy overlay, and a
// Cancel/Submit footer whose Submit is disabled while busy (no double-submits). Pair with
// useUpsertForm().

withDefaults(defineProps<{
    title: string;
    /** Screen-reader description; defaults to the title. */
    description?: string;
    busy?: boolean;
    submitLabel?: string;
    /** Extra classes for DialogContent, e.g. 'sm:max-w-2xl'. */
    contentClass?: string;
}>(), {
    busy: false
});

const emit = defineEmits<{ submit: [] }>();
const open = defineModel<boolean>('open', { default: false });
const { t } = useI18n();
</script>

<template>
    <Dialog v-model:open="open">
        <DialogContent :class="contentClass">
            <form class="grid gap-4" novalidate @submit.prevent="emit('submit')">
                <DialogHeader>
                    <DialogTitle>{{ title }}</DialogTitle>
                    <DialogDescription :class="{ 'sr-only': !$slots.description }">
                        <slot name="description">{{ description ?? title }}</slot>
                    </DialogDescription>
                </DialogHeader>

                <Overlay :show="busy">
                    <div class="grid grid-cols-1 gap-4">
                        <slot />
                    </div>
                </Overlay>

                <DialogFooter>
                    <Button type="button" variant="ghost" @click="open = false">{{ t('Cancel') }}</Button>
                    <Button type="submit" :disabled="busy">{{ submitLabel ?? t('Submit') }}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
