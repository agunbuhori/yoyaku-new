<template lang="pug">
    .wrapper-admin.bg-light
        headerAdmin
        section.sec-1
            .top_list
                h3.title-today {{ now }}
                h3.title-today {{ time }}
                .field-search
                    span(class="ti-search")
                    input.input(type="text" placeholder="Cari Nama")
                .groups-filter
                    button.button.is-rounded.is-tosca.is-outlined A - Z
                    button.button.is-rounded.is-tosca.is-outlined Terbaru
                    button.button.is-rounded.is-tosca.is-outlined Terlama
        section.sec-2
            table.table.is-striped.is-narrow.is-hoverable.is-fullwidth
              thead
                tr
                  th No
                  th Nama
                  th No. RM
                  th Jam
              tbody(v-for="i in 3")
                tr
                    td {{ i }}
                    td.customer-name 
                        h6 
                            span.ti-crown &nbsp;
                            | Agun Buhori
                    td.numbering 
                         label A1213
                    td 08:50
                
</template>

<script>
import headerAdmin from '~/components/HeaderAdmin';
import moment from 'moment';
import 'moment/locale/id';

export default {
    components: {
        headerAdmin
    },
    data() {
        return {
            isActive: false,
            isShow: false,
            now: moment().format('dddd, DD MMMM YYYY'),
            time: moment().format('HH:mm')
        }
    },
    computed: {
        
    },
    mounted() {
    },
    methods: {
        back: function () {
            this.$router.back()
        }
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/sass/style.sass';

.top_list 
    text-align: center

    .title-today
        color: $blue-navy
        font-size: 20px
        font-weight: 600
        margin-bottom: $gap2

    .field-search
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1)
        display: flex
        border-radius: 30px
        border: 1px solid #ccc
        margin-bottom: $gap2
        background: #fff

        span
            padding: $gap2
        .input
            margin-right: 15px
            margin-top: 5px
            border: none !important
            box-shadow: none !important
            
    .groups-filter
        display: flex
        justify-content: space-between

table  
    thead  
        background-color: $tosca 
        tr  
            &.odd  
                background: #ffffff 
            &.even  
                background: #dbecef 
        th  
            color: white 
            text-align: center 
    tbody  
        padding: 10px 
        td  
            text-align: center 
        td.customer-name  
            text-align: left 
            width: 70% 
            font-size: 12pt
            
            .ti-crown
                color: $yellow
        td.numbering  
            width: 30% 
        tbody tr:not(.is-selected):nth-child(even)  
        background-color: #dbecef 

.rm 
    background-color: #f1f2f2
    
.tag-tosca
    background: $tosca !important
    color: white

.bg-light
    background: #F7F9FB

.mt-g1
    margin-top: $gap1

.mt-g2
    margin-top: $gap2

.has-text-navy
    color: $blue-navy
    font-weight: 600

</style> 