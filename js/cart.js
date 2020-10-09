var cartArray = [];

function calcCartTotal() {
    let total = 0;
    let subtotals = document.getElementsByClassName("subtotal");
    for (let i = 0; i < subtotals.length; i++) {
        total += parseInt(subtotals[i].innerHTML);
    }
    document.getElementById("cartTotal").innerHTML = `<strong>` + total + `</strong>`;
}

function calcCartSubtotal(unitcost, i) {
    let quantity = parseInt(document.getElementById(`quantity${i}`).value);
    subtotal = quantity * unitcost;
    document.getElementById(`cartSubtotal${i}`).innerHTML = subtotal;
    calcCartTotal();
}

function showArticles(array) {
    let contentToAppend = "";

    for (let i = 0; i < array.length; i++) {
        let article = array[i];
        let USDValueInUYU = 40;
        let convertedToUYU;

        if (article.currency == "USD") {
            convertedToUYU = article.unitCost * USDValueInUYU;
        } else {
            convertedToUYU = article.unitCost;
        }

        let sub = convertedToUYU * article.count;

        contentToAppend += `
        <tr>
            <td class="text-center align-middle"><img src='${article.src}' class="img-thumbnail" width="110px"></td>
            <td class="text-center align-middle">${article.name}</td>
            <td class="text-center align-middle">${article.currency} ${article.unitCost}</td>
            <td class="text-center align-middle"><span id="convertedToUYU${i}">UYU ${convertedToUYU}</span></td>    
            <td class="text-center align-middle"><input style="width:60px;" onchange="calcCartSubtotal(${convertedToUYU}, ${i})" 
                    type="number" id="quantity${i}" value="${article.count}" min="1"></td>
            <td class="text-center align-middle"><span class="subtotal" id="cartSubtotal${i}">${sub}</span></td>
            <td class="text-center align-middle"><button class="btn btn-danger" onclick="deleteArticle(${i})">&times;</button></td>
        </tr>
        `;
        document.getElementById("cart").innerHTML = contentToAppend;
    }
    calcCartTotal();
}

function deleteArticle(i) {
    if (cartArray.length > 1) {
        cartArray.splice(i, 1);
        showArticles(cartArray);
    } else {
        document.getElementById("cartContent").innerHTML =
            `
            <div class="container">                
                <h3>Tu carrito está vacío.</h3>
                <p>Puedes añadir artículos para comprar desde nuestro <a href="products.html">listado de productos</a>.</p>
            </div>
            `;
    }
}

document.addEventListener("DOMContentLoaded", function(e) {
    getJSONData(CART_INFO_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            cartArray = resultObj.data.articles;

            showArticles(cartArray);
        }
    });
});