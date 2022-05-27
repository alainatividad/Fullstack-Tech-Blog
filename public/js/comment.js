const submitCommentHandler = async (event) => {
  event.preventDefault();

  const content = document.querySelector("#content").value.trim();
  const postId = document.querySelector(".comment").getAttribute("data-post");
  // console.log("postID! " + postId);

  if (content) {
    // alert("Login!");
    const response = await fetch("/api/users/comment", {
      method: "POST",
      body: JSON.stringify({ content, postId }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace(`/post/${postId}`);
    }
  }
};

// add event listener to login button
document
  .querySelector(".post-comment")
  .addEventListener("click", submitCommentHandler);
