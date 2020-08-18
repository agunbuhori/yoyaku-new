<template lang="pug">
    .wrapper
        Header
        div(v-if="snapshotLoaded")
            carousel.sec-0.no-pb(items="1" :nav="false" v-if="snapshotLoaded")
                a(v-for="adver in snapshot.advertisements" :href="adver.backlink")
                    img(:src="'http://localhost/yoyaku-laravel/public/'+ adver.picture" )

            section.sec-home
                h2.section-title Spesialis
                .specialis
                    .menus
                        div(v-for="(group, $index) in snapshot.groups")
                            .item.centered.dir-column(@click="filterGroup(group.id)")
                                img(:src="group.picture")
                                span {{ group.name }}
        section.sec-1
            h2.has-text-weight-bold Berita
            .categories
                a.item(class="active")
                    span Semua Berita
                //- a.item(:class="{'active': activeCategory === $index}" v-for="(category, $index) in categories" @click="activeCategory = $index")
                //-     span(v-html="category.name")
            .news
                .item(v-for="post in posts")
                    a(:href="post.link")
                        .news__img(:style="'background-image: url('+post.better_featured_image.media_details.sizes.medium.source_url+');'")
                    .info
                        span {{ post.date | moment }}
                        br
                        a(:href="post.link") {{ post.title.rendered.substring(0,35)+".." }}
        BottomNav
</template>

<script>
import moment from 'moment';
import BottomNav from '~/components/BottomNav';
import carousel from 'v-owl-carousel';
import Header from '~/components/Header';

export default {
    components: {
        BottomNav,
        carousel,
        Header
    },
    filters: {
        moment: function (date) {
        return moment(date).format('DD-MM-YYYY');
        }
    },
    data() {
        return {
            snapshot: {},
            snapshotLoaded: true,
            categories: [],
            activeCategory: 0,
            posts: [],
            homes: [],
        }
    },
    computed: {
        // authentication() {
        //     return this.$store.state.authentication
        // }
    },
    mounted() {
        this.getSnapshot();
        this.getLocation();
        this.getPostCategories();
        this.getPosts();
    },
    methods: {
        filterGroup(group_id) {
            location.href = '/search?group='+ group_id;
            this.filter = filter;
        },
        async getSnapshot() {
            await this.$axios.get("home")
            .then(response => {
                const {status, data} = response;
                
                if (status === 200) {
                    this.snapshotLoaded = true;
                    this.snapshot = data;

                    let groupLength = data.groups.length + 1;
                }
            })
        },
        async getPostCategories() {
            await this.$axios.get("https://news.yoyaku.id/wp-json/wp/v2/categories")
            .then(response => {
                const {status, data} = response;
            
                if (status === 200) {
                    this.categories = data;

                }
            })
        },
        async getPosts() {
            await this.$axios.get("https://news.yoyaku.id/wp-json/wp/v2/posts")
            .then(response => {
                const {status, data} = response;

                if (status === 200) {
                    this.posts = data;
                }
            })
        },
        async getLocation() {
            if (navigator.geolocation) {
                await navigator.geolocation.getCurrentPosition((response) => {
                    const {latitude, longitude} = response.coords;
                    this.$store.commit('setLocation', {latitude, longitude});
                }, (error) => {
                    alert("Harap aktifkan lokasi untuk melihat dokter terdekat");
                });
            } else {
                alert('It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it.');
            }
        },
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/sass/style.sass';
$box: 90px
$item: 150px
$padding-item: 10px

.sec-1
    .faded
        display: inline-block
        background-color: red
        width: $gap2*1.5
        height: $box
        position: absolute
        right: 0
        transform: translateY(-100%)
        background: -moz-linear-gradient(left, rgba(255,255,255,0), rgba(255,255,255, 1))
        background: -webkit-linear-gradient(left, rgba(255,255,255,0), rgba(255,255,255, 1))
.specialis
    margin-right: -$gap2
    overflow-y: hidden
    position: relative
    overflow-x: scroll
    .menus
        width: auto
        margin-right: $gap2
        display: flex
        .item
            width: $box
            height: $box
            background-color: $light-tosca
            flex: 0 0 $box
            margin-right: $gap2
            font-weight: 500
            border-radius: $br1

            span
                font-weight: bold
                color: #000
                font-size: 10pt

            img
                height: 50px
                margin-bottom: 5px

            &:last-child
            
.categories 
    display: flex
    overflow-x: scroll
    border-radius: $br1
    margin-bottom: $gap2

    .item
        text-align: center
        padding: $padding-item
        width: $item
        height: auto
        white-space: nowrap
        color: grey
        border-bottom: 2px solid #f5f5f5 
        font-weight: 500
        font-size: 13px

        &.active 
            border-bottom: 2px solid $tosca 
            color: $tosca 
       
.news
    display: flex
    flex-wrap: wrap
    margin: 0 -5px

    &__img
        width: 100%
        border-radius: $br1
        height: 120px
        background-size: cover
        margin-bottom: 10px

    @media screen and (min-width: $small)
         &__img
            width: 100%
            border-radius: $br1
            height: 150px
            background-size: cover
            margin-bottom: 10px

    .item
        margin-left: 5px
        margin-right: 5px
        flex-grow: 1
        width: 40%
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
.sec-home 
    padding-top: 0px
    margin-top: -13px

</style> 