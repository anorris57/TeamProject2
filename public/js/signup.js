$(document).ready(function() 
{ 
  // Getting references to our form and input
  var signUpForm = $("form.signup");
  var emailInput = $("input#email");
  var passwordInput = $("input#password");
  var usersname = emailInput.val();
  var username = usersname.substring(0, usersname.indexOf('@'));
  // When the signup button is clicked, validate the email and password are not blank
  signUpForm.on("submit", function(event) {
    event.preventDefault();
    var usersname = emailInput.val();
    var username = usersname.substring(0, usersname.indexOf('@'));
    var userData = {
      email: emailInput.val(),
      password: passwordInput.val(),
      userName: username,
    };

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData);
    emailInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If succesful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(userData) {
    localStorage.setItem("PetsTalkUser", userData.email);
    $.post("/api/signup", {
      email: userData.email,
      password: userData.password,
      userName: userData.userName
    }).then(userdata =>  {
      window.location.replace("/login");
      // If there's an error, handle it by throwing up a boostrap alert
    }).catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(3500);
  }

});
