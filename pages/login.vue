<template lang="pug">
    section
        .wrapper-login.login
            .column.is-narrow
            .image-wrapper
                img(src="/images/logo-tosca.png")
            //- .number-login
            //-     .field
            //-         //- label.label.is-size-7.has-text-navy Masuk menggunakan Whatsapp
            //-             //- p.control.has-icons-left
            //-             //- input.input(type='number' placeholder='0812-XXXX-XXXX' v-mask='mask')
            //-             span.icon.is-left
            //-                 //- ion-icon(name="logo-whatsapp")
            .group-button.gap-2
                a(href="https://wa.me/?text=login yoyaku").button.is-wa
                    img(src="/images/whatsapp.png" width="20")
                    span &nbsp; Masuk dengan WhatsApp
                button#google.button.is-go
                    img(src="/images/google.png" width="20")
                    span &nbsp; Masuk dengan Google
                //- button.button.is-fb(@click="socialLogin('facebook')")
                //-     img(src="/images/facebook.png" width="20")
                //-     span &nbsp; Masuk dengan Facebook


                
</template>

<script>
import googleSignIn from "google-signin-vue/src/googleSignIn.vue";

export default {
  components: {
    googleSignIn
  },
  data: () => {
    return {
      mask: "###-###-###"
    };
  },
  mounted() {
    this.checkAuthentication();
    this.startGapi();
  },
  methods: {
    checkAuthentication() {
      
    },
    async changeAuth(auth) {
      try {
        let authenticate = await this.$auth.loginWith("local", {
          data: {
            name: auth.getName(),
            email: auth.getEmail(),
            id: auth.getId()
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
    startGapi() {
      const _vn = this;
      function attachSignin(element) {
        auth2.attachClickHandler(
          element,
          {},
          function(googleUser) {
            _vn.changeAuth(googleUser.getBasicProfile());
          },
          function(error) {
          }
        );
      }

      gapi.load("auth2", function() {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        window.auth2 = gapi.auth2.init({
          client_id:
            "94291935431-r1h7unrmi59ug80p6uegkoc195vg5btb.apps.googleusercontent.com",
          cookiepolicy: "single_host_origin",
          scope: "profile email"
          //   ux_mode: "redirect"
          // Request scopes in addition to 'profile' and 'email'
          //scope: 'additional_scope'
        });
        attachSignin(document.getElementById("google"));
      });
    },
    getSuccessData: function(google) {
      console.log(google);
    },
    getFailureData: function(error) {
      console.log(error);
    }
  }
};
</script>

<style lang="sass">
@import '~/assets/sass/style.sass'

$space-content : 20px

.wrapper-login
    text-align: center
    width: 100%
    height: 100%
    position: absolute
    background: white

    h3
        color: white

.container-login
    text-align: center
    width: 100%
    height: 100%
    position: absolute
    padding: $gap2


.login
    text-alugn: center
    margin: 0 auto
    .image-wrapper
        margin-top: 4rem
        display: flex
        justify-content: center
        align-items: center
        text-align: center

        img
            width: 100%
            max-width: 600px
            padding: $gap2



    .group-button
        padding-top: 8rem
        width: 100%
        max-width: 600px
        margin: 0 auto
        justify-content: space-between
        padding-bottom: $space-content

        .is-wa
            background: #4fce5d
            color: #fff

        .is-go
            background: #DB4A39
            color: #fff

        .is-fb
            background: #3b5998
            color: #fff

        button
           margin-top: $gap1
           width: 100%
           height: 3.5rem

           img
               float: left

        a
            height: 3.5rem
            width: 100%

        .field
            margin-bottom: 0 !important


        .separator
            display: flex
            align-items: center
            text-align: center
            margin-top: 10px
            color: #7a7a7a


        .separator::before, .separator::after
            content: ''
            flex: 1
            border-bottom: 1px solid #b5b5b5

.text-center
    text-align: center
    font-weight: bold
    font-size: 25px

.bg-tosca
    background-color: $tosca

.gap-2
    padding: $gap2

.mt-2
    margin-top: $gap2
</style>
