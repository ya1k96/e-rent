function addContract(e) {
    e.preventDefault();
    let increment_porc = $(".ui-slider-value.last").text();
    let forma = $("form").serialize();
    forma = forma + '&increment_porc=' + (increment_porc.split("%"))[1];

    $.post("/inquilinos/add?" + forma, function( data ) {
        console.log(data);
        if(data.ok) {
            window.location.href = '?status=success';
        } else {
            window.location.href = '?status=danger';        
        }
    });
};

/**
 * @param {number} quantity Cantidad de productos
 * @param {string} description Descripcion del producto
 * @param {number} price Precio del producto
 */
function createPreference() {

    var orderData = {
        quantity,
        description,
        price
    };
        
    fetch("payments/create_preference", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(preference) {
        createCheckoutButton(preference.id);            
    })        
    .catch((err) => {
        console.log(err);
    });

}

 function createCheckoutButton(preference) {
     var script = document.createElement("script");  
     // The source domain must be completed according to the site for which you are integrating.
     // For example: for Argentina ".com.ar" or for Brazil ".com.br".
     script.src = "https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js";
     script.type = "text/javascript";
     script.dataset.preferenceId = preference;
     document.getElementById("button-checkout").innerHTML = "";
     document.querySelector("#button-checkout").appendChild(script);
 }


 