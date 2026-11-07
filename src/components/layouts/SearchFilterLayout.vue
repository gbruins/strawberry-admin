<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Button } from '@/components/ui/button';

// A filter form (responsive grid of fields + "Apply filters", Enter also applies) above the
// list in the default slot. Emits `apply`; wire it to useListPage().applyFilters.

const emit = defineEmits<{ apply: [] }>();
const { t } = useI18n();
</script>

<template>
    <div class="grid grid-cols-1 gap-5">
        <form v-if="$slots.filters" @submit.prevent="emit('apply')">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <slot name="filters" />
            </div>

            <Button type="submit" class="mt-5">{{ t('Apply filters') }}</Button>
        </form>

        <div>
            <slot />
        </div>
    </div>
</template>
