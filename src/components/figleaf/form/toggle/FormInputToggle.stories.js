import { ref } from 'vue';
import { FigFormInputToggle } from '../../../../index.js';
import { toggleInputSizes, toggleInputVariants } from './constants.js';

export default {
    title: 'Components/Form/Toggle',
    component: FigFormInputToggle,
    argTypes: {

    }
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: {
        FigFormInputToggle
    },
    setup() {
        const val = ref(false);

        return {
            val,
            args
        };
    },
    template: `
        <div>
            <fig-form-input-toggle
                v-model="val"
                v-bind="args" />

            <div class="mt-4">Selectede: {{ val }}</div>
        </div>
    `
});

export const Toggle = Template.bind({});
Toggle.args = {
};

