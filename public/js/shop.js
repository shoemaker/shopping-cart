/*global $:false */
/*global simpleCart:false */
'use strict';

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

// Reset all quantities to 1
$('input').val(1);
