<template lang="pug">
    .wrapper-admin.bg-light
        headerAdmin
        section.sec-1
            //- .field-search
            //-     date-picker(v-model="dateFilter" format="DD-MM-YYYY")
            .box-today.border-active(v-for="week in queues")
                nuxt-link(:to="'/admin/queue-today?time='+$moment(week.time).format('YYYY-MM-DD')")
                    .media
                        .media-left
                            h4  {{ $moment(week.time).format('dddd, DD MMM YYYY') }}
                        .media-right
                            h4 {{ week.total }} Pasien

</template>

<script>
import 'vue2-datepicker/index.css';
import DatePicker from 'vue2-datepicker';
import headerAdmin from '~/components/HeaderAdmin';
import moment from 'moment';
import 'moment/locale/id';

export default {
    components: {
        headerAdmin,
        DatePicker
    },
    data() {
        return {
            dateFilter: null,
            queues: [],
            now: moment().format('dddd, DD MMMM YYYY')
        }
    },
    computed: {
        authentication() {
            return this.$store.getters.loggedInUser
        },
        admin() {
            return this.$store.state.admin;
        },
    },
    mounted() {
        this.getSnapshot();
    },
    methods: {
         getSnapshot() {
            this.$axios.$get("weeks?service_id="+this.admin.id)
            .then(response => {
                this.queues = response;
            })
        },
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/sass/style.sass';
    
.field-search
    .mx-datepicker 
        width: 100%

.box-today
    background-color: white
    border-radius: 6px
    color: #4a4a4a
    display: block
    padding: $gap2
    margin-top: $gap2
    border: 1px solid #f1f1f1
    
    h4 
        color: #000
        font-weight: 500
        font-size: 17px

.border-active
    border-left: 7px solid $tosca

.border-off
    border-left: 7px solid $red
    h4 
        color: $red
        font-weight: 500
        font-size: 17px
        
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