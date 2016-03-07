function login(){

    var userName = document.getElementById("username").value;
    var password = document.getElementById("password").value;

	var sendParameters = "?UserName="+userName+"&Password="+password;
    $.ajax({url:"/login/"+sendParameters,success:function(result){
        console.log(result);

        if (result === "password passed"){
            console.log("log the user in");



            var sendParameters = "?UserName="+userName;
            $.ajax({url:"/alarmUser/"+sendParameters,success:function(result){
                $(location).attr('href', 'http://127.0.0.1:8000/alarmDefault/');
                console.log(result);
            }});

        }
        else if (result === "password failed"){
            alert("Password failed, please retry.");
        }
        else if (result === "no such user"){
            alert("No such user, please register first.");
        }


    }});
}

function register(){

    var userName = document.getElementById("username").value;
    var password = document.getElementById("password").value;

	var sendParameters = "?UserName="+userName+"&Password="+password;
    $.ajax({url:"/register/"+sendParameters,success:function(result){
        console.log(result);

        if (result === "user registered"){
            alert("Your account has been registered, please log in using your credentials!");
        }
        else if (result === "user exists"){
            alert("User exists, please log in with your credentials, or reset password.");
        }
        else if (result === "password changed"){
            alert("Password changed, please log in with your new password.");
        }

    }});
}
