<template lang="pug">
     .wrapper
        Header
        section.sec-tosca
           .profile-services
                .pict
                    img.service-img(:src="snapshot.picture ? snapshot.picture : '/images/default.png' ")
                    .favorite
                        button(@click="postfavorite(snapshot.id)")
                            img.love(:src="snapshot.favorite ? '/images/red-love.png' :'/images/default-love.png'" )
                h5.title-service.gap-2 {{ snapshot.name }}
                h5.f14-service {{ snapshot.group.name }}
                .d-flex.gap-2
                    h5.f14-service(v-if="snapshot.rating != '' ")
                        span.mr-5(class="ti-star")
                        | {{ snapshot.rating }} ({{ snapshot.user_rating }})
                    h5.f14-service
                        span.mr-5(class="ti-bag")
                        |  {{ $moment().format('YYYY') - snapshot.since }} Tahun
                h5.f14-service.gap-2 Biaya Mulai Rp. {{ formatPrice(snapshot.price) }}
        section.sec-2
            .desc-service
                h5.f14 Tanggal Tersedia 
                .select-day.gap-1
                    .queue-day(v-for="(date, $index) in snapshot.dates" :class="! date.available ? 'unactive' : ''")
                        .head-select
                            h4 {{ $moment($index).format('dd') }} 
                        .body-select
                            p.f12 {{ $moment($index).format('DD') }}
                            p
                                input(type='radio' name="date" :disabled="! date.available" @click="postDate($index, date.start)")
                            p.f12 {{ date.total }}
                            p Antrian
                //- .premium-feature
                //-     .premium-header
                //-         h6.f12 Premium Feature
                //-     .premium-body
                //-         h6.f12 Dapat di gunakan jika anda menggunakan fitur premium. Pilih jam dengan biaya  Rp {{snapshot.price}}
                //-         .times(v-for="time in times")
                //-             .times__head
                //-                 h6.f12.is-blue {{ time[0] }} - {{ time[time.length - 1] }}
                //-             .times__body
                //-                 .radio-times.radio-times(v-for="item in time" @click="openPremium()")
                //-                     input(type='radio' :id="item" name="time")
                //-                     label.radio(:for='item')
                //-                         | {{ item }}
            h6.f12 Pilih Keterangan (lebih dari 1)
            .group-checkbox
                button.button(:class="{'is-tosca': complaints.findIndex(item => item === reason.title) !== -1}")(v-for="(reason, $index) in snapshot.reasons" @click="addComplaint(reason.title, $index)") {{ reason.title }}
            .btn-send.gap-2
                button.button.is-tosca.is-fullwidth.is-rounded(@click="openBooking($moment(date).format('dd'))" v-if="complaints.length && date !== ''")
                    span.mr-5(class="ti-calendar")
                    | Kirim
            .pre-modal
                .modal.ph2(v-bind:class="{'is-active':isShow}")
                    .modal-background
                    .modal-card
                        .modal-card-body.body-modal
                            h6.f12  Apakah anda akan menggunakan fitur premium ?
                            div.gap-1
                                button.mr-5.button.is-danger.is-full(@click="closePremium(); premium = ''") batal
                                button.ml-5.button.is-success.is-full(@click="closePremium()") Lanjutkan
            .confirm-modal
                .modal.ph2(v-bind:class="{'is-active':isBook}")
                    .modal-background
                    .modal-card
                        .modal-card-head
                            h6.modal-card-title Prediksi Waktu
                        .modal-card-body.body-modal
                            h3.has-text-weight-semibold {{ date | moment }}
                            div
                                h1.has-text-weight-bold {{ time_start }} 
                            h6.f12  Apakah anda akan melanjutkan ?
                            div.gap-1
                                button.mr-5.button.is-tosca.is-outlined.is-full(@click="closeBooking()") Tidak
                                button.ml-5.button.is-tosca.is-full(@click="order()") Lanjut
        BottomNav
                
</template>

