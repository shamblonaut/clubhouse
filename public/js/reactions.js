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
    const reactionButton = event.currentTarget;
    const postVote = Number(reactionButton.parentNode.dataset["vote"]);
    const postId = reactionButton.dataset["post_id"];

    const fetchOptions = {
      headers: { "Content-Type": "application/json" },
      ...(postVote === vote
        ? { method: "DELETE" }
        : postVote === -vote
          ? { method: "PATCH", body: JSON.stringify({ vote }) }
          : { method: "POST", body: JSON.stringify({ vote }) }),
    };

    fetchWithLoader(`/posts/${postId}/react`, fetchOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `HTTP Error ${response.status}: ${response.statusText}`,
          );
        }

        if (response.status === 204) {
          return null;
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (data !== null) {
          updateReactions(data.data);
        } else {
          const voteCountDisplay = reactionButton.querySelector(".count");
          voteCountDisplay.textContent =
            Number(voteCountDisplay.textContent) - 1;
        }

        reactionButton.parentNode.dataset["vote"] =
          data?.data?.[postId]?.user_reaction || 0;
      });
  };
}

likeButtons?.forEach((likeButton) => {
  likeButton?.addEventListener("click", createReactionHandler(1));
});
dislikeButtons?.forEach((dislikeButton) => {
  dislikeButton?.addEventListener("click", createReactionHandler(-1));
});
