$(document).ready(function() {
    if(window.location.hash != "") {
        var linkhash = window.location.hash;
        linkhash = linkhash.replace('#', '');

        switch(linkhash) {
            case "user":

                break;
            case "devs":

                break;
            default:

                break;
        }
    } else {
        //TODO default stuff
    }

    $('#user_link').on('click', function(event) {
        event.preventDefault();
        window.location.hash = "#user";
        $('#user').show();
        $('#devs').hide();
    });
    $('#devs_link').on('click', function(event) {
        event.preventDefault();
        window.location.hash = "#devs";
        $('#user').hide();
        $('#devs').show();
    });
});
