<script>
export default {
    name: 'CardLastFour'
}
</script>

<script setup>
import { computed } from 'vue';
import CreditCardIcon from '@/components/figleaf/icon/creditCard/CreditCard.vue';
import { cardTypes } from '@/components/figleaf/icon/creditCard/constants.js';

const props = defineProps({
    type: {
        type: String,
        validator: (value) => Object.keys(cardTypes).includes(value)
    },

    lastFour: {
        type: [String, Number]
    }
});

const suffix = computed(() => {
    return props.lastFour ? `**** ${props.lastFour}` : '';
});
</script>


<template>
    <div class="flex items-center">
        <credit-card-icon :type="props.type" style="width:50px" />
        <div class="pl-2">{{ suffix }}</div>
    </div>
</template>
