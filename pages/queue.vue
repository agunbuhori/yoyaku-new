<template lang="pug">
    .wrapper
        Header
            .child
                button(@click="back()")
                  span(class="ti-angle-left")
            .child__center
                h3.text-white  Antrian
        section.sec-1(v-if="! snapshot.no_queue")
            .appointments.mb(v-if="!snapshot")
                .spec
                    .doctor
                        label.doctor__name Tidak ada reservasi 
            .appointments.mb(v-if="snapshot && ! snapshot.my_queue.rating")
                .spec
                    .doctor
                        //- span.text-muted {{ now }}
                        //- br
                        label.doctor__name {{ snapshot.service.name }}
                        //- h6.text-muted {{ time }}
            .appointments.sec-appointment(v-if="snapshot && ! snapshot.my_queue.rating")
                h6.text-bold {{ $moment(snapshot.my_queue.checking_time).format('dddd, DD MMMM YYYY') }}
                h6.text-bold No. Antrian
                h3.number-queue {{ snapshot.my_queue.number }}
                .button_flex(v-if="snapshot.my_queue.status === 'waiting'")
                    //- .w50
                    //-     button.button.is-tosca.is-outlined.is-fullwidth(@click="updateQueue()") Edit
                    //- .w50
                    button.button.is-danger.is-outlined.is-fullwidth(@click="modalCancel()") Batal
                .bottom--appointments(@click="toggleContent(0)")
                    h6 Lihat Detail Antrian
                table.table(v-show="showContent[0]")
                    thead

                        tr.f12
                            th No
                            th Prediksi Waktu
                            th Status
                    tbody
                        tr(v-for="(item, $index) in snapshot.sameday_queues" v-if="item.status != 2")
                            td.has-text-centered {{ item.number }}
                            td.has-text-centered {{ $moment(item.checking_time, "YYYY-MM-DD HH:mm:ss").format("HH:mm") }}
                            //- td {{ $moment(snapshot.service.schedules[0].time_start, "HH:mm:ss").add(15*$index, 'minutes').format("HH:mm") }}
                            //- td {{ $moment().format('YYYY-MM-DD') < item.checking_time ? "Booked" : item.status }}
                            td.has-text-centered {{ item.status }}
            .premium-modal
                .modal.ph2(v-bind:class="{'is-active':isShow}")
                    .modal-background
                    .modal-card
                        .crown
                            span(class="ti-crown")
                        .modal-card-body.modal-premium
                            h5 Keuntungan pengguna premium
                            label.f12  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut l
                            | abore et dolore magna aliqua. 
                    button.delete(aria-label="close"  @click='preClose()')
            .cancel-modal
                .modal.ph2(v-bind:class="{'is-active':isBlock}")
                    .modal-background
                    .modal-card
                        .modal-card-body.body-modal
                            h6.f12.mb  Apakah anda yakin membatalkan antrian ?
                            div.gap-1
                                button.mr-10.button.is-danger.is-half(@click='modalClose()') Tidak
                                button.ml-10.button.is-success.is-half(@click='cancelQueue()') Iya
        section.sec-2(v-if="snapshot && snapshot.my_queue.status === 'done' && ! snapshot.my_queue.rating")
            .review
                div(style="display:flex; justify-content: center; align-items: center; flex-direction: column; margin-bottom: 20px")
                    h5.section-title.gap-2 Review 
                    star-rating(v-bind:max-rating="5"
                                inactive-color="#c1c1c1"
                                active-color="#ffc53e"
                                v-model="rating"
                                v-bind:star-size="50"
                                :show-rating="false"
                                )
                textarea.textarea(placeholder="Tulis kritik dan saran disini" v-model="critic")
                .button-submit.mt-10
                    button.button.btn-save.is-rounded(@click="sendReview()") Kirim Penilaian 

        section.sec-news
            h2.section-title Berita Terbaru
            carousel.news(items="2" :nav="false" v-if="postsLoaded" :autoplay="true")
                .item(v-for="post in posts")
                    a(:href="post.link") 
                        .news__img(:style="'background-image: url('+post.better_featured_image.media_details.sizes.medium.source_url+');'")
                    .info
                        //- span {{ post.categories }}
                        a(:href="post.link") {{ post.title.rendered.substring(0,30)+".." }}
        
        BottomNav
