import Vue from 'vue'
import Vuex from 'vuex'

import db from '@/init'
const fb = require('../init')
Vue.use(Vuex);
fb.auth.onAuthStateChanged(user => {
    if (user) {
        store.commit('setCurrentUser', user)
        store.dispatch('fetchUserProfile')

        db.collection('posts').orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {
            //console.log(querySnapshot);
            let postsArray = []

            querySnapshot.forEach(doc => {
                let post = doc.data()
                post.id = doc.id
                postsArray.push(post)
            })

            store.commit('setPosts', postsArray)
        })

        db.collection('shares').orderBy('createdOn', 'desc').onSnapshot(querySnapshot =>{
            let sharesArray = []
            querySnapshot.forEach(doc => {
                let share = doc.data()
                share.id= doc.id
                sharesArray.push(share)
            })
            store.commit('setShares', sharesArray)
        })
    
    }
})

export const store = new Vuex.Store({
    state: {
        currentUser: null,
        userProfile: {},
        posts: [], 
        shares:[]
        
    },
    mutations: {
        setCurrentUser(state, val) {
            state.currentUser = val;
        },
        setUserProfile(state, val) {
            state.userProfile = val;
        },
        setPosts(state, val) {
            state.posts = val;
        },
        setShares(state, val){
            state.shares =val;
        }

    },
    actions: {
        fetchUserProfile({ commit, state }) {
            db.collection('users').doc(state.currentUser.uid).get()
                .then(res => {
                    commit('setUserProfile', res.data())
                }).catch(err => {
                    console.log(err)
                })
        },
        
    },
    getters:{
        userProfile(state){
            return state.userProfile;
        }
    }
})