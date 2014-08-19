$(document).ready(function() {
    var linkhash = window.location.hash;

    switch(linkhash) {
        case "#user":
            $('#user').show();
            $('#devs').hide();
            break;
        case "#devs":
            $('#user').hide();
            $('#devs').show();
            break;
        default:
            window.location.hash = "#user";
            $('#user').show();
            $('#devs').hide();
            break;
    };

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
