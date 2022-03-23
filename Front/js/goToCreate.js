let goToCreate = (function() {

    function goToC()
    {
        $.ajax({
            type: "POST",
            url: "/goToCreation/",
            data: {
                login: -1
            },
            success: () => {
                window.location.href = "/";
            },
        });
    }

    return{
        goToCreationPage(){
            goToC();
        },
    };

})();