<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Badge } from '@/components/ui/badge';

const props = defineProps({
    value: {
        type: Boolean,
        default: true
    },

    trueLabel: {
        type: String
    },

    falseLabel: {
        type: String
    }
});

const { t } = useI18n();

const label = computed(() => {
    if (props.value) {
        return props.trueLabel || t('true');
    }

    return props.falseLabel || t('false');
});
</script>

<template>
    <Badge :variant="value ? 'success' : 'destructive'">{{ label }}</Badge>
</template>
