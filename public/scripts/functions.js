function addContract(e) {
    e.preventDefault();
    let increment_porc = $(".ui-slider-value.last").text();
    let forma = $("form").serialize();
    forma = forma + '&increment_porc=' + (increment_porc.split("%"))[1];

    $.post("/inquilinos/add?" + forma, function( data ) {
        if(data.ok) {
            window.location.href = '?status=susccess';
        } else {
            window.location.href = '?status=danger';        
        }
    });
};

function sendLogin(email, password, cb) {
    let data = {email, password};
    fetch("login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(function(response) {
        return response.json();
    })  
    .then(function(response) {
        cb(response)
    })  
}
function sendRegister(email, password, userId, cb) {
    let data = {email, password, userId};
    fetch("register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(function(response) {
        return response.json();
    })  
    .then(function(response) {
        cb(response)
    })  
}

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

 const sendToServer = async subData => {
    console.log('saving to server...');
    await fetch("/subscribe", {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ sub: subData })
    });
  }
  const subscribe = async () => {
    const serviceWorker = await navigator.serviceWorker.ready; // 1
    const subscription = await serviceWorker.pushManager.getSubscription(); // 2

    if (!subscription) {
        console.log('subscribing....');
        const push = await serviceWorker.pushManager.subscribe({ // 3
            userVisibleOnly: true,
            applicationServerKey: 'BLTrRpzJQuGKQCOx5PrbIn_dI9d8ZuzZ7iVPRQ0Wf7EJBm0Bt4-f08zrej7I8WBEevAQriPtUAKCW_AbEtQLhh0'
        })
        console.log('subscribed. ', push);

        await sendToServer(push);
    }
  }

 