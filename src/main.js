// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import Meta from 'vue-meta'
import 'vue2-dropzone/dist/vue2Dropzone.css'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import { store } from './store/store'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faLocationArrow,
  faCheck,
  faWind,
  faHome,
  faSun,
  faEnvelope,
  faMoon,
  faInfoCircle,
  faLightbulb,
  faTrash,
  faSpinner,
  faSignOutAlt,
  faCloud,
  faCloudUploadAlt,
  faChartArea,
  faClipboardCheck
} from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import Vuelidate from 'vuelidate'

library.add(faWind)
library.add(faLocationArrow)
library.add(faHome)
library.add(faEnvelope)
library.add(faMoon)
library.add(faInfoCircle)
library.add(faLightbulb)
library.add(faCheck)
library.add(faSun)
library.add(faTrash)
library.add(faSpinner)
library.add(faSignOutAlt)
library.add(faCloud)
library.add(faChartArea)
library.add(faClipboardCheck)
library.add(faCloudUploadAlt)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  databaseURL: process.env.FB_DATABASE_URL,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.envFB_MSG_SENDER_ID
}

firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()

firebase.auth().onAuthStateChanged(function (user) {
  store.dispatch('setUser')
  // eslint-disable-next-line no-new
  new Vue({
    el: '#app',
    store: store,
    router: router,
    render: h => h(App)
  })
})

Vue.use(Vuelidate)
Vue.use(BootstrapVue)
Vue.use(Meta)
