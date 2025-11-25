<script>
export default {
    name: 'FigTrNoResults'
}
</script>

<script setup>
const props = defineProps({
    colspan: {
        type: [String, Number],
        default: 1
    }
});
</script>


<template>
    <tr>
        <td
            :colspan="colspan"
            class="text-center text-gray-500 px-6 py-1"><slot>{{ $t('No data') }}</slot></td>
    </tr>
</template>
