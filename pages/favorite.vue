<template lang="pug">
     .wrapper
        Header
        section.sec-1
            h2.section-title Favorit
            h4.separator {{ snapshot.services.data.length }} Favorit
            .groups-service(v-if="snapshotLoaded")
                .service_box(v-for="(favorite, $index) in snapshot.services.data")
                    nuxt-link.b_one(:to="'/service?id='+favorite.id")
                        .img-wrapper
                            img(:src="favorite.picture ? favorite.picture : '/images/default.png' ")
                        h6.f10
                            span(class="ti-location-pin") 
                            | {{ favorite.KM }}  KM
                        h6.f10
                            span(class="ti-star")
                            | 4.5 (200)
                    nuxt-link.b_two(:to="'/service?id='+favorite.id")
                        h6.f12.has-text-weight-semibold {{ favorite.name.substring(0,25)+".." }}
                        h4.service-name {{ favorite.name.substring(0,20)+".." }} 
                        h6.f10
                            span.mr-5(class="ti-bag")
                            | {{ favorite.since }} Tahun Pengalaman
                        h6.f10
                            span.mr-5(class="ti-money")
                            | Mulai dari Rp. {{favorite.premium_price }}
                        h6.f10
                            span.mr-5(class="ti-alarm-clock")
                            span.fn-10(v-for="schedule in favorite.schedules") {{ schedule.day }}&nbsp;
                    .b_three
                        button
                            span.ti-heart(:class="{'is-red': true}" @click="postFavorite(favorite.id, $index)")
            BottomNav       
</template>

<script>
    import BottomNav from '~/components/BottomNav';
    import Header from '~/components/Header';

    export default {
    middleware: 'member',
    components: {
        BottomNav,
        Header
    },
    async asyncData({$axios, params, store}, query = {}) {
        const data = await $axios.$get('favorites', {
            params: query
        });

        const snapshot = data;
        const snapshotLoaded = true;

        return { snapshot, snapshotLoaded };
    },
    data() {
        return {
            snapshot: {},
            snapshotLoaded: false,
            isClicked: false,
            favorites: []
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
        // this.getFavorites();
    },
    methods: {
        getFavorites() {
            this.$axios.$get("favorites/"+this.member.uid+"?with_detail=true")
            .then(response => {
                this.snapshot = response;
            })
        },
        async postFavorite(id, index) {
            await this.$axios.$post('add_favorite', {
                service_id: id,
                favorite: 0,
            })
            .then(response => {
                this.snapshot.services.data.splice(index, 1);
            })
        },
        inArray(item) {
            return this.favorites.indexOf(item) != '-1';
        },
    }
}
</script>

<style lang="sass" scoped> 
    @import '~/assets/sass/style.sass'
    $pd-15: 15px
    $pd-10: 10px

    .is-red 
        color: red

    .separator 
        margin-top: $gap2
        display: flex
        align-items: center
        text-align: center
        color: grey
        margin-bottom: $gap2

        &:before, &:after 
            content: ''
            flex: 1
            border-bottom: 1px solid grey
        

        &:before 
            margin-right: .25em
        
        &:after 
            margin-left: .25em

    .groups-service
        .service_box
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
                .img-wrapper
                    width: 100%
                    img 
                        width: 65px
                        border-radius: 40px
                        height: 65px
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

                

    .pd-10
        padding: 10px
    .pt-10
        padding: 10px
    .mt-10
        margin-top: 10px
    .f10
        font-size: 10pt
    .mr-5
        margin-right: 5px
    .mg-2
        margin-top: $gap2
        
</style>