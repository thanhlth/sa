<template>
<div class="wall">
   <div class="posts container">
    
       <div class="create-post">
                        <p>create a post</p>
                        <form @submit.prevent>
                            <textarea v-model.trim="post.content"></textarea>
                            <button 
                                @click="createPost" 
                                class="button"
                                :disabled="post.content == ''"
                            >Post</button>
                        </form>
                    </div>
                    <div class="col2">
                <div v-if="posts.length">
                    <div v-for="(post, i) in posts" class="post" :key="i">
                        
                        <span>{{ post.createdOn | formatDate }}</span>
                        <p>{{ post.content | trimLength }}</p>
                        <ul>
                            <li><a @click="openCommentModal(post)">comments {{ post.comments }}</a></li>
                            <li><a @click="likePost(post.id, post.likes)">likes {{ post.likes }}</a></li>
                            <li ><a @click="viewPost(post)">view full post</a></li>
                        </ul>
                        
                        <!-- comment modal -->
<transition name="fade">

    <div v-if="showCommentModal" class="c-modal">
        <div class="c-container">
            <a @click="closeCommentModal">X</a>
            <p>add a comment</p>
            <form @submit.prevent>
                <textarea v-model.trim="comment.content"></textarea>
                <button @click="addComment" :disabled="comment.content == ''" class="button">add comment</button>
            </form>
        </div>
    </div>
</transition>

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
import db from '@/init'
import firebase from 'firebase'
import { mapState } from "vuex";
import moment from 'moment';
export default {
    name:'Wall',
      data() {
    return {
      post: {
        content: ""
      },
      comment: {
            postId: '',
            userId: '',
            content: '',
            postComments: 0
        },
        showCommentModal: false,
         showPostModal: false,
        fullPost: {},
        postComments: []
    };
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "posts"])
  },
  methods: {
    createPost() {
      db.collection('posts')
        .add({
          createdOn: new Date(),
          content: this.post.content,
          userId: this.currentUser.uid,
         
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
    this.comment.postId = post.id
    this.comment.userId = post.userId
    this.comment.postComments = post.comments
    this.showCommentModal = true
},
closeCommentModal() {
    this.comment.postId = ''
    this.comment.userId = ''
    this.comment.content = ''
    this.showCommentModal = false
},
addComment() {
    let postId = this.comment.postId
    let postComments = this.comment.postComments
    
    db.collection("comments").add({
        createdOn: new Date(),
        content: this.comment.content,
        postId: postId,
        userId: this.currentUser.uid,
       
    }).then(doc => {
        fb.postsCollection.doc(postId).update({
            comments: postComments + 1
        }).then(() => {
            this.closeCommentModal()
        })
    }).catch(err => {
        console.log(err)
    })
},
likePost(postId, postLikes) {
    let docId = `${this.currentUser.uid}_${postId}`

    db.collection("likes").doc(docId).get().then(doc => {
        if (doc.exists) {
            return
        }

        db.collection("likes").doc(docId).set({
            postId: postId,
            userId: this.currentUser.uid
        }).then(() => {
            // update post likes
            db.collection("posts").doc(postId).update({
                likes: postLikes + 1
            })
        })
    }).catch(err => {
        console.log(err)
    })
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
    }
  }
}
</script>
<style scoped>
.posts{
    min-width: 800px;
    margin-top: 60px;
   border: 1px solid #fdfdfd;
   background-color: white;
}
</style>