<template>
    <div>
        <!-- Desktop Navigation -->
        <div class="dashboardNavigaiton">
            <div class="dashboardNavigationOverflow" data-simplebar>
                <div class="navTopHalf">
                    <div class="navigationHeaderWrapper">
                        <div class="userAccountCircle">AY</div>
                        <div class="navHeaderTextarea">
                            <p class="usernameP">Ashley Yallop</p>
                            <p class="userRoleP">admin</p>
                        </div>
                    </div>
                    <ul>
                        <li><router-link to="/"><font-awesome-icon class="fas" icon="tachometer-alt" />Dashboard</router-link></li>   
                        <li><router-link to="/reservations"><font-awesome-icon class="fas" icon="list-ul" />Reservations</router-link></li>
                        <li><router-link to="/liveproducts"><font-awesome-icon class="fas" icon="boxes" />Live Products</router-link></li>
                        <li><router-link to="/outofstock"><font-awesome-icon class="fas" icon="times-circle" />Out of Stock</router-link></li>
                        <li><router-link to="/addproduct"><font-awesome-icon class="fas" icon="box" />Add Product</router-link></li>
                    </ul>
                </div>
                <button class="logoutBtn" v-on:click="signout">Sign out</button>
            </div>
        </div>
        <!-- Mobile Navigation -->
        <div class="mobileDashboardNavigation">
            <router-link aria-label="Anyrep Logo" class="anyrepLogoLink" to="/"><img class="anyrepLogoMobile" src="../assets/anyrepLogo.png" alt=""></router-link>
            <button v-on:click="dashboardNavToggle" class="hamburger2 hamburger--spin-r" type="button" aria-label="Navigation">
                <span class="hamburger-box">
                    <span class="hamburger-inner"></span>
                </span>
            </button>
        </div>
        <div class="dashboardMobileNavigation">
            <div class="dashboardMobileNavOverflow" data-simplebar>
                <div class="navTopHalf">
                    <div class="navigationHeaderWrapper">
                        <div class="userAccountCircle">AY</div>
                        <div class="navHeaderTextarea">
                            <p class="usernameP">Ashley Yallop</p>
                            <p class="userRoleP">admin</p>
                        </div>
                    </div>
                    <ul>
                        <li v-on:click="dashboardNavToggle"><router-link to="/"><font-awesome-icon class="fas" icon="tachometer-alt" />Dashboard</router-link></li>   
                        <li v-on:click="dashboardNavToggle"><router-link to="/reservations"><font-awesome-icon class="fas" icon="list-ul" />Reservations</router-link></li>
                        <li v-on:click="dashboardNavToggle"><router-link to="/liveproducts"><font-awesome-icon class="fas" icon="boxes" />Live Products</router-link></li>
                        <li v-on:click="dashboardNavToggle"><router-link to="/outofstock"><font-awesome-icon class="fas" icon="times-circle" />Out of Stock</router-link></li>
                        <li v-on:click="dashboardNavToggle"><router-link to="/addproduct"><font-awesome-icon class="fas" icon="box" />Add Product</router-link></li>
                    </ul>
                </div>
                <button class="logoutBtn" v-on:click="signout">Sign out</button>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';

export default {
    created() { 

    },
    methods: {
        dashboardNavToggle: function() {
            //Toggle navigation
            [].map.call(document.querySelectorAll('.dashboardMobileNavigation'), function(el) { 
                el.classList.toggle('showNavbar');
            });
            //Toggle Hamburger
            [].map.call(document.querySelectorAll('.hamburger2'), function(el) {
                el.classList.toggle('is-active');
            });
        },
        signout(e) {
            firebase.auth().signOut().then(() => {
            this.$router.go({ path: this.$router.path })
            })
            e.preventDefault();
        }

    }
}
</script>

