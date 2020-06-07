<template>
<div class="center">
  <div  class="panel panel-white panel-shadow  update col-sm-12">
    <title>Upload Your Image</title>
<br />
  <img :src="imageUrl"  v-if="imageUrl" />
  <br />
  <div style="margin-top: 10px;">
     <label for="alias">Select File:</label>
    <textarea
      class="btn btn-default stat-item"
      @click="pickFile"
      v-model="imageName"
      style="height: 40px;"
    >
    </textarea>
   
    <form class="md-form" @submit.prevent="update">
      <div class="file-field big">
        <input
          type="file"
          style="display: none"
          ref="image"
          accept="image/*"
          @change="onFilePicked"
        />
        
        <div class=" form-button text-center">
        <button class="btn btn-success">Update</button>
      </div>
      </div>
    </form>
  </div>
  </div>
</div>
  
</template>
<script>
import db from "@/init";
import firebase from "firebase";
export default {
  name: "Update",
  data() {
    return {
      imageUrl: null,
      imageName:null,
      imageFile:null,
      user:null,
    };
  },
  created() {
    let ref = db.collection("users");
    //get current user
    ref
      .where("user_id", "==", firebase.auth().currentUser.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          (this.user = doc.data()), (this.user.id = doc.id);
        });
      });
  },
  methods: {
    pickFile() {
      this.$refs.image.click();
    },

    onFilePicked(e) {
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
    },
    update(){
      let user_id= this.user.id
      
     db.collection("users").doc(user_id).update({
       imageUrl:this.imageUrl 
     }).then(() => {
         this.$router.push({name: 'Wall', params: {id: user_id} });
     })
     .catch(err => {
          console.log(err);
        });

     
     
    }

  }
};
</script>
<style>
.update{
  margin-top: 60px;
  min-height: 150px;
  border: 1px solid #fdfdfd;
  background-color: white;
  width: 800px;
  margin-left: 300px;
}
.textarea{
  
    margin-bottom: 10px;

}
</style>
