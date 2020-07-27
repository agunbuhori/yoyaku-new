<template lang="pug">
.wrapper
  Header
  section.sec-1(v-if="snapshotLoaded") 
    .rate-user
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
          progress.progress.is-small.is-warning(:value="rates.rate" max="100")
          |&nbsp;&nbsp;
          .numb.text-muted {{ rates.total }}
  section.sec-2
    .comment(v-for="comment in snapshot.comments")
      h5.has-text-weight-semibold {{ comment.user }}
      .d-rate
        star-rating(v-bind:max-rating="5"
        inactive-color="#c1c1c1"
        active-color="#ffc53e"
        :rating="comment.rating"
        :increment="comment.rating"
        v-bind:star-size="15" :read-only="true" :show-rating="false")
        span.text-muted {{ comment.checking_time }}
      p {{ comment.critic }}
</template>

<script>
import StarRating from "vue-star-rating";
import BottomNav from "~/components/BottomNav";
import Header from "~/components/Header";

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
    formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
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
    
.rate-user
  display: flex
  justify-content: space-between

  .progress
    margin-bottom: 0.75rem 
    
  .numb 
    font-size: 15px
    margin-top: -5px

.comment 
  margin-top: $gap2
  p
    font-size: 13px

.gap-1
    margin-top: $gap1

.gap-2
    margin-top: $gap2

.d-rate
  display: flex
  justify-content: space-between
  width: 60%
  text-align: left
</style>