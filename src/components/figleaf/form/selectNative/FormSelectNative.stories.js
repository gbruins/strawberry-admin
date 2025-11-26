import { ref } from 'vue';
import { FigFormSelectNative } from '../../../../index.js';
import {
    formInputSizes
} from '../inputConstants.js';

export default {
    title: 'Components/Form/SelectNative',
    component: FigFormSelectNative,
    argTypes: {
        size: {
            control: { type: 'select' },
            options: Object.keys(formInputSizes)
        }
    }
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: {
        FigFormSelectNative
    },
    setup() {
        const val = ref(null);

        const options = [
            { label: 'One', value: 1 },
            { label: 'Two', value: 2 },
            { label: 'Three', value: 3 }
        ];

        return {
            val,
            options,
            args
        };
    },
    template: `
        <div>
            <fig-form-select-native
                v-model="val"
                :options="options"
                v-bind="attrs" />

            <div class="mt-4">value: {{ val }}</div>
        </div>
    `
});

export const FormSelectNative = Template.bind({});
FormSelectNative.storyName = 'Select Native';
FormSelectNative.args = {
    size: formInputSizes.md
};

