<template>
    <div id="dashboard" class="viewContainer">
        <div>
            <div class="outOfStockContainer"> 
                <h1>Edit Product</h1>
                <p class="productIdP"><b>ID:</b> {{ productId }}</p>
                <p><b>Live since:</b> {{ productTime }} on {{ productDate }}</p>
            </div>

            <div class="productContainer">
                <!-- Col 1 -->
                <div class="productMainInfoContainer">
                    <div class="productMainInfoWrapper">
                        <p class="inputLabel">Title</p>
                        <input v-model="productTitle" class="inputStyle" type="text" placeholder="Name">
                        <p class="inputLabel">Price</p>
                        <input v-model="productPrice" class="inputStyle" type="text" placeholder="Price">
                        <p class="inputLabel">Stock</p>
                        <input v-model="productStock" class="inputStyle" type="text" placeholder="Stock">
                        <p class="inputLabel">Model Number</p>
                        <input v-model="productModel" class="inputStyle" type="text" placeholder="Model Number">
                        <p class="inputLabel">Brand</p>
                        <input v-model="productBrand" class="inputStyle" type="text" placeholder="Brand">
                        <p class="inputLabel">Description</p>
                        <textarea v-model="productDescription" class="productTextarea" placeholder="Product Description"></textarea>
                    </div>

                    <div class="updateDeleteMobileBtns">
                        <button class="uploadBtn" v-on:click="updateProduct">Update <font-awesome-icon class="fas" icon="upload" /></button>
                        <button v-on:click="deleteProduct" class="deleteProduct">Delete <font-awesome-icon class="fas" icon="trash" /></button>
                    </div>
                </div>
                <!-- Col 2 -->
                <div class="productOtherInfoContainer">
                    <div class="productOtherInfoWrapper">
                        <div class="topHalf"> 
                            <div class="coverImagePreview">
                                <img class="coverImagePreviewImage" :src="productPicture">
                                <div @click="pickProduct" class="coverImagePreviewOverlay">
                                    <font-awesome-icon class="fas" icon="arrow-circle-up" />
                                </div>
                            </div>
                            <input type="file" style="display: none;" ref="coverImageInput" accept="image/*" @change="onProductPicked" >
                            <p class="inputLabel">Category</p>
                            <select v-model="productCategory" class="inputStyle selectStyle">
                                <option :value="null" disabled>Category</option>
                                <option>Washing Machines</option>
                                <option>Dishwasher</option>
                                <option>Cooker</option>
                                <option>Fridge</option>
                                <option>Freezer</option>
                                <option>Tumble Dryer</option>
                                <option>Commercial</option>
                            </select>
                            <p class="inputLabel">Type</p>
                            <select v-model="productType" class="inputStyle selectStyle">
                                <option :value="null" disabled>Type</option>
                                <option>New</option>
                                <option>Refurbished</option>
                            </select>     
                        </div>
                        <div class="bottomHalf">
                            <button class="uploadBtn" v-on:click="updateProduct">Update <font-awesome-icon class="fas" icon="upload" /></button>
                            <button v-on:click="deleteProduct" class="deleteProduct">Delete <font-awesome-icon class="fas" icon="trash" /></button>
                        </div>
                    </div>
                </div>
            </div>
      </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import imageCompression from 'browser-image-compression';

