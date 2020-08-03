<template>
    <div id="live-products" class="viewContainer">
      <div class="dashboardContentRow">
          <div class="outOfStockContainer"> 
              <h1 class="desktopPageTitle">Out of Stock Products</h1>
              <p>These are your out of stock products, either delete them, or add more stock. These are not live on your store!</p>
          </div>
 
          <div class="addProductContainer">
              <div class="addProductBtn"><router-link to="/addproduct">Add Product <font-awesome-icon class="fas" icon="plus" /></router-link></div>
          </div>
          <!-- Page Title -->
          <div class="pageFlexContainer"> 
              <!-- Col1 -->
              <div class="liveProductsContainer">
                  <div class="liveProductsWrapper">
                      <!-- Product Row -->
                      <div v-on:click="editProduct(product.id)" class="liveProductRow" :id="product.id" v-bind:key="product.id" v-for="product in products">
                          <div class="productBody">
                              <img class="productImage" :src="product.picture" alt="">
                              <div class="productInfoWrapper">
                                  <h4>{{ product.title }}</h4>
                                  <p class="stockP">Stock: {{ product.stock }}</p>
                                  <p class="descriptionP">{{ product.description }}</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <!-- Col2 -->
              <div class="productFilterContainer">
                  <div class="productFilterWrapper">
                      <h4>Filter Products</h4>
                      <div class="radioBtnWrapper">
                          <label class="container">Date
                              <input v-model="radioChecked" v-bind:value="'date_added'" type="radio" checked="checked" name="radio">
                              <span class="checkmark"></span>
                          </label>
                          <label class="container">Title
                              <input v-model="radioChecked" v-bind:value="'title'" type="radio" name="radio">
                              <span class="checkmark"></span>
                          </label>
                          <button @click="updateSearch" class="searchFilterBtn">Search <font-awesome-icon class="fas" icon="search" /></button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div v-if="!emptyStore" class="dashboardContentRow2">
          <button class="loadMoreBtn" v-on:click="loadMore"><p v-if="loadMoreError">No More</p><p v-if="!loadMoreError">Load More</p></button>
      </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore';

export default {
    name: 'live-products',
    components: {

    },
    data: function() {
        return {
            products: [],
            productId: '',
            emptyStore: false,
            lastVisibleData: [],
            loadMoreError: false,
            radioChecked: 'date_added',
            displayOrder: 'asc'
        };
    },
    created() { 
            // Loads product data and enters into array on page load
            const db = firebase.firestore()
            db.collection("products").where("stock", '<=', 0).orderBy('stock').orderBy(this.radioChecked, "desc").limit(6).get().then(querySnapshot => {

                //Sets the last visable product so it knows where to call more from
                var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
                //console.log("last", lastVisible);
                this.lastVisibleData = lastVisible

                querySnapshot.forEach(doc => {
                    const data = {
                        'id': doc.id,
                        'title': doc.data().title,
                        'description': doc.data().description,
                        'picture': doc.data().picture,
                        'stock': doc.data().stock,
                    }
                    this.products.push(data)
                })
                //Checks if the array is not set any data, then shows the "No products"
                if(this.products === undefined || this.products.length == 0) {
                  this.emptyStore = true
                }
            })

    },
    methods: {
        //Loads more products
        loadMore() {

            if (this.radioChecked == 'date_added') {
              this.displayOrder = 'desc'
            } else {
              this.displayOrder = 'asc'
            }

            //If there are still more results in database load them, else set the button
            if(this.lastVisibleData !== undefined) {
                
                const db = firebase.firestore()
                db.collection("products").where("stock", '<=', 0).orderBy('stock').orderBy(this.radioChecked, this.displayOrder).startAfter(this.lastVisibleData).limit(6).get().then(querySnapshot => {

                    //Sets the last visable product so it knows where to call more from
                    var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
                    //console.log("last", lastVisible);
                    this.lastVisibleData = lastVisible

                    querySnapshot.forEach(doc => {
                        const data = {
                            'id': doc.id,
                            'title': doc.data().title,
                            'description': doc.data().description,
                            'picture': doc.data().picture,
                            'stock': doc.data().stock,
                        }
                        this.products.push(data)
                    })
                    //Sets the button text to stop further presses
                    if(this.lastVisibleData === undefined) {
                        this.loadMoreError = true
                    }
                })
            } else {
                this.loadMoreError = true
            }
        },
        //Takes you to the edit product page of particular product
        editProduct(productId) {
             this.$router.push({ name: 'EditProduct', params: { product_id: productId } })
        },
        //Loads product data on the filter button press
        updateSearch() {

            //resets the load more
            this.lastVisibleData = []
            //resets product array
            this.products = []

            if (this.radioChecked == 'date_added') {
              this.displayOrder = 'desc'
            } else {
              this.displayOrder = 'asc'
            }

            if(this.lastVisibleData === undefined || this.lastVisibleData.length == 0) {
                this.loadMoreError = false
                // Gets product data and enters into the array
                const db = firebase.firestore()
                db.collection("products").where("stock", '<=', 0).orderBy('stock').orderBy(this.radioChecked, this.displayOrder).limit(6).get().then(querySnapshot => {
                    
                    //Sets the last visable product so it knows where to call more from
                    var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
                    //console.log("last", lastVisible);
                    this.lastVisibleData = lastVisible

                    querySnapshot.forEach(doc => {
                        const data = {
                            'id': doc.id,
                            'title': doc.data().title,
                            'description': doc.data().description,
                            'picture': doc.data().picture,
                            'stock': doc.data().stock,
                        }
                        this.products.push(data)
                    })
                })
            }

        },
    },
}
</script>

