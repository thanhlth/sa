<template>
  <div class="wall">
    <div class=" col-sm-12 ">
      <div class=" panel panel-white post panel-shadow  "><p>{{this.user.alias}}</p></div>
      
    </div>
    <div class="posts container">
      <div class="panel panel-white post panel-shadow create-post col-sm-12">
        <p>Create a post</p>
        <form @submit.prevent>
          <textarea
            id="form7"
            class="md-textarea form-control"
            rows="3"
            v-model.trim="post.content"
          ></textarea>
          <button
            @click="createPost"
            class="post-btn btn btn-info"
            :disabled="post.content == ''"
          >
            Post
          </button>
        </form>
      </div>
      <div >
        <div v-if="posts.length">
          <div v-for="(post, i) in posts" class="post" :key="i">
            <div  class="col-sm-12">
              <div class="panel panel-white post panel-shadow">
                <div class="post-heading">
                  <div class="pull-left image">
                    <img
                      src="https://bootdey.com/img/Content/user_1.jpg"
                      class="img-circle avatar"
                      alt="user profile image"
                    />
                  </div>
                  <div class="pull-left meta">
                    <div class="title h5">
                      <a href="#"><b>{{post.from}}</b></a>
                      made a post.
                    </div>
                    <h6 class="text-muted time">
                      {{ post.createdOn | formatDate }}
                    </h6>
                  </div>
                </div>
                <div class="post-description">
                  <p>{{ post.content | trimLength }}</p>
                  <div class="stats">
                    <a
                      href="#"
                      class="btn btn-default stat-item"
                      @click="likePost(post.id, post.likes)"
                    >
                      <i class="fa fa-thumbs-up icon"></i>{{ post.likes }}
                    </a>
                    <a
                      href="#"
                      class="btn btn-default stat-item"
                      @click="openCommentModal(post)"
                    >
                      <i class="fa fa-paper-plane icon"></i>
                    </a>

                    
                    <a
                      href="#"
                      class="btn btn-default stat-item"
                      @click="viewPost(post)"
                    >
                      <i class="fa fa-comment" aria-hidden="true"></i>
                    </a>
                  </div>
                </div>
                <div class="post-footer">
                  <div class="input-group">
                    
                    <input
                      class="form-control"
                      placeholder="Add a comment"
                      v-model="comment.content"
                      type="text"
                    />
                    <span class="input-group-addon">
                      <a @click="addComment" :disabled="comment.content == ''" class="button"><i class="fa fa-edit"></i></a>
                    </span>
                    
                  </div>
                  <ul  class="comments-list">
                    <li class="comment">
                      <!--
                      <a class="pull-left" href="#">
                        <img
                          class="avatar"
                          src="https://bootdey.com/img/Content/user_1.jpg"
                          alt="avatar"
                        />
                      </a>
                      <div class="comment-body">
                        <div class="comment-heading">
                          <h4 class="user">Gavino Free</h4>
                          <h5 class="time">5 minutes ago</h5>
                        </div>
                        <p>Sure, oooooooooooooooohhhhhhhhhhhhhhhh</p>
                      </div>
                      -->
                      <ul  v-show="postComments.length" class="comments-list">
                        <li  v-for="(comment,index) in postComments" class="comment" :key="index">
                          <div v-if="comment.postId==post.id">
                          <a class="pull-left" href="#">
                            <img
                              class="avatar"
                              src="https://bootdey.com/img/Content/user_3.jpg"
                              alt="avatar"
                            />
                          </a>
                          <div class="comment-body">
                            <div class="comment-heading">
                              <h4 class="user">{{comment.userName}}</h4>
                              <h5 class="time">{{comment.createdOn | formatDate}}</h5>
                            </div>
                            <p>{{comment.content}}</p>
                          </div>
                          </div>
                        </li>
                        
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- comment modal -->
            
          </div>
        </div>
        <div v-else>
          <p class="no-results">There are currently no posts</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import db from "@/init";
