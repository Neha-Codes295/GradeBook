function validation() {
    var emailid = document.getElementById("exampleInputEmail1");
    var password = document.getElementById("exampleInputPassword1");
  
    var emailValue = document.getElementById("exampleInputEmail1").value;
  
    var regex = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;
  
    if (emailid.value.trim() != "" && password.value.trim() != "") {
      if (regex.test(emailValue)) {
        return true;
      } else {
      alert("Invalid Email address!!Please Try Again");
      return false;}
    } else {
      alert("No blank value allowed");
      return false;
    }
  }