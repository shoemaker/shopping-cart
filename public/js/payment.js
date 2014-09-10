/*global $:false */
/*global simpleCart:false */
'use strict';

function jsonifyCart() {
    var cart = [];
    simpleCart.each(function(item) {
        var newItem = {
            name: item.get('name'),
            quantity: item.quantity(),
            price: item.price()
        };

        cart.push(newItem);
    });

    $('#inputCart').val(JSON.stringify(cart));
}

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
      
        },
        onSuccess : function() {
            jsonifyCart();
        }
    });

});    