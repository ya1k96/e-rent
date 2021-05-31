// Some general UI pack related JS
// Extend JS String with repeat method
String.prototype.repeat = function (num) {
  return new Array(Math.round(num) + 1).join(this);
};

(function ($) {
  'use strict';

  // Add segments to a slider
  $.fn.addSliderSegments = function () {
    return this.each(function () {
      var $this = $(this),
          option = $this.slider('option'),
          amount = (option.max - option.min)/option.step,
          orientation = option.orientation;
      if ( 'vertical' === orientation ) {
        var output = '', i;
        console.log(amount);
        for (i = 1; i <= amount - 1; i++) {
            output += '<div class="ui-slider-segment" style="top:' + 100 / amount * i + '%;"></div>';
        }
        $this.prepend(output);
      } else {
        var segmentGap = 100 / (amount) + '%';
        var segment = '<div class="ui-slider-segment" style="margin-left: ' + segmentGap + ';"></div>';
        $this.prepend(segment.repeat(amount - 1));
      }
    });
  };

  $(function () {

    // Custom Selects
    if ($('[data-toggle="select"]').length) {
      $('[data-toggle="select"]').select2();
    }

    // Checkboxes and Radiobuttons

    $('[data-toggle="checkbox"]').radiocheck();
    $('[data-toggle="radio"]').radiocheck();

    // Tabs
    $('.nav-tabs a').on('click', function (e) {
      e.preventDefault();
      $(this).tab('show');
    });

    // Tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Popovers
    $('[data-toggle="popover"]').popover();

  
    // Add style class name to a tooltips
    $('.tooltip').addClass(function () {
      if ($(this).prev().attr('data-tooltip-style')) {
        return 'tooltip-' + $(this).prev().attr('data-tooltip-style');
      }
    });

    // Placeholders for input/textarea
    $(':text, textarea').placeholder();

    // Make pagination demo work
    $('.pagination').on('click', 'a', function () {
      $(this).parent().siblings('li').removeClass('active').end().addClass('active');
    });

    $('.btn-group').on('click', 'a', function () {
      $(this).siblings().removeClass('active').end().addClass('active');
    });

    // Disable link clicks to prevent page scrolling
    $(document).on('click', 'a[href="#fakelink"]', function (e) {
      e.preventDefault();
    });

    // make code pretty
    window.prettyPrint && prettyPrint();

  });
}(jQuery));
