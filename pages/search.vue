<template lang="pug">
    .wrapper
        Header
        section.sec-1
            .field-search
                span(class="ti-search")
                input.input(type="text" name="filter" @keyup="getSearch" v-model="search" autocomplete="off") 
            .groups-filter
                button.button.is-rounded.is-small.is-tosca.is-outlined(v-on:click='isOpen = !isOpen') Filter
                    span(class="ti-angle-down")
                button.button.is-rounded.is-small.is-tosca.is-outlined(@click="snapshot.services = []; filterResult('nearby'); getSnapshot()") Terdekat
                button.button.is-rounded.is-small.is-tosca.is-outlined(@click="snapshot.services = []; filterResult('fastest'); getSnapshot()") Tercepat
                button.button.is-rounded.is-small.is-tosca.is-outlined(@click="snapshot.services = []; filterResult('rating'); getSnapshot()") Rating
            .filter-content(v-show="isOpen")
                h5.has-text-weight-semibold.mt-10 Kategori
                .filtered-two.mg-2
                    .control
                        button(:class="{'active': category == filter.id}" v-for="filter in groups" @click="category = filter.id; filterResult(null); getSnapshot() ") {{ filter.name }}
                h5.has-text-weight-semibold.mt-15 Harga
                .filtered-two.mg-2
                    .control
                        button(:class="{'active': filter === 'low'}" @click="filterResult('low')") Rp. 10.000 - Rp. 50.000
                        button(:class="{'active': filter === 'high'}" @click="filterResult('high')") Rp. 50.000 - Rp. 300.000
                h5.has-text-weight-semibold.mt-15 Gender
                .filtered-two.mg-2
                    .control
                        button(:class="{'active': filter === 'female'}" @click="filterResult('female')") Dokter Wanita
                        button(:class="{'active': filter === 'male'}" @click="filterResult('male')") Dokter Pria
                    
                button(@click="snapshot.services = []; getSnapshot()").button.is-fullwidth.is-rounded.is-tosca.mt-10 Cari
        section.sec-search
            h2.section-title Hasil Pencarian
            carousel.sec-0.banner.no-pb(items="1" :nav="false" v-if="snapshotLoaded")
                a(v-for="ads in snapshot.advertisements" :href="ads.backlink")
                    img(:src="ads.picture" )
            .groups-service
                .service_box(v-for="service in snapshot.data" )
                    nuxt-link.b_one(:to="'/service?id='+service.id")
                        .img-ads(v-if="service.premium == 1")
                            img(src="/images/ads.png")
                        .img-wrapper
                            img(:src="service.picture ? service.picture : '/images/default.png' ")
                        h6.f10(v-if="service.distance")
                            span(class="ti-location-pin") 
                            | {{ service.distance.toFixed(2) }} KM
                        .service-rate.f10(v-if="service.rating != '' ")
                            img.star(src="/images/star.png")
                            span  {{ service.rating }} ({{ service.user_rating }})
                    nuxt-link.b_two(:to="'/service?id='+service.id")
                        h6.f12.has-text-weight-semibold {{ service.name.substring(0,30) }}
                        h4.service-name {{ service.group_name }} 
                        h6.f10
                            span.mr-5(class="ti-bag")
                            | {{ $moment().format('YYYY') - service.since }} Tahun
                        h6.f10
                            span.mr-5(class="ti-wallet")
                            | Mulai Rp. {{ formatPrice(service.price) }}
                        h6.f10
                            span.mr-5(class="ti-alarm-clock")
                            span.fn-10(v-for="schedule in service.schedules") {{ schedule.day }} &nbsp;
                    .b_three
                        button
                            img.love(:src="service.favorite == 1 ? '/images/red-love.png' :'/images/default-love.png'" @click="postFavorite(service)")
                        //- button
                        //-     span.ti-heart(:class="{'is-red': favorites.indexOf(service.id) != -1}" @click="postFavorite(service.id)")

        BottomNav
</template>

<script>
import BottomNav from '~/components/BottomNav';
import Header from '~/components/Header';
import carousel from 'v-owl-carousel';

