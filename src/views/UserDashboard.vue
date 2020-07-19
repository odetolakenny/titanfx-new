<template>
    <v-content>
      <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
        <v-row class="ml-5">
            <v-col lg="6" sm="12">
                <v-img class="mt-10 pt-5" width="125" height="63" :src="logo"></v-img>
              <v-chip style="width:50px; height:5px" x-small color="#ff0000"></v-chip>
              <p class="title">Welcome {{user.name}}</p>
              <p>Date/Time: {{date}}</p>
              <v-btn @click="logout" :loading="loading" class="white--text" color="#ff0000">Logout</v-btn>
              <br><br>
            </v-col>
        </v-row>

          <div class="px-5">
              <v-card elevation="15">
                  <v-list-item two-line>
                  <v-list-item-content>
                      <v-list-item-title class="title font-weight-black"> <strong>&#8358;{{user.amount}}</strong></v-list-item-title>
                      <v-list-item-subtitle>Dashboard balance</v-list-item-subtitle>
                  </v-list-item-content>
                  </v-list-item>
                  <v-list-item dense two-line>
                      <v-list-item-content>
                          <v-list-item-title> <strong>{{user.plan}}</strong></v-list-item-title>
                          <v-list-item-subtitle>Plan</v-list-item-subtitle>
                      </v-list-item-content>
                      </v-list-item>
                      <v-list-item dense two-line>
                      <v-list-item-content>
                          <v-list-item-title> <strong>{{user.duration}}</strong></v-list-item-title>
                          <v-list-item-subtitle>Duration</v-list-item-subtitle>
                      </v-list-item-content>
                      </v-list-item>
                  <v-card-actions>
                <v-btn block small @click="paymentDialog = true" class="white--text" color="#ff0000">Top Up</v-btn>
              </v-card-actions>
              </v-card>
          </div>

          <v-expansion-panels class="pt-3 px-5">
            <v-expansion-panel>
              <v-expansion-panel-header>Account Information</v-expansion-panel-header>
              <v-expansion-panel-content>
                <div>
                  <v-card elevation="15">
                      <v-list-item dense two-line>
                      <v-list-item-content>
                          <v-list-item-title> <strong>{{user.email}}</strong></v-list-item-title>
                          <v-list-item-subtitle>Email Address</v-list-item-subtitle>
                      </v-list-item-content>
                      </v-list-item>
                      <v-list-item dense two-line>
                      <v-list-item-content>
                          <v-list-item-title> <strong>{{user.phoneNo}}</strong></v-list-item-title>
                          <v-list-item-subtitle>Phone Number</v-list-item-subtitle>
                      </v-list-item-content>
                      </v-list-item>
                      <v-list-item dense two-line>
                      <v-list-item-content>
                          <v-list-item-title> <strong>{{user.bank.accountNo}}</strong></v-list-item-title>
                          <v-list-item-subtitle>Account Number</v-list-item-subtitle>
                      </v-list-item-content>
                      </v-list-item>
                      <v-list-item dense two-line>
                      <v-list-item-content>
                          <v-list-item-title> <strong>{{user.bank.bankName}}</strong></v-list-item-title>
                          <v-list-item-subtitle>Bank Name</v-list-item-subtitle>
                      </v-list-item-content>
                      </v-list-item>
                      <v-card-actions>
                        <v-btn block small @click="editDialog = true" color="#ff0000" class="white--text">Edit Account</v-btn>
                      </v-card-actions>
                  </v-card>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels accordion class="pt-3 px-5">
            <v-expansion-panel>
              <v-expansion-panel-header>Withdrawals</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-card elevation="15">
                  <v-card-title class="subtitle-2">Requests
                    <v-spacer></v-spacer>
                    <v-btn small @click="withdrawalDialog = true" color="#ff0000" class="white--text">New Request</v-btn>
                  </v-card-title>
                  <p class="text-center py-3" v-if="withdrawals.length === 0">No withdrawals yet</p>
                  <v-card dense class="pb-2" two-line v-for="(item, i) in withdrawals" :key="i">
                    <v-card-text>
                      <span>Amount: <strong>&#8358;{{item.amount}}</strong></span>
                      <span class="text-right pl-10">Approved <v-icon v-if="item.approved" color="success">mdi-check-bold</v-icon> <v-icon v-else color="red">mdi-close-thick</v-icon></span> <br>
                      <span>Date: <strong>{{new Date(item.timestamp.seconds * 1000)}}</strong></span><br>
                    </v-card-text>
                  </v-card>
              </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels accordion class="pt-3 px-5">
            <v-expansion-panel>
              <v-expansion-panel-header>Payments</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-card elevation="15">
                  <p class="text-center py-3" v-if="payments.length === 0">No payments made yet</p>
                  <v-card dense class="pb-2" two-line v-for="(item, i) in payments" :key="i">
                    <v-card-text>
                      <span>Amount: <strong>&#8358;{{item.amount}}</strong></span> <br>
                      <span>Date: <strong>{{new Date(item.timestamp.seconds * 1000)}}</strong></span><br>
                    </v-card-text>
                  </v-card>
              </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

        <v-dialog v-model="editDialog" max-width="450" height="500">
          <v-card>
              <v-card-title>Edit Account</v-card-title>
              <v-card-text class="px-5">
                <v-text-field dense outlined v-model="user.name" label="Full Name"></v-text-field>
                <v-text-field dense outlined v-model="user.phoneNo" type="number" label="Phone Number"></v-text-field>

                <v-text-field dense outlined v-model="user.bank.accountNo" type="number" label="Account Number"></v-text-field>
                <v-text-field dense outlined v-model="user.bank.bankName" label="Bank Name"></v-text-field>
                </v-card-text>
              <v-card-actions>
                <v-btn :loading="editLoading" block @click="editAccount" class="white--text" color="#ff0000">Edit Account</v-btn>
              </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="withdrawalDialog" max-width="450" height="500">
          <v-card>
              <v-card-title>Request Withdrawal</v-card-title>
              <p class="text-center px-3">Make sure your Bank Account details are valid.</p>
              <v-card-text class="px-5">
                <v-text-field dense outlined v-model="withdrawalAmount" type="number" label="Amount"></v-text-field>
                </v-card-text>
              <v-card-actions>
                <v-btn :loading="withdrawalLoading" :disabled="withdrawalAmount === 0" block @click="requestWithdrawal" class="white--text" color="#ff0000">Request</v-btn>
              </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="paymentDialog" max-width="450" height="500">
          <v-card>
              <v-card-title>Fund your account</v-card-title>
              <p class="text-center px-3">Transfer money to this account and upload your proof of payment.</p>
              <p class="subtitle-2 font-weight-bold text-center">
                <span>First City Monument Bank</span> <br>
                <span>2591493017</span> <br>
                <span>UGBOKO DAVID PASCAL</span>
              </p>
              <v-card-text class="text-center px-5">
                <v-text-field dense outlined v-model="paidAmount" type="number" label="Amount"></v-text-field>

              <input type="file" @change="previewImage" accept="image/*" >
              <v-card-subtitle>Progress: {{uploadValue.toFixed()+"%"}}</v-card-subtitle>

              <v-progress-linear :value="uploadValue" stream striped></v-progress-linear>

              <v-btn
                text
                block
                class="black--text"
                @click="onUpload"
                :disabled="imageData==null"
                :loading="imgloading">
                Upload</v-btn>
                </v-card-text>
              <v-card-actions>
                <v-btn v-if="imageUploaded" :disabled="paidAmount === 0" :loading="loading" block @click="sendPaymentProof" class="white--text" color="#ff0000">Send Proof</v-btn>
              </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :timeout="timeout">{{ text }}
          <v-btn color="primary" text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
    </v-content>
