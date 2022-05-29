const signUpFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector("#name-signup").value.trim();
  const email = document.querySelector("#email-signup").value.trim();
  const password = document.querySelector("#password-signup").value.trim();

  if (name && email && password) {
    // create a post request with the details entered
    const response = await fetch("/api/users/", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      // redirect to homepage
      document.location.replace("/");
    } else {
      //  alert user if request has failed
      alert("Failed to sign in");
    }
  }
};

// event listener for the submit button
document
  .querySelector(".signup-form")
  .addEventListener("submit", signUpFormHandler);
