<template>
    <div id="dashboard" class="viewContainer">
        <div>
            <div class="outOfStockContainer"> 
                <h1>Dashboard</h1>
                <p>The dashboard displays bite size bits of information from each page you may want to visit.</p>
            </div>
            <div class="addProductContainer">
                <div class="addProductBtn"><router-link to="/addproduct">Add Product <font-awesome-icon class="fas" icon="plus" /></router-link></div>
            </div>
            <!-- Page Title -->
            
            <div class="pageFlexContainer">
                <!-- Col 1 -->
                <div class="dashboardCol1">
                    <div class="recentReservationsWrapper">
                        <div class="reservationWrapperPadding">
                            <h4 class="infoPreviewTitle">Recent Reservations</h4>
                            <p class="wrapperP">These are your most recent product reservations. Go to the reservation page to manage who you have contacted!</p>
                        </div>
                        <!-- Reservation Results Title Row -->
                        <div v-if="!emptyReservations" class="reservationRow reservationTitleRow">
                            <div class="reservationCol idHide">
                                <p class="reservationTableTitle">Order</p>
                            </div>
                            <div class="reservationCol phoneHide tabletHide">
                                <p class="reservationTableTitle">Phone</p>
                            </div>
                            <div class="reservationCol">
                                <p class="reservationTableTitle">Date</p>
                            </div>
                            <div class="reservationCol statusHide">
                                <p class="reservationTableTitle">Status</p>
                            </div>
                        </div>
                        <!-- Reservation Results -->
                        <div v-on:click="viewReservation(reservation.id)" v-bind:key="reservation.id" v-for="reservation in reservations" class="reservationRow">
                            <div class="reservationCol idHide">
                                <p>#{{ reservation.id }}</p>
                            </div>
                            <div class="reservationCol  tabletHide phoneHide">
                                <p>{{ reservation.user_phone }}</p>
                            </div>
                            <div class="reservationCol">
                                <p>{{ reservation.date }}</p>
                            </div>
                            <div class="reservationCol statusHide">   
                                <button class="processing" v-bind:class="{ completed: reservation.status == 'completed', cancelled: reservation.status == 'cancelled'  }">{{ reservation.status }}</button> 
                            </div>
                        </div>
                        <div class="reservationWrapperPadding">
                            <button class="dashboardWrappersBtn"><router-link to="/reservations">Reservations</router-link></button>
                        </div>
                    </div>
                    
                    <div class="outOfStockProductsWrapper">
                        <h4 class="infoPreviewTitle">Out of Stock Products</h4>
                        <p class="wrapperP">These products are out of stock due to recent reservations, either delete them or add more stock so that it can appear on the store page again!</p>
                        <div v-on:click="editProduct(outOfStockProduct.id)" class="liveProductRow" :id="outOfStockProduct.id" v-bind:key="outOfStockProduct.id" v-for="outOfStockProduct in outOfStockProducts">
                            <div class="productBody">
                                <img class="productImage" :src="outOfStockProduct.picture" alt="">
                                <div class="productInfoWrapper">
                                    <h4>{{ outOfStockProduct.title }}</h4>
                                    <p class="stockP">Stock: {{ outOfStockProduct.stock }}</p>
                                    <p class="descriptionP">{{ outOfStockProduct.description }}</p>
                                </div>
                            </div>
                        </div>
                        <button class="dashboardWrappersBtn recentProductBtn"><router-link to="/outofstock">Out of Stock</router-link></button>
                    </div>
                </div>
                <!-- Col 2 -->
                <div class="dashboardCol2">
                    <div class="recentProducts">
                        <h4 class="infoPreviewTitle">Recently Added Products</h4>
                        <p class="wrapperP">These are your 3 latest products that have been added to your store! Go to the Live Product page to see more.</p>
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
                        <button class="dashboardWrappersBtn recentProductBtn"><router-link to="/liveproducts">Live Products</router-link></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore';

