<template lang="pug">
    .wrapper
        Header
        section.sec-1
            .profile
                .item 
                    .icon
                        nuxt-link(to="/profile")
                            span(class="ti-angle-left")
                    .info
                        h2 Edit Profil
                .item
                    .icon
                        img(src='/images/1.png')
                    .info
                        label Nama
                        input.input(type="text" v-model="user.name")
                .item
                    .icon
                        img(src='/images/2.png')
                    .info
                        label Email
                        input.input(type="text" disabled v-model="user.email")
                .item
                    .icon
                        img(src='/images/3.png')
                    .info
                        label No WhatsApp
                        input.input(type="text" v-model="user.member.whatsapp")
                .item
                    .icon
                        img(src='/images/4.png')
                    .info
                        label Umur
                        input.input(type="number" v-model="user.member.age")
                .item
                    .icon
                        img(src='/images/5.png')
                    .info
                        label Jenis Kelamin
                        .control
                            label.radio
                                input(type="radio" name="gender" value="male" v-model="user.member.gender")
                                | &nbsp; Pria
                            label.radio
                                input(type="radio" name="gender" value="female" v-model="user.member.gender")
                                | &nbsp; Wanita
                .item
                    .icon
                         img(src='/images/6.png')
                    .info
                        label Alamat
                        textarea.textarea(name="address" v-model="user.member.address")
            .button-prof
                button.button.btn-history.is-rounded.is-fullwidth(@click="postProfile()") Simpan
                    span(class="ti-save")

                    
        BottomNav
</template>

<script>
import BottomNav from '~/components/BottomNav';
import Header from '~/components/Header';

export default {
    middleware: 'member',
    components: {
        BottomNav,
        Header
    },
    data() {
        return {
            snapshot: {},
            snapshotLoaded: false,
            profiles: [],
            user: {
                name: "",
                email: "",
                member: {}
            }
        }
    },
    computed: {
        member() {
            return this.$store.state.member
        }
    },
    mounted() {
        this.getSnapshot();
    },
    methods: {
        getSnapshot() {
            this.$axios.$get("profile")
            .then(response => {
                this.snapshotLoaded
                this.user = response;
            });
        },
        postProfile(){
            const { name, email, member } = this.user;
            this.$axios.$put("update_profile", {
                name, email, member
            })
            .then(response => {
                this.$router.push('/profile');
            })
            .catch(error => {
                alert(JSON.stringify(error.response.data.errors));
            });

        }
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/sass/style.sass';

.profile
    .item
        display: grid
        grid-template-columns: 50px 1fr
        // border-bottom: 1px solid #ddd

        .icon
            display: flex
            justify-content: flex-start
            align-items: center
            height: 60px
            width: 80%
            img
                width: 100%
        .info
            display: flex
            flex-direction: column
            padding: $gap1 0
            justify-content: center
            // align-items: center

            span
                font-weight: bold
        .logout
            display: flex
            flex-direction: column
            padding: $gap1 0
            justify-content: center
            align-items: center

            span
                font-weight: bold

.head-profile
    display: flex
    a 
        font-size: 25px
        margin-top: 40px
        margin-right: $gap1
.button-prof
    text-align: center
    margin: 0 auto
   

    .btn-history
        border: none !important
        background: $tosca
        color: white

        span 
            margin-left: 10px

.control
    display: flex
    padding-top: $gap1
.d-flex
    display: flex
    justify-content: space-between

</style> 