export default {
    middleware: 'member',
    async asyncData({$axios, route, params, store}, query = {
            lat: store.state.location.latitude, 
            long: store.state.location.longitude,
            group_id: route.query.group
        }) {
        const data = await $axios.$get('services', {
            params: query
        });

        const snapshot = data.services;
        const groups = data.groups;
        const love = data.services.favorite;

        return { snapshot, groups, love };
    },
    middleware: "member",
    components: {
        BottomNav,
        carousel,
        Header
    },
    data() {
        return {
            isOpen: false,
            // snapshot: {},
            snapshotLoaded: false,
            isClicked: false,
            filter: {},
            category: "",
            categories: [],
            lat: "",
            long: "",
            q: "",
            minmax: '',
            favorites: [],
            search: '',
        }
    },
    computed: {
        member() {
            return this.$store.state.member;
        },
        filters() {
            return this.$store.state.filters;
        }
    },
    mounted() {
        // this.getCategories();
        // this.getSnapshot();
        // this.getFavorites();

        this.category = this.$route.query.group;
    },
    methods: {
        // async getLocation() {
        //     if (navigator.geolocation) {
        //         await navigator.geolocation.getCurrentPosition((response) => {
        //             this.lat = response.coords.latitude;
        //             this.long = response.coords.longitude;
        //             this.getSnapshot();
        //         }, (error) => {
        //             alert("Harap aktifkan lokasi untuk melihat dokter terdekat");
        //         });
        //     } else {
        //         alert('It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it.');
        //     }
        // },
        searchValue: function(event){
            this.search = event.target.value;
            alert(this.search);
        },
        formatPrice(value) {
            let val = (value/1).toFixed(0).replace('.')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        getCategories() {
            this.$axios.$get("home")
            .then(response => {
                this.categories = response.groups;
            });
        },
        // getFavorites() {
        //     this.$axios.$get("favorites/"+this.member.uid+"?with_detail=true")
        //     .then(response => {
        //         console.log(response)
        //         this.favorites = response;
        //     })
        // },
        async getSearch(event) {
             const data = await this.$options.asyncData(this.$root.$options.context, {
                group_id: this.category,
                filter: event.target.value
            })
            this.snapshot = data.snapshot;
        },
        async getSnapshot() {
            const data = await this.$options.asyncData(this.$root.$options.context, {
                group_id: this.category,
                filter: this.filter
            })
            this.snapshot = data.snapshot;
            // this.$axios.$get("search", {
            //     params: {
            //         q: this.q,
            //         filter: this.filter,
            //         category: this.category ,
            //         lat: this.lat,
            //         lon: this.long,
            //         minmax: this.minmax
            //     }
            // })
            // .then(response => {
                
            //     this.snapshotLoaded = true;
            //     this.snapshot = response;
            //     this.group = response.groups;

            //     this.getFavorites();
            // })
        },
        filterResult(filter) {
            this.filter = filter;
        },
        async postFavorite(service){
            await this.$axios
            .$post("add_favorite", {
                service_id: service.id,
                favorite: service.favorite == 0 ? 1 : 0,
            })
            .then(response => {
                service.favorite = !service.favorite ;
            })
        },
        inArray(item) {
            return this.favorites.indexOf(item) != '-1';
        },
        checkFavorite(id){
            
        }
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/sass/style.sass'
$pd-15: 15px
$pd-10: 10px

.sec-search 
    padding: 0px 15px
    margin-bottom: 4rem

.is-red 
    color: red

.field-search
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1)
    display: flex
    border-radius: 30px
    border: 1px solid #ccc
    margin-bottom: $gap2

    span
        padding: $gap2
    .input
        margin-right: 15px
        margin-top: 0px
        border: none !important
        box-shadow: none !important

.groups-filter
    button 
        width: 65px
        margin-right: 8px

.filter-content 
    .filtered-two 
        background: #f5f5f5
        border-radius: 5px
        overflow-y: scroll
        height: auto
        border: 1px solid #ddd
        .control 
            padding: $gap1
            border-bottom: 1px solid #ddd
            &:last-child
                border-bottom: none

            button
                background-color: transparent
                border: none
                border-bottom: 1px solid #ddd
                display: block
                padding: 10px
                font-size: 12pt
                width: 100%
                cursor: pointer
                text-align: left
            
                &:last-child
                    border-bottom: none

                &.active
                    background-color: $tosca
                    color: white
                    border-radius: 5px


.groups-service
    .service_box
        position: relative
        display: flex
        height: auto
        padding: $gap2
        margin-top: $gap2
        border: 1px solid #ededed
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1)
        border-radius: 10px

        &:first-child
            margin-top: 0
        

        .b_one
            width: 25%

            .service-rate
                display: flex
                justify-content: left

                .star
                    width: 15px
                    height: 15px

                span 
                    margin-left: 5px
                    
            .img-ads
                width: 40px
                z-index: 15 
                top: 0
                left: 0
                position: absolute 
            .img-wrapper
                width: 100%
                
                img 
                    width: 65px
                    border-radius: 50%
                    height: 65px

                @media screen and (min-width: $small)
                    img 
                        margin: 0 auto
                        width: 70%
                        height: 120px
        .b_two
            width: 65%

            .service-name
                font-size: 15px
                color: $tosca
                font-weight: bold
        
        .b_three
            width: 10%
            margin-left: -5px
            button
                border: none
                background: none
                .ti-heart
                    font-size: 25px
                    
    @media screen and (min-width: $small)
        .b_one
            text-align: center

.owl-carousel
    .owl-item
        img 
            display: block
            width: 100%
            height: 7rem  

.pd-10
    padding: 10px
.pt-10
    padding: 10px

.mt-15
    margin-top: 15px

.mt-10
    margin-top: 10px
.f10
    font-size: 10pt
.mr-5
    margin-right: 5px
.mg-2
    margin-top: $gap2

span.active
    color: red
        
</style>