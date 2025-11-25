export default function usePaginationBar(props, context) {

    const paginationBarEmits = [
        'pageSize',
        'pageNumber',
        'change'
    ];

    const paginationBarProps = {
        pageSize: {
            type: Number,
            default: 100
        },
    
        pageNumber: {
            type: Number,
            default: 1
        },

        totalRows: {
            type: Number,
            default: 0
        },

        buttonLimit: {
            type: Number,
            default: 5
        },

        perPageOptions: {
            type: Array,
            default: function() {
                return [1, 2, 3, 25, 50, 100, 200, 500];
            }
        }
    }

    return {
        paginationBarEmits,
        paginationBarProps
    };
}