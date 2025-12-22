import { FigIcon } from '../../../index.js';
import { figIconVariants } from './constants';
import svgFileNames from './svgFileNames.js'

export default {
    title: 'Components/Icon',
    component: FigIcon,
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: Object.keys(figIconVariants)
        },

        icon: {
            control: { type: 'select' },
            options: svgFileNames
        }
    }
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: {
        FigIcon
    },
    setup() {
        return {
            args
        };
    },
    template: `
        <fig-icon v-bind="args" />
    `
});

export const Icon = Template.bind({});
Icon.args = {
    variant: figIconVariants.default,
    icon: 'cart',
    width: 40,
    height: 40
};