<style scoped>
/* Page Content */
.dashboardPageContentContainer {
    padding-left: 250px;
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    position: relative;
}
.dashboardPageWrapper {
    position: absolute;
    left: 250px;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 40px 20px 0;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    z-index: 100;
}
.dashboardContentRow {
    width: 100%;
    align-self: flex-start;
}
.dashboardContentRow2 {
    width: 100%;
    align-self: flex-end;
}
.dashboardPageWrapper h1 {
    font-size: 24px;
    font-weight: bold;
    padding: 0 0 20px;
    margin: 0;
}

/* Product Styling */
.liveProductRow {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    background-color: #FFF;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    cursor: pointer;
 
}
.liveProductRow:last-child {
    margin-bottom: 0;
}

.productBody {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
}
.productImage {
    height: 100%;
    min-height: 80px;
    width: 80px;
    min-width: 80px;
    object-fit: cover;
    border-radius: 5px;
}
.productInfoWrapper {
    box-sizing: border-box;
    padding-left: 10px;
}
.productInfoWrapper h4 {
    margin: 0;
    padding: 0;   
    font-size: 16px;
    font-weight: bold;
    line-height: 18px;
    max-height: 36px;
    overflow: hidden;
}
.stockP {
    margin: 0;
    padding: 5px 0;
    font-size: 14px;
    line-height: 14px;   
    width: 100%;
}
.descriptionP {
    margin: 0;
    padding: 0;
    font-size: 16px;
    line-height: 16px;
    max-height: 32px;
    overflow: hidden;   
}

.outOfStockContainer {
    border-left: 4px solid #1B9CF3;
    background-color: #FFF;
    border-radius: 0px 10px 10px 0px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}
.outOfStockContainer h1 {
    font-size: 18px;
    padding: 10px 10px 5px;
    box-sizing: border-box;
    margin: 0;
}
.outOfStockContainer p {
    padding: 5px 10px 10px;
    box-sizing: border-box;
    font-size: 14px;
    margin: 0;
}

.loadMoreBtn {
    padding: 7px 40px;
    background-color: #1B9CF3;
    border: none;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s;
    cursor: pointer;
    margin: 20px 0 20px;
}
.loadMoreBtn p {
    padding: 0;
    margin: 0;
    font-size: 14px;
    color: #FFF;
}
.loadMoreBtn:hover {
    background-color: #1687D3;
}


