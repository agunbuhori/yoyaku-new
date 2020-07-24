<template lang="pug">
    .headerAdmin
        .header-control
            .child
                button
                    span(class="ti-arrow-left" @click="back()")
            .child-center
                h3.title-admin {{ this.$route.name == 'admin-queue-today' ? 'Antrian Harian' : '' }}
                h3.title-admin {{ this.$route.name == 'admin-queue-week' ? 'Antrian Mingguan' : '' }}
                h3.title-admin {{ this.$route.name == 'admin-history' ? 'Riwayat Antrian' : '' }}
                h3.title-admin {{ this.$route.name == 'admin-setting' ? 'Pengaturan' : '' }}
                h3.title-admin {{ this.$route.name == 'admin-offline' ? 'Form Offline' : '' }}
                h3.title-admin {{ this.$route.name == 'admin-pending' ? 'Pasien Pending' : '' }}
                h3.title-admin {{ this.$route.name == 'admin-number-offline' ? 'No Antrian Offline' : '' }}
                h3.title-admin {{ this.$route.name == 'admin-table-history' ? 'Daftar Riwayat' : '' }}
                h3.title-admin {{ this.$route.name == 'admin-table-premium' ? 'Daftar Riwayat Premium' : '' }}
                h3.title-admin {{ this.$route.name == 'admin-calendar' ? 'Kalender' : '' }}
                h3.title-admin {{ this.$route.name == 'admin-history-premium' ? 'Riwayat Antrian Premium' : '' }}
</template>

<script>
export default {
    data() {
        return {
            active: 0,
        }
    },
    computed: {
        
    },
    mounted() {
        
    },
    methods: {
        back() {
            this.$router.back()
        }
    }
}
</script>

<style lang="sass">
@import '~/assets/sass/style.sass';

.headerAdmin
    width: 100%
    top: 0
    height: 60px
    background-color: white
    overflow: hidden
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1)

    .header-control
        display: flex
        justify-content: space-between
        align-items: center
        padding-top: $gap2

        .child-center
            margin: 0 auto
            .title-admin
                font-size: 22px
                color: #13ADC1
                font-weight: 600

        button 
            font-size: 20px
            border: none
            padding: 0
            background: none

            span 
                margin-left: 10px
                font-weight: bold
            
</style>
