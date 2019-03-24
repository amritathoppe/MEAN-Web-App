function ajaxProfileForm() {
    //console.log("Username: " + document.getElementById("username") + " Password: " + document.getElementById("password"));

    var firstNameElement = document.getElementById("firstName");
    var lastNameElement = document.getElementById("lastName");
    var interestElement = document.getElementById("interest");
    var stateElement = document.getElementById("state");
    var profileImageElement = document.getElementById("profileImageText");
    var ImageUploadElement = document.getElementById("ImageUpload");

    // window.location.href = "http://localhost:8080/login.html";
    console.log("Inside AJAX");
    console.log(firstNameElement);
    console.log(lastNameElement);


    if (firstNameElement && lastNameElement) {
        var firstName = firstNameElement.value;
        var lastName = lastNameElement.value;
        var interest= interestElement.value;
        var state = stateElement.value;
        var profileImage = profileImageElement.value;
        var ImageUpload = ImageUploadElement.value;
        console.log("Username: " + firstName + " Password: " + lastName);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                var msgElement = document.getElementById("msg");
                if (msg) {
                    msg.innerHTML = this.responseText;
                    if (this.status == 200) {
                        msg.innerHTML = msg.innerHTML + "You can Search Profiles  " +
                            "by <a href='http://localhost:8080/searchProfile.html'> clicking here</a>";
                    }
                }
            }
        };
        xhr.open("POST", window.location.href, true);
        xhr.setRequestHeader("Content-type",
            "application/x-www-form-urlencoded");
        xhr.send("firstName="+firstName+"&lastName="+lastName +"&interest="+interest +"&state="+state+"&profileImageText="+profileImage +"&ImageUpload="+ImageUpload);
    }
}