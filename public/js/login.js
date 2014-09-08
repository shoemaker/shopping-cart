/*global $:false */
'use strict';

$(document).ready(function () {
    
    $.validate({
        form : '#frmSignIn',
        validateOnBlur : false, 
        errorMessagePosition : 'top', 
        scrollToTopOnError : false, 
        onError : function() {
      
        }
    });

    $('#btnSignIn').click(function() {

    });

});    