import { ref } from 'vue';
import { FigFormInputMoney } from '../../../../index.js';
import {
    formInputSizes
} from '../inputConstants.js';

export default {
    title: 'Components/Form/Money',

    component: FigFormInputMoney,

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
        FigFormInputMoney
    },
    setup() {
        const val = ref(null);

        return {
            val,
            args
        };
    },
    template: `
        <div>
            <fig-form-input-money
                v-model="val"
                v-bind="args" />

            <div class="mt-4">value: {{ val }}</div>
        </div>`
});

export const Money = Template.bind({});
Money.args = {
    size: formInputSizes.md,
    min: 0,
    max: 10
    // state: null
};

