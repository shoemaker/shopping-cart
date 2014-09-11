exports.shoppingCart = function() {
    var obj = {
        credentialsHash: null,
        email: null,
        purchaseDate: null,
        purchaseDateDisplay: null,
        items: [

        ],
        address: {
            name: {
                first: null,
                last: null
            },
            street1: null,
            street2: null,
            city: null,
            state: null,
            zip: null
        },
        payment: {
            creditCard: {
                number: null,
                expiration: null,
                ccv: null
            }
        }
    };

    return obj;
}

exports.cartItem = function() {
    var obj = {
        name: null,
        price: null,
        quantity: null
    };

    return obj;
}