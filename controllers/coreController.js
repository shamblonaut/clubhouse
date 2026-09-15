import {
  selectPostsWithAuthors,
  selectReactionsForPosts,
} from "../db/queries.js";
import objectArrayToObject from "../utils/objectify.js";

export const showHome = async (req, res) => {
  const posts = await selectPostsWithAuthors();
  const reactions = objectArrayToObject(
    await selectReactionsForPosts(req.user?.id),
    "post_id",
    "vote",
  );
  res.render("home", {
    user: req.user,
    isAuthenticated: req.isAuthenticated(),
    isMember: req.user?.is_member,
    isAdmin: req.user?.is_admin,
    posts,
    reactions,
  });
};
