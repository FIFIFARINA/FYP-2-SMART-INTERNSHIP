const loginForm = document.getElementById("loginForm");
const formMessage = document.getElementById("formMessage");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword?.addEventListener("click", () => {
  const showing = passwordInput.type === "text";
  passwordInput.type = showing ? "password" : "text";
  togglePassword.textContent = showing ? "Show" : "Hide";
  togglePassword.setAttribute("aria-label", showing ? "Show password" : "Hide password");
});
loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!loginForm.reportValidity()) return;
  const username = document.getElementById("username").value.trim();
  const role = document.getElementById("userRole").value;
  const destinationByRole = { student: "dashboard.html", supervisor: "supervisor.html", admin: "supervisor.html" };
  const destination = destinationByRole[role];
  if (!destination) { formMessage.textContent = "Please select a valid account type."; return; }
  sessionStorage.setItem("sim_username", username || "User");
  sessionStorage.setItem("sim_user_role", role);
  window.location.href = destination;
});
document.getElementById("forgotLink")?.addEventListener("click", (event) => { event.preventDefault(); formMessage.textContent = "Password reset can be connected to your university email service."; });
document.getElementById("signupLink")?.addEventListener("click", (event) => { event.preventDefault(); formMessage.textContent = "Registration can be added for students, lecturers, and administrators."; });