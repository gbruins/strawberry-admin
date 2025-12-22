<script>
import { tooltipTriggers } from './constants';
export const triggerKeys = Object.keys(tooltipTriggers);

export default {
    name: 'FigTooltip'
}
</script>

<script setup>
import { ref, watch, computed, onBeforeUnmount, useSlots } from 'vue';
import { createPopper } from '@popperjs/core';
import isFunction from 'lodash.isfunction';
import isString from 'lodash.isstring';
import { tooltipPlacements } from './constants.js';

const props = defineProps({
    placement: {
        type: String,
        default: tooltipPlacements['bottom-start'],
        validator: (value) => Object.keys(tooltipPlacements).includes(value)
    },

    triggers: {
        type: [String, Array],
        default: () => {
            return triggerKeys;
        },
        validator: (value) => {
            if(isString(value)) {
                return triggerKeys.includes(value);
            }

            return triggerKeys.some(key => value.includes(key));
        }
    },

    disabled: {
        type: Boolean,
        default: false
    },

    centered: {
        type: Boolean,
        default: true
    },

    offset: {
        type: Array,
        default: () => [0, 8]
    },

    flip: {
        type: Boolean,
        default: true
    },

    customPopperOptions: {
        type: Object,
        default: null
    },

    target: {}
});

const slots = useSlots();

const visible = ref(false);
const arrow = ref(null);
const tooltipRef = ref(null);
const popperTarget = ref(null);

let popper = null;

const defaultPopperOptions = computed(() => {
    return {
        strategy: 'fixed',
        placement: props.placement,
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: props.offset
                }
            },
            {
                name: 'flip',
                enabled: props.flip
            },
            {
                name: 'preventOverflow',
                options: {
                    padding: 10
                }
            },
            {
                name: 'arrow',
                options: {
                    enabled: true,
                    element: arrow.value
                }
            }
        ]
    };
});

const ariaAttrs = computed(() => {
    return {
        'aria-expanded': visible.value,
        'aria-haspopup': 'true'
    };
});

const propTarget = computed(() => {
    if (isFunction(props.target)) {
        const t = props.target();
        return t.value || t;
    }

    return props.target?.value || props.target;
});

function removePopper() {
    popper?.destroy();
    popper = null;
}

function buildPopper() {
    removePopper();

    if (props.disabled) {
        visible.value = false;
        return;
    }

    popper = createPopper(
        propTarget.value || popperTarget.value,
        tooltipRef.value,
        props.customPopperOptions || defaultPopperOptions.value
    );
}

function setDisplay(isVisible) {
    return isVisible ? buildPopper() : removePopper();
}

function toggle(e) {
    e?.preventDefault();

    visible.value = (e?.type === 'mouseenter' || e?.type === 'focusin');
    setDisplay(visible.value);
}

function checkHover(e) {
    if (slots && (isFunction(slots.toggler) && slots.toggler())) {
        toggle(e);
    }
}

watch(
    () => props.target,
    () => {
        propTarget.value?.addEventListener('mouseenter', toggle, false);
        propTarget.value?.addEventListener('mouseleave', toggle, false);
    }
)

onBeforeUnmount(() => {
    propTarget.value?.removeEventListener('mouseenter', toggle);
    propTarget.value?.removeEventListener('mouseleave', toggle);
});
</script>


<template>
    <div
        class="relative inline-flex"
        @mouseenter="checkHover($event)"
        @mouseleave="checkHover($event)">
        <div ref="popperTarget" class="leading-none"><slot name="toggler" :aria-attrs="ariaAttrs"></slot></div>
        <transition name="fade">
            <div
                v-show="visible"
                ref="tooltipRef"
                :class="{'invisible': !visible, 'block': visible, 'text-center': centered, 'text-left': !centered}"
                class="fig-tip">
                <div ref="arrow" class="arrow"></div>
                <slot></slot>
            </div>
        </transition>
    </div>
</template>


<style scoped>
.fig-tip {
    background-color: var(--color-gray-800);
    color: #ffffff;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.25rem 0.5rem; /* py-1 px-2 */
    z-index: 50;
    font-weight: 400; /* font-normal */
    line-height: normal; /* leading-normal */
    font-size: 0.875rem; /* text-sm */
    max-width: 20rem; /* max-w-xs */
    overflow-wrap: break-word; /* break-words */
    border-radius: 0.125rem; /* rounded-sm */
    min-width: 25px;
}

/* https://popper.js.org/docs/v2/tutorial/#arrow */
.arrow,
.arrow::before {
    position: absolute;
    width: 8px;
    height: 8px;
    z-index: -1;
}

.arrow::before {
    content: '';
    transform: rotate(45deg);
    background-color: var(--color-gray-800)
}

[data-popper-placement^='top'] > .arrow {
    bottom: -4px;
}

[data-popper-placement^='bottom'] > .arrow {
    top: -4px;
}

[data-popper-placement^='left'] > .arrow {
    right: -4px;
}

[data-popper-placement^='right'] > .arrow {
    left: -4px;
}
</style>
