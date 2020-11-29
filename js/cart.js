var cartArray = [];

function calcCartTotal() {
    let total = 0;
    let subtotals = document.getElementsByClassName("subtotal");
    for (let i = 0; i < subtotals.length; i++) {
        total += parseInt(subtotals[i].innerHTML);
    }
    document.getElementById("cartTotal").innerHTML = total;
    calcDelivery();
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

function calcDelivery() {
    let cartTotal = parseInt(document.getElementById("cartTotal").innerHTML);
    let delivery;
    let deliveryValue;
    let elements = document.getElementsByName("delivery");
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].checked) {
            deliveryValue = parseInt(elements[i].value);
        }
    }
    delivery = cartTotal * deliveryValue / 100;
    totalDeliveryIncluded = cartTotal + delivery;

    document.getElementById("purchaseSubtotal").innerHTML = cartTotal;
    document.getElementById("purchaseDelivery").innerHTML = delivery;
    document.getElementById("purchaseDeliveryIncluded").innerHTML = totalDeliveryIncluded;
}

function selectPayment() {
    var payments = document.getElementsByName("paymentMethod");
    for (var i = 0; i < payments.length; i++) {
        if (payments[i].checked && (payments[i].value) == "1") {
            document.getElementById("paymentCardData").classList.remove("d-none");
            document.getElementById("paymentBankData").classList.add("d-none");
        } else if (payments[i].checked && (payments[i].value) == "2") {
            document.getElementById("paymentCardData").classList.add("d-none");
            document.getElementById("paymentBankData").classList.remove("d-none");
        }
    }
}

function validPayment() {
    let cardName = document.getElementById("paymentCardName").value;
    let cardNumber = document.getElementById("paymentCardNumber").value;
    let cardDate = document.getElementById("paymentCardDate").value;
    let cardSecurity = document.getElementById("paymentCardSecurity").value;
    let bankAccountNumber = document.getElementById("paymentBankAccountNumber").value;
    let paymentMethod = document.getElementsByName("paymentMethod");
    let validatedPayment = true;
    for (var i = 0; i < paymentMethod.length; i++) {
        if (paymentMethod[i].checked && (paymentMethod[i].value) == "1") {
            if (cardName == "" || cardNumber == "" || cardDate == "" || cardSecurity == "") {
                validatedPayment = false;
            } else {
                validatedPayment = true;
            }
        } else if (paymentMethod[i].checked && (paymentMethod[i].value) == "2") {
            if (bankAccountNumber == "") {
                validatedPayment = false;
            } else {
                validatedPayment = true;
            }
        }
    }
    return validatedPayment;
}

document.addEventListener("DOMContentLoaded", function(e) {
    getJSONData(CART_INFO_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            cartArray = resultObj.data.articles;

            showArticles(cartArray);
            calcDelivery();
        }
    });

    let elements = document.getElementsByName("delivery");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("change", function() {
            calcDelivery();
        });
    }

    let paymentMethods = document.getElementsByName("paymentMethod");
    for (var i = 0; i < paymentMethods.length; i++) {
        paymentMethods[i].addEventListener("change", function() {
            selectPayment();
        });
    }

    let form = document.getElementById("needs-validation");
    form.addEventListener("submit", function(e) {
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById("paymentMessage").innerHTML = `
                <div class="alert alert-danger alert-dismissible show" role="alert" style="z-index:9999">
                    <strong>Debes completar todos los datos de envío.</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                `;
        } else {
            if (validPayment()) {
                document.getElementById("paymentBtn").classList.remove("btn-primary");
                document.getElementById("paymentBtn").classList.remove("btn-danger");
                document.getElementById("paymentBtn").classList.add("btn-success");
                document.getElementById("cartContent").innerHTML = `
                    <div class="container">
                        <h3>Tu compra ha sido confirmada.</h3>
                        <br><br>
                        <a type="button" class="btn btn-light btn-block" href="cart.html">Volver al carrito</a>
                    </div>
                    `;
            } else {
                e.preventDefault();
                e.stopPropagation();
                document.getElementById("paymentBtn").classList.remove("btn-primary");
                document.getElementById("paymentBtn").classList.remove("btn-success");
                document.getElementById("paymentBtn").classList.add("btn-danger");
                document.getElementById("paymentMessage").innerHTML = `       
                    <div class="alert alert-danger alert-dismissible show" role="alert" style="z-index:9999">
                        <strong>Debes ingresar una forma de pago.</strong>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    `;
            }
        }
        form.classList.add("was-validated");
    });

    let formPaymentCardData = document.getElementById("paymentCardData");
    formPaymentCardData.addEventListener("submit", function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (formPaymentCardData.checkValidity() === false) {
            document.getElementById("paymentMessage").innerHTML = `
                <div class="alert alert-danger alert-dismissible show" role="alert" style="z-index:9999">
                    <strong>Selecciona una forma de pago y completa todos sus campos.</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                `;
        } else {
            document.getElementById("paymentBtn").classList.remove("btn-primary");
            document.getElementById("paymentBtn").classList.remove("btn-danger");
            document.getElementById("paymentBtn").classList.add("btn-success");
            document.getElementById("paymentMessage").innerHTML = `
                <div class="alert alert-success alert-dismissible show" role="alert" style="z-index:9999">
                    <strong>Forma de pago ingresada.</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                `;
            $("#modalPayment").modal("hide");
        }
        formPaymentCardData.classList.add('was-validated');
    });

    let formPaymentBankData = document.getElementById("paymentBankData");
    formPaymentBankData.addEventListener("submit", function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (formPaymentBankData.checkValidity() === false) {
            document.getElementById("paymentMessage").innerHTML = `
                <div class="alert alert-danger alert-dismissible show" role="alert" style="z-index:9999">
                    <strong>Selecciona una forma de pago y completa todos sus campos.</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                `;
        } else {
            document.getElementById("paymentBtn").classList.remove("btn-primary");
            document.getElementById("paymentBtn").classList.remove("btn-danger");
            document.getElementById("paymentBtn").classList.add("btn-success");
            document.getElementById("paymentMessage").innerHTML = `
                <div class="alert alert-success alert-dismissible show" role="alert" style="z-index:9999">
                    <strong>Forma de pago ingresada.</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                `;
            $("#modalPayment").modal("hide");
        }
        formPaymentBankData.classList.add('was-validated');
    });
});