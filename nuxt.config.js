require('dotenv').config();


export default {
  mode: 'spa',
  router: {
    linkActiveClass: 'active-link'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/images/icon-app.png' },
      { rel: "icon-app", href: '/images/icons/icon-48x48.png' },
      { rel: "apple-touch-icon", sizes: "72x72", href: "/images/icons/icon-72x72.png"},
      { rel: "apple-touch-icon", sizes: "96x96", href: "/images/icons/icon-96x96.png"},
      { rel: "apple-touch-icon",  sizes: "192x192", href: "/images/icons/icon-192x192.png"},
      
    ],
    script: [
      { src: 'https://apis.google.com/js/platform.js', async: true, defer: true },
      // { src: 'https://connect.facebook.net/id_ID/sdk.js#xfbml=1&version=v7.0&appId=627965421408473&autoLogAppEvents=1', async: true, defer: true, crossorigin: "anonymous", nonce: "5S9caF1g" },
    ],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'static/themify-icons.css',
    'assets/sass/style.sass',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    'plugins/firebase.js',
    'plugins/axios.js',
    'plugins/authentication.js',
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/modules/tree/master/packages/bulma
    '@nuxtjs/bulma',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/moment'
  ],
  pwa: {
    manifest: {
      name: 'Yoyaku ID',
      short_name: 'Yoyaku',
      lang: 'id',
      display: 'standalone',
      icons: [
        {
          'src': '/images/icons/icon-96x96.png',
            'sizes': '96x96',
            'type': 'image/png',
        },
        {
            'src': '/images/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png',
        },
        {
          'src': '/images/icons/icon-512x512.png',
          'sizes': '512x512',
          'type': 'image/png',
        },
    ],
    },
  },
  auth: {
    plugins: [
      '~/plugins/auth.js'
    ],
    strategies: {
      google: {
        client_id: "94291935431-r1h7unrmi59ug80p6uegkoc195vg5btb.apps.googleusercontent.com",
        userinfo_endpoint: false,
      },
      facebook: {
        client_id: '627965421408473',
        userinfo_endpoint: 'https://graph.facebook.com/v2.12/me?fields=about,name,picture{url},email,birthday',
        scope: ['public_profile', 'email', 'user_birthday']
      },
      'laravel.passport': {
        url: 'http://localhost/antrian/public/api/social_login',
        client_id: 1,
        client_secret: 'xUVXhO7nOPQ8Xx9xGUuqdUIEZhTVJBy4K6efkR1g'
      },
      redirect: {
        home:"/userdata"
      },
      rewriteRedirects: false,
      local: {
        endpoints: {
          user: false,
          login: { 
            url: 'http://localhost/antrian/public/api/social_login',
            method: 'post',
            propertyName: 'access_token' 
          },
          logout: {
            url: 'https://localhost/yoyaku_php/public/api/v1/auth/login',
            method: 'post'
          }
        },
      }
    }
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: process.env.API_URL
    // baseURL: process.env.API_URL || "http://192.168.1.120/yoyaku_id/public/api/v1/"
  },
  server: {
    host: process.env.SERVER_IP,
    port: 2100
  },
  /*
  ** Build configuration
  */

  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    filenames: {
      app: ({ isDev }) => isDev ? '[name].[hash].js' : '[chunkhash].js',
      chunk: ({ isDev }) => isDev ? '[name].[hash].js' : '[chunkhash].js'
    },
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
