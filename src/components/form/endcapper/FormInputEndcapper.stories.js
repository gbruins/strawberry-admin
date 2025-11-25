import {
    FigFormInputEndcapper,
    FigFormText
} from '../../../../index.js';

export default {
    title: 'Components/Form/Endcapper',
    component: FigFormInputEndcapper,
    argTypes: {

    }
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: {
        FigFormInputEndcapper,
        FigFormText
    },
    setup() {
        return { args };
    },
    template: `
        <div>
            <fig-form-input-endcapper class="mb-2">
                <template v-slot:prefix>$</template>
                <fig-form-text size="sm" />
            </fig-form-input-endcapper>

            <fig-form-input-endcapper class="mb-2">
                <template v-slot:prefix>$</template>
                <fig-form-text size="md" />
            </fig-form-input-endcapper>

            <fig-form-input-endcapper>
                <template v-slot:prefix>$</template>
                <fig-form-text size="lg" />
            </fig-form-input-endcapper>
        </div>
    `
});

export const WithPrefix = Template.bind({});
WithPrefix.args = {
};
