<script>
import { RowBuilderProps } from './useRowBuilder.js';
export default {
    name: 'FigRowBuilder'
}
export const builderProps = RowBuilderProps;
</script>

<script setup>
import { VueDraggableNext as draggable } from 'vue-draggable-next';
import FigButton from '../button/Button.vue';
import FigPopConfirm from '../popConfirm/PopConfirm.vue';
import FigIcon from '../icon/FigIcon.vue';
import useRowBuilder from './useRowBuilder.js';

const props = defineProps(builderProps);

const emit = defineEmits([
    'add',
    'remove',
    'update:modelValue'
]);

const {
    rows,
    canSortRows,
    densityClass,
    canAddRow,
    onPopoverToggleClick,
    addRow,
    removeRow,
    onSort
} = useRowBuilder(props, emit);
</script>


<template>
    <div>
        <div class="fig-row-builder">
            <draggable
                :list="rows"
                handle=".fig-row-builder-row-handle"
                @change="onSort"
                ghost-class="ghost">
                <div class="fig-row-builder-row" v-for="(obj, index) in rows" :key="index">
                    <div class="flex">
                        <!-- drag handle -->
                        <div class="fig-row-builder-row-handle cursor-grab" v-if="canSortRows">
                            <fig-icon icon="dots-vertical-double" />
                        </div>

                        <div class="flex flex-grow" :class="densityClass">
                            <slot :rowBuilder="obj"></slot>
                        </div>

                        <div
                            v-if="removable"
                            class="flex items-start flex-nowrap"
                            :class="densityClass">

                            <fig-pop-confirm
                                :disabled="!removeConfirm"
                                @confirm="removeRow(index)">
                                {{ $t('Delete this row?') }}

                                <template v-slot:reference>
                                    <fig-button
                                        class="ml-4"
                                        variant="plain"
                                        icon="trash"
                                        size="sm"
                                        @click="onPopoverToggleClick(index)"
                                        dotted />
                                </template>
                            </fig-pop-confirm>
                        </div>
                    </div>
                </div>
            </draggable>
        </div>

        <div
            :class="{'pt-2': rows.length}"
            class="flex items-center">
            <fig-button
                v-if="canAddRow"
                @click="addRow"
                variant="plain"
                size="sm"
                icon="plus"
                class="mr-3"><slot name="buttonLabel">{{ $t('Add row') }}</slot></fig-button>

            <div class="flex-grow">
                <slot name="addButtonRight" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.fig-row-builder .fig-row-builder-row {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    width: 100%;
}

.fig-row-builder-row-handle {
    display: flex;
    align-items: center;
    width: 1.5rem; /* w-6 */
}

.fig-row-builder-row-sm {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    padding-right: 0.5rem;
}
.fig-row-builder-row-md {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-right: 0.75rem;
}
.fig-row-builder-row-lg {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    padding-right: 1rem;
}
</style>
