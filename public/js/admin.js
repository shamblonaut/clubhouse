const postDeleteButtons = document.querySelectorAll(".delete-post");
postDeleteButtons?.forEach((postDeleteButton) => {
  postDeleteButton.addEventListener("click", (event) => {
    const postId = event.currentTarget.dataset["post_id"];
    if (!postId) return;

    const confirmation = confirm("Are you sure you want to delete that post?");
    if (!confirmation) return;

    fetch(`/posts/${postId}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          alert("Post deleted successfully!");
          window.location.reload();
          return;
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (data?.errors) {
          alert(errors[0]);
        }
      });
  });
});
