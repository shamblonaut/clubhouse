const memberStatusForm = document.querySelector("form.member-status");
memberStatusForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);

  const isMember = formData.get("isMember");
  if (isMember === "true") return;

  const memberPassword = prompt("Please enter member password:");
  if (!memberPassword) return;

  fetch("/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberPassword }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.errors) {
        return alert(data.errors[0]);
      } else if (data.success) {
        alert("You are now a member!");
        window.location.reload();
      }
    });
});
