/*global $:false */
/*global simpleCart:false */
'use strict';

$(document).ready(function () {
    simpleCart({
        cartColumns: [
            { attr: 'name' , label: 'Name' },
            { attr: 'price' , label: 'Price', view: 'currency' },
            { attr: 'quantity' , label: 'Qty' },
            { attr: 'total' , label: 'SubTotal', view: 'currency' },
            { view: 'foo', text: '', label: false } ]
    });

    $.validate({
        form : '#frmPayment',
        validateOnBlur : false, 
        errorMessagePosition : 'top', 
        scrollToTopOnError : true, 
        onError : function() {
      
        }
    });

});    