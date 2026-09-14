const likeButtons = document.querySelectorAll("button.like");
const dislikeButtons = document.querySelectorAll("button.dislike");

function updateReactions(updatedData) {
  likeButtons.forEach((likeButton) => {
    const postId = Number(likeButton.dataset["post_id"]);
    const countDisplay = likeButton.querySelector(".count");
    countDisplay.textContent = updatedData[postId].likes;
  });

  dislikeButtons.forEach((dislikeButton) => {
    const postId = Number(dislikeButton.dataset["post_id"]);
    const countDisplay = dislikeButton.querySelector(".count");
    countDisplay.textContent = updatedData[postId].dislikes;
  });
}

function createReactionHandler(vote) {
  return (event) => {
    const postVote = Number(event.target.parentNode.dataset["vote"]);
    const postId = event.target.dataset["post_id"];

    const fetchOptions = {
      headers: { "Content-Type": "application/json" },
      ...(postVote === vote
        ? { method: "DELETE" }
        : postVote === -vote
          ? { method: "PATCH", body: JSON.stringify({ vote }) }
          : { method: "POST", body: JSON.stringify({ vote }) }),
    };

    fetch(`/posts/${postId}/react`, fetchOptions)
      .then((response) => response.json())
      .then(({ success, data }) => {
        if (data) {
          updateReactions(data);
        } else if (success) {
          const voteCountDisplay = event.target.querySelector(".count");
          voteCountDisplay.textContent =
            Number(voteCountDisplay.textContent) - 1;
        }

        event.target.parentNode.dataset["vote"] =
          data?.[postId]?.user_reaction || 0;
      });
  };
}

likeButtons?.forEach((likeButton) => {
  likeButton?.addEventListener("click", createReactionHandler(1));
});
dislikeButtons?.forEach((dislikeButton) => {
  dislikeButton?.addEventListener("click", createReactionHandler(-1));
});
