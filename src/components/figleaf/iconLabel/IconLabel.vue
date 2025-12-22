<script>
export default {
    name: 'IconLabel'
}
</script>

<script setup>
import { computed, useSlots } from 'vue';

const props = defineProps({
    classes: {
        type: String
    }
});

const slots = useSlots();

const defaultSlotClasses = computed(() => {
    if(props.classes) {
        return props.classes;
    }

    return {
        'pl-1': slots.left,
        'pr-1': slots.right
    }
});
</script>


<template>
    <div class="flex items-center break-normal">
        <div class="flex-shrink-0" v-if="$slots.left"><slot name="left"></slot></div>
        <div :class="defaultSlotClasses"><slot></slot></div>
        <div class="flex-shrink-0" v-if="$slots.right"><slot name="right"></slot></div>
    </div>
</template>
