document.addEventListener("DOMContentLoaded", () => {
  const adminPassword = prompt("Please enter admin password:");
  if (!adminPassword) {
    window.location.assign("/");
    return;
  }

  fetch("/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminPassword }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.errors) {
        alert(data.errors[0]);
      } else if (data.success) {
        alert("You are now an admin!");
      }

      window.location.assign("/");
    });
});
