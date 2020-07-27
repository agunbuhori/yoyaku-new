<template lang="pug">
    .header
        .header-control
            .child
                button(v-if="title !== 'index'")
                    label(@click="back()")
                        span(class="ti-arrow-left" )
            .child-center
                h2.has-text-white {{ this.$route.name === 'comment' ? 'Komentar' : '' }}
                h2.has-text-white {{ this.$route.name === 'search' ? 'Cari' : '' }}
                h2.has-text-white {{ this.$route.name === 'queue' ? 'Antrian' : '' }}
                h2.has-text-white {{ this.$route.name === 'favorite' ? 'Favorit' : '' }}
                h2.has-text-white {{ this.$route.name === 'profile' ? 'Profil Saya' : '' }}
                h2.has-text-white {{ this.$route.name === 'history' ? 'Riwayat' : '' }}
                h2.has-text-white {{ this.$route.name === 'service' ? 'Layanan' : '' }}
                h2.has-text-white {{ this.$route.name === 'update' ? 'Edit Profil' : '' }}
                h2.has-text-white {{ this.$route.name === 'appointment' ? 'Buat Janji' : '' }}
                div(v-if="title === 'index'")
                    img(src="images/logo.png")
</template>

<script>
export default {
    data() {
        return {
            active: 0,
            title: this.$route.name,
        }
    },
    computed: {
    },
    mounted() {
    },
    methods: {
         back() {
            this.$router.back();
        }
    }
}
</script>

<style lang="sass">
@import '~/assets/sass/style.sass';

.header
    width: 100%
    top: 0
    height: 60px
    background-color: $tosca
    overflow: hidden
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1)
    
    .header-control
        display: flex
        justify-content: space-between
        align-items: center
        padding-top: $gap2

        .child-center
            margin: 0 auto
            img
                height: 35px
        button 
            font-size: 20px
            border: none
            padding: 0
            background: none

            span 
                margin-left: 10px
                font-weight: bold
                color: white
</style>