import firebase from "firebase";
import { mapState } from "vuex";
import moment from "moment";
export default {
  name: "Wall",
  data() {
    return {
      user:null,
      profile:null,
      post: {
        content: ""
      },
      comment: {
        postId: "",
        userId: "",
        content: "",
        postComments: 0,

      },
      
      
      postComments: []
    };
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "posts"])
  },
  created(){
    let ref = db.collection('users')
//get current user
ref.where('user_id','==',firebase.auth().currentUser.uid)
.get().then(snapshot => {
snapshot.forEach(doc => {
    this.user = doc.data(),
    this.user.id= doc.id
})
})
ref.doc(this.$route.params.id).get()
        .then(user =>{//user
            this.profile = user.data()
        })
  },
  methods: {
    createPost() {
      db.collection("posts")
        .add({
          createdOn: new Date(),
          content: this.post.content,
          userId: this.currentUser.uid,
          to: this.$route.params.id,
          from:this.profile.alias,
          srcImg:null,
          comments: 0,
          likes: 0
        })
        .then(ref => {
          this.post.content = "";
        })
        .catch(err => {
          console.log(err);
        });
    },
    openCommentModal(post) {
      this.comment.postId = post.id;
      this.comment.userId = post.userId;
      this.comment.postComments = post.comments;
      
    },
    closeCommentModal() {
      this.comment.postId = "";
      this.comment.userId = "";
      this.comment.content = "";
    
    },
    addComment() {
      
      let postId = this.comment.postId;
      let postComments = this.comment.postComments;
      

      db.collection("comments")
        .add({
          createdOn: new Date(),
          content: this.comment.content,
          postId: postId,
          userId: this.currentUser.uid,
          userName:this.profile.alias
        })
        .then(doc => {
          db.collection("posts")
            .doc(postId)
            .update({
              comments: postComments + 1
            })
            .then(() => {
              this.closeCommentModal();
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    likePost(postId, postLikes) {
      let docId = `${this.currentUser.uid}_${postId}`;

      db.collection("likes")
        .doc(docId)
        .get()
        .then(doc => {
          if (doc.exists) {
            return;
          }

          db.collection("likes")
            .doc(docId)
            .set({
              postId: postId,
              userId: this.currentUser.uid
            })
            .then(() => {
              // update post likes
              db.collection("posts")
                .doc(postId)
                .update({
                  likes: postLikes + 1
                });
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    viewPost(post) {
      this.postComments=[]
    db.collection("comments").where('postId', '==', post.id).get().then(docs => {
        let commentsArray = []

        docs.forEach(doc => {
            let comment = doc.data()
            comment.id = doc.id
            commentsArray.push(comment)
            //console.log(doc);
        })

        this.postComments = commentsArray
        this.fullPost = post
       console.log(commentsArray)
    }).catch(err => {
        console.log(err)
    })
},
closePostModal() {
    this.postComments = []
    
}
  },
  filters: {
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).fromNow();
    },
    trimLength(val) {
      if (val.length < 200) {
        return val;
      }
      return `${val.substring(0, 200)}...`;
    },
    
  }
};
</script>
<style scoped>
.create-post {
  
  margin-top: 60px;
  min-height: 150px;
  border: 1px solid #fdfdfd;
  background-color: white;
}
.create-post .md-textarea {
  width: 680px;
  position: absolute;
  height: 50px;
}
.create-post .post-btn {
  position: absolute;

  right: 250px;
}
.panel-shadow {
    box-shadow: rgba(0, 0, 0, 0.3) 7px 7px 7px;
    background-color: white;
    margin-top: 10px;
    margin-bottom: 10px;
}
.panel-white {
  border: 1px solid #dddddd;
}
.panel-white  .panel-heading {
  color: #333;
  background-color: #fff;
  border-color: #ddd;
}
.panel-white  .panel-footer {
  background-color: #fff;
  border-color: #ddd;
}

.post .post-heading {
  height: 95px;
  padding: 20px 15px;
}
.post .post-heading .avatar {
  width: 60px;
  height: 60px;
  display: block;
  margin-right: 15px;
}
.post .post-heading .meta .title {
  margin-bottom: 0;
}
.post .post-heading .meta .title a {
  color: black;
}
.post .post-heading .meta .title a:hover {
  color: #aaaaaa;
}
.post .post-heading .meta .time {
  margin-top: 8px;
  color: #999;
}
.post .post-image .image {
  width: 100%;
  height: auto;
}
.post .post-description {
  padding: 15px;
}
.post .post-description p {
  font-size: 14px;
  text-align: left;
}
.post .post-description .stats {
  margin-top: 20px;
  text-align: left;
}
.post .post-description .stats .stat-item {
  display: inline-block;
  margin-right: 15px;
}
.post .post-description .stats .stat-item .icon {
  margin-right: 8px;
}
.post .post-footer {
  border-top: 1px solid #ddd;
  padding: 15px;
  text-align: left;
}
.post .post-footer .textarea-group-addon a {
  color: #454545;
}
.post .post-footer .comments-list {
  padding: 0;
  margin-top: 20px;
  list-style-type: none;
}
.post .post-footer .comments-list .comment {
  display: block;
  width: 100%;
  margin: 20px 0;
}
.post .post-footer .comments-list .comment .avatar {
  width: 35px;
  height: 35px;
}
.post .post-footer .comments-list .comment .comment-heading {
  display: block;
  width: 100%;
}
.post .post-footer .comments-list .comment .comment-heading .user {
  font-size: 14px;
  font-weight: bold;
  display: inline;
  
  margin-right: 10px;
}
.post .post-footer .comments-list .comment .comment-heading .time {
  font-size: 12px;
  color: #aaa;
  
  display: inline;
}
.post .post-footer .comments-list .comment .comment-body {
  margin-left: 50px;
}
.post .post-footer .comments-list .comment > .comments-list {
  margin-left: 50px;
}

</style>
