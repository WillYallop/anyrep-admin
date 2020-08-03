<template>
    <div id="user-reservation" class="viewContainer">
        <div>
            <div class="outOfStockContainer"> 
                <h1>Reservation Details</h1>
                <p class="productIdP"><b>ID:</b> {{ reservationId }}</p>
                <p><b>Reserved at:</b> {{ resTime }} on {{ resDate }}</p>
            </div>
            <div class="reservationDetailsWrapper">
                <div class="reservationCol">
                    <h4>General</h4>
                    <p class="inputLabel">Date Reserved:</p>
                    <div class="dateInputWrapper"> 
                        <input v-model="resDate" class="inputStlye dateInput" placeholder="Date" type="text">
                        <input v-model="resTime" class="inputStlye dateInput" placeholder="Time" type="text">
                    </div>
                    <p class="inputLabel">Status:</p>
                    <select v-model="resStatus" class="inputStyle selectStyle">
                        <option :value="null" disabled>Status</option>
                        <option>processing</option>
                        <option>completed</option>
                        <option>cancelled</option>
                    </select>
                    <button v-on:click="updateStatus" class="updateStatusBtn">Update Status</button>
                </div>
                <div class="reservationCol">
                    <h4 class="mobileH4">Details</h4>
                    <p class="inputLabel">Name:</p>
                    <input v-model="userName" class="inputStlye" placeholder="Name" type="text" >
                    <p class="inputLabel">Email:</p>
                    <input v-model="userEmail" class="inputStlye" placeholder="Email" type="text" >
                    <p class="inputLabel">Phone:</p>
                    <input v-model="userPhone" class="inputStlye" placeholder="Phone" type="text" >
                    <p class="inputLabel">Address:</p>
                    <input v-model="userAddress" class="inputStlye" placeholder="Address" type="text" >
                </div>
                <div class="reservationCol">
                    <h4 class="mobileH4">Info</h4>
                    <p class="inputLabel">Message:</p>
                    <textarea v-model="userMessage" class="inputStlye textareaStyle"></textarea>
                </div>
            </div>
            <div class="productInfoContainer">
                <h4>Product Reserved</h4>
                <div v-on:click="editProduct(prodId)" class="liveProductRow">
                    <div class="productBody">
                        <img class="productImage" :src="productPicture" alt="">
                        <div class="productInfoWrapper">
                            <h4>{{ productTitle }}</h4>
                            <p class="stockP">Stock: {{ productStock }}</p>
                            <p class="priceP">Price: {{ productPrice }}</p>
                            <p class="descriptionP">{{ productDescription }}</p>
                        </div>
                    </div>
                </div>
            </div>
      </div>
      <div class="contactUserWrapper">  
            <a :href="telLink" class="callBtn">Call</a>
            <a :href="emailLink" class="emailBtn">Email</a>
      </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore';
const db = firebase.firestore()

export default {
    name: 'user-reservation',
    components: {
        
    },
    data: function() {
        return {
            //Reservation Data
            reservationId: null,
            resDate: '',
            prodId: '',
            resStatus: '',
            resTime: '',
            userAddress: '',
            userMessage: '',
            userName: '',
            userPhone: '',
            userEmail: '',
            telLink: 'tel:' + this.userPhone,
            emailLink: 'mailto:' + this.userEmail,
            //Product Data
            productPicture: '',
            productTitle: '', 
            productPrice: '', 
            productStock: '',
            productDescription: ''
        };
    },
    created() {
        this.reservationId = this.$route.params.reservation_id

        const db = firebase.firestore()
        db.collection("reservations").doc(this.reservationId).get().then(doc => {
            
            this.resDate = doc.data().date
            this.prodId = doc.data().product_id
            this.resStatus = doc.data().status
            this.resTime = doc.data().time
            this.userAddress = doc.data().user_address
            this.userMessage = doc.data().user_message
            this.userName = doc.data().user_name
            this.userPhone = doc.data().user_phone
            this.userEmail = doc.data().user_email       

      })
      .catch(err => {
        console.log('Error getting document', err);
      }).then (() => {

            this.telLink = 'tel:' + this.userPhone
            this.emailLink = 'mailto:' + this.userEmail
            this.loadProduct(this.prodId)   

        })
    },
    mounted() {
        
    },
    methods: {
        //Updates the status of the reservation
        updateStatus() {
            return db.collection('reservations').doc(this.reservationId).update({
                status: this.resStatus,
     
            }).then (() => {
                //If the product is being set to complete, take away 1 from the product stock
                if(this.resStatus == 'completed') {
                    var newStock = this.productStock - 1;  
                    console.log(newStock)

                    return db.collection('products').doc(this.prodId).update({
                    stock: newStock,
        
                    }).then (() => {
                        this.$router.push({ path: '/reservations' })
                    })
                } else {
                    this.$router.push({ path: '/reservations' })
                }
            })
        },
        //Loads the data of the product that has been reserved, its called on creation in the load reservation data
        loadProduct(productId) {
            
            //Once the reservatuion data has loaded, use the product id to load product data
            db.collection("products").doc(productId).get().then(doc => {
                this.productPicture = doc.data().picture
                this.productTitle = doc.data().title
                this.productPrice = doc.data().price
                this.productStock = doc.data().stock
                this.productDescription = doc.data().description
            })
            .catch(err => {
                console.log('Error getting document', err);
            })
        },
        //Takes you to the edit product page of particular product
        editProduct(productId) {
             this.$router.push({ name: 'EditProduct', params: { product_id: productId } })
        },
    }
}

