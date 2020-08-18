<template lang="pug">
.wrapper
  Header
  section.sec-1(v-if="snapshotLoaded") 
    .total-rate
      .checkbox-feature
        input#1(type='checkbox' v-model="tipeRate" value="1" @click="getStar(1)")
        label.checkbox(for='1')
          span.ti-star 
          h6.title-rate 1 (100) 
      .checkbox-feature
        input#2(type='checkbox' v-model="tipeRate" value="2")
        label.checkbox(for='2')
          span.ti-star
          h6.title-rate 2 (100) 
      .checkbox-feature
        input#3(type='checkbox' v-model="tipeRate" value="3")
        label.checkbox(for='3')
          span.ti-star
          h6.title-rate 3 (100) 
      .checkbox-feature
        input#4(type='checkbox' v-model="tipeRate"  value="4")
        label.checkbox(for='4')
          span.ti-star
          h6.title-rate 4 (100) 
      .checkbox-feature
        input#5(type='checkbox' v-model="tipeRate" value="5")
        label.checkbox(for='5')
          span.ti-star
          h6.title-rate 5 (100) 
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
          progress.progress.is-small.is-warning(:value="rates.total / snapshot.user_rating * 100" :max="100")
          |&nbsp;&nbsp;
          .numb.text-muted {{ (rates.total / snapshot.user_rating * 100).toFixed() }}%
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
        rate: []
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
      rateTipe: []
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
    getStar(star){
    
    },
     check: function(e) {
      if (e.target.checked) {
        console.log(e.target.value)
      }
    },
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

.total-rate
  display: flex
  justify-content: space-between
  margin-bottom: $gap2

  .checkbox-feature 
    width: 100%
    border-radius: 4px
    margin-left: 4px
    margin-right: 4px

    .ti-star 
      font-size: 30px
      color: $yellow

    .title-rate
      font-weight: 600
      font-size: 14px

    label.checkbox 
      display: inline-block
      cursor: pointer
      padding: 10px 0px
      width: 100%
      height: 80px
      text-align: center
      border: 1px solid #ccc
      color: #000
      border-radius: 4px

    input[type=checkbox]:checked + label.checkbox 
        border: 1px solid #ccc
        background: $grey

    input[type=checkbox] 
        display: none
      
.rate-user
  display: flex
  justify-content: space-between

  .progress
    width: 150px
    margin-bottom: 0.50rem 
    
  .numb 
    font-size: 15px
    margin-top: -5px
    width: 25px

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