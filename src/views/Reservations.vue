<template>
    <div id="reservation" class="viewContainer">
        <div>
            <div class="outOfStockContainer"> 
                <h1>Reservations</h1>
                <p>Navigate through customer product reservations to view their details and contact them.</p>
            </div>

            <div class="reservationNavigationContainer">
                <div v-on:click="activeFilter('all'); reloadReservations();" @click="selected = 1" :class="{highlight:selected == 1}" class="col">
                    <font-awesome-icon class="fas" icon="list-ul" />
                    <p>All</p>
                </div>
                <div v-on:click="activeFilter('processing')" @click="selected = 2" :class="{highlight:selected == 2}" class="col">
                    <font-awesome-icon class="fas" icon="pause-circle" />
                    <p>Processing</p>
                </div>
                <div v-on:click="activeFilter('completed')" @click="selected = 3" :class="{highlight:selected == 3}" class="col">
                    <font-awesome-icon class="fas" icon="clipboard-check" />
                    <p>Complete</p>
                </div>
                <div v-on:click="activeFilter('cancelled')" @click="selected = 4" :class="{highlight:selected == 4}" class="col">
                    <font-awesome-icon class="fas" icon="trash-alt" />
                    <p>Cancelled</p>
                </div>
                <div class="overlayWrapper" :style="slideActive"></div>
            </div>

            <div v-if="!emptyStore" class="reservationResultsContainer"> 
                <!-- Reservation Results Title Row -->
                <div class="reservationRow reservationTitleRow">
                    <div class="reservationCol idHide">
                        <p class="reservationTableTitle">Order</p>
                    </div>
                    <div class="reservationCol phoneHide">
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
                    <div class="reservationCol  phoneHide">
                        <p>{{ reservation.user_phone }}</p>
                    </div>
                    <div class="reservationCol">
                        <p>{{ reservation.date }}</p>
                    </div>
                    <div class="reservationCol statusHide">
                        <button class="processing" v-bind:class="{ completed: reservation.status == 'completed', cancelled: reservation.status == 'cancelled'  }">{{ reservation.status }}</button> 
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!emptyStore" class="dashboardContentRow2">
          <button class="loadMoreBtn" v-on:click="loadMore(reservationStatus)"><p v-if="loadMoreError">No More</p><p v-if="!loadMoreError">Load More</p></button>
        </div>

    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore';

export default {
    name: 'reservation',
    data: function() {
        return {
            slideActive: 'left: 0;',
            selected: 1,
            emptyStore: false,
            reservations: [],
            lastVisibleData: [],
            loadMoreError: false,
            reservationStatus: 'all',
        };
    },
    created() {
        // Loads product data and enters into array on page load
        const db = firebase.firestore()
        db.collection("reservations").orderBy('date', "desc").limit(10).get().then(querySnapshot => {

            //Sets the last visable product so it knows where to call more from
            var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
            //console.log("last", lastVisible);
            this.lastVisibleData = lastVisible

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
                this.emptyStore = true
            }
        })
    },
    mounted() {
        
    },
    methods: {
        //Controls the filter navigation & loading for "processing", "complete" and "deleted" reserations
        activeFilter(status) {
            if(status == 'all') {
                this.slideActive = 'left: 0;' 
                this.reservationStatus = 'all'
            }
            if(status == 'processing') {
                this.slideActive = 'left: 25%;'
                this.reservationStatus = 'processing'
            }
            if(status == 'completed') {
                this.slideActive = 'left: 50%;'
                this.reservationStatus = 'complete'
            }
            if(status == 'cancelled') {
                this.slideActive = 'left: 75%;'
                this.reservationStatus = 'cancelled'
            }

            //resets the load more
            this.lastVisibleData = []
            //resets product array
            this.reservations = []

            if(this.lastVisibleData === undefined || this.lastVisibleData.length == 0) {
                this.loadMoreError = false
                // Gets product data and enters into the array
                const db = firebase.firestore()
                db.collection("reservations").where("status", "==", status).orderBy('date', "desc").limit(10).get().then(querySnapshot => {
                    
                    //Sets the last visable product so it knows where to call more from
                    var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
                    //console.log("last", lastVisible);
                    this.lastVisibleData = lastVisible

                    querySnapshot.forEach(doc => {
                        const data = {
                            'id': doc.id,
                            'date': doc.data().date,
                            'user_phone': doc.data().user_phone,
                            'status': doc.data().status,
                        }
                        this.reservations.push(data)
                    })
                })
            }
        },
        //Controls the loading for "all"
        reloadReservations() {
            //resets the load more
            this.lastVisibleData = []
            //resets product array
            this.reservations = []

            if(this.lastVisibleData === undefined || this.lastVisibleData.length == 0) {
                this.loadMoreError = false
                // Gets product data and enters into the array
                const db = firebase.firestore()
                db.collection("reservations").orderBy('date', "desc").limit(10).get().then(querySnapshot => {
                    
                    //Sets the last visable product so it knows where to call more from
                    var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
                    //console.log("last", lastVisible);
                    this.lastVisibleData = lastVisible

                    querySnapshot.forEach(doc => {
                        const data = {
                            'id': doc.id,
                            'date': doc.data().date,
                            'user_phone': doc.data().user_phone,
                            'status': doc.data().status,
                        }
                        this.reservations.push(data)
                    })
                })
            }
        },
        //If the navigation is on "processing", "complete" or "deleted" it loads more data of that type
        //If the navigation is on "all" it loads more no matter the status
        loadMore(loadWhere) {
            if(loadWhere == 'all') {
                //If there are still more results in database load them, else set the button
                if(this.lastVisibleData !== undefined) {
                    
                    const db = firebase.firestore()
                    db.collection("reservations").orderBy('date', "desc").startAfter(this.lastVisibleData).limit(10).get().then(querySnapshot => {

                        //Sets the last visable product so it knows where to call more from
                        var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
                        //console.log("last", lastVisible);
                        this.lastVisibleData = lastVisible

                        querySnapshot.forEach(doc => {
                            const data = {
                                'id': doc.id,
                                'date': doc.data().date,
                                'user_phone': doc.data().user_phone,
                                'status': doc.data().status,
                            }
                            this.reservations.push(data)
                        })
                        //Sets the button text to stop further presses
                        if(this.lastVisibleData === undefined) {
                            this.loadMoreError = true
                        }
                    })
                } else {
                    this.loadMoreError = true
                }
            } else {
                //If there are still more results in database load them, else set the button
                if(this.lastVisibleData !== undefined) {
                    
                    const db = firebase.firestore()
                    db.collection("reservations").where("status", "==", loadWhere).orderBy('date', "desc").startAfter(this.lastVisibleData).limit(10).get().then(querySnapshot => {

                        //Sets the last visable product so it knows where to call more from
                        var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
                        //console.log("last", lastVisible);
                        this.lastVisibleData = lastVisible

                        querySnapshot.forEach(doc => {
                            const data = {
                                'id': doc.id,
                                'date': doc.data().date,
                                'user_phone': doc.data().user_phone,
                                'status': doc.data().status,
                            }
                            this.reservations.push(data)
                        })
                        //Sets the button text to stop further presses
                        if(this.lastVisibleData === undefined) {
                            this.loadMoreError = true
                        }
                    })
                } else {
                    this.loadMoreError = true
                }
            }
        },
        //Links you to the user reservation page
        viewReservation(reservationId) {
            this.$router.push({ name: 'UserReservation', params: { reservation_id: reservationId } })
        },
    }
}
</script>

