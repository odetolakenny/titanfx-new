<template>
    <v-content>
      <v-row align="center" justify="center" class="mx-3">
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
            <v-col class="text-left" lg="8" md="8" sm="12">
                <v-img class="mt-10 pt-5" width="125" height="63" :src="logo"></v-img>
                <p class="black--text title" > Admin Dashboard <span><v-btn :loading="loading" @click="logout">Logout</v-btn></span></p>
                <v-btn @click="showForm('new', null)" color="#ff0000" large block class="white--text"><span>Create New Account</span></v-btn>
                <v-btn @click="navigate('AdminPayments')" text large block class="black--text"><span> Payment Requests</span></v-btn>
                <v-btn @click="navigate('AdminWithdrawals')" text large block class="black--text"><span> Withdrawal Requests</span></v-btn> <br>

                <p class="black--text title">Users</p> <br>
                <p class="subtitle-2" v-if="users.length === 0">No Users yet</p>
                <div v-for="user in users" :key="user.email" class="pb-3">
                    <v-card dense>
                    <v-card-text>
                        <p>Name: <strong>{{user.name}}</strong></p>
                        <p>Email: <strong>{{user.email}}</strong></p>
                        <p>Amount: <strong>&#8358;{{user.amount}}</strong></p>
                        <v-row dense>
                          <v-col><strong>{{user.plan}}</strong> </v-col>
                          <v-col>{{user.duration}}</v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn @click="showForm('edit', user)" class="black--text" color="#ff0000" small>Edit Account Details</v-btn>
                    </v-card-actions>
                </v-card>
                </div>
            </v-col>
        </v-row>

        <v-dialog v-model="form" max-width="450" height="500">
            <v-card>
                <v-card-title>{{formHeader}}</v-card-title>
                <v-card-text class="px-5">
                  <p>Please make sure you leave no field empty</p>
                  <v-text-field v-if="!showEditButton" dense outlined v-model="user.email" type="email" label="Email"></v-text-field>
                  <v-text-field v-if="!showEditButton" dense outlined v-model="user.password" type="password" label="Password"></v-text-field>
                  <v-text-field v-if="!showEditButton" dense outlined v-model="user.confirmPassword" type="password" label="Confirm Password"></v-text-field>
                  <v-text-field dense outlined v-model="user.name" label="Full Name"></v-text-field>
                  <v-text-field dense outlined v-model="user.phoneNo" type="number" label="Phone Number"></v-text-field>

                  <v-text-field dense outlined v-model="user.bank.accountNo" type="number" label="Account Number"></v-text-field>
                  <v-text-field dense outlined v-model="user.bank.bankName" label="Bank Name"></v-text-field>
                  <v-text-field dense outlined v-model="user.amount" type="number" label="Amount"></v-text-field>

                  <v-select :items="plans" v-model="user.plan" label="Investment Plan" solo></v-select>
                  <v-select :items="durations" v-model="user.duration" label="Duration of Plan" solo></v-select>

                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                    <v-btn :loading="loading" block @click="createUser" v-if="showCreateButton" class="white--text" color="#ff0000">Create User</v-btn>
                    <v-btn :loading="deleteLoading" v-if="deleteUser" @click="deleteUser" class="black--text" small>Delete Account</v-btn>
                    <v-btn :loading="loading" @click="editUser" v-if="showEditButton" class="white--text" color="#ff0000">Edit User</v-btn>
                </v-card-actions>
                <p v-if="showEditButton" class="caption mr-3 text-right red--text">You cannot undo the delete function</p>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :timeout="timeout">{{ text }}
          <v-btn color="primary" text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
    </v-content>
</template>

<script>
import firebase from 'firebase'
import db from '../../main'

export default {
  name: 'AdminDashboard',
  components: {
  },
  data: () => ({
    logo: require('../../assets/logo.png'),
    overlay: true,
    loading: false,
    snackbar: false,
    text: '',
    timeout: 2500,
    form: false,
    formHeader: '',
    showCreateButton: false,
    showEditButton: false,
    deleteLoading: false,
    user: {
      name: '',
      PhoneNo: 0,
      email: '',
      password: '',
      confirmPassword: '',
      uid: '',
      bank: {
        bankName: '',
        accountNo: ''
      },
      plan: '',
      duration: '',
      amount: 0
    },
    users: [],
    plans: ['Monthly plan', '3-10 months fixed plan'],
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
    createUser () {
      this.loading = true
      if (this.user.password !== this.user.confirmPassword || this.password === '') {
        this.text = 'Check Password'
        this.snackbar = true
        this.loading = false
      } else {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.user.email, this.user.password)
          .then(data => {
            this.user.uid = data.user.uid
            db.collection('users').doc(data.user.uid).set(this.user)
              .then(() => {
                this.loading = false
                this.text = 'Account created'
                this.snackbar = true
                this.form = false
              })
              .catch((error) => {
                this.text = error.message
                this.snackbar = true
              })
          })
          .catch(err => {
            this.loading = false
            this.text = err.message
            this.snackbar = true
          })
      }
    },
    editUser () {
      this.loading = true
      db.collection('users').doc(this.user.uid)
        .set(this.user)
        .then(() => {
          this.loading = false
          this.text = 'Account Updated'
          this.snackbar = true
          this.form = false
        })
        .catch((error) => {
          this.text = error.message
          this.snackbar = true
        })
    },
    deleteUser () {
      this.deleteLoading = true
      db.collection('users').doc(this.user.uid)
        .delete()
        .then(() => {
          var userStuff = firebase.auth().currentUser

          userStuff.delete().then(() => {
            // User deleted.
          }).catch((error) => {
            // An error happened.
            console.log(error)
            this.text = error.message
            this.snackbar = true
          })
          this.deleteLoading = false
          this.text = 'Account Deleted'
          this.snackbar = true
          this.form = false
        })
        .catch((error) => {
          this.text = error.message
          this.snackbar = true
        })
    },
    showForm (how, user) {
      if (how === 'new' && user === null) {
        this.formHeader = 'Create a new user'
        this.user = {
          name: '',
          PhoneNo: 0,
          email: '',
          password: '',
          confirmPassword: '',
          uid: '',
          bank: {
            bankName: '',
            accountNo: ''
          },
          plan: '',
          duration: '',
          amount: 0
        }
        this.form = true
        this.showEditButton = false
        this.showCreateButton = true
      }
      if (how === 'edit') {
        this.formHeader = 'Update User'
        this.form = true
        this.showEditButton = true
        this.showCreateButton = false
        this.user = user
      }
    },
    navigate (route) {
      this.$router.push({ name: route })
    },
    logout () {
      this.loading = true
      firebase.auth().signOut().then(() => {
        // Sign-out successful.
        this.$router.replace({ name: 'Home' })
      }).catch(() => {
        // An error happened.
        this.loading = false
        this.text = 'Error logging out.'
        this.snackbar = true
      })
    }
  },
  mounted () {
    db.collection('users')
      .onSnapshot((querySnapshot) => {
        this.users = []
        querySnapshot.forEach((doc) => {
          this.users.push(doc.data())
        })
      })
    this.overlay = false
  }
}
</script>

<style scoped>
</style>
