<template>
  <div class="login container ">
    <form @submit.prevent="login" >
      <h2 class="center ">Login</h2>
      <div class="form-detail">
        <div class="form-info col-md-6 col-xs-12">
      
      <div class="group">
        <input class="control-custom" type="email" name="email" v-model="email" />
        
        
<label for="email">Email:</label>
      </div>
      <div class="group">
        
        <input type="password" name="password" v-model="password" />
<span class="bar"></span>
        <label for="password">Password:</label>
      </div>
      <p v-if="feedback" class="alert alert-danger center">{{ feedback }}</p>
      <div class="form-button text-center">
        <button class="btn btn-success">Login</button>
      </div>
      </div>
      </div>
    </form>
  </div>
</template>
<script>
import firebase from 'firebase'
export default {
  name: "Login",
  data() {
    return {
      email: null,
      password: null,
      feedback:null
    }
    
  },
  methods:{
      login(){
          if(this.password&&this.email){
            firebase.auth().signInWithEmailAndPassword(this.email,this.password)
            .then(cred =>{
              this.$store.commit("setCurrentUser", cred.user);
          this.$store.dispatch("fetchUserProfile");
              this.$router.push({name: 'Home'})
            }).catch(err =>{
              this.feedback = err.message
            })
            this.feedback=null
          }else{
            this.feedback="Please fill in both fields"
          }
      }
  }
};
</script>
<style>
.login{
    max-width: 400px;
    margin-top: 60px;
   border: 1px solid #fdfdfd;
   background-color: white;
}
.form-detail {
  padding-top: 50px;
  display: flex;
  align-items: flex-end;
  width :500px;
}

.form-detail .control-custom {
  font-size: 14px;
  color: #868686;
  width: 97%;
}

.form-detail .group { 
  position: relative;
}

.form-detail input {
  display: block;
  padding: 14px 0;
  border: none;
  border-bottom: 1px solid #d8d8d8;
  margin-top: 26px;
}

.form-detail textarea {
  display: block;
  border: none;
  border-bottom: 1px solid #d8d8d8;
}

.form-detail label {
  font-size: 14px;
  color: #868686;
  position: absolute;
  pointer-events: none;
  left: 0;
  top: 16px;
}

input:focus, 
textarea:focus {
  outline: none;
}

.form-detail .bar { 
  position: relative; 
  display: block; 
  width: 97%; 
}

.bar::before,
.bar::after {
  content:'';
  height: 2px; 
  width: 0;
  bottom: 1px; 
  position: absolute;
  background: #2cb680; 
  transition: 0.2s ease all; 
  -moz-transition: 0.2s ease all; 
  -webkit-transition: 0.2s ease all;
}

.bar::before {
  left:50%;
}

.bar::after {
  right:50%; 
}

.form-detail input:focus ~ .bar::before,
.form-detail input:focus ~ .bar::after,
.form-detail textarea:focus ~ .bar::before,
.form-detail textarea:focus ~ .bar::after {
  width:50%;
}
.form-button {
  margin-top: 20px; 
  margin-bottom: 20px;
}
.form-detail label {
  font-size: 14px;
  color: #868686;
  position: absolute;
  pointer-events: none;
  left: 0;
  top: 16px;
  transition: 0.2s ease all; 
  -moz-transition: 0.2s ease all; 
  -webkit-transition: 0.2s ease all;
}
.form-detail input:focus ~ label, 
.form-detail input:valid ~ label,
.form-detail textarea:focus ~ label,
.form-detail textarea:valid ~ label {
  top: -16px;
  color: #2cb680;
}
</style>