<style scoped>


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
/* Reservation Filter Container */
.reservationNavigationContainer {
    width: 100%;
    height: 40px;
    background-color: #FFF;
    border-radius: 10px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    position: relative;
}
.reservationNavigationContainer .col {
    width: 25%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 20;
    position: relative;
}
.reservationNavigationContainer .col p {
    margin: 0;
    padding: 0;
    transition: 0.3s;
}
.reservationNavigationContainer .col .fas {
    padding-right: 10px;
    color: #1B9CF3;
    transition: 0.3s;
}
.reservationNavigationContainer .highlight .fas {
    color: #FFF;
} 
.reservationNavigationContainer .highlight p {
    color: #FFF;
}

.overlayWrapper {
    width: 25%;
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: #1B9CF3;
    transition: left 0.3s;
    z-index: 10;
    border-radius: 10px;
}

/* Reservation Results */
.reservationResultsContainer {
    width: 100%;
    background-color: #FFF;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-wrap: wrap;
    position: relative;
    margin-top: 10px;
    padding-top: 10px;
}
.reservationTitleRow {
    padding: 0 0 5px !important;
    cursor: default !important;
}
.reservationRow {
    width: 100%;
    background-color: #F7F7F7;
    display: flex;
    padding: 10px 0;
    cursor: pointer;
} 
.reservationRow:nth-of-type(2n+1) {
    background-color: #FFF;
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
    font-size: 14px;
    border: none;
    border-radius: 10px;
    min-width: 120px;
    cursor: pointer;
}
.completed {
    padding: 5px 20px !important;
    box-sizing: border-box !important;
    background-color: #A1F2FB;
    color: #253B3D;
    font-size: 14px;
    border: none;
    border-radius: 10px;
    min-width: 120px;
    cursor: pointer;
}
.cancelled {
    padding: 5px 20px !important;
    box-sizing: border-box !important;
    background-color: #FBA1A1;
    color: #3F2121;
    font-size: 14px;
    border: none;
    border-radius: 10px;
    min-width: 120px;
    cursor: pointer;
}

.dashboardContentRow2 {
    width: 100%;
    align-self: flex-end;
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

@media only screen and (max-width: 1100px) {
    .reservationNavigationContainer {height: auto;}
    .reservationNavigationContainer .col {padding: 10px 0;}
    .reservationNavigationContainer .col .fas {padding: 0 0 5px;}
    .reservationNavigationContainer .col p {width: 100%; text-align: center; font-size: 14px;}
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


</style>