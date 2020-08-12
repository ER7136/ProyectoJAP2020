//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
var productsArray = [];

function showProducts(array) {

    let contentToAppend = "";
    for (let i = 0; i < array.length; i++) {
        let product = array[i];

        contentToAppend += `
        <div class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">` + product.name + `</h4>
                        <small class="text-muted">` + product.soldCount + ` vendidos</small>
                    </div>
                    <p>` + product.description + `</p>
                    <br>
                    <h5> Precio: ` + product.currency + ` ` + product.cost + `</h5>
                </div>
            </div>
        </div>
        `
        document.getElementById("productList").innerHTML = contentToAppend;
    }
}

document.addEventListener("DOMContentLoaded", function(e) {
    getJSONData(PRODUCTS_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            productsArray = resultObj.data;
            showProducts(productsArray);
        }
    });
});