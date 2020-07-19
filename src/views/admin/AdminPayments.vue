<template>
    <v-content>
        <v-row align="center" justify="center" class="mx-3">
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
            <v-col class="text-left" lg="8" md="8" sm="12">
                <v-img class="mt-10 pt-5" width="125" height="63" :src="logo"></v-img>
                <p class="black--text title" > Payment Requests </p> <v-btn color="#ff0000" small @click="goback">Return to dashboard</v-btn>
                <p class="subtitle-1 font-weight-bold text-center black--text" v-if="payments.length === 0">No payment Requests</p> <br>
                <p class="caption black--text" v-if="payments.length !== 0">Click for more details</p>
                <div v-for="(item, i) in payments" :key="i" class="pb-3">
                    <v-card :loading="cardLoading" @click="showDialog(item, i)" dense>
                    <v-card-text>
                        <span>Amount: &#8358;<span class="subtitle-2 font-weight-bold">{{item.amount}}</span></span> <br>
                        <span>Name: <strong>{{item.user.name}}</strong></span> <br>
                        <span>Date: <strong>{{new Date(item.timestamp.seconds * 1000)}}</strong></span>
                    </v-card-text>
                </v-card>
                </div>
            </v-col>
        </v-row>

        <v-dialog v-if="dialog" v-model="dialog" max-width="450" height="500">
          <v-card>
              <v-card-title>Payment Request Details</v-card-title>
              <v-card-text class="px-5">
                <span>Name: {{selected.user.name}}</span> <br>
                <span>Amount: &#8358;{{selected.amount}}</span> <br>
                <span>Date: <strong>{{new Date(selected.timestamp.seconds * 1000)}}</strong></span><br>
                <a :href="selected.proof"> Link to proof </a>
                <p class="caption red--text">Wait a while for the image to load</p>
                <v-img :src="selected.proof"></v-img>
                </v-card-text>
              <v-card-actions>
                <p class="caption red--text">This action cannot be undone</p> <br>
                <v-btn :loading="declineLoading" @click="declinePayment" class="white--text" color="red">Decline</v-btn>
                <v-btn :loading="approveLoading" @click="approvePayment" class="white--text" color="success">Approve</v-btn>
              </v-card-actions>
            </v-card>
        </v-dialog>
    </v-content>
</template>

<script>
import db from '../../main'
import firebase from 'firebase'

export default {
  name: 'AdminPayments',
  components: {
  },
  data: () => ({
    logo: require('../../assets/logo.png'),
    overlay: true,
    approveLoading: false,
    declineLoading: false,
    cardLoading: false,
    snackbar: false,
    text: '',
    timeout: 2500,
    dialog: false,
    payments: [],
    paymentsID: [],
    selected: null,
    selectedID: '',
    selectedUser: null
  }),
  methods: {
    approvePayment () {
      this.approveLoading = true
      db.collection('payments').add({
        amount: this.selected.amount,
        user: this.selected.user,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
        .then((docRef) => {
          console.log('payment added')
          this.deletePaymentRequest(this.selectedID, 'approve')
        })
        .catch(() => {
          this.approveLoading = false
          this.text = 'Error approving payment. Try again.'
          this.snackbar = true
        })
    },
    declinePayment () {
      this.declineLoading = true
      this.deletePaymentRequest(this.selectedID, 'decline')
    },
    showDialog (item, i) {
      this.cardLoading = true
      this.selected = item
      db.collection('users').doc(this.selected.user.uid)
        .get().then((doc) => {
          this.selectedUser = doc.data()
          this.selectedID = this.paymentsID[i]
          this.cardLoading = false
          this.dialog = true
        }).catch((error) => {
          this.cardLoading = false
          this.text = error.name
          this.snackbar = true
        })
    },
    deletePaymentRequest (id, type) {
      db.collection('paymentRequests').doc(id).delete().then(() => {
        console.log('payment request deleted')
        if (type === 'decline') {
          // send email to user
          const subject = 'Payment Declined'
          const sendTo = this.selected.user.email
          const message = 'Hi, ' + this.selected.user.name + '. Your payment has been declined'
          const Http = new XMLHttpRequest()
          const url = 'https://us-central1-titanfx-6ae67.cloudfunctions.net/sendMail?to=' + sendTo + '&subject=' + subject + '&message=' + message
          Http.open('GET', url)
          Http.send()
          console.log('all done - decline')
          this.dialog = false
          this.declineLoading = false
          this.text = 'Payment Request Declined'
          this.snackbar = true
        }

        if (type === 'approve') {
          const newAmount = parseInt(this.selectedUser.amount) + parseInt(this.selected.amount)
          db.collection('users').doc(this.selected.user.uid)
            .update({
              amount: newAmount.toString()
            })
            .then(() => {
              console.log('all done - wait')
              // send email to user
              const subject = 'Payment Approved'
              const sendTo = this.selected.user.email
              const message = 'Hi, ' + this.selected.user.name + '. Your payment has been approved'
              const Http = new XMLHttpRequest()
              const url = 'https://us-central1-titanfx-6ae67.cloudfunctions.net/sendMail?to=' + sendTo + '&subject=' + subject + '&message=' + message
              Http.open('GET', url)
              Http.send()

              this.dialog = false
              this.text = 'Account Updated'
              this.snackbar = true
              this.approveLoading = false
            })
            .catch(() => {
              this.text = 'Error auto-updating amount. Please do so manually'
              this.snackbar = true
            })
        }
      }).catch((error) => {
        this.approveLoading = false
        this.declineLoading = false
        this.text = error.message
        this.snackbar = true
      })
    },
    goback () {
      this.$router.go(-1)
    }
  },
  mounted () {
    db.collection('paymentRequests')
      .orderBy('timestamp', 'desc')
      .where('approved', '==', false)
      .onSnapshot((querySnapshot) => {
        this.payments = []
        this.paymentsID = []
        querySnapshot.forEach((doc) => {
          this.payments.push(doc.data())
          this.paymentsID.push(doc.id)
        })
      })
    this.overlay = false
  }
}
</script>

<style scoped>
</style>
