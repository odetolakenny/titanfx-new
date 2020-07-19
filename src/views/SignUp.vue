<template>
    <v-content>
        <v-row align="center" justify="center" class="mx-5">
            <v-col class="text-center" lg="8" md="8" sm="12">
              <v-img class="mt-10 pt-5" width="125" height="63" :src="logo"></v-img>
              <p class="white--text title" >Login to your account</p>
              <v-text-field placeholder="Full Name" v-model="name" solo></v-text-field>
              <v-text-field placeholder="Email Address" v-model="email" solo></v-text-field>
              <v-text-field placeholder="Preferred password" v-model="password" type="password" solo></v-text-field>
              <v-text-field placeholder="Phone Number" v-model="phoneNumber" solo></v-text-field>
              <v-text-field placeholder="Bank Name" v-model="bankName" solo></v-text-field>
              <v-text-field placeholder="Bank Account Number" v-model="bankAccountNumber" solo></v-text-field>
              <v-select :items="plans" v-model="plan" label="Investment Plan" solo></v-select>
              <v-select :items="durations" v-model="duration" label="Duration of Plan" solo></v-select>
              <p class="caption font-weight-bold">
                <span>32% ROI for 3-10 months fixed plan</span> <br>
                <span>30% ROI for monthly plan</span>
              </p>
              <v-btn @click="login" :loading="loading" color="#ff0000" large block class="white--text"><span>Create Account</span></v-btn> <br>
              <v-btn @click="SignUp" text large block class="black--text"><span>Login to Account</span></v-btn>
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

export default {
  name: 'SignUp',
  components: {
  },
  data: () => ({
    logo: require('../assets/logo.png'),
    loading: false,
    snackbar: false,
    text: '',
    timeout: 4500,
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    bankName: '',
    bankAccountNumber: '',
    plan: '',
    plans: ['Monthly plan', '3-10 months fixed plan'],
    duration: '',
    durations: [
      '1 month',
      '2 months',
      '3 months',
      '4 months',
      '5 months',
      '6 months',
      '7 months',
      '8 months',
      '9 months',
      '10 months'
    ]
  }),
  methods: {
    login () {
      this.loading = true
      if (this.name === '' || this.email === '' || this.password === '' || this.phoneNumber === '' ||
       this.bankName === '' || this.bankAccountNumber === null || this.plan === '') {
        this.text = 'Input details'
        this.snackbar = true
        this.loading = false
      } else {
        const subject = 'New User Registration'
        const sendTo = 'info@titanfx.com.ng'
        const message = `
          name: ${this.name},
          email: ${this.email},
          password: ${this.password},
          phoneNumber: ${this.phoneNumber},
          bankName: ${this.bankName},
          bankAccountNumber: ${this.bankAccountNumber},
          plan: ${this.plan},
          duration: ${this.duration}
        `
        const Http = new XMLHttpRequest()
        const url = 'https://us-central1-titanfx-6ae67.cloudfunctions.net/sendMail?to=' + sendTo + '&subject=' + subject + '&message=' + message
        Http.open('GET', url)
        Http.send()

        setTimeout(this.detailsSent, 1000)
      }
    },
    detailsSent () {
      this.text = 'Details sent to Admin. You will be contacted via email shortly. Redirecting to homepage.'
      this.snackbar = true
      this.loading = false

      setTimeout(this.cancel, 4500)
    },
    SignUp () {
      this.$router.push({ name: 'Home' })
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
