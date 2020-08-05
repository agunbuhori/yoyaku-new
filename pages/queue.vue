<template lang="pug">
    .wrapper
        Header
            .child
                button(@click="back()")
                  span(class="ti-angle-left")
            .child__center
                h3.text-white  Antrian
        section.sec-queue(v-if="!snapshot.no_queue")
            .appointments.mb(v-if="!snapshot")
                .spec
                    .doctor
                        img(src="/images/nothing.png" width="10%")
                        h4.text-tosca.has-text-weight-bold Tidak ada reservasi
                        h5.text-muted Anda belum mengambil nomor antrian, silahkan melakukan reservasi

                        nuxt-link(to="/search")
                            button.gap-2.button.is-tosca Buat Janji
            .appointments.mb(v-if="snapshot && ! snapshot.my_queue.rating")
                .spec
                    .doctor
                        //- span.text-muted {{ now }}
                        //- br
                        label.doctor__name {{ snapshot.service.name }}
                        //- h6.text-muted {{ time }}
            .appointments.sec-appointment.mb(v-if="snapshot && ! snapshot.my_queue.rating")
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
                            th Prediksi
                            th Status
                    tbody
                        tr(v-for="(item, $index) in snapshot.sameday_queues" v-if="item.status != 2")(:class="item.status == 'failed' ? 'strikeout' : ' ' ")
                            td.has-text-centered {{ item.number }}
                            td.has-text-centered {{ $moment(item.checking_time, "YYYY-MM-DD HH:mm:ss").format("HH:mm") }}
                            //- td {{ $moment(snapshot.service.schedules[0].time_start, "HH:mm:ss").add(15*$index, 'minutes').format("HH:mm") }}
                            //- td {{ $moment().format('YYYY-MM-DD') < item.checking_time ? "Booked" : item.status }}
                            td.has-text-centered {{ item.status | capitalize }}
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
        section.sec-queue(v-if="snapshot && snapshot.my_queue.status === 'done' && ! snapshot.my_queue.rating")
            .review.mb
                div
                    h4.section-title Review 
                    star-rating(v-bind:max-rating="5"
                                inactive-color="#c1c1c1"
                                active-color="#ffc53e"
                                v-model="rating"
                                v-bind:star-size="50"
                                :show-rating="false"
                                )
                textarea.textarea.gap-1(maxlength="200" placeholder="Tulis kritik dan saran disini" v-model="critic")
                .button-submit
                    button.button.btn-save.is-rounded(@click="sendReview()") Kirim Penilaian 
        section.sec-news
            h2.has-text-weight-bold Berita
            carousel.news(items="2" :nav="false" v-if="postsLoaded" :autoplay="true")
                .item(v-for="post in posts")
                    a(:href="post.link") 
                        .news__img(:style="'background-image: url('+post.better_featured_image.media_details.sizes.medium.source_url+');'")
                    .info
                        //- span {{ post.categories }}
                        a(:href="post.link") {{ post.title.rendered.substring(0,30)+".." }}
        section.sec-3
            div(v-for="services in services")
                .ads-title
                    img(:src="services.picture")
                    .text-title {{ services.name }}
                carousel.ads-group(items="2" :nav="false")
                    .ads-group__item(v-for="service in services.services")
                        nuxt-link(:to="'/service?id='+service.id")
                            .ads-group__item__body
                                .img-ads(v-if="service.premium == 1")
                                    img(src="/images/ads.png")
                                .main-img
                                    img(:src="service.picture ? service.picture : '/images/default.png'")
                                h6.has-text-weight-bold {{service.name}}
                                h6(v-if="service.rating != '' ")
                                    span(class="ti-star")
                                    |  {{ service.rating }}
                                h6(v-if="service.rating == '' ")
                                    span(class="ti-star")
                                    |  -

        
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
            services: [],
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
        this.getServices();

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
        getServices(){
            this.$axios.get("queue")
            .then(response => {
                const {status, data} = response;

                if (status === 200) {
                    this.services = data.services;
                    console.log(data.services)
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
        

    },
    filters : {
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
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

            .strikeout 
                color: grey
                td 
                    position: relative
                td 
                    &::before
                        content: " "
                        position: absolute
                        top: 50%
                        left: 0
                        border-bottom: 1px solid grey
                        width: 100%

.sec-queue
    padding-left: $gap2
    padding-right: $gap2

.text-failed 
    text-decoration: line-through
    // color: grey
.review
    padding-top: 0px
    margin-top: -25px
    text-align: center

    div
        display:flex 
        justify-content: center 
        align-items: center
      
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
                display: inline-block
                color: #000
                line-height: 13px
                
.cancel-modal 
    .modal-card 
        .body-modal 
            border-radius: 6px
            text-align: center !important

.ads-title
    display: flex
    margin-bottom: $gap1

    .text-title
        font-size: 18px
        font-weight: bold
        margin-top: 5px
    img
        width: 30px
        
.ads-group
    padding: 0px
    &__item
        margin-left: 5px
        margin-right: 5px
        margin-bottom: 10px

        &__body
            width: 100%
            height: auto
            background: $white
            border: 1px solid #eeeeee
            border-radius: 5px
            text-align: center
            display: block
            padding: 5px
        
            .img-ads
                width: 40px
                z-index: 15 
                top: 0
                left: 0
                margin-left: 5px
                position: absolute

            .main-img
                display: flex
                justify-content: center
                align-items: center
                flex-direction: column
                img
                    width: 70px
                    height: 70px
                    border-radius: 50%

            @media screen and (min-width: $small)
                .main-img
                    img
                        width: 100px
                        height: 100px

            

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

.gap-1
    margin-top: 1rem

.gap-2
    margin-top: 2rem

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

.sec-ads 
    padding-top: 0px
    margin-top: -15px

</style> 