</template>

<script>
import firebase from 'firebase'
import db from '../main'

export default {
  name: 'Profile',
  components: {
  },
  data () {
    return {
      logo: require('../assets/logo.png'),
      date: '',
      user: null,

      overlay: true,
      snackbar: false,
      text: '',
      timeout: 3500,

      loading: false,
      editLoading: false,
      withdrawalLoading: false,

      editDialog: false,
      withdrawalDialog: false,
      paymentDialog: false,

      withdrawals: [],
      payments: [],
      withdrawalAmount: 0,
      paidAmount: 0,
      imgloading: false,
      imageData: null,
      picture: null,
      uploadValue: 0,
      imageUploaded: false
    }
  },
  methods: {
    editAccount () {
      this.editLoading = true
      db.collection('users').doc(this.$route.params.id)
        .set(this.user)
        .then(() => {
          this.editLoading = false
          this.text = 'Account Updated'
          this.snackbar = true
          this.editDialog = false
        })
        .catch((error) => {
          this.text = error.message
          this.snackbar = true
        })
    },
    requestWithdrawal () {
      if (this.withdrawalAmount < parseInt(this.user.amount)) {
        db.collection('withdrawals').add({
          amount: this.withdrawalAmount,
          approved: false,
          user: {
            uid: this.$route.params.id,
            email: this.user.email,
            name: this.user.name,
            bank: this.user.bank
          },
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
          .then((docRef) => {
            const subject = 'New withdrawal request'
            const sendTo = 'info@titanfx.com.ng'
            const message = 'A user - ' + this.user.name + ' has requested a withdrawal'
            const Http = new XMLHttpRequest()
            const url = 'https://us-central1-titanfx-6ae67.cloudfunctions.net/sendMail?to=' + sendTo + '&subject=' + subject + '&message=' + message
            Http.open('GET', url)
            Http.send()
            this.withdrawalAmount = 0
            this.withdrawalLoading = false
            this.text = 'Withdrawal request successfully sent'
            this.snackbar = true
            this.withdrawalDialog = false
          })
          .catch(() => {
            this.withdrawalLoading = false
            this.text = 'Error sending request'
            this.snackbar = true
          })
      } else {
        this.text = 'You do not have enough money.'
        this.snackbar = true
      }
    },
    sendPaymentProof () {
      db.collection('paymentRequests').add({
        amount: this.paidAmount,
        approved: false,
        user: {
          uid: this.$route.params.id,
          email: this.user.email,
          name: this.user.name,
          currentAmount: this.user.amount
        },
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        proof: this.picture
      })
        .then((docRef) => {
          const subject = 'New Payment Request'
          const sendTo = 'info@titanfx.com.ng'
          const message = 'A user - ' + this.user.name + ' has sent a payment proof to you.'
          const Http = new XMLHttpRequest()
          const url = 'https://us-central1-titanfx-6ae67.cloudfunctions.net/sendMail?to=' + sendTo + '&subject=' + subject + '&message=' + message
          Http.open('GET', url)
          Http.send()
          this.paidAmount = 0
          this.loading = false
          this.text = 'Payment Proof successfully sent'
          this.snackbar = true
          this.paymentDialog = false
        })
        .catch(() => {
          this.loading = false
          this.text = 'Error sending proof. Try again.'
          this.snackbar = true
        })
    },
    previewImage (event) {
      this.uploadValue = 0
      this.picture = null
      this.imageData = event.target.files[0]
    },
    onUpload () {
      this.picture = null
      this.imgloading = true

      var uploadImage = new Promise((resolve, reject) => {
        var storageRef = firebase.storage().ref(`${this.imageData.name}`).put(this.imageData)
        storageRef.on('state_changed', snapshot => {
          this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        },
        () => {
        },
        () => {
          this.uploadValue = 100
          storageRef.snapshot.ref.getDownloadURL().then((url) => {
            this.picture = url
            resolve()
          })
        }
        )
      })
      uploadImage.then(() => {
        this.imageUploaded = true
        this.imgloading = false
        console.log(this.picture)
      })
    },
    logout () {
      this.loading = true
      firebase.auth().signOut().then(() => {
        // Sign-out successful.
        this.$router.replace({ name: 'Home' })
      }).catch(() => {
        // An error happened.
        this.loading = false
      })
    }
  },
  mounted () {
    this.date = new Date().toLocaleString()
    this.user = this.$route.params.user

    if (this.user === null || this.user === undefined) {
      db.collection('users').doc(this.$route.params.id)
        .get().then((doc) => {
          this.user = doc.data()
        })
    }

    db.collection('withdrawals')
      .where('user.uid', '==', this.$route.params.id)
      .orderBy('timestamp', 'desc')
      .onSnapshot((querySnapshot) => {
        this.withdrawals = []
        querySnapshot.forEach((doc) => {
          this.withdrawals.push(doc.data())
        })
      })

    db.collection('payments')
      .where('user.uid', '==', this.$route.params.id)
      .orderBy('timestamp', 'desc')
      .onSnapshot((querySnapshot) => {
        this.payments = []
        querySnapshot.forEach((doc) => {
          this.payments.push(doc.data())
        })
      })
    this.overlay = false
  }
}
</script>

<style scoped>
</style>
