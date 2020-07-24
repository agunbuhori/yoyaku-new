<template lang="pug">
    .wrapper-admin
        .image-wrapper
            img(src="/images/logo-tosca.png")
        section.sec-1.mt-g2
            .field
                label.label.has-text-navy Username
                .control
                input.input(type='text' placeholder='' v-model="username"  required="")
            .field
                label.label.has-text-navy Password
                .control
                input.input(type='password' placeholder='' v-model="password"  required="")
            button.button.is-tosca.is-fullwidth(type="button" @click="login()") Login
</template>

<script>
import headerAdmin from '~/components/HeaderAdmin';

export default {
    components: {
        
    },
    data() {
        return {
            username: "",
            password: ""
        }
    },
    computed: {
    },
    mounted() {
    },
    methods: {
        login() {
            this.$axios.$post("login", {
                username: this.username,
                password: this.password,
                guard: 'users'
            })
            .then(response => {
                if (response.token) {
                    localStorage.setItem('admin', JSON.stringify(response));
                    localStorage.setItem('admin_token', response.token);

                    if (response.role === 'owner')
                        window.location.href = '/admin';
                    else
                        window.location.href = '/admin/counter';
                }
            })
        }
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/sass/style.sass';

.image-wrapper
        margin-top: 4rem
        display: flex
        justify-content: center
        align-items: center
        text-align: center

        img 
            width: 100%
            max-width: 600px
            padding: $gap2

.bg-light
    background: #F7F9FB

.mt-g1
    margin-top: $gap1

.mt-g2
    margin-top: $gap2

</style> 