export default {
    name: 'dashboard',
    components: {
        
    },
    data: function() {
        return {
            productId: '',
            productPicture: '',
            productTitle: '',
            productDescription: '',
            productPrice: '',
            productStock: '',
            productType: '',
            productModel: '',
            productCategory: '',
            productBrand: '',
            productDate: '',
            productTime: ''
        };
    },
    created() {
        this.productId = this.$route.params.product_id

        const db = firebase.firestore()
        db.collection("products").doc(this.productId).get().then(doc => {
            
            this.productPicture = doc.data().picture
            this.productTitle = doc.data().title
            this.productDescription = doc.data().description,
            this.productPrice = doc.data().price
            this.productStock = doc.data().stock
            this.productType = doc.data().product_type
            this.productModel = doc.data().model_number
            this.productCategory = doc.data().category
            this.productBrand = doc.data().brand,
            this.productDate = doc.data().date_added,
            this.productTime = doc.data().time_added
             

      })
      .catch(err => {
        console.log('Error getting document', err);
      });


    },
    mounted() {
        
    },
    methods: {
        //Update photo
        pickProduct: function() {
            this.$refs.coverImageInput.click();
        },
       onProductPicked: function() {
            this.startLoading()
            var imageFile = event.target.files[0];
            const fileName = imageFile.name
            const ext = fileName.slice(fileName.lastIndexOf('.'))

            var options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            }
            imageCompression(imageFile, options)
                .then( (compressedFile) => {

                //upload file to firebase
                //Sets the unique Id for the name
                function uuidv4() {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                }
                this.uniqueId = uuidv4()
                
                //Set the location to store in firebase storage
                var storageRef = firebase.storage().ref('product_images/' + this.uniqueId + ext)
                //Sets variable to store data
                let uploadTask = storageRef.put(compressedFile)
                //Stores data, handles errors and returns and updates users database with the profile picture url
                uploadTask.on('state_changed', (snapshot) => {

                    this.snapshot = snapshot

                }, (error) => {
                    // Handle unsuccessful uploads
                    this.errorMsg = error
                    this.failLoading()
                }, () => {
                    // Handle successful uploads on complete
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    this.productPicture = downloadURL

                    }).then (() => {
                        this.endLoading()
                    });
                    })

                })
                .catch(function (error) {
                console.log(error.message);
                });
        },
        updateProduct() {
            const db = firebase.firestore()
            this.startLoading()

            var stockConverted = parseInt(this.productStock)

            return db.collection('products').doc(this.productId).update({
                picture: this.productPicture,
                title: this.productTitle,
                price: this.productPrice,
                category: this.productCategory,
                stock: stockConverted,
                brand: this.productBrand,
                model_number: this.productModel,
                product_type: this.productType,
                description: this.productDescription
     
            }).then (() => {
                this.endLoading()
                this.$router.go(-1)
            })
        },
        //Deletes the selected product
        deleteProduct() {
            const db = firebase.firestore()
            if(confirm('Are you sure?')) {
                
                db.collection("products").doc(this.productId).delete().then(success => {

                    this.$router.push({ path: '/liveproducts' })
                    this.blank = success
                },
                    error => {
                        console.error("Error removing document: ", error);
                })
            }
        },

    }
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
    box-sizing: border-box;
}
.dashboardPageWrapper {
    width: 100%;
    padding: 40px 20px;
    box-sizing: border-box;
    position: relative;
}
.dashboardPageWrapper h1 {
    font-size: 24px;
    font-weight: bold;
    padding: 0 0 5px;
    margin: 0;
}
.productIdP {
    margin: 0;
    padding: 5px 10px 0 !important;
}

/* Product Col Container */
.productContainer {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    position: relative;
}
/* Product Col 1 */
.productMainInfoContainer {
    width: 100%;
    padding-right: 370px;
    box-sizing: border-box;
}
.productMainInfoWrapper {
    width: 100%;
    border-radius: 10px;
    background-color: #FFF;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
    position: relative;
    margin-bottom: 20px;
} 

.inputLabel {
    margin: 0;
    padding: 0 0 5px;
}
    /* Input Styling */
    .inputStyle {
        height: 35px;
        padding: 0 10px;
        box-sizing: border-box;
        background-color: #F9F9F9;
        border: 1px solid #EFEFEF;
        border-radius: 5px;
        width: 100%;
        margin-bottom: 10px;
    }
    .inputStyle:focus {
        border: 1px solid #1B9CF3;
    }
    .selectStyle {
        padding: 0 6px !important;
    }
    .selectStyle:last-child {
        margin-bottom: 0 !important;
    }
    .productTextarea {
        height: 200px;
        resize: none;
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        background-color: #F9F9F9;
        border: 1px solid #EFEFEF;
        font-family: Arial, Helvetica, sans-serif;
        border-radius: 5px;
    }
    .productTextarea:focus {
        border: 1px solid #1B9CF3;
    }

