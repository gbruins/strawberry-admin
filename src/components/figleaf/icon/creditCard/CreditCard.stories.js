import { FigCreditCardIcon } from '../../../../index.js';
import { cardTypes } from './constants.js';

export default {
    title: 'Components/CreditCardIcon',
    component: FigCreditCardIcon,
    argTypes: {
        type: {
            control: { type: 'select' },
            options: Object.keys(cardTypes)
        }
    }
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: {
        FigCreditCardIcon
    },
    setup() {
        return { args };
    },
    template: '<fig-credit-card-icon v-bind="args" />'
});

export const CreditCardIcon = Template.bind({});
CreditCardIcon.args = {
    type: cardTypes.visa
};

