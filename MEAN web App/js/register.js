function ajaxSubmitForm() {
    console.log("Username: " + document.getElementById("username") + " Password: " + document.getElementById("password"));

    var usernameElement = document.getElementById("username");
    var passwordElement = document.getElementById("password");
   // window.location.href = "http://localhost:8080/login.html";
    console.log("Inside AJAX");
    console.log(usernameElement);
    console.log(passwordElement);


    if (usernameElement && passwordElement) {
        var username = usernameElement.value;
        var password = passwordElement.value;
        console.log("Username: " + username + " Password: " + password);
       /* if(usernameElement.value == 0 ||usernameElement.value.length <= 0)
        {
        var msgElement = document.getElementById("msg");
         if(msg)
         msg.innerHTML("user required!");
        }*/
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                var msgElement = document.getElementById("msg");
                if (msg) {
                    msg.innerHTML = this.responseText;
                    if (this.status == 200) {
                        msg.innerHTML = msg.innerHTML + "You will be redirected to the Login Page in 15 seconds " +
                            "or <a href='http://localhost:8080/login.html'>click here</a>";
                        setTimeout(function() {
                            window.location.href = "http://localhost:8080/login.html";
                        }, 15000);
                    }
                }
            }
        };
        xhr.open("POST", window.location.href, true);
        xhr.setRequestHeader("Content-type",
            "application/x-www-form-urlencoded");
        xhr.send("username="+username+"&password="+password);
    }
}