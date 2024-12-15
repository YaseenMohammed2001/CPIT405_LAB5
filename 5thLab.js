// Helper functions for managing cookies
function setCookie(name, value, days = 365) {
  const expires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000
  ).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const cookieArr = document.cookie.split("; ");
  for (let cookie of cookieArr) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// Select elements
const likeButton = document.getElementById("like-button");
const dislikeButton = document.getElementById("dislike-button");
const likeCount = document.getElementById("like-count");
const dislikeCount = document.getElementById("dislike-count");
const commentInput = document.getElementById("comment-input");
const submitComment = document.getElementById("submit-comment");
const clearComments = document.getElementById("clear-comments");
const commentsSection = document.getElementById("comments-section");
const resetButton = document.getElementById("reset-button");

// Initialize state from cookies
let likes = parseInt(getCookie("likes")) || 100;
let dislikes = parseInt(getCookie("dislikes")) || 20;
let comments = JSON.parse(getCookie("comments")) || [];
let userVoted = getCookie("userVoted") || null; // 'like' or 'dislike'
let userCommented = getCookie("userCommented") || null;

// Update UI
function updateUI() {
  likeCount.textContent = likes;
  dislikeCount.textContent = dislikes;
  commentsSection.innerHTML = comments
    .map((comment) => `<p>${comment}</p>`)
    .join("");

  // Disable buttons if user already voted or commented
  likeButton.disabled = userVoted === "like";
  dislikeButton.disabled = userVoted === "dislike";
  submitComment.disabled = userCommented !== null;
}

// Event listeners
likeButton.addEventListener("click", () => {
  if (!userVoted) {
    likes++;
    userVoted = "like";
    setCookie("likes", likes);
    setCookie("userVoted", userVoted);
    updateUI();
  }
});

dislikeButton.addEventListener("click", () => {
  if (!userVoted) {
    dislikes++;
    userVoted = "dislike";
    setCookie("dislikes", dislikes);
    setCookie("userVoted", userVoted);
    updateUI();
  }
});

submitComment.addEventListener("click", () => {
  const comment = commentInput.value.trim();
  if (comment && !userCommented) {
    comments.push(comment);
    userCommented = comment;
    setCookie("comments", JSON.stringify(comments));
    setCookie("userCommented", userCommented);
    commentInput.value = "";
    updateUI();
  }
});

clearComments.addEventListener("click", () => {
  comments = [];
  deleteCookie("comments");
  userCommented = null;
  deleteCookie("userCommented");
  updateUI();
});

resetButton.addEventListener("click", () => {
  likes = 100;
  dislikes = 20;
  comments = [];
  userVoted = null;
  userCommented = null;
  deleteCookie("likes");
  deleteCookie("dislikes");
  deleteCookie("comments");
  deleteCookie("userVoted");
  deleteCookie("userCommented");
  updateUI();
});

// Initial UI update
updateUI();
