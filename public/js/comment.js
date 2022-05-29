const submitCommentHandler = async (event) => {
  event.preventDefault();

  // get the entry entered into the textbox
  const content = document.querySelector("#content").value.trim();
  // I have stored the postId into the data-post attribute of comment-card so we'll be getting that to link the comment to the post
  const postId = document.querySelector(".comment").getAttribute("data-post");

  if (content) {
    // crete a post request with content and postId in its body
    const response = await fetch("/api/users/comment", {
      method: "POST",
      body: JSON.stringify({ content, postId }),
      headers: { "Content-Type": "application/json" },
    });

    // if ok, reload the post page
    if (response.ok) {
      document.location.replace(`/post/${postId}`);
    }
  }
};

// add event listener to login button
document
  .querySelector(".post-comment")
  .addEventListener("click", submitCommentHandler);
