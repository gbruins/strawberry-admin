import { ref } from 'vue';
import { FigFormSelectBitwise } from '../../../../index.js';
import { formInputSizes } from '../inputConstants.js';

export default {
    title: 'Components/Form/SelectBitwise',
    component: FigFormSelectBitwise,
    argTypes: {
        size: {
            control: { type: 'select' },
            options: Object.keys(formInputSizes)
        },

        clearable: {
            control: {
                type: 'boolean'
            }
        },

        multiple: {
            control: {
                type: 'boolean'
            }
        }
    }
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: {
        FigFormSelectBitwise
    },
    setup() {
        const selected = ref(null);

        const options = [
            { label: 'One', value: 1, disabled: false },
            { label: 'Two', value: 2, disabled: false },
            { label: 'Four', value: 4, disabled: false },
            { label: 'Eight', value: 8, disabled: false },
            { label: 'Sixteen', value: 16, disabled: false }
        ];

        return {
            selected,
            options,
            args
        };
    },
    template: `
        <div>
            <fig-form-select-bitwise
                v-bind="args"
                v-model="selected"
                :options="options" />

            <div class="mt-2">Selected: {{ selected }}</div>
        </div>
    `
});

export const FormSelectBitwise = Template.bind({});
FormSelectBitwise.storyName = 'Select Bitwise';
FormSelectBitwise.args = {
    size: formInputSizes.md,
    searchable: true,
    mode: 'tags',  // single/multiple/tags
    closeOnSelect: false,
    canClear: true
};

