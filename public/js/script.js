const cardEventHandler = async (event) => {
  var card = event.target;

  if (card.parentElement.matches(".card")) {
    var path = card.parentElement.getAttribute("data-post");
    window.location.href = `/post/${path}`;
  }
};

document.querySelector(".card").addEventListener("click", cardEventHandler);
