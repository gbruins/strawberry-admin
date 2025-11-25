import { FigFormInputFileButton } from '../../../../index.js';

export default {
    title: 'Components/Form/FileButton',
    component: FigFormInputFileButton,
    argTypes: {

    }
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: {
        FigFormInputFileButton
    },
    setup() {
        function onInput(files) {
            console.log(files);
        }

        return {
            onInput,
            args
        };
    },
    template: `
        <div>
            <fig-form-input-file-button @input="onInput" v-bind="args" />
        </div>
    `
});

export const FileButton = Template.bind({});
FileButton.args = {
};
