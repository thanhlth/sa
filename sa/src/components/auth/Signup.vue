<template>
<div>
<div class="signup container">
    <form  @submit.prevent="signup" >

      <h2 class="center ">Signup</h2>
      <div class="form-detail">
        <div class="form-info col-md-6 col-xs-12">
      <div class="group">
        
        <input type="email" name="email" v-model="email" />
        <span class="bar"></span>
        <label for="email">Email:</label>
      </div>
      <div class="group">
        
        <input type="password" name="password" v-model="password" />
        <span class="bar"></span>
        <label for="password">Password:</label>
      </div>
      <div class="group">
        
        <input type="text" name="alias" v-model="alias" />
        <span class="bar"></span>
        <label for="alias">Alias:</label>
      </div>
       <div >
                   <img :src="imageUrl" height="60" v-if="imageUrl" />
                   <p>Select File</p>
                   <textarea class="btn btn-default stat-item"
                      @click="pickFile"
                      v-model="imageName"
                    >
                    <i class="fa fa-paperclip icon"></i> 
                    </textarea>
                   
                   <input type="file" style="display: none" ref="image" accept="image/*" @change="onFilePicked"/>
                 </div>
      <p class="alert alert-danger center" v-if="feedback">{{ feedback }}</p>
      <div class=" form-button text-center">
        <button class="btn btn-success">Signup</button>
      </div>
      </div>
      </div>
    </form>
  </div>
</div>
    
</template>
<script>
import db from '@/init'
import firebase from 'firebase';
import slugify from "slugify"
export default {
    data(){
        return{
             email: null,
      password: null,
      alias: null,
      feedback: null,
      slug: null,

      imageName: null,
      imageUrl: '',
      downloadUrl: '',
      imageFile: null
        }
    },
    methods:{
        signup(){
      if (this.alias && this.email && this.password) {
        this.slug = slugify(this.alias, {
          replacement: "-",
          remove: /[$*_=`()~!\-:@'"]/g,
          lower: true
        });
        let ref = db.collection('users').doc(this.slug)
        ref.get().then(doc => {
          if(doc.exists){
            this.feedback= 'This alias already exists'
          }else {
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then(cred =>{
              ref.set({
                alias: this.alias,
                user_id: cred.user.uid,
                imageUrl: this.imageUrl,
                  downloadUrl: this.downloadUrl,
                imgSrc:"https://bootdey.com/img/Content/user_1.jpg"
              })
            })
            .then(() => {

                this.$store.dispatch("fetchUserProfile");
              this.$router.push({name: 'Home'})
            })
            .catch(err =>{
              console.log(err)
              this.feedback= err.message;
            })
            this.feedback = 'This is free to use'
          }
        })
        console.log(this.slug);
      } else {
        this.feedback = "You must enter all fields";
      }
    },
     pickFile () {
      this.$refs.image.click()
    },
    onFilePicked (e) {
      const files = e.target.files
      if (files[0] !== undefined) {
        this.imageName = files[0].name
        if (this.imageName.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.addEventListener('load', () => {
          this.imageUrl = fr.result
          this.imageFile = files[0]
        })
      } else {
        this.imageName = ''
        this.imageFile = ''
        this.imageUrl = ''
      }
    }
            
    }
}                  
</script>
<style>
.signup{
    max-width: 400px;
    margin-top: 60px;
   border: 1px solid #fdfdfd;
   background-color: white;
}
</style>