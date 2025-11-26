<script>
export default {
    name: 'TimerBar'
}
</script>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
    /**
     * The duration of the timer bar in milliseconds
     */
    duration: {
        type: Number,
        default: 3000
    },

    /**
     * Timer moves from right to left
     */
    rtl: {
        type: Boolean,
        default: false
    },

    /**
     * Height of the timer bar.  Example: 2px, 100%, 10em
     */
    height: {
        type: String,
        default: '5px'
    },

    /**
     * The color of the timer bar
     */
    color: {
        type: String,
        default: '#12c75a'
    },

    /**
     * If true, the timer bar will have rounded edges
     */
    rounded: {
        type: Boolean,
        default: false
    },

    /**
     * If true, the timer bar will start automatically when mounted
     */
    autostart: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits([
    'start',
    'cancel',
    'done'
]);

defineExpose({
    start,
    cancel
});

const isActive = ref(false);
const timeoutId = ref(-1);

const transitionBarWithStyle = ref({});
const timeRemaining = ref(0);

const progressClasses = computed(() => {
    return {
        'timerbar-progress': true,
        'rounded-full': props.rounded
    }
});

const wrapperStyle = computed(() => {
    return {
        height: props.height
    }
});

function reset() {
    transitionBarWithStyle.value = {};
    isActive.value = false;
    timeRemaining.value = 0;
    timeoutId.value = -1;
}

function start() {
    if (isActive.value) {
        // console.log('timer is already active. Please wait to finish')
        return;
    }

    if (props.duration) {
        timeRemaining.value = props.duration;
    }

    if (timeRemaining.value < 0) {
        return;
    }

    isActive.value = true;
    emit('start');

    timeoutId.value = setTimeout(() => {
        reset();
        emit('done');
    }, timeRemaining.value);

    transitionBarWithStyle.value = {
        'animation-duration': `${timeRemaining.value}ms`,
        'transform-origin': props.rtl ? '0 100%' : '100% 0',
        'background': props.color
    };
}

function cancel() {
    if (isActive.value && timeoutId.value > -1) {
        clearTimeout(timeoutId.value);
        reset();
        emit('cancel');
    }
}

onMounted(() => {
    if (props.autostart) {
        start();
    }
});
</script>

<template>
    <div v-if="isActive" class="timerbar" :style="wrapperStyle">
        <div :class="progressClasses" :style="transitionBarWithStyle"></div>
    </div>
</template>

<style scoped>
.timerbar {
    width: 100%;
    position: relative;
}

.timerbar-progress {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-delay: 0s;
  animation-name: timebar_progress_x;
}

@keyframes timebar_progress_x {
  from  { transform: scaleX(1) }
  to    { transform: scaleX(0) }
}
</style>
