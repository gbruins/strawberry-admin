<script>
export default {
    name: 'Modal'
}
</script>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { onKeyStroke } from '@vueuse/core';
import FigButton from '../button/Button.vue';
import { modalSizes } from './constants.js';

const props = defineProps({
    size: {
        type: String,
        default: modalSizes.lg,
        validator: (value) => Object.keys(modalSizes).includes(value)
    },

    closeButton: {
        type: Boolean,
        default: true
    },

    escapeToClose: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['visible']);

defineExpose({
    show,
    hide,
    toggle
});

const visible = ref(false);
const modalContainer = ref(null);

const classes = computed(() => {
    return {
        'fig-modal': true,
        'fig-modal-sm': props.size === modalSizes.sm,
        'fig-modal-md': ![modalSizes.sm, modalSizes.lg, modalSizes.xl, modalSizes.full].includes(props.size),
        'fig-modal-lg': props.size === modalSizes.lg,
        'fig-modal-xl': props.size === modalSizes.xl,
        'fig-modal-full': props.size === modalSizes.full
    }
});

function emitVisible() {
    emit('visible', visible.value);
}

function hide() {
    visible.value = false;
    document.body.style.overflow = '';
    emitVisible();
}

function show() {
    visible.value = true;
    document.body.style.overflow = 'hidden'; // prevent body from scrolling too (double scroll bars)
    emitVisible();
}

function toggle() {
    visible.value ? hide() : show();
}

function onEscape() {
    if(props.escapeToClose) {
        hide();
    }
}

onMounted(() => {
    onKeyStroke('Escape', onEscape, { target: document });
});
</script>


<template>
    <div>
        <div
            v-if="visible"
            ref="modalContainer"
            class="overflow-x-hidden overflow-y-auto fixed top-0 left-0 w-full h-full z-50 outline-none focus:outline-none">

            <!--content-->
            <div :class="classes">
                <!--header-->
                <div
                    v-if="$slots.header || closeButton"
                    class="flex items-center justify-between py-1 px-5 border-b border-solid border-gray-300 rounded-t-sm">
                    <div class="text-base font-semibold break-words">
                        <slot name="header"></slot>
                    </div>

                    <fig-button
                        v-if="closeButton"
                        size="md"
                        variant="ghost"
                        icon="x"
                        @click="toggle" />
                </div>

                <!--body-->
                <div class="relative py-4 px-5 flex-auto text-base text-gray-600 break-words">
                    <slot></slot>
                </div>

                <!--footer-->
                <div
                    v-if="$slots.footer"
                    class="flex items-center py-3 px-5 border-t border-solid border-gray-300 bg-gray-100 rounded-b-sm">
                    <slot name="footer"></slot>
                </div>
            </div>

        </div>

        <!-- backdrop -->
        <div v-if="visible" class="opacity-25 fixed top-0 left-0 z-40 bg-black h-screen w-screen"></div>
    </div>
</template>


<style scoped>
.fig-modal {
    position: relative;
    width: auto;
    margin-top: 1.5rem; /* my-6: 24px */
    margin-bottom: 1.5rem;
    margin-left: auto;
    margin-right: auto;
    border: 0;
    border-radius: 0.375rem; /* rounded-md: 6px */
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); /* shadow-lg */
    background-color: #fff;
    outline: none;
}
.fig-modal:focus {
    outline: none;
}

/* sizes */
.fig-modal-sm {
    max-width: 20rem; /* max-w-xs: 320px */
}
.fig-modal-md {
    max-width: 32rem; /* max-w-lg: 512px */
}
.fig-modal-lg {
    max-width: 48rem; /* max-w-3xl: 768px */
}
.fig-modal-xl {
    max-width: 72rem; /* max-w-6xl: 1152px */
}
.fig-modal-full {
    width: 98%;
}
</style>
