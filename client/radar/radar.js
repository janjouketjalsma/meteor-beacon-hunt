Template.radar.rendered = function(){
$(function() {
 
     var $rad = $('#rad'),
         d = 0;
     (function rotate() {
         $rad.css({ transform: 'rotate('+ d +'deg)'}); // apply CSS3
         setTimeout(function() {
             ++d;         // next degree
             rotate();    // recall function
        }, 5);          // every 25ms
    })();                // 1st start

});
};