<template lang="pug">
    .wrapper
        Header
        section.sec-1
            .d-flex
                h1.section-title Profil
                span.f12
                    nuxt-link(to="/update") Edit Profile |
                    a.red(@click="signout")  Keluar
            .profile
                .item(v-for="profile in profiles")
                    .icon
                        img(:src="profile.img")
                        //- span(:class="profile.icon")
                    .info
                        label {{ profile.label }}
                        span {{ profile.value }}

            //- .button-prof
            //-     nuxt-link(to="/history")
            //-         button.button.btn-history.is-rounded Lihat Riwayat Sebelumnya
            //-             span(class="ti-back-right")

                    
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
            profiles: [
                // {icon: "ti-user", label: "Nama", value: "Agun Buhori"},
                // {icon: "ti-tag", label: "Jenis Kelamin", value: "Laki-laki"},
                // {icon: "ti-wheelchair", label: "Usia", value: "22 Tahun"},
                // {icon: "ti-mobile", label: "No. Handphone", value: "081221881544"},
                // {icon: "ti-location-pin", label: "Alamat", value: "Jl. Babakan Ciamis No. 1331B, Babakan Ciamis, Sumur Bandung, Kota Bandung, Jawa Barat"},
            ]
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
            if (this.$auth.loggedIn)
                this.$axios.$get('profile')
                .then(response => {
                    const { name, email, whatsapp, age, gender, member, address } = response;
                    this.profiles.push({img: "/images/1.png", label: "Nama", value: name});
                    this.profiles.push({img: "/images/2.png", label: "Email", value: email});
                    this.profiles.push({img: "/images/3.png", label: "Whatsapp", value: member.whatsapp});
                    this.profiles.push({img: "/images/4.png", label: "Usia", value: member.age});
                    this.profiles.push({img: "/images/5.png", label: "Jenis Kelamin", value: member.gender === null ? "" : (member.gender === 'male' ? 'Pria' : 'Wanita') });
                    this.profiles.push({img: "/images/6.png", label: "Alamat", value: member.address});
                })
            
        },
        signout() {
            this.$auth.logout();
            window.location.href = '/login';
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
        border-bottom: 1px solid #ddd

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
.button-prof
    text-align: center
    margin: 0 auto
    padding-top: $gap2

    .btn-history
        border: none !important
        background: $tosca
        color: white

        span 
            margin-left: 10px

.d-flex
    display: flex
    justify-content: space-between

.red
    color: $red
</style> 