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
            { view: 'remove' , text: 'Remove' , label: false },
            { view: 'foo', text: '', label: false }
        ]
    });

    simpleCart.bind('afterAdd', function(item) {
        console.log(item.get('name'), 'added.');
        $('.alert').alert('close');
    });

    // Reset all quantities to 1
    $('input').val(1);

    $('#checkoutMain, #checkoutModal').click(function () {
        if (simpleCart.quantity() === 0) {
            $('#msgContainer').html('<div class="alert alert-danger" role="alert"><h4>Empty Shopping Cart</h4>You must have at least one item in your shopping cart to checkout.</div>');
            $('#cartModal').modal('hide');
            $('html, body').animate({ scrollTop: 0 }, 500);
            return false;
        }
    });
    
});