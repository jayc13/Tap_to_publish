/* -- Twitter START -- */

var openTW = (function () {

    var consumerKey = 'BN14oi6siiCwG2qXDgEcfXpI4';
    var consumerSecret = 'qsccXWEEQPtOKErQcGCsK22L0zhgHpKFRpOI0PhF749SuK8NWm';
    var userKey = '';
    var userSecret = '';


    function init() {
        localStorage.consumerKey = consumerKey;
        localStorage.consumerSecret = consumerSecret;
        
        if (localStorage.userKey !== "") {
            userKey = localStorage.userKey;
        }
        //console.log(localStorage.userKey);
        
        if (localStorage.userSecret !== "") {
            userSecret = localStorage.userSecret;
        }
        //console.log(localStorage.userSecret);

        if (window.location.href.indexOf("oauth_token=") > 0) {
            show_loading();
            userKey = new RegExp('[\?&]oauth_token=([^&#]*)').exec(window.location.href)[1];
            var verifier = new RegExp('[\?&]oauth_verifier=([^&#]*)').exec(window.location.href)[1];

            $.get(url_back_end + "/twitter/validate_token?oauth_token=" + userKey + "&oauth_verifier=" + verifier + "&oauth_secret=" + userSecret, {})
                    .done(function (data) {
                        userKey = data.token.token;
                        userSecret = data.token.secret;
                        localStorage.userKey = userKey;
                        localStorage.userSecret = userSecret;
                        
                        User_Id = data.token.params.user_id;
                        User_Name = data.token.params.user_screen_name;
                        token_tw = data.token;
                        
                        localStorage.User_Id = User_Id;
                        localStorage.User_Name = User_Name;
                        localStorage.token_tw = token_tw;
                        
                        var url = window.location.pathname.toString();
                        $(location).attr('href',url);
                        hide_loading();
                    })
                    .fail(function (xhr, error, status) {
                        hide_loading();
                    });

        }

    }
    function logout() {
        localStorage.userKey = '';
        localStorage.userSecret = '';
        userKey = '';
        userSecret = '';
        window.location.reload();
    }
    /*
     Now that we have the information we can Tweet!
     */
    function post(message) {

        $.get(url_back_end + "/twitter/publish?con_key=" + consumerKey + "&con_secret=" + consumerSecret + "&userKey=" + localStorage.userKey + "&userSecret=" + localStorage.userSecret + "&message=" + message, {})
                .done(function () {
                    $("#alert").hide();
                    $("#alert p").text("Publishing successful to Twitter");
                    $("#alert").show();
                    setTimeout(function () {
                        $("#alert").hide();
                    }, 3000);
                })
                .fail(function (xhr, error, status) {
                    
                });

    }
    function is_login() {
        userKey = localStorage.userKey;
        userSecret = localStorage.userSecret;
        if (userKey) {
            return true;
        } else {
            return false;
        }
    }
    // The public API
    return {
        init: init,
        post: post,
        logout: logout,
        is_login: is_login
    }

}());

/* -- Twitter END -- */
