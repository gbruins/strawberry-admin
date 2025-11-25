export const popoverPlacements = {
    'top-end': 'top-end',
    top: 'top',
    'top-start': 'top-start',
    'bottom-end': 'bottom-end',
    bottom: 'bottom',
    'bottom-start': 'bottom-start',
    'right-start': 'right-start',
    right: 'right',
    'right-end': 'right-end',
    'left-start': 'left-start',
    left: 'left',
    'left-end': 'left-end'
};

export const popoverDisplayAction = {
    click: 'click',
    mouseover: 'mouseover'
};

export const popoverProps = {
    placement: {
        type: String,
        validator: (position) => {
            return Object.keys(popoverPlacements).includes(position);
        },
        default: popoverPlacements['bottom-start'],
    },

    disabled: {
        type: Boolean,
        default: false
    },

    offset: {
        type: Array,
        default: () => [0, 8]
    },

    flip: {
        type: Boolean,
        default: true
    },

    customPopperOptions: {
        type: Object,
        default: null
    },

    target: {}
};