</template>

<script>
import Header from '~/components/Header';
import BottomNav from '~/components/BottomNav';
import carousel from 'v-owl-carousel'
import moment from 'moment';
import 'moment/locale/id';
import StarRating from 'vue-star-rating';

export default {
    async asyncData({$axios, params, store, route}) {
        let snapshot = await $axios.$get('queue')
        if (snapshot.no_queue)
            snapshot = false;

        return { snapshot };
    },
    middleware: 'member',
    components: {
        BottomNav,
        Header,
        carousel,
        StarRating
    },
    data() {
        return {
            isShow: false,
            isBlock: false,
            posts: [],
            queue: 0,
            total: 0,
            queues: [],
            now: null,
            time: "",
            firstTime: "",
            postsLoaded: false,
            snapshotLoaded: false,
            myNumber: 1,
            showContent: {
                0: false,
            },
        }
    },
    computed: {
        member() {
            return this.$store.state.member;
        }
    },
    mounted() {
        // this.getSnapshot();
        this.getPosts();

        setInterval(() => {
            this.now = moment().format("dddd, DD MMMM YYYY");
            this.time = moment().format("HH:mm");
        }, 1000);
    },
    methods: {
        async sendReview() {
            await this.$axios.$put('add_review', {
                rating: this.rating,
                critic: this.critic,
                code: this.snapshot.my_queue.code
            })
            .then(response => {
                this.snapshot.my_queue = response;
            })
        },
        getPosts() {
            this.$axios.get("https://news.yoyaku.id/wp-json/wp/v2/posts")
            .then(response => {
                const {status, data} = response;

                if (status === 200) {
                    this.posts = data;
                    this.postsLoaded = true;
                }
            })
        },
        cancelQueue(){
            this.$axios.$delete('delete_queue/'+this.snapshot.my_queue.code)
            .then(response => {
                location.reload();
            })
        },
        updateQueue(){
            const service_id = this.snapshot.my_queue.service_id;
            this.$axios.$delete('delete_queue/'+this.snapshot.my_queue.code)
            .then(response => {
                this.$router.push('/appointment?id='+service_id);
            })
        },
        premiumShow: function(){
            this.isShow = true;
        },
        preClose: function() {
            this.isShow = false;
        },
        modalCancel: function(){
            this.isBlock = true;
        },
        modalClose: function(){
            this.isBlock = false;
        },
        toggleContent(id) {
          this.showContent[id] = ! this.showContent[id];
        },
        getTime(time, index) {
            return moment(time).add((15*index), 'minutes').format('HH:mm');
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

    .button_flex
        margin-top: 10px
        display: flex
        justify-content:  space-around

        .w50 
            width: 48%
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
    table
        width: 100%
        margin-top: $dstnc

        thead 
            background: $tosca
            th
                color: white
                text-align: center   
        tbody
           .premium
                background-color: #1592E6
                color: #FFE200
      
.crown 
    background: #1592E6
    width: 5rem
    height: 5rem
    border-radius: 2.8rem
    display: flex
    justify-content: center
    align-items: center
    margin: 0 auto
    transform: translateY(50%)
    .ti-crown
        font-size: 50px
        color: yellow
.modal-premium 
    background: white
    padding-top: 38px
    text-align: center
    border: 3px solid #1592E6
    border-radius: 15px


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
                display: inline-block;
                color: #000
                line-height: 13px
                
.cancel-modal 
    .modal-card 
        .body-modal 
            border-radius: 6px
            text-align: center !important

.is-half
    width: 30%

.mr-10 
    margin-right: 10px

.ml-10
    margin-left: 10px 
.doctor__name
    font-size: 12pt
.table
    border-radius: $br1
    overflow: hidden
.mb 
    margin-bottom: $gap2

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
.sec-news 
    padding-top: 0px
    margin-top: -15px

.sec-appointment 
    margin-bottom: 15px
</style> 