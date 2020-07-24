<template lang="pug">
    .wrapper-admin.bg-light
        headerAdmin
        section.sec-1
            .queue-box
                h6 Antrian saat ini 
                h1 7
            ul.data-pending.mt-g2
                li.antre(v-for="i in 4")
                    h1.has-text-navy 4
                    h6.has-text-navy.mb-g1 12:00
                    .footer-pending
                        h5 Buka Pending
            small.has-text-danger *) Nomor otomatis hilang jika terlewat 5 antrian
</template>

<script>
import headerAdmin from '~/components/HeaderAdmin';
import moment from 'moment';

export default {
    components: {
        headerAdmin,
    },
    data() {
        return {
            dateFilter: null
        }
    },
    computed: {
        
    },
    mounted() {
    },
    methods: {
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/sass/style.sass';
    
.queue-box
    background-color: white
    max-width: 100%
    border-radius: 6px
    border: 1px solid #ddd
    text-align: center
    padding: $gap1
    line-height: 1.3

    h6 
        font-size: 18px
        font-weight: 600
    
    h1 
        font-size: 35pt
        font-weight: 700
        color: $blue-navy

.data-pending 
    display: flex
    flex-wrap: wrap
    justify-content: space-between
    li.antre 
        background-color: white
        border: 1px solid #ddd
        max-width: 100%
        border-radius: 6px
        text-align: center
        margin-bottom: 1rem
        width: 48%
        padding-top: 10px

        h1
            font-size: 45px

        .footer-pending
            background-color: $tosca
            padding: $gap1
            border-radius: 0px 0px 6px 6px
            color: white
    

.bg-light
    background: #F7F9FB

.mb-g1
    margin-bottom: $gap1
    
.mt-g1
    margin-top: $gap1

.mt-g2
    margin-top: $gap2

.has-text-navy
    color: $blue-navy
    font-weight: 600

</style> 