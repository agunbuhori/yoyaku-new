<template lang="pug">
    .bottom-nav
        nuxt-link.bottom-nav__link(:to="nav.path" v-for="(nav, $index) in navs" :class="{'active': activePath === nav.path}" :key="$index")
            span.icon(:class="nav.icon")
            span.title {{ nav.title }}
</template>

<script>
export default {
    data() {
        return {
            active: 0,
            navs: [
                {icon: 'ti-home', title: 'Beranda', path: '/'},
                {icon: 'ti-alarm-clock', title: 'Antrian', path: '/queue'},
                {icon: 'ti-search', title: 'Cari', path: '/search'},
                {icon: 'ti-heart', title: 'Favorit', path: '/favorite'},
                {icon: 'ti-user', title: 'Profil', path: '/profile'},
            ]
        }
    },
    computed: {
        activePath() {
            return this.$route.path;
        }
    },
    mounted() {

    }
}
</script>

<style lang="sass">
@import '~/assets/sass/style.sass';
.bottom-nav 
    height: 60px;
    display: flex;
    justify-content: space-around;
    background-color: #f9f9fa;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 600px;
    z-index: 99;
    padding-top: 7px;

    &__link
        display: flex
        height: $nav-height
        flex-direction: column
        justify-content: center
        align-items: center
        color: #333
        .icon
            transition: 0.2s
            font-size: 20px
            margin-bottom: 2.5px
        .title
            transition: 0.2s
            font-size: 11px

        &.active span
            color: $tosca
</style>