$(document).ready(function() {
 // Getting references to our form and inputs for user login password and email
  var loginForm = $("form.login");
  var emailInput = $("input#email");
  var passwordInput = $("input#password");

  var lsmsg = localStorage.getItem("lsmsg");
  console.log("Login Message =" + lsmsg);
  //FunctionloginForm passes in the email and password and creates a local storage
  //for user email, updates the logged state to true, and passes the email and
  //password to validate user login.
  loginForm.on("submit", function(event) {
    event.preventDefault();
    var userData = 
    {
      email: emailInput.val(),
      password: passwordInput.val()
    };
    localStorage.removeItem("PetsTalkUser");
    localStorage.setItem("PetsTalkUser", email);
    //if email or password not submitted jump out of the function
    if (!userData.email || !userData.password) {
      return;
    }
    //call login function and put email in local storage
    login();
    //update the login state to true
    updateLogState(userData.email);
    //if valid email and password go ahead and pass to loginUser function
    //console.log("Email4=" + userData.email + " Password4=" + userData.password);
    loginUser(userData.email, userData.password);
    //clear out the values after logged in
    emailInput.val("");
    passwordInput.val("");
  });

  // loginUser does a post to our "api/login" route to determine users that are current logged in
  function loginUser(email, password) {
    $.post("/api/login", 
    {
      email: email,
      password: password
    })
    .then(function(data) {
      window.location.replace(data);
    }).catch(handleLoginErr);
    
  }

  // Update the database to indicate the user is currently logged in.
  function updateLogState(email) 
  {
    var loginData=
    {
      email:email,
      logged:true
    }
    //calling ajax call to update the login state of the user then get the updated data from api call
  $.ajax({
    method : "PUT",
    url : "/api/login",
    data: loginData
  })
  // .then(getUpdate);
  }

  // Saving Email/User Id in local storage
  function login() 
  {
    //console.log("Saving email in to local storage");
    //Clear current local storage before adding fresh entry
    localStorage.removeItem("PetsTalkUser");
    //get the user email, store in local storage
    var email = $("#email").val().trim();
    localStorage.setItem("PetsTalkUser", email);
    //clear the email value
    $('#email').val(''); 
  }


  function handleLoginErr(err) {

    $(".alert").show();
    $(".alert").fade(5000);

  }

});

