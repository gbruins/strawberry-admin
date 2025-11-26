<script>
export default {
    name: 'BooleanTag'
}
</script>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import FigTag from '@/components/figleaf/tag/Tag.vue';

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
    },

    tag: {
        type: String
    },

    size: {
        type: String
    }
});

const { t } = useI18n();

const tagLabel = computed(() => {
    if(props.value) {
        return props.trueLabel || t('true');
    }

    return props.falseLabel || t('false');
});
</script>


<template>
    <fig-tag
        :tag="tag"
        :size="size"
        :variant="value ? 'success' : 'error'">{{ tagLabel }}</fig-tag>
</template>
