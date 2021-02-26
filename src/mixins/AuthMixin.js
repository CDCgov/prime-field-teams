export default {
    data() {
        return {
            authProvider: null
        };
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
        authenticated() {
            return this.$store.state.authenticated;
        },
    }
}
