<template lang="pug">
.wrapper
  Header
  section.sec-tosca(v-if="snapshotLoaded") 
    .profile-services
      .pict
        img(:src="snapshot.picture ? snapshot.picture : '/images/default.png' ")
        .favorite
          button
            span.ti-heart(
              @click="postfavorite(snapshot.id)",
              :style="snapshot.favorite ? { color: 'red' } : null"
            )
      h5.title-service.gap-2 {{ snapshot.name }}
      //- h5.f14-service {{ group.name }}
      .d-flex.gap-2
        h5.f14-service(v-if="snapshot.rating != '' ")
          span.mr-5.ti-star
          | {{ snapshot.rating }} ({{ snapshot.user_rating }})
        h5.f14-service
          span.mr-5.ti-bag
          | {{ $moment().format('YYYY') - snapshot.since }} Tahun
      h5.f14-service.gap-2 Biaya Mulai Rp. {{ formatPrice(snapshot.price) }}
  section.sec-2
    .desc-service
      h5.f14 Jam Operasional
      table.gap-1
        tr(v-for="schedule in snapshot.schedules")
          td {{ schedule.day }}
          td {{ $moment(schedule.time_start, 'HH:mm:ss').format('HH:mm') }} - {{ $moment(schedule.time_end, 'HH:mm:ss').format('HH:mm') }}
      h5.f14.gap-1 Alamat
      h5.f12-desc {{ snapshot.address }}
      h5.f14.gap-1 Tentang
      h5.f12-desc {{ snapshot.description }}
      h5.f14.gap-1(v-if="snapshot.rating != '' ") Rating
      .rate-user.mb-2.gap-2(v-if="snapshot.rating != '' ")
        .div.has-text-centered
          .f30.has-text-weight-semibold {{ snapshot.rating }}
          star-rating(v-bind:max-rating="5"
          inactive-color="#c1c1c1"
          active-color="#ffc53e"
          :rating="snapshot.rating"
          :increment="snapshot.rating"
          v-bind:star-size="25" :read-only="true" :show-rating="false")
          h4.text-muted ({{ snapshot.user_rating }})
        .div.gap-1(style="width: 60%")
          .rate-user(v-for="rates in snapshot.rating_data")
            .numb {{ rates.rate }}
            |&nbsp;&nbsp;
            progress.progress.is-small.is-warning(:value="rates.total / snapshot.user_rating * 100")
            |&nbsp;&nbsp;
            .numb.text-muted {{ rates.total / snapshot.user_rating * 100 }}%
          nuxt-link(:to="'/comment?id='+snapshot.id") 
            h5.has-text-right.text-muted  Lihat Komentar 
              span.ti-angle-right
    .btn-appointment(@click="check()")
      button.button.is-tosca.is-medium.is-fullwidth.is-rounded
          span.mr-5.ti-calendar
          | Buat Janji
    .check-modal
      .modal.ph2(v-bind:class="{'is-active':isHide}")
          .modal-background
          .modal-card
              .modal-card-body.body-modal
                  h4.has-text-weight-bold.centered  Harap Lengkapi profil terlebih dahulu
                  div.gap-1
                    nuxt-link(to="/profile")
                      button.mr-10.button.is-tosca.is-fullwidth Ke halaman Profil
</template>

<script>
import StarRating from "vue-star-rating";
import BottomNav from "~/components/BottomNav";
import Header from "~/components/Header";
import member from '~/middleware/member';

export default {
  async asyncData({ $axios, params, store, route }) {
    const { latitude, longitude } = store.state.location;
    const snapshot = await $axios.$get("service/" + route.query.id, {
      params: {
        lat: latitude,
        long: longitude,
      },
    });

    return { snapshot };
  },
  middleware: "member",
  components: {
    BottomNav,
    Header,
    StarRating,
  },
  data() {
    return {
      // snapshot: {},
      snapshotLoaded: true,
      isClicked: false,
      favorite: {},
      liked: false,
      isHide: false,
    };
  },
  computed: {
    member() {
      return this.$store.state.member;
    },
  },
  async mounted() {
    // await this.getSnapshot();
  },
  methods: {
    check(){
      this.$axios.$get('profile')
      .then(response => {
        if(response.member.gender || response.member.age || response.member.whatsapp || response.member.address  != null){
          this.isHide = false;
          window.location.href = '/appointment?id=' + this.$route.query.id;
        }else {
          this.isHide = true;
        }
      })
    },
    formatPrice(value) {
        let val = (value/1).toFixed(0).replace('.')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    async getSnapshot() {
      await this.$axios
        .$get("service/" + this.$route.query.id)
        .then((response) => {
          this.snapshotLoaded = true;
          this.snapshot = response;
        });
    },
    async postfavorite(id) {
      await this.$axios
        .$post("add_favorite", {
          service_id: id,
          favorite: this.snapshot.favorite ? 0 : 1,
        })
        .then((response) => {
          this.snapshot.favorite = !this.snapshot.favorite;
        });
    },
  },
}
</script>

<style lang="sass" scoped> 
@import '~/assets/sass/style.sass';

.is-red 
    color: red

.sec-tosca
    background-color: $tosca
.profile-services
    .pict
        display: flex
        justify-content: center
        align-items: center
        img 
            border-radius: 50%
            width: 135px
            height: 135px
        .favorite 
            background-color: white
            width: 50px
            height: 50px
            border-radius: 50%
            margin-left: -30px
            margin-top: 85px
            text-align: center
            padding-top: 8px
            button 
                border: none
                background: none

                .ti-heart
                    color: #ccc
                    font-size: 30px

.desc-service
    table
        width: 100%
        tr
            td
                padding-bottom: 5px
.rate-user
  display: flex
  justify-content: space-between

  .progress
    margin-bottom: 0.50rem 
    
  .numb 
    font-size: 15px
    margin-top: -5px

.btn-appointment
    width: 90%
    position: fixed
    bottom: 0
    left: 0
    margin-bottom: $gap2
    z-index: 10
    margin-left: 5%
    
@media screen and (min-width: $small)
  .btn-appointment
    width: 53%
    position: fixed
    bottom: 0
    left: 0
    margin-bottom: $gap2
    z-index: 10
    margin-left: 25%


.title-service
    font-size: 16pt
    color: white
    text-align: center

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

.mr-5 
    margin-right: 5px

.mb-2
  margin-bottom: $gap2

.d-flex
    display: flex
    justify-content: space-around
</style>