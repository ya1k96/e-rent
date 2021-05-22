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