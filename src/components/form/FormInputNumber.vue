<script>
import isFinite from 'lodash-es/isFinite.js';
import { isNumber } from '../../utils/common.js';
import FormText from './text/FormText';
import FigButton from '../button/Button';
import FormInputEndcapper from './endcapper/FormInputEndcapper';


export default {
    name: 'FormInputNumber',

    inheritAttrs: false,

    components: {
        FormText,
        FigButton,
        FormInputEndcapper
    },

    props: {
        value: {
            // type: Number
        },

        max: {
            type: Number,
            default: null
        },

        min: {
            type: Number,
            default: null
        },

        step: {
            type: Number,
            default: 1
        },

        size: {
            type: String,
            default: 'md',
            validator: (value) => {
                return ['sm', 'md', 'lg'].includes(value);
            }
        },

        controlsRight: {
            type: Boolean,
            default: false
        },

        controls: {
            type: Boolean,
            default: false
        },

        center: {
            type: Boolean,
            default: false
        }
    },

    data: () => ({
        selectedValue: null
    }),

    computed: {
        plusDisabled() {
            return isFinite(this.max) && parseFloat(this.selectedValue) >= this.max;
        },

        minusDisabled() {
            return isFinite(this.min) && parseFloat(this.selectedValue) <= this.min;
        },

        classNames() {
            const classes = [
                `fig-input-number-${this.size}`
            ];

            if(this.controlsRight) {
                classes.push('is-controls-right');
            }

            return classes;
        }
    },

    watch: {
        value: {
            handler: function(newVal) {
                if(newVal != null) {
                    this.setValue(newVal, false);
                }
            },
            immediate: true
        }
    },

    methods: {

        /*
        * fixes an issue when adding floating point numbers: .01 + .05 = 0.060000000000000005
        * https://stackoverflow.com/questions/588004/is-floating-point-math-broken/51723472#51723472
        */
        floatify(number) {
            if(number) {
                if(!isNumber(number)) {
                    number = parseFloat(number);
                }
                return parseFloat(number).toFixed(10);
            }
        },

        emitInput() {
            if(this.selectedValue !== this.value) {
                this.$emit('input', parseFloat(this.selectedValue));
            }
        },

        up() {
            this.setValue(
                this.floatify(this.selectedValue + this.step)
            );
        },

        down() {
            this.setValue(
                this.floatify(this.selectedValue - this.step)
            );
        },

        setValue(newVal, emit) {
            const val = isNaN(newVal) ? this.min : newVal;

            if(this.max && (val > this.max)) {
                this.selectedValue = this.max;
            }
            else if(this.min && (val < this.min)) {
                this.selectedValue = this.min;
            }
            else {
                this.selectedValue = val;
            }

            if(emit !== false) {
                this.emitInput();
            }
        }

    }
};
</script>


<template>
    <div class="fig-input-number" :class="classNames">
        <template v-if="controlsRight">
            <fig-button
                variant="naked"
                @click="down"
                :disabled="minusDisabled"
                size="sm"
                class="control-right-decrease">-</fig-button>

            <fig-button
                variant="naked"
                @click="up"
                :disabled="plusDisabled"
                size="sm"
                class="control-right-increase">+</fig-button>
        </template>

        <div class="fig-input-wrapper">
            <form-text
                v-model="selectedValue"
                type="number"
                :min="min"
                :max="max"
                :step="step"
                :size="size"
                @input="emitInput"
                v-bind="$attrs" />
        </div>

        <!-- <template v-if="controls">
            <fig-button
                slot="prefix"
                variant="naked"
                @click="up"
                :disabled="plusDisabled"
                icon="plus" />

            <fig-button
                slot="suffix"
                variant="naked"
                @click="down"
                :disabled="minusDisabled"
                icon="minus" />
        </template> -->
    </div>
</template>

<style>
.fig-input-number {
    @apply relative w-full;
    min-width: 80px;
}
.fig-input-number-sm {
    @apply leading-7;
    min-width: 66px;
}
.fig-input-number-md {
    @apply leading-8;
}
.fig-input-number-lg {
    @apply leading-9;
}

.fig-input-wrapper {
    @apply relative inline-block w-full;
}

.fig-input-number-sm > button {
    width: 30px;
    line-height: 14px;
}
.fig-input-number-md > button,
.fig-input-number-lg > button {
    width: 40px;
    line-height: 19px;
}

.fig-input-number input {
    padding-right: 42px;
}
.fig-input-number-sm input {
    padding-right: 32px;
}

.control-right-increase,
.control-right-decrease {
    @apply cursor-pointer h-auto text-center bg-gray-100 text-gray-600 absolute text-sm;
    z-index: 1;
    top: 1px;
    right: 1px;
    transition: line-height 0.15s ease-out;
}
.control-right-increase {
    @apply border-gray-300 border-0 border-b border-l;
    border-radius: 0 4px 0 0;
}
.control-right-decrease {
    @apply border-gray-300 border-0 border-l;
    bottom: 1px;
    top: auto;
    left: auto;
    border-right: none;
    border-radius: 0 0 4px 0;
}

.fig-input-number button:hover {
    line-height: 25px;
    z-index: 2;
}
.fig-input-number-sm button:hover {
    line-height: 17px;
}


.control-right-decrease:hover {
    border-top: 1px solid #dcdfe6;
}
.control-right-increase:disabled,
.control-right-decrease:disabled {
    @apply cursor-not-allowed text-gray-300;
}


/* Chrome, Safari, Edge, Opera: hide arrows */
.fig-input-number input::-webkit-outer-spin-button,
.fig-input-number input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox: hide arrows */
.fig-input-number[input] {
  -moz-appearance: textfield;
}
</style>
