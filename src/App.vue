<template>
  <div id="app">
    <vue-loading-component />
    <Navigation :class="[($route.path == '/login' ? 'hideNavigation' : '')]"/>
    <div class="siteContainer" :class="[($route.path == '/login' ? 'editContainer' : '')]">
      <div class="siteWrapper">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation'

export default {
  name: 'dashboard',
  components: {
    Navigation
  },
  created() {
    var today = new Date().getHours();
    var body = document.body;
    if (today >= 7 && today <= 19) {
      body.classList.remove("nightTime");
    } else {
        body.classList.add("nightTime");
    }
  }
}
</script>

<style>
html {
  -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
  -webkit-tap-highlight-color: transparent !important;
   height: 100%;
}
body {
  padding: 0;
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #FAFAFA;
  min-height: 100%;
}
select:focus {
  outline: none;
  border: 1px solid #0080D5;
}
::selection {
    background-color: #0080D5;
    color: #FFF;
}
button:focus {
  outline: none;
}
input:focus {
  outline: none;
}
textarea:focus {
  outline: none;
}
.dashboardNavigationOverflow .simplebar-content {
    height: 100% !important;
    display: flex !important;
    flex-wrap: wrap !important;
    box-sizing: border-box !important;
}
.dashboardMobileNavOverflow .simplebar-content {
    height: 100% !important;
    display: flex !important;
    flex-wrap: wrap !important;
    box-sizing: border-box !important;
} 
.siteContainer {
  position: absolute;
  top: 0;
  left: 250px;
  bottom: 0;
  right: 0;
  min-height: 100%;
  box-sizing: border-box;
}
.siteWrapper {
  width: 100%;
  height: 100%;
  min-height: 100%;
  padding: 20px 20px 0;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  z-index: 100;
}
.viewContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.editContainer {
  left: 0;
}
.editContainer .viewContainer {
  justify-content: flex-start !important;
}
@media only screen and (max-width: 850px) {
  .siteContainer {left: 0; padding-top: 60px;}
}
</style>
