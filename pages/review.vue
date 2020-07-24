<template lang="pug">
    .wrapper
        section.sec-1.section-bg
            .appointments.mb
                .spec
                    .doctor
                        span.text-muted Selasa, 15 April 2020 08:50
                        br
                        label.doctor__name Dr. John Doe S.Kes M.Kes
                            br 
                            | (Spesialis THT)
                h6.mt-10.text-bold Antrian Selesai
                h3.number-queue 10
        section.sec-2
            .review
                div(style="display:flex; justify-content: center; align-items: center; flex-direction: column; margin-bottom: 20px")
                    h5.section-title.gap-2 Review 
                    star-rating(v-bind:max-rating="5"
                                inactive-color="#c1c1c1"
                                active-color="#ffc53e"
                                v-model="rating"
                                v-bind:star-size="40")
                textarea.textarea(placeholder="Tulis kritik dan saran disini" v-model="critic")
                .button-submit.mt-10
                    button.button.btn-save.is-rounded(@click="sendReview()") Kirim Penilaian 

        BottomNav
</template>

<script>
import StarRating from 'vue-star-rating';
import BottomNav from '~/components/BottomNav';
import carousel from 'v-owl-carousel'

export default {
    middleware: 'member',
    components: {
        BottomNav,
        carousel,
        StarRating
    },
    data() {
        return {
            rating: null,
            critic: ""
        }
    },
    computed: {
        authentication() {
        }
    },
    mounted() {

    },
    methods: {
        async sendReview() {
            await this.$axios.$put('add_review', {
                rating: this.rating,
                critic: this.critic,
                code: '2020' 
            })
            .then(response => {

            })
        }

    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/sass/style.sass';

$dstnc : 10px
$bd-grey: #e5e5e5

.appointments
    background-color: #FFFFFF
    max-width: 100%
    position: relative
    height: auto
    text-align: center
    font-weight: 600
    padding: $gap1
    border-radius: $br1
    border: 1px solid #eee
    
    .number-queue 
        font-size: 50pt
        font-family: 'Heebo', sans-serif
        font-weight: bold
        line-height: 50pt

    
    .bottom--appointments
        height: auto
        background-color: $tosca
        text-align: center
        padding: $gap1
        color: white
        border-radius: $br1
        margin-top: $gap2

        h6 
            font-weight: 700

.review
    background-color: #FFFFFF
    height: auto
    font-weight: 600
    border-radius: $br1
    border: 1px solid #dedede
    padding: $gap2

    table   
        width: 100%
        tr 
            td 
                padding-bottom: 5px

                span.vue-star-rating-rating-text 
                    display: none

.button-submit
    text-align: center
    margin: 0 auto
    padding-top: $gap2

    .btn-save
        border: none !important
        background: $tosca
        color: white

        span 
            margin-left: 10px



.section-bg
    background: $light
.news
    margin: 0 -5px

    &__img
        width: 100%
        border-radius: $br1
        height: 120px
        background-size: cover
        margin-bottom: 10px

    .item
        margin-left: 5px
        margin-right: 5px
        margin-bottom: 10px

        .info
            span
                font-size: 12px
            a
                font-weight: bold
                font-size: 12px
                display: inline-block
                color: #000
                line-height: 13px
.doctor__name
    font-size: 12pt
.table
    border-radius: $br1
    overflow: hidden
.mb 
    margin-bottom: $gap2
.mt-10
    margin-top: $gap2



</style> 