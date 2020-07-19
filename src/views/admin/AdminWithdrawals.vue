<template>
    <v-content>
        <v-row align="center" justify="center" class="mx-3">
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
            <v-col class="text-left" lg="8" md="8" sm="12">
                <v-img class="mt-10 pt-5" width="125" height="63" :src="logo"></v-img>
                <p class="black--text title" > Withdrawal Requests </p> <v-btn color="#ff0000" small @click="goback">Return to dashboard</v-btn>
                <p class="subtitle-1 font-weight-bold text-center black--text" v-if="withdrawals.length === 0">No payment Requests</p> <br>
                <p class="caption black--text" v-if="withdrawals.length !== 0">Click for more details</p>
                <div v-for="(item, i) in withdrawals" :key="i" class="pb-3">
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
              <v-card-title>Withdrawal Request Details</v-card-title>
              <v-card-text class="px-5">
                <v-list-item dense two-line>
                  <v-list-item-content>
                    <v-list-item-title> <strong>{{selected.user.name}}</strong></v-list-item-title>
                    <v-list-item-subtitle>Name</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item dense two-line>
                  <v-list-item-content>
                    <v-list-item-title> <strong>{{selected.user.email}}</strong></v-list-item-title>
                    <v-list-item-subtitle>Email Address</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item dense two-line>
                  <v-list-item-content>
                    <v-list-item-title> <strong>&#8358;{{selected.amount}}</strong></v-list-item-title>
                    <v-list-item-subtitle>Amount</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item dense two-line>
                  <v-list-item-content>
                    <v-list-item-title> <strong>&#8358;{{selectedUser.amount}}</strong></v-list-item-title>
                    <v-list-item-subtitle>Current Balance of user</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item dense two-line>
                  <v-list-item-content>
                    <v-list-item-title> <strong>{{selected.user.bank.bankName }} {{selected.user.bank.accountNo }}</strong></v-list-item-title>
                    <v-list-item-subtitle>Bank Details</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                </v-card-text>
              <v-card-actions>
                <p class="caption red--text">This action cannot be undone</p> <br>
                <v-btn :loading="declineLoading" @click="declineWithdrawal" class="white--text" color="red">Decline</v-btn>
                <v-btn :loading="approveLoading" @click="approveWithdrawal" class="white--text" color="success">Approve</v-btn>
              </v-card-actions>
            </v-card>
        </v-dialog>
    </v-content>
</template>

<script>
import db from '../../main'

export default {
  name: 'Adminwithdrawals',
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
    withdrawals: [],
    withdrawalsID: [],
    selected: null,
    selectedID: '',
    selectedUser: null
  }),
  methods: {
    approveWithdrawal () {
      this.approveLoading = true
      db.collection('withdrawals').doc(this.selectedID)
        .update({
          approved: true
        })
        .then((docRef) => {
          const newAmount = parseInt(this.selectedUser.amount) - parseInt(this.selected.amount)
          db.collection('users').doc(this.selected.user.uid)
            .update({
              amount: newAmount.toString()
            })
            .then(() => {
              console.log('all done - wait')
              // send email to user
              const subject = 'Withdrawal Approved'
              const sendTo = this.selected.user.email
              const message = 'Hi, ' + this.selected.user.name + '. Your Withdrawal has been approved'
              const Http = new XMLHttpRequest()
              const url = 'https://us-central1-titanfx-6ae67.cloudfunctions.net/sendMail?to=' + sendTo + '&subject=' + subject + '&message=' + message
              Http.open('GET', url)
              Http.send()
              console.log('all done - aprroved')

              this.text = 'Account Updated'
              this.snackbar = true
              this.dialog = false
              this.approveLoading = false
            })
            .catch(() => {
              this.text = 'Error auto-updating amount. Please do so manually'
              this.snackbar = true
            })
        })
        .catch(() => {
          this.approveLoading = false
          this.text = 'Error approving Withdrawal. Try again.'
          this.snackbar = true
        })
    },
    declineWithdrawal () {
      this.declineLoading = true
      this.deleteWithdrawalRequest(this.selectedID)
    },
    showDialog (item, i) {
      this.cardLoading = true
      this.selected = item
      db.collection('users').doc(this.selected.user.uid)
        .get().then((doc) => {
          this.selectedUser = doc.data()
          this.selectedID = this.withdrawalsID[i]
          this.cardLoading = false
          this.dialog = true
        }).catch((error) => {
          this.cardLoading = false
          this.text = error.name
          this.snackbar = true
        })
    },
    deleteWithdrawalRequest (id) {
      db.collection('withdrawals').doc(id).delete().then(() => {
        console.log('payment Withdrawal deleted')
        // send email to user
        const subject = 'Withdrawal Declined'
        const sendTo = this.selected.user.email
        const message = 'Hi, ' + this.selected.user.name + '. Your Withdrawal has been declined'
        const Http = new XMLHttpRequest()
        const url = 'https://us-central1-titanfx-6ae67.cloudfunctions.net/sendMail?to=' + sendTo + '&subject=' + subject + '&message=' + message
        Http.open('GET', url)
        Http.send()
        console.log('all done - decline')

        this.declineLoading = false
        this.text = 'Withdrawal Request Declined'
        this.snackbar = true
        this.dialog = false
      }).catch((error) => {
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
    db.collection('withdrawals')
      .orderBy('timestamp', 'desc')
      .where('approved', '==', false)
      .onSnapshot((querySnapshot) => {
        this.withdrawals = []
        this.withdrawalsID = []
        querySnapshot.forEach((doc) => {
          this.withdrawals.push(doc.data())
          this.withdrawalsID.push(doc.id)
        })
      })
    this.overlay = false
  }
}
</script>

<style scoped>
</style>
