<template lang="pug">
    .header
        h2.has-text-white {{ this.$route.name === 'search' ? 'Cari' : '' }}
        h2.has-text-white {{ this.$route.name === 'queue' ? 'Antrian' : '' }}
        h2.has-text-white {{ this.$route.name === 'favorite' ? 'Favorit' : '' }}
        h2.has-text-white {{ this.$route.name === 'profile' ? 'Profil Saya' : '' }}
        h2.has-text-white {{ this.$route.name === 'history' ? 'Riwayat' : '' }}
        h2.has-text-white {{ this.$route.name === 'service' ? 'Layanan' : '' }}
        h2.has-text-white {{ this.$route.name === 'update' ? 'Edit Profil' : '' }}
        h2.has-text-white {{ this.$route.name === 'appointment' ? 'Buat Janji' : '' }}
        div(v-if="title === 'index'")
            img(src="images/logo.png")
</template>

<script>
export default {
    data() {
        return {
            active: 0,
            title: this.$route.name,
        }
    },
    computed: {
        back() {
            this.$router.back()
        }
    },
    mounted() {
    }
}
</script>

<style lang="sass">
@import '~/assets/sass/style.sass';

.header
  width: 100%
  z-index: 9
  background-color: $tosca
  color: #fff
  height: 60px
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1)
  display: flex
  justify-content: center
  align-items: center
  img
      height: 35px

</style>
