<template lang="pug">
    .wrapper-admin.bg-light
        section
            .menu_head
                //- .menu__logout
                //-     button.logout(@click="logout()") Logout
                .menu__image
                    img(:src="admin.picture")
                    br
                    h3.section-title {{ admin.name }}
                    button.button.is-rounded.mt-g1 {{ admin.group_name }}
        section.sec-2
            .menu-groups
                .item 
                    nuxt-link(to="/admin/queue-today")
                        .item__image
                            img(src="/images/menu-dokter/today.png")
                        h6 Antrian Hari Ini
                .item 
                    nuxt-link(to="/admin/queue-week")
                        .item__image
                            img(src="/images/menu-dokter/daftar_pasien.png")
                        h6 Daftar Antrian
            .menu-groups(@click="openOffline(admin.id)")
                .item
                    .item__image
                        img(:src="isOpen == 1 ? '/images/menu-dokter/offline-on.png' : '/images/menu-dokter/offline-off.png'")
                    h6 Akses Form
                .item 
                    nuxt-link(to="/admin/history")
                        .item__image
                            img(src="/images/menu-dokter/history.png")
                        h6 Riwayat
            .menu-groups
                .item 
                    nuxt-link(to="/admin/setting")
                        .item__image
                            img(src="/images/menu-dokter/setting.png")
                        h6 Pengaturan
                .item 
                    .logout(@click="logout")
                        .item__image
                            img(src="/images/logout2.png")
                        h6 Logout

                //- .item 
                //-     nuxt-link(to="/admin/history-premium")
                //-         .item__image
                //-             img(src="/images/menu-dokter/premium.png")
                //-         h6 Premium
               

</template>

<script>

export default {
    components: {
    },
    data() {
        return {
            isOpen: false,
            showContent: {
                0: true,
            },
        }
    },
    computed: {
        authentication() {
            return this.$store.getters.loggedInUser
        },
        admin() {
            return this.$store.state.admin;
        }
    },
    mounted() {
        this.getSnapshot()
    },
    methods: {
            openOffline(id) {
                this.$axios.post("open", {
                   service_id: id,
                   open: this.isOpen ? 0 : 1,
                })
                .then(response => {
                    this.isOpen = ! this.isOpen;
                });
            },
            logout() {
                localStorage.removeItem('admin');
                window.location.href = "/admin/signin";
            },
            getSnapshot(){
                 this.$axios.$get("schedules?service_id="+this.admin.id)
                .then(response => {
                    if (response.open == 1)
                        this.isOpen = 1;
                });
            },
        }
    }
</script>

<style lang="sass" scoped>
@import '~/assets/sass/style.sass';

.bg-light
    background: #F7F9FB

.menu_head
    top: 0
    display: flex
    background: white
    justify-content: center
    text-align: center
    border-bottom: 2px solid #f5f5f5
    margin-top: $gap2
    padding-bottom: $gap2

    .menu__logout
        padding-top: $gap2
        padding-left: $gap1
        width: 8%

    .menu__image
        margin: 0 auto
        justify-content: center
        align-items: center
        width: 92%
        margin-left: -10px
        img 
            border-radius: 50%
            width: 135px
            height: 135px

.menu-groups
    display: flex
    justify-content: space-between
    max-width: 100%
    margin-top: $gap1

    .item
        margin-left: 10px
        margin-right: 10px
        background: white
        width: 45%
        height: auto
        padding: $gap2
        border: 1pz solid #f5f5f5
        border-radius: 10px
        text-align: center
        justify-content: center

        h6 
            font-weight: 700
            font-size: 16px
            margin-top: $gap2 
            color: #000

        &__image
            justify-content: center
            align-items: center
            img 
                border-radius: 50%
                width: 70px
                height: 70px
.red
    color: $red

.mt-g1
    margin-top: $gap1

.mt-g2
    margin-top: $gap2

</style> 