<template>
<div class="navbar">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" ><router-link :to="{name: 'Home'}" >Deju</router-link></a>
  
  
    
  <form class="form-inline">
    <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
    <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
  </form>

    <ul class="navbar-nav">
      
      <li class="nav-item" v-if="!user">
        <router-link :to="{ name :'Signup' }"><a class="nav-link">Sign Up</a></router-link>
      </li>
      <li class="nav-item" v-if="!user">
        <router-link :to="{ name :'Login' }"><a class="nav-link">Login</a></router-link>
      </li>
      
      <li class="nav-item" v-if="user">
        <a class="nav-link" @click="logout">Logout</a>
      </li>
    </ul>
  
</nav>
    
</div>
</template>
<script>
import firebase from 'firebase'
import db from '@/init'
export default {
    name:'NavBar',
    data(){
        return{
user:null
        }
    },
    methods:{
        logout(){
            firebase.auth().signOut().then(() => {
              this.$router.push({ name:'Login'})
            })
        },
       
    },
    created(){
        //let user = firebase.auth().currentUser
        firebase.auth().onAuthStateChanged((user) =>{
            if(user){
                this.user=user
            } else{
                this.user=null
            }
        })
    }
}
</script>
<style scoped>
.navbar{
      padding: 0;
      background-color: #6992db;

}
.navbar-brand{
  position: absolute;
    left: 40px;
    
}
.navbar .navbar-brand .router-link-active{
  font-size: xx-large;
    color: white;
}
.navbar a{
  text-decoration: none;
}
.navbar .nav-link{
  color:white;
  font-size:medium;
} 
.navbar .navbar-expand-lg{
  display: flex;
    height: 40px;
    margin: 0;
    padding: 0;
}
.navbar-light .navbar-nav .nav-link {
    color: white;
    text-decoration: none;
}
ul {
  
  position: absolute;
  right: -1315px;
}
.form-inline{
  display:none;
}
</style>