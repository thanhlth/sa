<template>
  <div>
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
          >Post</button>
        </form>
      </div>
      <div>
        <div v-if="posts.length">
          <div v-for="(post, i) in posts" class="post" :key="i">
            <div class="col-sm-12">
              <div class="panel panel-white post panel-shadow">
                <div class="post-heading">
                  <div class="pull-left image">
                    <img
                      :src="post.imageUrl"
                      class="img-circle avatar left"
                      alt="avatar"
                      height="60"
                      width="60"
                      margin-right="10"
                    />
                  </div>
                  <div class="pull-left meta">
                    <div class="title h5">
                      <a href="#">
                        <b>{{post.from}}</b>
                      </a>
                      made a post.
                    </div>
                    <h6 class="text-muted time">{{ post.createdOn | formatDate }}</h6>
                  </div>
                </div>
                <div class="post-description">
                  <p>{{ post.content | trimLength }}</p>
                  <div class="stats">
                    <a class="btn btn-default stat-item" @click="likePost(post.id, post.likes)">
                      <i class="fa fa-thumbs-up icon"></i>
                      {{ post.likes }}
                    </a>
                    <a class="btn btn-default stat-item" @click="openCommentModal(post)">
                      <i class="fa fa-paper-plane" aria-hidden="true"></i>
                    </a>

                    <a class="btn btn-default stat-item" @click="viewPost(post)">
                      <i class="fa fa-comment" aria-hidden="true"></i>
                    </a>
                    <a class="btn btn-default stat-item" @click="openShare(post)">
                      <i class="fa fa-share icon" aria-hidden="true"></i>
                    </a>
                  </div>
                  <transition name="fade">
                    <div v-if="showShare" class="c-modal">
                      <div class="c-container">
                        <a @click="closeShare">X</a>

                        <p>Share this post</p>
                        <button @click="sharePost" class="button">Share</button>
                      </div>
                    </div>
                  </transition>
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
                      <a @click="addComment" :disabled="comment.content == ''">
                        <i class="fa fa-paper-plane icon"></i>
                      </a>
                    </span>
                  </div>
                  <ul class="comments-list">
                    <li class="comment">
                      <ul v-show="postComments.length" class="comments-list">
                        <li v-for="(comment,index) in postComments" class="comment" :key="index">
                          <div v-if="comment.postId==post.id">
                            <a class="pull-left" href="#">
                              <img
                                :src="comment.imageUrl"
                                class="img-circle avatar left"
                                alt="avatar"
                                height="60"
                                width="60"
                                margin-right="10"
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
      </div>
      <div>
        <div v-if="shares.length">
          <div v-for="(post, i) in shares" class="post" :key="i">
            <div class="col-sm-12">
              <div class="panel panel-white post panel-shadow">
                <div class="post-heading">
                  <div class="pull-left image">
                    <img
                      :src="post.imageUrl"
                      class="img-circle avatar left"
                      alt="avatar"
                      height="60"
                      width="60"
                      margin-right="10"
                    />
                  </div>
                  <div class="pull-left meta">
                    <div class="title h5">
                      <a href="#">
                        <b>{{post.userName}}</b>
                      </a>
                      shared a post.
                    </div>
                    <h6 class="text-muted time">{{ post.createdOn | formatDate }}</h6>
                  </div>
                </div>
                <div class="share-heading">
                  <div class="pull-left image">
                    <img
                      :src="post.imageUrlshare"
                      class="img-circle avatar left"
                      alt="avatar"
                      height="60"
                      width="60"
                      margin-right="10"
                    />
                  </div>
                  <div class="pull-left meta">
                    <div class="title h5">
                      <a href="#">
                        <b>{{post.from}}</b>
                      </a>
                    </div>
                    <h6 class="text-muted time">{{ post.time | formatDate }}</h6>
                    <div></div>
                  </div>

                  <p>{{ post.content | trimLength }}</p>
                </div>

                <div class="post-description">
                  <div class="stats">
                    <a class="btn btn-default stat-item" @click="likeShare(post.id, post.likes)">
                      <i class="fa fa-thumbs-up icon"></i>
                      {{ post.likes }}
                    </a>
                    <a class="btn btn-default stat-item" @click="openCommentModal(post)">
                      <i class="fa fa-paper-plane" aria-hidden="true"></i>
                    </a>

                    <a class="btn btn-default stat-item" @click="viewPost(post)">
                      <i class="fa fa-comment" aria-hidden="true"></i>
                    </a>
                  </div>
                  <transition name="fade">
                    <div v-if="showShare" class="c-modal">
                      <div class="c-container">
                        <a @click="closeShare">X</a>

                        <p>Share this post</p>
                        <button @click="sharePost" class="button">Share</button>
                      </div>
                    </div>
                  </transition>
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
                      <a @click="addCommentP" :disabled="comment.content == ''">
                        <i class="fa fa-paper-plane icon"></i>
                      </a>
                    </span>
                  </div>
                  <ul class="comments-list">
                    <li class="comment">
                      <ul v-show="postComments.length" class="comments-list">
                        <li v-for="(comment,index) in postComments" class="comment" :key="index">
                          <div v-if="comment.postId==post.id">
                            <a class="pull-left" href="#">
                              <img
                                :src="comment.imageUrl"
                                class="img-circle avatar left"
                                alt="avatar"
                                height="60"
                                width="60"
                                margin-right="10"
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
  name: "Home",
  data() {
    return {
      user: null,

      post: {
        content: ""
      },
      comment: {
        postId: "",
        userId: "",
        content: "",
        postComments: 0
      },
      share: {
        postId: "",
        postShares: 0,
        from: "",
        content: "",
        imageUrlshare: "",
        time: ""
      },
      showShare: false,
      postComments: []
    };
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "posts", "shares"])
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
    createPost() {
      db.collection("posts")
        .add({
          createdOn: new Date(),
          content: this.post.content,
          userId: this.currentUser.uid,
          to: this.user.alias,
          from: this.user.alias,
          imageUrl: this.user.imageUrl,
          comments: 0,
          likes: 0,
          shares: 0
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
          userName: this.user.alias,
          imageUrl: this.user.imageUrl
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
      console.log(docId);
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
      this.postComments = [];
      db.collection("comments")
        .where("postId", "==", post.id)
        .get()
        .then(docs => {
          let commentsArray = [];
          docs.forEach(doc => {
            let comment = doc.data();
            comment.id = doc.id;
            commentsArray.push(comment);
            //console.log(doc);
          });
          this.postComments = commentsArray;
          this.fullPost = post;
          console.log(commentsArray);
        })
        .catch(err => {
          console.log(err);
        });
    },
    openShare(post) {
      this.share.postId = post.id;
      this.share.from = post.from;
      this.share.postShares = post.shares;
      (this.showShare = true),
        (this.share.time = post.createdOn),
        (this.share.imageUrlshare = post.imageUrl),
        (this.share.content = post.content);
    },
    closeShare() {
      this.share.postId = "";
      this.share.from = "";
      this.share.postShares = "";
      (this.showShare = false),
        (this.share.time = ""),
        (this.share.imageUrlshare = ""),
        (this.share.content = "");
    },
    sharePost() {
      let postId = this.share.postId;
      let postShares = this.share.postShares;

      db.collection("shares")
        .add({
          createdOn: new Date(),
          content: this.share.content,
          postId: postId,

          userId: this.currentUser.uid,
          userName: this.user.alias,
          imageUrl: this.user.imageUrl,
          imageUrlshare: this.share.imageUrlshare,
          time: this.share.time,
          from: this.share.from,
          comments: 0,
          likes: 0,
          shares: 0
        })
        .then(doc => {
          db.collection("posts")
            .doc(postId)
            .update({
              shares: postShares + 1
            })
            .then(() => {
              this.closeCommentModal();
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    closePostModal() {
      this.postComments = [];
    },
    likeShare(postId, postLikes) {
      let docId = `${postId}`;
      console.log(docId);
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
              db.collection("shares")
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
    addCommentP() {
      let postId = this.comment.postId;
      let postComments = this.comment.postComments;

      db.collection("comments")
        .add({
          createdOn: new Date(),
          content: this.comment.content,
          postId: postId,
          userId: this.currentUser.uid,
          userName: this.user.alias,
          imageUrl: this.user.imageUrl
        })
        .then(doc => {
          db.collection("shares")
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
};
</script>
<style >
</style>