let logFunc = (function() {

    function postLog(username, pwd)
    {
        console.log(username);
        console.log(pwd);
        $.ajax({
            type: "POST",
            url: "/login/",
            data: {
                login: username,
                password: pwd
            },
            success: () => {
                window.location.href = "/";
            },
        });
    }

    return{
        sendLogin(username, pwd){
            postLog(username, pwd);
        }
    };

})();