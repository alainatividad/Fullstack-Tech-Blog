const createPost = async (event) => {
  event.preventDefault();

  const title = document.querySelector("#title").value.trim();
  const content = document.querySelector("#content").value.trim();

  if (content && title) {
    const response = await fetch("/api/users/post", {
      method: "POST",
      body: JSON.stringify({ title, content }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace(`/dashboard`);
    }
  }
};

// for update and delete buttons
const updatePost = async (event) => {
  const element = event.target;
  const elementType = event.target.getAttribute("type");

  // event.preventDefault();
  if (element.matches("button")) {
    if (elementType === "submit") {
      // get card element of the event target
      const topParent = element.parentElement.parentElement;
      const postId = topParent.getAttribute("data-post");
      // content is the text of textarea of the Card Body (last child element of topParent)
      const content = topParent.lastElementChild.firstElementChild.value.trim();
      // title is from the innerText of the button element in the Card Header (first child element of topParent)
      const title =
        topParent.firstElementChild.firstElementChild.innerText.trim();

      if (content && title) {
        const response = await fetch(`/api/users/post/${postId}`, {
          method: "PUT",
          body: JSON.stringify({ title, content }),
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          alert("Post updated");
          document.location.replace(`/dashboard`);
        }
      }
    } else if (elementType === "delete") {
      // get card element of the event target
      const topParent = element.parentElement.parentElement;
      const postId = topParent.getAttribute("data-post");
      if (postId) {
        const response = await fetch(`/api/users/post/${postId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          alert("Post deleted");
          document.location.replace(`/dashboard`);
        }
      }
    }
  }
};
// check which post triggered the update
document.querySelector(".posts").addEventListener("click", updatePost);

document.querySelector(".new-post").addEventListener("click", createPost);