/* Product Col 2 */
.productOtherInfoContainer {
    width: 350px;
    box-sizing: border-box;
    position: absolute;
    right: 0;
    top: 0;
} 
.productOtherInfoWrapper {
    width: 100%;
    border-radius: 10px;
    background-color: #FFF;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
}
.topHalf {
    align-self: flex-start;
}

    /* Image preview */
    .coverImagePreview {
        margin-bottom: 10px;
        width: 100%;
        height: 250px;
        background-color: #F3F9FF;
        border-radius: 5px;
        position: relative;
    }
    .darkmode--activated  .coverImagePreview {
        background-color: #161616;
    }
    .coverImagePreviewOverlay {
        width: 100%;
        height: 250px;
        opacity: 0;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.6);
        transition: 0.3s;
        border-radius: 5px;
        top: 0;
        left: 0;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .coverImagePreviewOverlay:hover {
        opacity: 1;
    }
    .coverImagePreviewOverlay .fas {
        color: #FFF;
        font-size: 20px;
    }
    .coverImagePreviewImage {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 5px;
        border-style: none;
        outline:none;
        background-color: #F3F9FF;
        border: none;
    }

.bottomHalf {
    align-self: flex-end;
}
/* Update Product Button */
.uploadBtn {
    background-color: #1B9CF3;
    border: none;
    border-radius: 20px;
    padding: 7px 40px;
    color: #FFF;
    cursor: pointer;
    transition: 0.3s;
    margin-top: 20px;
    font-size: 14px;
    width: 100%;
}
.uploadBtn:hover {
    background-color: #1687D3;
    color: #D8D8D8;
}
.uploadBtn .fas {
    padding-left: 5px;
    color: #FFF;
    transition: 0.3s;
}
.uploadBtn:hover .fas {
    color: #D8D8D8;
}
/* Delete Product Button */
.deleteProduct {
    background-color: #EB0F0F;
    border-radius: 20px;
    border: none;
    padding: 7px 40px;
    color: #FFF;
    transition: 0.3s;
    cursor: pointer;
    font-size: 14px;
    width: 100%;
    margin-top: 10px;
}
.deleteProduct:hover {
    background-color: #D21F21;
    color: #D8D8D8;
}

.deleteProduct .fas {
    padding-left: 5px;
    color: #FFF;
    transition: 0.3s;
}
.deleteProduct:hover .fas {
    color: #D8D8D8;
}

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



@media only screen and (min-width: 1100.1px) {
    .updateDeleteMobileBtns {display: none;}
}
@media only screen and (max-width: 1100px) {
    .productContainer {flex-wrap: wrap-reverse;}
    /* Product Col 1 */
    .productMainInfoContainer {width: 100%;padding-right: 0;}
    /* Product Col 2 */
    .productOtherInfoContainer {width: 100%;position: relative;right: auto;top: auto;margin-bottom: 20px;} 
    .dashboardPageWrapper h1 {font-size: 18px;}
    .productIdP {font-size: 14px;}
    .outOfStockContainer {margin-bottom: 20px;}
    .bottomHalf {display: none;}
    .uploadBtn {margin-top: 0;}
    .deleteProduct {margin-bottom: 20px;}
}
@media only screen and (max-width: 850px) {
    .dashboardPageContentContainer {padding-left: 0;}
    .dashboardPageWrapper {padding: 20px 40px;}
    .routerPageContainer {top: 60px !important;}
}
@media only screen and (max-width: 510px) {
    .dashboardPageWrapper {padding: 20px;}
}
</style>