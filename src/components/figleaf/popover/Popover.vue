<script>
export default {
    name: 'Popover'
}
</script>

<script setup>
import { ref, computed, useSlots, watch, onMounted } from 'vue';
import { createPopper } from '@popperjs/core';
import isFunction from 'lodash.isfunction';
import { onClickOutside, onKeyStroke } from '@vueuse/core';
import { popoverProps } from './constants';

const props = defineProps(popoverProps);

const emit = defineEmits([
    'visible'
]);

defineExpose({
    show,
    hide,
    toggle
});

const slots = useSlots();

let popper = null;
const visible = ref(false);
const popperContainer = ref(null);
const popoverTarget = ref(null);
const arrow = ref(null);
const menu = ref(null);

const propTarget = computed(() => {
    if (isFunction(props.target)) {
        const t = props.target();
        return t.value || t;
    }

    if (props.target) {
        return props.target.value || props.target;
    }

    return null;
});

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
        'aria-expanded': visible.value ? 'true' : 'false',
        'aria-haspopup': 'true'
    };
});

function setVisible(isVisible) {
    visible.value = !!isVisible;
    emit('visible', visible.value);
}

function removePopper() {
    if(popper) {
        popper.destroy();
    }
    popper = null;
}

function buildPopper() {
    removePopper();

    if (props.disabled) {
        setVisible(false);
        return;
    }

    popper = createPopper(
        popoverTarget.value,
        menu.value,
        props.customPopperOptions || defaultPopperOptions.value
    );
}

function setDisplay(isVisible) {
    return isVisible ? buildPopper() : removePopper();
}

function toggle(e) {
    e?.preventDefault();
    setVisible(!visible.value);
    setDisplay(visible.value);
}

function hide() {
    setVisible(false);
    setDisplay(false);
}

function show() {
    setVisible(true);
    setDisplay(true);
}

function checkClick(e) {
    if (slots.toggler() && e.target?.parentElement?.contains(e.target)) {
        toggle(e);
        return;
    }

    if (propTarget?.value && e.target === propTarget.value) {
        toggle(e);
        return;
    }

    if (isFunction(slots.toggler)
        && slots.toggler()
        && popoverTarget.value?.contains(e.target)) {
        toggle(e);
    }
}

function processClickOutside(e) {
    if (!visible.value) {
        return;
    }

    // If the user has defined a target prop, then all clicks on that target
    // will be considered 'outside' of the root element of this component.
    // In that case, if the target of the click is that outwide target, then do nothing.
    if (propTarget?.value && e.target === propTarget.value) {
        return;
    }

    const containsTarget = popoverTarget.value?.contains(e.target);

    if (popoverTarget.value && !containsTarget) {
        hide();
    }
    else if (slots.toggler() && !containsTarget) {
        hide();
    }
}

watch(
    () => props.target,
    (val) => {
        propTarget.value?.addEventListener('click', checkClick, false);
    }
);

onMounted(() => {
    onClickOutside(popperContainer.value, processClickOutside);
    onKeyStroke('Escape', hide, { target: document });
});
</script>


<template>
    <div
        ref="popperContainer"
        class="fig-popover"
        @click="checkClick">
        <div
            ref="popoverTarget"
            class="leading-none"><slot name="toggler" :aria-attrs="ariaAttrs"></slot></div>
        <div
            ref="menu"
            class="fig-popover-wrapper shadow-tight"
            :class="{'hidden': !visible, 'block': visible}"
            :aria-hidden="!visible">
            <div ref="arrow" class="arrow"></div>
            <!-- header -->
            <div
                v-if="$slots.header"
                class="fig-popover-gutter border-b"><slot name="header"></slot></div>

            <slot></slot>

            <!-- footer -->
            <div
                v-if="$slots.footer"
                class="fig-popover-gutter border-t"><slot name="footer"></slot></div>
        </div>
    </div>
</template>


<style scoped>
.fig-popover {
    position: relative;
    display: inline-flex;
    vertical-align: middle;
}

.fig-popover-wrapper {
    background-color: #fff;
    font-size: 1rem;
    z-index: 50;
    float: left;
    list-style: none;
    text-align: left;
    border-radius: 0.375rem; /* rounded */
    margin-top: 0.25rem; /* mt-1 */
}

.fig-popover-gutter {
    padding-left: 0.5rem;  /* px-2 */
    padding-right: 0.5rem;
    padding-top: 0.25rem;  /* py-1 */
    padding-bottom: 0.25rem;
    font-size: 0.875rem;   /* text-sm */
    border-style: solid;
    border-color: var(--color-gray-300); /* border-gray-300 */
    background-color: var(--color-gray-100); /* bg-gray-100 */
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
    background-color: #fff;
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
