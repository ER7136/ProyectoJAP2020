var product = {};
var productComments = [];

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
        }
    });

    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            productComments = resultObj.data;

            showComments(productComments);
        }
    });
});