export default {
    name: 'dashboard',
    components: {
     
    },
    data: function() {
        return {
            products: [],
            outOfStockProducts: [],
            reservations: [],
            emptyReservations: false,
        };
    },
    created() {

            //For Recently added products
            // Loads product data and enters into array on page load
            const db = firebase.firestore()
            db.collection("products").where("stock", '>', 0).orderBy('stock').orderBy('date_added', "desc").limit(4).get().then(querySnapshot => {

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
            //For out of stock products
            // Loads product data and enters into array on page load
            db.collection("products").where("stock", '<=', 0).orderBy('stock').orderBy('date_added', "desc").limit(4).get().then(querySnapshot => {

                querySnapshot.forEach(doc => {
                    const data = {
                        'id': doc.id,
                        'title': doc.data().title,
                        'description': doc.data().description,
                        'picture': doc.data().picture,
                        'stock': doc.data().stock,
                    }
                    this.outOfStockProducts.push(data)
                })
            })

            //For Reservations
            db.collection("reservations").orderBy('date', "desc").limit(4).get().then(querySnapshot => {

                querySnapshot.forEach(doc => {
                    const data = {
                        'id': doc.id,
                        'date': doc.data().date,
                        'user_phone': doc.data().user_phone,
                        'status': doc.data().status,
                    }
                    this.reservations.push(data)
                })
                //Checks if the array is not set any data, then shows the "No products"
                if(this.reservations === undefined || this.reservations.length == 0) {
                    this.emptyReservations = true
                }
            })

    },
    methods: {
        //Takes you to the edit product page of particular product
        editProduct(productId) {
             this.$router.push({ name: 'EditProduct', params: { product_id: productId } })
        },
        //Links you to the user reservation page
        viewReservation(reservationId) {
            this.$router.push({ name: 'UserReservation', params: { reservation_id: reservationId } })
        },
    },
}
</script>

<style scoped>
.routerPageContainer {
    top: 0 !important;
}
/* Page Content */
.dashboardPageContentContainer {
    padding-left: 250px;
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    position: relative;
}
.dashboardPageWrapper {
    width: 100%;
    padding: 40px 20px 20px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    z-index: 100;
}
.dashboardPageWrapper h1 {
    font-size: 24px;
    font-weight: bold;
    padding: 0 0 20px;
    margin: 0;
}

/* Page Notification */
.outOfStockContainer {
    width: 100%;
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

/* Page Content */
.pageFlexContainer {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}
.infoPreviewTitle {
    margin: 0;
    padding: 0 0 5px;
}
.wrapperP {
    margin: 0;
    padding: 0 0 10px;
    font-size: 14px;
}
.dashboardWrappersBtn {
    background-color: #1B9CF3;
    border: none;
    border-radius: 20px;
    padding: 0;
    color: #FFF;
    cursor: pointer;
    transition: 0.3s;
    font-size: 14px;
}
.dashboardWrappersBtn a {
    padding: 7px 40px;
    display: block;
    
}
.recentProductBtn {
    margin-top: 0;
}
.dashboardWrappersBtn:hover {
    background-color: #1687D3;
}
.dashboardWrappersBtn:hover a {
    color: #D8D8D8;
}
.dashboardWrappersBtn a {
    text-decoration: none;
    color: #FFF;
    transition: 0.3s;
}
/* Col 1 */
.dashboardCol1 {
    width: 50%;
    padding-right: 10px;
    box-sizing: border-box;
} 
/* Recent Reservations */
.recentReservationsWrapper {
    width: 100%;
    background-color: #FFF;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-wrap: wrap;
    position: relative;
    margin-bottom: 20px;
} 
.reservationWrapperPadding {
    padding: 10px;
}
.reservationTitleRow {
    padding: 0 0 5px !important;
    cursor: default !important;
}
.reservationRow {
    width: 100%;
    background-color: #FFF;
    display: flex;
    padding: 10px 0;
    cursor: pointer;
} 
.reservationRow:nth-of-type(2n+1) {
     background-color: #F7F7F7;
}
.reservationCol {
    width: 25%;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
}
.reservationCol p {
    margin: 0;
    padding: 0;
    font-size: 16px;
    line-height: 16px;
    height: 16px;
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis; 
}
.reservationTableTitle {
    font-weight: bold;
}

.processing {
    padding: 5px 20px !important;
    box-sizing: border-box !important;
    background-color: #B0FBA1;
    color: #1B4413;
    font-size: 16px;
    border: none;
    border-radius: 10px;
    min-width: 120px;
}
.completed {
    padding: 5px 20px !important;
    box-sizing: border-box !important;
    background-color: #A1F2FB;
    color: #253B3D;
    font-size: 16px;
    border: none;
    border-radius: 10px;
    min-width: 120px;
}
.cancelled {
    padding: 5px 20px !important;
    box-sizing: border-box !important;
    background-color: #FBA1A1;
    color: #3F2121;
    font-size: 16px;
    border: none;
    border-radius: 10px;
    min-width: 120px;
}
/* Out of Stock Products */
.outOfStockProductsWrapper {
    width: 100%;
    border-radius: 10px;
    background-color: #FFF;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1); 
    margin-bottom: 20px;
} 
/* Col 2 */
.dashboardCol2 {
    width: 50%;
    padding-left: 10px;
    box-sizing: border-box;
} 
/* Recent Products */
.recentProducts {
    width: 100%;
    border-radius: 10px;
    background-color: #FFF;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1); 
    margin-bottom: 20px;
}
/* Product Styling */
.liveProductRow {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    background-color: #F7F7F7;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    margin-bottom: 10px;
    cursor: pointer;
}

.productBody {
    width: 100%;
    max-height: 100px;
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
@media only screen and (max-width: 1400px) {
    .tabletHide {display: none;}

    .reservationCol {width: 33.33%;}
}

@media only screen and (max-width: 1100px) {
    .outOfStockContainer {margin-bottom: 10px;}
    .addProductContainer {justify-content: flex-start;}
    .dashboardPageWrapper h1 {font-size: 18px;}

    .dashboardCol1 {width: 100%; padding: 0;}
    .dashboardCol2 {width: 100%; padding: 0;}

    .tabletHide {display: flex;}
    .reservationCol {width: 25%;}
}
@media only screen and (max-width: 850px) {
    .dashboardPageContentContainer {padding-left: 0;}
    .dashboardPageWrapper {padding: 20px 40px;}
    .routerPageContainer {top: 60px !important;}
}
/* For reservations */
@media only screen and (max-width: 700px) { 
    .hideMobile {display: none;}
    .tableCol {width: 33.33%}
}
@media only screen and (max-width: 600px) {
    .idHide {display: none;}
    .reservationCol {width: 30%;}
    .statusHide {width: 40%;}
}
@media only screen and (max-width: 400px) { 
    .phoneHide {display: none;}
    .reservationCol {width: 50%;}
    .statusHide {width: 50%;}
}
/* For reservations ^^^ */
@media only screen and (max-width: 510px) {
    .dashboardPageWrapper {padding: 20px;}
}

</style>