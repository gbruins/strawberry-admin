import { computed } from 'vue';

export const formInputSizes = {
    sm: 'sm',
    md: 'md',
    lg: 'lg'
};

export const formInputProps = {
    size: {
        type: String,
        default: formInputSizes.md,
        validator: (value) => Object.keys(formInputSizes).includes(value)
    },

    state: {
        type: Boolean,
        default: null
    },

    disabled: {
        type: Boolean,
        default: false
    },

    readonly: {
        type: Boolean
    }
};

export default function useFormInput(props) {
    const classNames = computed(() => {
        return {
            'fig-form-control': true,
            [`fig-form-control-${props.size}`]: true,
            'fig-form-control-state-success': !props.disabled && props.state === true,
            'fig-form-control-state-error': !props.disabled && props.state === false,
            'cursor-not-allowed bg-gray-100 fig-text-gray-disabled': props.disabled,
            'bg-white': !props.disabled
        };
    });

    return {
        classNames
    };
};
