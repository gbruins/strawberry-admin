<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Badge } from '@/components/ui/badge';

const props = withDefaults(defineProps<{
    value?: boolean;
    trueLabel?: string;
    falseLabel?: string;
}>(), {
    value: true
});

const { t } = useI18n();

const label = computed(() => props.value ? (props.trueLabel || t('true')) : (props.falseLabel || t('false')));
</script>

<template>
    <Badge :variant="value ? 'success' : 'destructive'">{{ label }}</Badge>
</template>