</script>

<style scoped>
.outOfStockContainer {
    width: 100%;
    border-left: 4px solid #1B9CF3;
    background-color: #FFF;
    border-radius: 0px 10px 10px 0px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
}
.outOfStockContainer h1 {
    font-size: 18px;
    padding: 10px 10px 5px;
    box-sizing: border-box;
    margin: 0;
}
.outOfStockContainer p {
    padding: 3px 10px 10px;
    font-size: 14px;
    margin: 0;
}
.productIdP {
    margin: 0;
    padding: 5px 10px 0 !important;
}
/* Reservation Details Container */
.reservationDetailsWrapper {
    width: 100%;
    border-radius: 10px;
    background-color: #FFF;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px 10px 0;
    box-sizing: border-box;
}
.reservationCol {
    width: 33.33%;
    padding-right: 20px;
    box-sizing: border-box;
}
.reservationCol:last-child {
    padding-right: 0;
}
.reservationCol h4 {
    margin: 0;
    padding: 0 0 20px;
}
.inputLabel {
    font-size: 14px;
    margin: 0;
    padding: 0 0 5px;
}
.inputStlye {
    height: 35px;
    padding: 0 10px;
    box-sizing: border-box;
    background-color: #F9F9F9;
    border: 1px solid #EFEFEF;
    border-radius: 5px;
    width: 100%;
    margin-bottom: 10px;
}
.textareaStyle {
    resize: none;
    height: 200px;
    padding: 10px;
    font-family: Arial, Helvetica, sans-serif;
}
.selectStyle {
    padding: 0 6px !important;
    height: 35px;
    box-sizing: border-box;
    background-color: #F9F9F9;
    border: 1px solid #EFEFEF;
    border-radius: 5px;
    width: 100%;
    margin-bottom: 10px;
}
/* General col */
.dateInputWrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.dateInput {
    width: 48%;
}

.updateStatusBtn {
    padding: 7px 40px;
    background-color: #1B9CF3;
    border: none;
    border-radius: 20px;
    transition: 0.3s;
    font-size: 14px;
    color: #FFF;
    cursor: pointer;
    margin-bottom: 10px;
}

/* Prodct Info */
.productInfoContainer {
    width: 100%;
    margin-bottom: 20px;
}
.productInfoContainer h4 {
    margin: 0;
    padding: 0 0 10px;
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
.priceP {
    margin: 0;
    padding: 0 0 5px 0;
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

/* Contact Area */
.contactUserWrapper {
    width: 100%;
    margin: 10px 0 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.contactUserWrapper a {
    display: block;
    width: 49%;
    padding: 7px 0;
    box-sizing: border-box;
    border-radius: 20px;
    border: none;
    color: #FFF;
    font-size: 16px;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
}
.callBtn {
    background-color: #43B51F;
    transition: 0.3s;
}
.callBtn:hover{
    background-color: #39991A;
}
.emailBtn {
    background-color: #1B9CF3;
    transition: 0.3s;

}
.emailBtn:hover {
    background-color: #1687D3;
}

@media only screen and (max-width: 1100px) {
    .outOfStockContainer {margin-bottom: 20px;}
    .reservationCol {width: 100%; padding-right: 0;}
    .mobileH4 {padding-top: 10px !important;}
}
@media only screen and (max-width: 500px) {
    .contactUserWrapper a {width: 100%;}
    .callBtn {margin-bottom: 10px;}
}
</style>