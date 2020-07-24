<template lang="pug">
    .wrapper-admin.bg-light
        headerAdmin
        section.sec-1
            .queue-box
                h6 Akan masuk ke nomor antri
                h1 ?
</template>

<script>
import 'vue2-datepicker/index.css';
import DatePicker from 'vue2-datepicker';
import headerAdmin from '~/components/HeaderAdmin';

export default {
    components: {
        headerAdmin,
        DatePicker
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
    position: relative
    border-radius: 5px
    border: 1px solid #ddd
    text-align: center
    padding: $gap1

    h6 
        font-size: 16px
        font-weight: 500
    
    h1 
        font-size: 35pt
        font-weight: 700

.bg-light
    background: #F7F9FB

.mt-g1
    margin-top: $gap1

.mt-g2
    margin-top: $gap2

.has-text-navy
    color: $blue-navy
    font-weight: 600

.is-center
    text-align: center

</style> 