/* Add Product Btn */
.addProductContainer {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    padding-bottom: 20px;
}
.addProductBtn {
    border-radius: 5px;
    background-color: #FDFDFD;
    cursor: pointer;
    transition: 0.3s;
    z-index: 1000;
    border: 1px solid #D2D2D2;
}
.addProductBtn:hover {
    background-color: #1B9CF3;
    border: 1px solid #1B9CF3;
}
.addProductBtn:hover .fas {
    color: #FFF;
}
.addProductBtn .fas {
    color: #242424;
    transition: 0.3s;
    padding-left: 5px;
    font-size: 10px;
}
.addProductBtn:hover a {
    color: #FFF;
}
.addProductBtn a {
    display: block;
    font-size: 13px;
    padding: 7px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    color: #242424;
    transition: 0.3s;
}

/* Col container */
.pageFlexContainer {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    position: relative;
}
/* Col1 */
.liveProductsContainer {
    width: 100%;
    padding-right: 370px;
    box-sizing: border-box;
}
.liveProductsWrapper {
    width: 100%;
    background-color: transparent;
    padding: 0;
    box-sizing: border-box;
}
.mobilePageTitle {
    font-size: 18px !important;
    padding-bottom: 10px !important;
}
/* Col2 */
.productFilterContainer {
    width: 350px;
    box-sizing: border-box;
    position: absolute;
    right: 0;
    top: 0;
}
.productFilterWrapper {
    width: 100%;
    border-radius: 10px;
    background-color: #FFF;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1); 
}
.productFilterWrapper h4 {
    margin: 0;
    padding: 0;
    font-size: 16px;
    font-weight: bold;
}
.radioBtnWrapper {
    padding-top: 10px;
}
/* Radio Btn Start */
.container {
  display: block;
  position: relative;
  padding-left: 30px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 16px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.container:last-child {
    margin-bottom: 0;
}
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #E6E6E6;
  border-radius: 50%;
}
.container:hover input ~ .checkmark {
  background-color: #ccc;
}
.container input:checked ~ .checkmark {
  background-color: #1B9CF3;
  border: 1px solid #015D98;
  box-sizing: border-box;
}
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
.container input:checked ~ .checkmark:after {
  display: block;
}
.container .checkmark:after {
    top: 5px;
    left: 5px;
    width: 8px;
	height: 8px;
	border-radius: 50%;
	background: #F5F5F5;
}
/* Radio Btn End */
.searchFilterBtn {
    background-color: #1B9CF3;
    border: none;
    border-radius: 20px;
    padding: 7px 40px;
    color: #FFF;
    cursor: pointer;
    transition: 0.3s;
    margin-top: 10px;
    font-size: 14px;
    width: 100%;
}
.searchFilterBtn:hover {
    background-color: #1687D3;
    color: #D8D8D8;
}
.searchFilterBtn .fas {
    padding-left: 5px;
    color: #FFF;
    transition: 0.3s;
    font-size: 14px;
}
.searchFilterBtn:hover .fas {
    color: #D8D8D8;
}
@media only screen and (min-width: 1100.1px) {
    .mobilePageTitle {display: none;}
}
@media only screen and (max-width: 1100px) {
    .pageFlexContainer {flex-wrap: wrap-reverse;}
    /* Product Col 1 */
    .liveProductsContainer {width: 100%;padding-right: 0;}
    /* Product Col 2 */
    .productFilterContainer {width: 100%;position: relative;right: auto;top: auto;margin-bottom: 20px;} 
    .outOfStockContainer {margin-bottom: 10px;}
    .addProductContainer {justify-content: flex-start;}
    .searchFilterBtn {width: auto;}
}
@media only screen and (max-width: 850px) {
    .dashboardPageContentContainer {padding-left: 0;}
    .routerPageContainer {top: 60px !important;}
    .dashboardPageWrapper {padding: 20px 40px 0; left: 0;}
}
@media only screen and (max-width: 510px) {
    .dashboardPageWrapper {padding: 20px 20px 0;}

}

</style>