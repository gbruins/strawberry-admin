<script>
export default {
    name: 'Dropdown'
}
</script>

<script setup>
// this component was heavily influenced by:
// https://raw.githubusercontent.com/coreui/coreui-vue/master/src/components/dropdown/CDropdown.vue
// https://coreui.io/vue/docs/components/dropdown.html

import { ref, computed, useSlots } from 'vue';
import vNodes from '@/components/figleaf/vnodes/VNodes.vue';
import FigPopover from '@/components/figleaf/popover/Popover.vue';
import { popoverProps } from '@/components/figleaf/popover/constants.js';

const props = defineProps(popoverProps);

const emit = defineEmits([
    'selected'
]);

const slots = useSlots();
const popoverEl = ref(null);
const dropdownButtonValues = new Map();

function isType(vnode, name) {
    return vnode?.type?.name === name;
}

function isDropdownButton(vnode) {
    return isType(vnode, 'DropdownButton');
}

function isDropdownDivider(vnode) {
    return isType(vnode, 'DropdownDivider');
}

/**
 * Get the 'value' prop from the DropdownButton vnode if it exists,
 * otherwise set the value to the current size of the Map object
 * @param {*} vnode
 */
function setDropdownButtonValue(vnode) {
    if (isDropdownButton(vnode)) {
        dropdownButtonValues.set(
            vnode,
            vnode?.props?.hasOwnProperty('value') ? vnode.props.value : dropdownButtonValues.size
        );
    }
}


function onDropdownItemClick(vnode) {
    if (isDropdownButton(vnode)) {
        emit('selected', dropdownButtonValues.get(vnode));
    }
}

const dropdownItems = computed(() => {
    const items = [];

    function processVnode(vnode) {
        if (isDropdownButton(vnode) || isDropdownDivider(vnode)) {
            items.push(vnode);

            if (isDropdownButton(vnode)) {
                setDropdownButtonValue(vnode);
            }
        }
    }

    if (slots.default) {
        slots.default().forEach((child) => {
            if (child.children && child.children instanceof Array) {
                child.children.forEach(processVnode);
            }
            else {
                processVnode(child);
            }
        });
    }

    return items;
});
</script>


<template>
    <fig-popover v-bind="$props" ref="popoverEl">
        <template v-slot:toggler>
            <slot name="toggler"></slot>
        </template>

        <div class="py-1">
            <v-nodes
                v-for="(vnode, idx) in dropdownItems" :key="idx"
                :vnodes="vnode"
                @click="(e) => { e.preventDefault(); onDropdownItemClick(vnode) }" />
        </div>
    </fig-popover>
</template>
