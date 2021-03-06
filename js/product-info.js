var product = {};
var productComments = [];
var allProducts = [];

function showImagesGallery(array) {
    let contentToAppend = "";

    for (let i = 0; i < array.length; i++) {
        let imageSrc = array[i];

        contentToAppend += `
        <div class="col-lg-3 col-md-4 col-6">
            <div class="d-block mb-4 h-100">
                <img class="img-fluid img-thumbnail" src="` + imageSrc + `" alt="">
            </div>
        </div>
        `;
        document.getElementById("productImagesGallery").innerHTML = contentToAppend;
    }
}

function showComments(commentsArray) {
    let comments = "";

    commentsArray.forEach(function(comment) {
        let rating = "";

        comments += `
                <p><strong>${comment.user}</strong> comentó:</p>
                <p>${comment.description}</p>
                `;

        for (let i = 1; i <= comment.score; i++) {
            rating += `<span class="fa fa-star checked"></span>`;
        }
        for (let i = comment.score + 1; i <= 5; i++) {
            rating += `<span class="fa fa-star"></span>`;
        }

        comments += `<div style="text-align: left;"><em>Calificación: ${rating}</em></div>`;
        comments += `<div style="text-align: left;"><sub>${comment.dateTime}</sub></div><br><br>`;
    });
    document.getElementById("productComments").innerHTML = comments;
}

function showRelatedProducts(allProductsArray, relatedProductsArray) {
    let relatedProducts = '<br><br>';
    relatedProductsArray.forEach(function(i) {
        relatedProducts += `
            <div class="col-lg-3 col-md-4 col-6">                
                <br>
                <strong><em>${allProductsArray[i].name}</em></strong><br>
                <p>${allProductsArray[i].currency} ${allProductsArray[i].cost}</p>                               
                <div class="d-block mb-3">
                    <img class="img-fluid img-thumbnail" src="` + allProductsArray[i].imgSrc + `" alt=""></img>
                </div>                
                <a class="d-block text-center" href="product-info.html">Ver este producto</a><br><br>
            </div>
        `;
    });
    document.getElementById("relatedProducts").innerHTML = relatedProducts;
}

document.addEventListener("DOMContentLoaded", function() {
    getJSONData(PRODUCT_INFO_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            product = resultObj.data;

            let productNameHTML = document.getElementById("productName");
            let productDescriptionHTML = document.getElementById("productDescription");
            let productPriceHTML = document.getElementById("productPrice");
            let productSoldCountHTML = document.getElementById("productSoldCount");

            productNameHTML.innerHTML = product.name;
            productDescriptionHTML.innerHTML = product.description;
            productPriceHTML.innerHTML = product.currency + ` ` + product.cost;
            productSoldCountHTML.innerHTML = product.soldCount;

            showImagesGallery(product.images);
            showRelatedProducts(allProducts, product.relatedProducts);
        }
    });

    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            productComments = resultObj.data;

            showComments(productComments);
            showRelatedProducts(allProducts, product.relatedProducts);
        }
    });

    let userLogged = localStorage.getItem('userLogged');
    if (userLogged) {
        document.getElementById("newComment").style = "display: inline-block";
    }

    document.getElementById("sendComment").addEventListener("click", function() {
        let now = new Date();
        let dateTime = `${now.getFullYear()}-`

        if (now.getMonth() + 1 <= 9) {
            dateTime += `0${now.getMonth() + 1}-`
        } else {
            dateTime += `${now.getMonth() + 1}-`
        };
        if (now.getDate() + 1 <= 9) {
            dateTime += `0${now.getDate()} `
        } else {
            dateTime += `${now.getDate()} `
        };
        if (now.getHours() + 1 <= 9) {
            dateTime += `0${now.getHours()}:`
        } else {
            dateTime += `${now.getHours()}:`
        };
        if (now.getMinutes() + 1 <= 9) {
            dateTime += `0${now.getMinutes()}:`
        } else {
            dateTime += `${now.getMinutes()}:`
        };
        if (now.getSeconds() + 1 <= 9) {
            dateTime += `0${now.getSeconds()}`
        } else {
            dateTime += `${now.getSeconds()}`
        };

        let newComment = {
            user: JSON.parse(localStorage.getItem('userLogged')).email,
            description: document.getElementById('newComm').value,
            score: parseInt(document.getElementById('newRating').value),
            dateTime: dateTime
        };

        productComments.push(newComment);
        showComments(productComments);
        showRelatedProducts(allProducts, product.relatedProducts);
    });

    getJSONData(PRODUCTS_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            allProducts = resultObj.data;

            showRelatedProducts(allProducts, product.relatedProducts);
        }
    });
});