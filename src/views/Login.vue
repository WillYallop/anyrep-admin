<template>
    <div id="login" class="viewContainer">
        <div class="loginContainer">
            <div class="loginWrapper">
                <input v-on:keyup.enter="signin" type="email" id="signinEmail" class="inputText" required v-model="email" placeholder="Email..">
                <input v-on:keyup.enter="signin" type="password" id="signinPassword" class="inputText" required v-model="password" placeholder="Password..">
                <button id="signInBtn" class="bannerBtn" v-on:click="signin">Sign in</button>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
    name: 'login',
    data: function() {
        return {
        email: '',
        password: '',
        userInfo: ''
        };
    },
    mounted() {
        
    },
    methods: {
        signin: function(e) {
            firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(userInfo => {
                
                this.userInfo = userInfo
                this.$router.go({ path: this.$router.path })
            },
            err => {
                alert(err.message);
            })
            e.preventDefault();
        },
    }
}

</script>

<style scoped>
.loginContainer {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 40px 0;
    box-sizing: border-box;
}
.loginWrapper {
    width: 100%;
    max-width: 450px;
    background-color: #FFF;
    border-radius: 20px;
    padding: 20px;
    box-sizing: border-box;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
}
.loginWrapper input {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #EFEFEF;
    border-radius: 10px;
    margin-bottom: 10px;
    background-color: #F9F9F9;
}
.loginWrapper input:focus {
    border: 1px solid #1B9CF3;
}
.bannerBtn {
    background-color: #1B9CF3;
    border-radius: 20px;
    cursor: pointer;
    color: #FFF;
    border: none;
    font-size: 16px;
    align-self: flex-end;
    padding: 7px 60px;
    box-sizing: border-box;
    transition: 0.3s;
}
.bannerBtn:hover {
    background-color: #1687D3;
}
</style>