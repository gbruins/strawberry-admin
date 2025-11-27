<script>
export default {
    name: 'VNodes',

    props: {
        vnodes: {
        }
    },

    setup(props) {
        return () => props.vnodes;
    }
};
</script>
