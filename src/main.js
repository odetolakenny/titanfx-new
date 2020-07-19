import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import firebase from 'firebase'

Vue.config.productionTip = false

const db = firebase.initializeApp({
  apiKey: 'AIzaSyAMXCwfhknGvtRQOEf7sFG5KOs_r_S8fmI',
  authDomain: 'titanfx-6ae67.firebaseapp.com',
  databaseURL: 'https://titanfx-6ae67.firebaseio.com',
  projectId: 'titanfx-6ae67',
  storageBucket: 'titanfx-6ae67.appspot.com',
  messagingSenderId: '12003135777',
  appId: '1:12003135777:web:46706572e56fe37f5f6e60'
}).firestore()

export default db

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