<script>
    import BottomNav from '~/components/BottomNav';
    import Header from '~/components/Header';
    import carousel from 'v-owl-carousel';
    import moment from 'moment';
    import 'moment/locale/id';

    export default {
    async asyncData({$axios, params, store, route}) {
        const { latitude, longitude } = store.state.location;
        const snapshot = await $axios.$get('service/'+route.query.id, {
            params: {
                lat: latitude, long: longitude
            }
        });

        return {snapshot};
    },
    middleware: 'member',
    components: {
        BottomNav,
        carousel,
        Header
    },
    data() {
        return {
            isBook: false,
            isShow: false,
            snapshot: {},
            book: {},
            times: [],
            profiles: {},
            premium: false,
            // snapshot: {
            //     group: {}
            // },
            unavailables: [],
            isClicked: false,
            favorite: {},
            complaints: [],
            date: "",
            time_start: "",
            little_day: "",
        }
    },
    computed: {
        member() {
            return this.$store.state.member;
        }
    },
    async mounted() {
        // await this.getSnapshot();
    },
    methods: {
        formatPrice(value) {
            let val = (value/1).toFixed(0).replace('.')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        moment: function () {
            return moment();
        },
        times: function () {
            return times();
        },
        addComplaint(complaint, id) {
            let find = this.complaints.find(item => item === complaint);

            if (! find)
                this.complaints.push(complaint);
            else
                this.complaints.forEach((item, index) => {
                    if (item === complaint)
                        this.complaints.splice(index, 1);
                })

            
        },
        openPremium : function() {
            this.isShow = true;
        },
        closePremium: function() {
            this.isShow = false;
        },
        postfavorite(id) {
            this.$axios.$post('add_favorite', {
                service_id: id,
                favorite: this.snapshot.favorite ? 0 : 1,
            })
            .then(response => {
                this.snapshot.favorite = ! this.snapshot.favorite;
            })
        },
        // getSnapshot() {
        //     this.$axios.$get("http://localhost/yoyaku-laravel/public/api/member/service/"+this.$route.query.id)
        //     .then(response => {
        //         this.snapshotLoaded = true;
        //         this.snapshot = response;
        //         this.title = response.group.reason.title;
        //         this.descriptions= JSON.parse(response.group.reason.description)

        //         response.dates.forEach(date => {
        //             response.dates_available.forEach(item => {
        //                 if (item === date)
        //                     this.unavailables.push(item);
        //             })
        //         });
        //     })
        // },
        inArray(item) {
            return this.unavailables.indexOf(item) == '-1';
        },
        postDate(date, time_start){
            this.date = date;
            this.time_start = time_start;
            // this.date = date;
            // this.$axios.post("service", {
            //     id: this.$route.query.id,
            //     date
            // })
            // .then(response => {
            //     const {status, data} = response;

            //     if (status === 200) {
            //         let times = [];

            //         while (data.length > 0)
            //             times.push(data.splice(0, 8));

            //         this.times = times;
            //     }
            // })
        },
        closeBooking: function() {
            this.isBook = false;
        },
        openBooking : function(value) {
            this.isBook = true;
            this.little_day = value;
            // alert(value);
        },
        order() {
            this.$axios.$post('add_queue', {
                premium: this.premium,
                service_id: this.$route.query.id,
                complaint: this.complaints.join(', '),
                date: this.date
            })
            .then(response => {
                if (response.restricted)
                    alert("Maaf, anda sudah melakukan booking di hari tersebut");
                else
                    this.$router.push('/queue');
            });
            // window.location.href = "https://api.whatsapp.com/send?phone=6288906310398&text=Saya booking, keluhan saya "+this.complaints.join(', ');
        },
    },
    filters: {
        moment: function (date) {
            return moment(date).format('ddd, Do MMMM YYYY');
        },
        times: function(date) {
            return moment(date).format('h:mm');
        },
        dates: function(date) {
            return moment(date).format('Do');
        },
    }
}
</script>

<style lang="sass" scoped> 
    @import '~/assets/sass/style.sass'

    .hidden
        display: none
    
    .showed
        display: block

    .sec-tosca
        background-color: $tosca
    .profile-services
        .pict
            display: flex
            justify-content: center
            align-items: center

            img.service-img 
                border-radius: 50%
                width: 135px
                height: 135px

            .favorite 
                background-color: white
                // width: 50px
                // height: 50px
                border-radius: 50%
                margin-left: -30px
                margin-top: 85px
                text-align: center
                padding-top: 8px

                button 
                    border: none
                    background: none

                img.love
                    width: 30px !important
                    height: auto

    .desc-service
        .select-day 
            overflow-x: scroll
            display: flex
            margin-bottom: 1rem
            
            .queue-day 
                text-align: center
                border: 1px solid #fff
                width: 15%
            
            .head-select 
                background: $tosca
                color: white
                height: 20px
                
                h4 
                    margin-top: 0
                    font-size: 11pt
                    font-weight: 300
            
            .body-select 
                background: $light
                line-height: 1.5
                padding: 3px
                font-size: 11px
                font-weight: 700
    .premium-feature 
        border-radius: 10px
        .premium-header
            width: 100%
            height: auto 
            background: $blue 
            color: #FFE200 
            padding: 10px 
            border-radius: 10px 10px 0px 0px 
        
        .premium-body 
            border: 1px solid $blue 
            width: 100% 
            height: auto 
            background: white 
            border-radius: 0px 0px 10px 10px 
            padding: 10px 

            .times 
                width: 100% 
                &__head 
                    width: 100% 
                    margin-top: 5pt 
                    border-radius: 10px 10px 0px 0px 
                    padding: 10px 
                    background-color: #E3F4FF 
                    border: 1px solid #E3F4FF 
                    height: 43px 
                    
                &__body 
                    border: 1px solid #E3F4FF 
                    padding: 10px
                     
                    .radio-times 
                        width: 25% 
                        display: inline-flex  
                        margin-top: 5px 
                        font-size: 12px 

                        label.radio 
                            display: inline-block 
                            cursor: pointer 
                            width: 100% 
                            text-align: center 
                            border: 1px solid #ccc 
                            padding: 0.75rem 
                            background: white
                            border: 1px solid $tosca 
                            color: $tosca 
                        
                        label.radio--disable 
                            margin-top: 5pt 
                            display: inline-block 
                            width: 100% 
                            text-align: center 
                            border: 1px solid #ccc 
                            padding: 0.75rem 
                            background: #f2f2f2 
                            border: 1px solid #f2f2f2 
                            color: #5E8BA8 

                        input[type=radio]:checked + label.radio 
                            border: 1px solid #ccc
                            background: $blue 
                            color: yellow 
                        
                        input[type=radio] 
                            display: none 
    .group-checkbox 
        display: initial !important

        .button
            width: 48%
            margin-left: 2px
            margin-right: 2px
            margin-top: 5px
    
    .pre-modal 
        .modal-card 
            .body-modal 
                border-radius: 6px
                text-align: center !important

    .confirm-modal 
        .modal-card 
            width: 85%
           
            .modal-card-head
                background: white
                text-align: center
                display: flex
                position: center
                border-top-left-radius: 0px
                border-top-right-radius: 0px

                .modal-card-title
                    font-size: 18px
                    font-weight: 600
                    
            .modal-card-body 
                text-align: center !important

                button
                    width: 48%
   
    .title-service
        font-size: 16pt
        color: white
        text-align: center

    .is-blue
        color: $blue
    
    .gap-1
        margin-top: $gap1

    .gap-2
        margin-top: $gap2

    .f14-service
        font-size: 14pt
        color: white
        text-align: center
    
    .f14
        color: #000
        font-weight: 600
        font-size: 14pt

    .f12-desc
        font-weight: 400
        font-size: 12pt
        text-align: justify

    .f12
        font-size: 12pt

    .mr-5 
        margin-right: 5px
    
    .d-flex
        display: flex
        justify-content: space-around
        
    .unactive
        color: red
</style>