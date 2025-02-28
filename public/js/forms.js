document.addEventListener("DOMContentLoaded", () => {
  const newsletterForm = document.getElementById("newsletterForm");

  if (!newsletterForm) return; // ✅ Exit if form does not exist (prevents errors)

  const nameInput = document.getElementById("nl-name");
  const emailInput = document.getElementById("nl-email");
  const consentCheckbox = document.getElementById("consentCheckbox");
  const alertDiv = document.getElementById("newsLettersAlert");

  newsletterForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission
    alert("clicked");
    // Get form values
    const fullName = nameInput.value.trim();
    const email = emailInput.value.trim();
    const consentGiven = consentCheckbox.checked;

    // Validate inputs
    if (!fullName || !email || !consentGiven) {
      showAlert("<%= __('email_required') %>", "error");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/form/submit",
        {
          fullName,
          email,
          form_type: "newsletter",
        }
      );

      showAlert("<%= __('newsletter_signup_success') %>", "success");
      nameInput.value = "";
      emailInput.value = "";
    } catch (error) {
      let errorMessage = error.message; //

      if (error.response) {
        const { message, errorType } = error.response.data;

        // Handle different error cases based on errorType
        if (errorType === "missing_fields") {
          errorMessage = "Please fill in all required fields.";
        } else if (errorType === "invalid_email") {
          errorMessage = "Invalid email format. Please enter a valid email.";
        } else if (errorType === "invalid_form_type") {
          errorMessage = "Form type is incorrect.";
        } else if (errorType === "server_error") {
          errorMessage =
            "There was a problem processing your request. Try again.";
        } else {
          errorMessage = message; // Fallback to the default message from the server
        }
      }

      showAlert(errorMessage, "error"); // ✅ Show detailed error message
    }
  });

  // Function to display alerts
  function showAlert(message, type) {
    alertDiv.textContent = message;
    alertDiv.className = `form-alert ${type}`; // Set success or error class
    alertDiv.classList.remove("d-none");

    // Hide alert after 5 seconds
    setTimeout(() => {
      alertDiv.classList.add("d-none");
    }, 5000);
  }
});
