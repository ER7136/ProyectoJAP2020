const ORDER_ASC_BY_PRICE = "Mayor a menor";
const ORDER_DESC_BY_PRICE = "Menor a mayor";
const ORDER_BY_PROD_SOLD = "Relevancia";
var currentProductsArray = [];
var currentSortProductCriteria = undefined;
var minPrice = undefined;
var maxPrice = undefined;
var search = undefined;

function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE) {
        result = array.sort(function(a, b) {
            if (a.cost < b.cost) { return -1; }
            if (a.cost > b.cost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_PRICE) {
        result = array.sort(function(a, b) {
            if (a.cost > b.cost) { return -1; }
            if (a.cost < b.cost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_PROD_SOLD) {
        result = array.sort(function(a, b) {
            let asoldCount = parseInt(a.soldCount);
            let bSoldCount = parseInt(b.soldCount);

            if (asoldCount > bSoldCount) { return -1; }
            if (asoldCount < bSoldCount) { return 1; }
            return 0;
        });
    }
    return result;
}

function showProducts(array) {

    let contentToAppend = "";
    for (let i = 0; i < array.length; i++) {
        let product = array[i];

        if (((minPrice == undefined) || (minPrice != undefined && parseInt(product.cost) >= minPrice)) &&
            ((maxPrice == undefined) || (maxPrice != undefined && parseInt(product.cost) <= maxPrice))) {

            if (search == undefined ||
                product.name.toLowerCase().indexOf(search) != -1 ||
                product.description.toLowerCase().indexOf(search) != -1) {

                contentToAppend += `
                <div class="col-md-6 col-lg-4">
                    <div class="card-deck">
                        <div class="card my-3">
                            <a href="product-info.html">
                                <img src="${product.imgSrc}" class="card-img-top" alt="${product.description}">
                            </a>
                            <div class="card-body">
                                <h5 class="card-title"><strong>${product.name}</strong></h5>
                                <p class="card-text">${product.description}</p><br>
                                <div class="row">
                                    <div class="col-6">
                                        <p class="card-text text-left"><small class="text-muted">${product.soldCount} vendidos</small></p>
                                    </div>
                                    <div class="col-6">
                                        <h6 class="card-text text-right"><strong>${product.currency} ${product.cost}</strong></h6>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer">
                                <a href="product-info.html"><p class="card-text text-center text-primary">Ver producto</p></a>
                            </div>
                        </div>
                    </div>
                </div>
            `
            }
        }
        document.getElementById("productList").innerHTML = contentToAppend;
    }
}

function sortAndShowProducts(sortCriteria, productsArray) {
    currentSortProductCriteria = sortCriteria;

    if (productsArray != undefined) {
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortProductCriteria, currentProductsArray);

    showProducts(currentProductsArray);
}

document.addEventListener("DOMContentLoaded", function(e) {
    getJSONData(PRODUCTS_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            sortAndShowProducts(ORDER_ASC_BY_PRICE, resultObj.data);
        }
    });

    document.getElementById("sortAscPrice").addEventListener("click", function() {
        sortAndShowProducts(ORDER_ASC_BY_PRICE);
    });

    document.getElementById("sortDescPrice").addEventListener("click", function() {
        sortAndShowProducts(ORDER_DESC_BY_PRICE);
    });

    document.getElementById("sortBySold").addEventListener("click", function() {
        sortAndShowProducts(ORDER_BY_PROD_SOLD);
    });

    document.getElementById("clearRangeFilterPrice").addEventListener("click", function() {
        document.getElementById("rangeFilterPriceMin").value = "";
        document.getElementById("rangeFilterPriceMax").value = "";
        minPrice = undefined;
        maxPrice = undefined;

        showProducts(currentProductsArray);
    });

    document.getElementById("rangeFilterPrice").addEventListener("click", function() {
        minPrice = document.getElementById("rangeFilterPriceMin").value;
        maxPrice = document.getElementById("rangeFilterPriceMax").value;

        if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0) {
            minPrice = parseInt(minPrice);
        } else {
            minPrice = undefined;
        }

        if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0) {
            maxPrice = parseInt(maxPrice);
        } else {
            maxPrice = undefined;
        }

        showProducts(currentProductsArray);
    });

    document.getElementById("clearSearch").addEventListener("click", function() {
        document.getElementById("search").value = "";
        search = undefined;

        showProducts(currentProductsArray);
    });

    document.getElementById("search").addEventListener("input", function() {
        search = document.getElementById("search").value.toLowerCase();

        showProducts(currentProductsArray);
    });
});