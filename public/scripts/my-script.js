$(function() {
  moment.locale('es');

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("../sw.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
  }

  if($("#btn-save")) {    
    $("#btn-save").on('click', addContract);
  }
  /* Eliminar el mensaje de status */
  if($(".status")) {
      setTimeout(function() {
          $(".status").fadeOut();
      }, 3000)
  }
  
  /** Funcion para el slider */
  var slider3 = $("#slider3")
    , slider3ValueMultiplier = 5
    , slider3Options;

    
    if (slider3.length > 0) {        
    slider3.slider({
      min: 1,
      max: 5,
      values: [1, 2],
      orientation: "horizontal",
      range: true,
      slide: function(event, ui) {
        slider3.find(".ui-slider-value:first")
          .text("")
          .end()
          .find(".ui-slider-value:last")
          .text("%" + ui.values[1] * slider3ValueMultiplier);
      }
    });
  
    slider3Options = slider3.slider("option");
    slider3.addSliderSegments(slider3Options.max)
      .find(".ui-slider-value:first")
      .text("")
      .end()
      .find(".ui-slider-value:last")
      .text("%" + slider3Options.values[1] * slider3ValueMultiplier);
  }


})