<style scoped>
    .hideNavigation {display: none;}
    /* Desktop Navigation */
    .dashboardNavigaiton {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        width: 250px;
        background-color: #FFF;
        box-shadow: 3px 0px 6px rgba(0, 0, 0, 0.1);
        z-index: 2000;
    }
    .dashboardNavigationOverflow {
        height: 100%;
        width: 100%;
        padding: 20px 20px 0 !important;
        box-sizing: border-box;
    }
    .navigationHeaderWrapper {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 0 20px;
        box-sizing: border-box;
    }
    .userAccountCircle {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #1B9CF3;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #FFF;
    }
    .navHeaderTextarea {
        padding-left: 10px;
        box-sizing: border-box;
    } 
    .usernameP {
        margin: 0;
        padding: 0 0 3px;
        font-size: 18px;
        font-weight: bold;
    } 
    .userRoleP {
        margin: 0;
        padding: 0;
        font-size: 14px;
    }

    .dashboardNavigaiton ul {
        margin: 0;
        padding: 0;
    }
    .dashboardNavigaiton ul li {
        list-style-type: none;
    }
    .dashboardNavigaiton ul li a {
        text-decoration: none;
        display: block;
        width: 100%;
        padding: 7px 10px;
        box-sizing: border-box;
        color: #242424;
      
        cursor: pointer;
    }
    .dashboardNavigaiton ul li a .fas {
        color: #1B9CF3;
        padding-right: 10px;
    }
    .dashboardNavigaiton ul li a:hover {
        color: #858585;
    }
    .router-link-exact-active {
        background-color: #1B9CF3;
        border-radius: 20px;
        color: #FFF !important;
    }
    .router-link-exact-active .fas {
        color: #FFF !important;
    }
    .navTopHalf {
        width: 100%;
        align-self: flex-start;
    }
    /* Mobile Navigation */
    .mobileDashboardNavigation {
        width: 100%;
        height: 60px;
        padding: 0 20px;
        box-sizing: border-box;
        background-color: #FFF;
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 1000;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);

        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 2000;
    }
    .mobileDashboardNavigation .router-link-exact-active {
        background-color: transparent !important;
    }
    .anyrepLogoLink {
        display: flex;
        align-items: center;
    }
    .anyrepLogoMobile {
        height: 50px;
    }
    /*Mobile Navigation Area*/
    .hamburger-inner, .hamburger-inner::before, .hamburger-inner::after {
        background-color: #201F1F;
    }
    .hamburger2.is-active .hamburger-inner, .hamburger2.is-active .hamburger-inner::before, .hamburger2.is-active .hamburger-inner::after {
        background-color: #201F1F;
    }
    .hamburger2 {
        padding: 6px 0 0 3px;
        background-color: transparent;
        border: none;
        cursor: pointer;
    }
    .hamburger-inner, .hamburger-inner::before, .hamburger-inner::after {
        width: 40px;
        height: 3px;
    }
    .hamburger-box {
        width: 40px;
    }
    .hamburger-inner::before {
        top: -10px;
    }
    .hamburger-inner::after {
        bottom: -10px;
    }
    /* Mobile Nav Slider */
    .dashboardMobileNavigation {
        position: fixed;
        top: 60px;
        bottom: 0;
        right: -250px;
        background-color: #FFF;
        width: 250px;
        transition: right 0.3s;
        z-index: 1500;
        box-shadow: -3px 0px 6px rgba(0, 0, 0, 0.1);
    }
    .showNavbar {
        right: 0;
    }
    .dashboardMobileNavOverflow {
        width: 100%;
        height: 100%;
        padding: 10px 10px 0;
        box-sizing: border-box;
    }
    .dashboardMobileNavOverflow ul {
        margin: 0;
        padding: 0;
        width: 100%;
    }
    .dashboardMobileNavOverflow ul li {
        list-style-type: none;
        width: 100%;
    }
    .dashboardMobileNavOverflow ul li a {
        color: #242424;
        text-decoration: none;
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
    }
    .dashboardMobileNavOverflow ul li a:hover {
        color: #8E8E8E;
    }
    .dashboardMobileNavOverflow ul li a .fas {
        color: #1B9CF3;
        padding-right: 10px;
    }

    .logoutBtn {
        background-color: #1B9CF3;
        border-radius: 20px;
        cursor: pointer;
        color: #FFF;
        width: 100%;
        border: none;
        font-size: 16px;
        align-self: flex-end;
        margin: 20px 0;
        padding: 7px 10px;
        box-sizing: border-box;
        transition: 0.3s;
    }
    .logoutBtn:hover {
        background-color: #1687D3;
    }

    @media only screen and (min-width: 850.1px) {
        .mobileDashboardNavigation {display: none;}
        .dashboardMobileNavigation {display: none;}
    }
    @media only screen and (max-width: 850px) {
        .dashboardNavigaiton {display: none;}
    }
</style>