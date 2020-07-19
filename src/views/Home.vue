<template>
    <v-content class="style">
        <v-row align="center" justify="center" class="mx-5">
            <v-col class="text-center" lg="8" md="8" sm="12">
              <v-img class="mt-10 pt-5" width="125" height="63" :src="logo"></v-img>
              <p class="white--text title" >Login to your account</p>
              <v-text-field placeholder="Email Address" v-model="email" solo></v-text-field>
              <v-text-field placeholder="Password" v-model="password" type="password" solo></v-text-field>

              <v-btn @click="login" :loading="loading" color="#ff0000" large block class="white--text"><span>Login</span></v-btn> <br>
              <v-btn @click="SignUp" text large block class="black--text"><span>Create Account</span></v-btn>
              <v-btn @click="cancel" text large block class="black--text"><span>Or return to homepage</span></v-btn>
            </v-col>
        </v-row>

        <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
        >
            {{ text }}
            <v-btn
            color="primary"
            text
            @click="snackbar = false"
            >
            Close
            </v-btn>
        </v-snackbar>
    </v-content>
</template>

<script>
import firebase from 'firebase'
import db from '../main'

export default {
  name: 'Home',
  components: {
  },
  data: () => ({
    logo: require('../assets/logo.png'),
    loading: false,
    snackbar: false,
    text: '',
    timeout: 2500,
    email: '',
    password: ''
  }),
  methods: {
    login () {
      this.loading = true
      if (this.email === '' && this.password === '') {
        this.text = 'Input login credentials'
        this.snackbar = true
        this.loading = false
      }
      if (this.email === 'info@titanfx.com.ng' && this.password === 'Kenya007') {
        this.$router.replace({ name: 'AdminDashboard' })
      } else {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(data => {
            this.userID = data.user.uid
            db.collection('users').doc(data.user.uid).get().then((doc) => {
              if (doc.exists) {
                this.$router.replace({ name: 'UserDashboard', params: { id: data.user.uid, user: doc.data() } })
              } else {
                // doc.data() will be undefined in this case
                console.log('No such document!')
                this.loading = false
                this.text = 'No such User!'
                this.snackbar = true
              }
            }).catch(function (error) {
              console.log('Error getting document:', error)
            })
          }).catch(err => {
            this.loading = false
            this.text = err.message
            this.snackbar = true
          })
      }
    },
    SignUp () {
      this.$router.push({ name: 'SignUp' })
    },
    cancel () {
      window.open('http://titanfx.com.ng')
    }
  }
}
</script>

<style scoped>
  .style {
    background-color: white
  }
</style>
