import { ref } from 'vue';
import { FigFormTextarea } from '../../../../index.js';

export default {
    title: 'Components/Form/Textarea',
    component: FigFormTextarea,
    argTypes: {
    }
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: {
        FigFormTextarea
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
            <fig-form-textarea
                v-model="val"
                v-bind="args" />

            <div class="mt-4">Value: {{ val }}</div>
        </div>
    `
});

export const Textarea = Template.bind({});
Textarea.args = {
};
