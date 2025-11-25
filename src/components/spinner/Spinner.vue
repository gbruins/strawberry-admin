<script>
export default {
    name: 'Spinner'
}
</script>

<script setup>
import { spinnerStrokeWidths } from './constants';

const props = defineProps({
    color: {
        type: String,
        default: '#44403c'
    },

    width: {
        type: Number,
        default: 30
    },

    strokeWidth: {
        type: Number,
        default: 2,
        validator: (value) => spinnerStrokeWidths.includes(value)
    }
});
</script>


<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        :width="width"
        :height="width"
        :stroke="color">
        <g fill="none">
            <g transform="translate(1 1)" :stroke-width="strokeWidth">
                <circle stroke-opacity=".25" cx="18" cy="18" r="18" />
                <path d="M36 18c0-9.94-8.06-18-18-18">
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 18 18"
                        to="360 18 18"
                        dur="0.8s"
                        repeatCount="indefinite" />
                </path>
            </g>
        </g>
    </svg>
</template>
