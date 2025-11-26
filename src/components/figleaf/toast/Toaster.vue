<script>
export default {
    name: 'FigToaster'
}
</script>

<script setup>
import { computed } from 'vue';
import SvgIcon from '@/components/figleaf/svgIcon/SvgIcon.vue';
import TimerBar from '@/components/figleaf/timerBar/TimerBar.vue'
import { toastVariants } from './constants.js';
import useToast from './useToast';

const props = defineProps({
    maxToasts: {
        type: Number,
        default: 10
    }
});

const emit = defineEmits([
    'close'
]);

const { toasts, removeToast } = useToast();

const includedToasts = computed(() => {
    return [...toasts.value].slice(0, props.maxToasts);
});

const enterActiveClasses = computed(() => {
    const classes = [
        'transform',
        'ease-out',
        'duration-300',
        'transition'
    ];

    if(toasts.value.length > 1) {
        classes.push('delay-300');
    }

    return classes.join(' ');
});


function closeToast(id) {
    emit('close');
    removeToast(id);
}

function getTitleClass(variant) {
    switch(variant) {
        case toastVariants.success:
            return 'text-emerald-600';

        case toastVariants.error:
            return 'text-red-600';

        case toastVariants.warning:
            return 'text-amber-700';

        default:
            return 'text-blue-600';
    }
}

function getIconType(variant) {
    switch(variant) {
        case toastVariants.success:
            return 'check-circle';

        case toastVariants.error:
            return 'circle-x';

        case toastVariants.warning:
            return 'alert-circle';

        default:
            return 'info-circle';
    }
}

function getTimerBarColor(variant) {
    switch(variant) {
        case toastVariants.success:
            return '#4ADE80';

        case toastVariants.error:
            return '#FCA5A5';

        case toastVariants.warning:
            return '#F0b211';

        default:
            return '#93C5FD';
    }
}

function getIconBgClasses(toastConfig) {
    const classes = [];

    classes.push(
        toastConfig.icon !== false ? 'w-12' : 'w-2'
    );

    switch(toastConfig.variant) {
        case toastVariants.success:
            classes.push('bg-emerald-500');
            break;

        case toastVariants.error:
            classes.push('bg-red-500');
            break;

        case toastVariants.warning:
            classes.push('bg-amber-400');
            break;

        default:
            classes.push('bg-blue-400');
    }

    return classes;
}
</script>


<template>
    <div class="toaster">
        <div class="max-w-sm w-full">

            <transition-group
                :enter-active-class="enterActiveClasses"
                enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
                enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
                leave-active-class="transition ease-in duration-500"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
                move-class="transition duration-500">

                <div
                    class="toast shadow-tight"
                    v-for="toastConfig in includedToasts"
                    :key="toastConfig.id">

                    <!-- icon -->
                    <div
                        class="inline-flex justify-center items-center"
                        :class="getIconBgClasses(toastConfig)">
                        <i class="p-2">
                            <svg-icon
                                v-if="toastConfig.icon !== false"
                                :icon="getIconType(toastConfig.variant)"
                                stroke="#fff"
                                stroke-width="1.5"
                                :width="26"
                                :height="26" />
                        </i>
                    </div>

                    <!-- message -->
                    <div
                        class="pl-4 pr-5 py-4 overflow-y-auto toast-content"
                        :class="{'pr-6': toastConfig.closable !== false, 'pr-4': !(toastConfig.closable !== false)}">
                        <!-- title -->
                        <div
                            class="text-sm font-semibold break-words"
                            :class="getTitleClass(toastConfig.variant)">{{ toastConfig.title }}</div>

                        <!-- message -->
                        <div
                            v-if="toastConfig.text"
                            class="text-gray-600 text-sm pt-1 break-words">{{ toastConfig.text }}</div>
                        <div
                            v-else-if="toastConfig.dangerousText"
                            class="text-gray-600 text-sm pt-1 break-words"
                            v-html="toastConfig.dangerousText"></div>
                    </div>

                    <!-- close button -->
                    <button
                        v-if="toastConfig.closable !== false"
                        type="button"
                        @click="closeToast(toastConfig.id)"
                        class="absolute top-0 right-0 p-0 mt-2 mr-2 border-0 background-transparent hover:bg-gray-200">
                        <svg-icon
                            icon="x"
                            stroke="#000"
                            stroke-width="1.5"
                            :width="18"
                            :height="18" />
                    </button>

                    <timer-bar
                        ref="timerBar"
                        autostart
                        :duration="toastConfig.timeout"
                        height="1px"
                        :color="getTimerBarColor(toastConfig.variant)"
                        class="timer-bar" />
                </div>
            </transition-group>

        </div>

    </div>
</template>

<style scoped>
/* Note that toasts should have the hightest z-index so they appear over modal and everything else */
.toaster {
    position: fixed;
    inset: 0;
    display: flex;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 24px;
    padding-bottom: 24px;
    align-items: flex-start;
    justify-content: flex-end;
    pointer-events: none;
    z-index: 9999;
}

.toast {
    display: flex;
    max-width: 400px;
    width: 100%;
    background-color: #fff;
    border-radius: 0.5rem;
    overflow: hidden;
    margin-left: auto;
    margin-right: auto;
    margin-top: 1rem;
    position: relative;
    pointer-events: auto;
}

.toast-content {
    max-height: 300px;
}

.bg-success {
    background-color: #f3fbf0;
}
.bg-error {
    background-color: #fbf0f0;
}
.bg-info {
    background-color: #f0f3fb;
}

.timer-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
}
</style>
