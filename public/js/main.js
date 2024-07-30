// Wait for marked to be available
function ensureMarked() {
  return new Promise((resolve, reject) => {
    console.log("ensureMarked called, marked status:", typeof marked);
    if (typeof marked === "object" && typeof marked.parse === "function") {
      console.log("marked is available as an object with parse method");
      window.markedParse = marked.parse.bind(marked);
      resolve();
    } else if (typeof marked === "function") {
      console.log("marked is available as a function");
      window.markedParse = marked;
      resolve();
    } else if (typeof marked !== "undefined") {
      console.log("marked is available but not as expected:", marked);
      reject(new Error("marked is not available in the expected format"));
    } else {
      console.log("Loading marked script");
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
      script.onload = () => {
        console.log("marked script loaded, status:", typeof marked);
        if (typeof marked === "object" && typeof marked.parse === "function") {
          window.markedParse = marked.parse.bind(marked);
          resolve();
        } else if (typeof marked === "function") {
          window.markedParse = marked;
          resolve();
        } else {
          reject(new Error("marked loaded but not in the expected format"));
        }
      };
      script.onerror = (error) => {
        console.error("Error loading marked:", error);
        reject(error);
      };
      document.head.appendChild(script);
    }
  });
}

// Initialize marked when it's available
ensureMarked()
  .then(() => {
    if (typeof marked === "object" && typeof marked.parse === "function") {
      console.log("Using marked.parse");
      window.markedParse = marked.parse.bind(marked);
    } else if (typeof marked === "function") {
      console.log("Using marked directly");
      window.markedParse = marked;
    } else {
      throw new Error("marked is not available in the expected format");
    }
    // Set options if available
    if (typeof marked.setOptions === "function") {
      marked.setOptions({
        breaks: true,
        gfm: true,
      });
    }
  })
  .catch((error) => {
    console.error("Failed to initialize marked:", error);
  });

function showRegisterForm() {
  const mainContent = document.getElementById("mainContent");
  mainContent.innerHTML = `
        <h2>Register</h2>
        <form id="registerForm">
            <div class="mb-3">
                <label for="registerEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="registerEmail" required>
            </div>
            <div class="mb-3">
                <label for="registerPassword" class="form-label">Password</label>
                <input type="password" class="form-control" id="registerPassword" required>
            </div>
            <button type="submit" class="btn btn-primary">Register</button>
        </form>
    `;
  document
    .getElementById("registerForm")
    .addEventListener("submit", handleRegister);
}

function showLoginForm() {
  const mainContent = document.getElementById("mainContent");
  mainContent.innerHTML = `
        <h2>Sign In </h2>
        <form id="loginForm">
            <div class="mb-3">
                <label for="loginEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="loginEmail" required>
            </div>
            <div class="mb-3">
                <label for="loginPassword" class="form-label">Password</label>
                <input type="password" class="form-control" id="loginPassword" required>
            </div>
            <button type="submit" class="btn btn-primary">Sign In</button>
        </form>
        <p class="mt-3">
          <a href="#" id="forgotPasswordLink">Forgot Password?</a>
        </p>
    `;
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document
    .getElementById("forgotPasswordLink")
    .addEventListener("click", showForgotPasswordForm);
}

async function handleRegister(event) {
  event.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  try {
    await register(email, password);
    showLoginForm();
  } catch (error) {
    alert(error.message);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  try {
    await login(email, password);
    updateNavbar();
    await loadContent();
  } catch (error) {
    alert(error.message);
  }
}

function handleLogout() {
  logout();
  updateNavbar();
  loadContent();
}

function showForgotPasswordForm(event) {
  event.preventDefault();
  const mainContent = document.getElementById("mainContent");
  mainContent.innerHTML = `
    <h2>Forgot Password</h2>
    <p>Enter your email address to receive a password reset link.</p>
    <form id="forgotPasswordForm">
      <div class="mb-3">
        <label for="resetEmail" class="form-label">Email</label>
        <input type="email" class="form-control" id="resetEmail" required>
      </div>
      <button type="submit" class="btn btn-primary">Request Password Reset</button>
    </form>
    <p class="mt-3">
      <a href="#" id="backToLoginLink">Back to Login</a>
    </p>
  `;
  document
    .getElementById("forgotPasswordForm")
    .addEventListener("submit", handleForgotPassword);
  document
    .getElementById("backToLoginLink")
    .addEventListener("click", showLoginForm);
}

// Function to handle the forgot password form submission
async function handleForgotPassword(event) {
  event.preventDefault();
  const email = document.getElementById("resetEmail").value;
  try {
    await requestPasswordReset(email);
    alert(
      "If an account with that email exists, we've sent a password reset link."
    );
    showLoginForm();
  } catch (error) {
    console.error("Error requesting password reset:", error);
    alert("Error requesting password reset. Please try again.");
  }
}

// Function to send the password reset request to the server
async function requestPasswordReset(email) {
  try {
    const response = await apiCall("/auth/request-password-reset", "POST", {
      email,
    });
    return response;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error;
  }
}

// Function to check for password reset token in URL
function checkForPasswordResetToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  if (token) {
    showResetPasswordForm(token);
  }
}

// Function to show the reset password form
function showResetPasswordForm(token) {
  const mainContent = document.getElementById("mainContent");
  mainContent.innerHTML = `
    <h2>Reset Your Password</h2>
    <form id="resetPasswordForm">
      <input type="hidden" id="resetToken" value="${token}">
      <div class="mb-3">
        <label for="newPassword" class="form-label">New Password</label>
        <input type="password" class="form-control" id="newPassword" required>
      </div>
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Confirm New Password</label>
        <input type="password" class="form-control" id="confirmPassword" required>
      </div>
      <button type="submit" class="btn btn-primary">Reset Password</button>
    </form>
  `;
  document
    .getElementById("resetPasswordForm")
    .addEventListener("submit", handleResetPassword);
}

// Function to handle the reset password form submission
async function handleResetPassword(event) {
  event.preventDefault();
  const token = document.getElementById("resetToken").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    await resetPassword(token, newPassword);
    alert(
      "Password reset successful. You can now log in with your new password."
    );
    showLoginForm();
  } catch (error) {
    console.error("Error resetting password:", error);
    alert("Error resetting password. Please try again.");
  }
}

// Function to send the reset password request to the server
async function resetPassword(token, newPassword) {
  return apiCall("/auth/reset-password", "POST", { token, newPassword });
}

async function handleSearch(event) {
  event.preventDefault();
  const query = document.getElementById("searchInput").value.trim();
  console.log("Search query:", query); // Add this log
  if (query === "") {
    return;
  }
  try {
    const posts = await searchPosts(query);
    displaySearchResults(posts);
  } catch (error) {
    console.error("Error searching posts:", error);
    alert("Error searching posts. Please try again.");
  }
}

async function searchPosts(query) {
  try {
    console.log("Searching for:", query); // Add this log
    return await apiCall(`/posts/search?query=${encodeURIComponent(query)}`);
  } catch (error) {
    console.error("Error searching posts:", error);
    throw error;
  }
}

function displaySearchResults(posts) {
  const mainContent = document.getElementById("mainContent");
  if (posts.length === 0) {
    mainContent.innerHTML =
      '<p class="text-center mt-5">No posts found matching your search.</p>';
    return;
  }

  mainContent.innerHTML = `
    <div class="row d-flex flex-row justify-content-center align-items-center align-content-center">
    <div class="mb-4"> <h2>Search Results</h2> </div>
                    <div class="col-md-10">
                        ${posts
                          .map(
                            (post, index) => `
                            <article class="post-card ${
                              index === 0 ? "featured-post" : ""
                            }" data-post-id="${
                              post.id
                            }" onclick="displaySinglePost(${
                              post.id
                            }); return false;">
                                <div class="row" style="cursor: pointer;" onclick="displaySinglePost(${
                                  post.id
                                }); return false;"
                                          >
                                    <div class="col-md-8">
                                        <div class="post-meta">
                                            <img src="https://picsum.photos/30/30" class="rounded-circle" alt="${
                                              post.author
                                            }">
                                            <span class="author">${
                                              post.author
                                            }</span>
                                            <span class="date">${new Date(
                                              post.created_at
                                            ).toLocaleDateString("en-US", {
                                              month: "short",
                                              day: "numeric",
                                            })}</span>
                                        </div>
                                        <h2 class="post-title">
                                          ${post.title}
                                          </h2>
                                        <p class="post-excerpt">${post.content.substring(
                                          0,
                                          100
                                        )}...</p>
                                        <div class="post-footer">
                                            <span class="read-time">${Math.ceil(
                                              post.content.split(" ").length /
                                                200
                                            )} min read</span>
                                        </div>
                                    </div>
                                    <div class="col-md-4 align-content-center" >
                                        ${
                                          post.image_url
                                            ? `<img src="${post.image_url}" class="img-fluid post-image" alt="${post.title}">`
                                            : ""
                                        }
                                    </div>
                                </div>
                            </article>
                        `
                          )
                          .join("")}
                    </div>
  `;
}

function updateNavbar() {
  const navbarContent = document.getElementById("navbarContent");
  if (!navbarContent) {
    console.error("Navbar content element not found");
    return;
  }
  if (isLoggedIn()) {
    navbarContent.innerHTML = `
            <form class="d-flex col-9" role="search" onsubmit="handleSearch(event)" id="seachForm" >
                <input class="form-control me-2" type="search" id="searchInput" placeholder="Search BlogNarrative"
                    aria-label="Search" style="width: 85%;">
                <button class="btn btn-outline-secondary" type="submit">Search</button>
            </form>
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0 px-5">
              <li class="nav-item" onclick="showCreatePostForm()"
                style="color: #bebebe; display: flex; flex-direction: row; align-items: center;">
                  <a class="nav-link btn text-dark" href="#"
                      style="display: flex; align-items: center; gap: 0.5em; font-family: sohne, 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #bebebe;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#262626"
                          viewBox="0 0 24 24" aria-label="Write">
                          <path fill="#262626"
                              d="M14 4a.5.5 0 0 0 0-1zm7 6a.5.5 0 0 0-1 0zm-7-7H4v1h10zM3 4v16h1V4zm1 17h16v-1H4zm17-1V10h-1v10zm-1 1a1 1 0 0 0 1-1h-1zM3 20a1 1 0 0 0 1 1v-1zM4 3a1 1 0 0 0-1 1h1z">
                          </path>
                          <path stroke="#262626"
                              d="m17.5 4.5-8.458 8.458a.25.25 0 0 0-.06.098l-.824 2.47a.25.25 0 0 0 .316.316l2.47-.823a.25.25 0 0 0 .098-.06L19.5 6.5m-2-2 2.323-2.323a.25.25 0 0 1 .354 0l1.646 1.646a.25.25 0 0 1 0 .354L19.5 6.5m-2-2 2 2">
                          </path>
                      </svg>
                      Write
                  </a>
              </li>
              <li class="nav-item" onclick="handleLogout()" style=" display: flex; flex-direction: row; align-items: center;">
                  <a class="nav-link btn text-dark">
                      SignOut
                  </a>
              </li>
            </ul>
            `;
  } else {
    navbarContent.innerHTML = `
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#blogNarrativeNavbar"
                  aria-controls="blogNarrativeNavbar" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="blogNarrativeNavbar">
                 
                  <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                      <li class="nav-item" onclick="showLoginForm()"
                        style="color: #bebebe; display: flex; flex-direction: row; align-items: center;">
                          <a class="nav-link btn text-dark" href="#"
                              style="display: flex; align-items: center; gap: 0.5em; font-family: sohne, 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #bebebe;">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#262626"
                                  viewBox="0 0 24 24" aria-label="Write">
                                  <path fill="#262626"
                                      d="M14 4a.5.5 0 0 0 0-1zm7 6a.5.5 0 0 0-1 0zm-7-7H4v1h10zM3 4v16h1V4zm1 17h16v-1H4zm17-1V10h-1v10zm-1 1a1 1 0 0 0 1-1h-1zM3 20a1 1 0 0 0 1 1v-1zM4 3a1 1 0 0 0-1 1h1z">
                                  </path>
                                  <path stroke="#262626"
                                      d="m17.5 4.5-8.458 8.458a.25.25 0 0 0-.06.098l-.824 2.47a.25.25 0 0 0 .316.316l2.47-.823a.25.25 0 0 0 .098-.06L19.5 6.5m-2-2 2.323-2.323a.25.25 0 0 1 .354 0l1.646 1.646a.25.25 0 0 1 0 .354L19.5 6.5m-2-2 2 2">
                                  </path>
                              </svg>
                              Write
                          </a>
                      </li>
                      <li class="nav-item">
                          <a class="nav-link btn text-dark" onclick="showLoginForm()">Sign in</a>
                      </li>
                      <li class="nav-item">
                          <a class="nav-link btn btn-outline-secondary text-dark"
                              onclick="showRegisterForm()">Get Started</a>
                      </li>
                  </ul>
              </div>
        `;
  }
}

async function displayPosts() {
  const mainContent = document.getElementById("mainContent");
  try {
    console.log("displayPosts called");
    // await ensureMarked();
    // console.log(
    //   "After ensureMarked, window.markedParse is:",
    //   typeof window.markedParse
    // );
    // if (typeof window.markedParse !== "function") {
    //   throw new Error(
    //     "markedParse is not a function after ensuring it's loaded"
    //   );
    // }

    const posts = await getAllPosts();
    if (posts.length === 0) {
      mainContent.innerHTML =
        '<p class="text-center mt-5">No stories yet. Be the first to write a story!</p>';
    } else {
      mainContent.innerHTML = `
                <div class="row d-flex flex-row justify-content-center align-items-center align-content-center">
                    <div class="col-md-10">
                        ${posts
                          .map(
                            (post, index) => `
                            <article class="post-card ${
                              index === 0 ? "featured-post" : ""
                            }" data-post-id="${
                              post.id
                            }" onclick="displaySinglePost(${
                              post.id
                            }); return false;">
                                <div class="row" style="cursor: pointer;" onclick="displaySinglePost(${
                                  post.id
                                }); return false;"
                                          >
                                    <div class="col-md-8">
                                        <div class="post-meta">
                                            <img src="https://picsum.photos/30/30" class="rounded-circle" alt="${
                                              post.author
                                            }">
                                            <span class="author">${
                                              post.author
                                            }</span>
                                            <span class="date">${new Date(
                                              post.created_at
                                            ).toLocaleDateString("en-US", {
                                              month: "short",
                                              day: "numeric",
                                            })}</span>
                                        </div>
                                        <h2 class="post-title">
                                          ${post.title}
                                          </h2>
                                        <p class="post-excerpt">${post.content.substring(
                                          0,
                                          100
                                        )}...</p>
                                        <div class="post-footer">
                                            <span class="read-time">${Math.ceil(
                                              post.content.split(" ").length /
                                                200
                                            )} min read</span>
                                        </div>
                                    </div>
                                    <div class="col-md-4 align-content-center" >
                                        ${
                                          post.image_url
                                            ? `<img src="${post.image_url}" class="img-fluid post-image" alt="${post.title}">`
                                            : ""
                                        }
                                    </div>
                                </div>
                            </article>
                        `
                          )
                          .join("")}
                    </div>
            `;
    }
  } catch (error) {
    mainContent.innerHTML = `<p class="text-danger text-center mt-5">Error loading stories: ${error.message}</p>`;
  }
  // Add click event to post cards
  document.querySelectorAll(".post-card").forEach((card) => {
    card.addEventListener("click", async (event) => {
      const postId = event.currentTarget.dataset.postId;
      displaySinglePost(postId);
    });
  });
}

async function displaySinglePost(postId) {
  const mainContent = document.getElementById("mainContent");
  // const likeCount = await getLikeCount(postId);
  // const isLiked = await getUserLikeStatus(postId);
  try {
    await ensureMarked(); // Ensure marked is available
    const post = await getPost(postId);
    const currentUserId = getUserId();
    const isAuthor = post.user_id === currentUserId;
    let likeCount = 0;
    try {
      likeCount = await getLikeCount(postId);
    } catch (likeError) {
      console.error("Error fetching like count:", likeError);
    }
    console.log("Fetched post:", post);
    if (!post) {
      throw new Error("Post not found");
    }
    const parsedContent = DOMPurify.sanitize(window.markedParse(post.content));
    mainContent.innerHTML = `
      <article class="single-post" data-post-id="${post.id}">
        <h1>${post.title}</h1>
        <div class="post-meta">
          <img src="https://picsum.photos/30/30" class="rounded-circle" alt="${
            post.author
          }">
          <span class="author">${post.author}</span>
          <span class="date">${new Date(post.created_at).toLocaleDateString(
            "en-US",
            { month: "long", day: "numeric" }
          )}</span>
        </div>
        ${
          post.image_url
            ? `<img src="${post.image_url}" class="img-fluid post-image" alt="${post.title}">`
            : ""
        }
        <div class="post-content"></div>
                <div class="post-actions d-flex  m-3 ">
                    <button class="mt-3" id="likeButton" style="border:0px; background:transparent;">
                        <i class="before-like"></i>
                        <svg class="clap-icon like-btn" data-post-id="1" xmlns="http://www.w3.org/2000/svg"
                          width="24" height="24" viewBox="0 0 24 24" aria-label="clap">
                          <path fill-rule="evenodd"
                          d="M11.37.828 12 3.282l.63-2.454zM13.916 3.953l1.523-2.112-1.184-.39zM8.589 1.84l1.522 2.112-.337-2.501zM18.523 18.92c-.86.86-1.75 1.246-2.62 1.33a6 6 0 0 0 .407-.372c2.388-2.389 2.86-4.951 1.399-7.623l-.912-1.603-.79-1.672c-.26-.56-.194-.98.203-1.288a.7.7 0 0 1 .546-.132c.283.046.546.231.728.5l2.363 4.157c.976 1.624 1.141 4.237-1.324 6.702m-10.999-.438L3.37 14.328a.828.828 0 0 1 .585-1.408.83.83 0 0 1 .585.242l2.158 2.157a.365.365 0 0 0 .516-.516l-2.157-2.158-1.449-1.449a.826.826 0 0 1 1.167-1.17l3.438 3.44a.363.363 0 0 0 .516 0 .364.364 0 0 0 0-.516L5.293 9.513l-.97-.97a.826.826 0 0 1 0-1.166.84.84 0 0 1 1.167 0l.97.968 3.437 3.436a.36.36 0 0 0 .517 0 .366.366 0 0 0 0-.516L6.977 7.83a.82.82 0 0 1-.241-.584.82.82 0 0 1 .824-.826c.219 0 .43.087.584.242l5.787 5.787a.366.366 0 0 0 .587-.415l-1.117-2.363c-.26-.56-.194-.98.204-1.289a.7.7 0 0 1 .546-.132c.283.046.545.232.727.501l2.193 3.86c1.302 2.38.883 4.59-1.277 6.75-1.156 1.156-2.602 1.627-4.19 1.367-1.418-.236-2.866-1.033-4.079-2.246M10.75 5.971l2.12 2.12c-.41.502-.465 1.17-.128 1.89l.22.465-3.523-3.523a.8.8 0 0 1-.097-.368c0-.22.086-.428.241-.584a.847.847 0 0 1 1.167 0m7.355 1.705c-.31-.461-.746-.758-1.23-.837a1.44 1.44 0 0 0-1.11.275c-.312.24-.505.543-.59.881a1.74 1.74 0 0 0-.906-.465 1.47 1.47 0 0 0-.82.106l-2.182-2.182a1.56 1.56 0 0 0-2.2 0 1.54 1.54 0 0 0-.396.701 1.56 1.56 0 0 0-2.21-.01 1.55 1.55 0 0 0-.416.753c-.624-.624-1.649-.624-2.237-.037a1.557 1.557 0 0 0 0 2.2c-.239.1-.501.238-.715.453a1.56 1.56 0 0 0 0 2.2l.516.515a1.556 1.556 0 0 0-.753 2.615L7.01 19c1.32 1.319 2.909 2.189 4.475 2.449q.482.08.971.08c.85 0 1.653-.198 2.393-.579.231.033.46.054.686.054 1.266 0 2.457-.52 3.505-1.567 2.763-2.763 2.552-5.734 1.439-7.586z"
                          clip-rule="evenodd"></path>
                        </svg>
                        <span id="likeCount">${likeCount}</span>
                    </button>
                    <button onclick="showCommentsModal(${
                      post.id
                    })" class="btn btn-secondary mt-3" style="border:0px; background:transparent;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" class="ko">
                                            <path
                                                d="M18.006 16.803c1.533-1.456 2.234-3.325 2.234-5.321C20.24 7.357 16.709 4 12.191 4S4 7.357 4 11.482c0 4.126 3.674 7.482 8.191 7.482.817 0 1.622-.111 2.393-.327.231.2.48.391.744.559 1.06.693 2.203 1.044 3.399 1.044.224-.008.4-.112.486-.287a.49.49 0 0 0-.042-.518c-.495-.67-.845-1.364-1.04-2.057a4 4 0 0 1-.125-.598zm-3.122 1.055-.067-.223-.315.096a8 8 0 0 1-2.311.338c-4.023 0-7.292-2.955-7.292-6.587 0-3.633 3.269-6.588 7.292-6.588 4.014 0 7.112 2.958 7.112 6.593 0 1.794-.608 3.469-2.027 4.72l-.195.168v.255c0 .056 0 .151.016.295.025.231.081.478.154.733.154.558.398 1.117.722 1.659a5.3 5.3 0 0 1-2.165-.845c-.276-.176-.714-.383-.941-.59z">
                                            </path>
                                        </svg>
                    </button>
                    </div>
                    ${
                      isAuthor
                        ? `
                        <button class="btn btn-primary" onclick="editPost(${post.id})">Edit Post</button>
                        <button class="btn btn-danger" onclick="confirmDeletePost(${post.id})">Delete Post</button>
                    `
                        : ""
                    }
            </article>
    `;
    const postContentDiv = mainContent.querySelector(".post-content");
    postContentDiv.innerHTML = parsedContent;

    const likeButton = document.getElementById("likeButton");
    likeButton.addEventListener("click", async () => {
      try {
        const liked = await toggleLike(postId);
        const newLikeCount = await getLikeCount(postId);
        document.getElementById("likeCount").textContent = newLikeCount;
        likeButton.classList.toggle("btn-outline-primary", !liked);
        likeButton.classList.toggle("btn-primary", liked);
      } catch (error) {
        console.error("Error handling like:", error);
        alert("Error liking post. Please try again.");
      }
    });

    await displayComments(post.id);
    displayCommentForm(post.id);
  } catch (error) {
    console.error("Error in displaySinglePost:", error);
    mainContent.innerHTML = `<p class="text-danger">Error loading post: ${error.message}</p>`;
  }
}

function showCreatePostForm() {
  const mainContent = document.getElementById("mainContent");
  mainContent.innerHTML = `
    <div class="create-post">
      <h2>Create a New Post</h2>
      <input type="text" id="postTitle" class="form-control mb-3 editor-Title" placeholder="Enter post title">
      <input type="file" id="postImage" class="form-control mb-3" accept="image/*">
      <textarea id="editor"></textarea>
      <button onclick="togglePreview()" class="btn btn-secondary">Toggle Preview</button>
      <button onclick="publishPost()" class="btn btn-primary">Publish</button>
      <button onclick="cancelCreatePost()" class="btn btn-danger">Cancel</button>
    </div>
  `;
  initializeEditor();
}

function cancelCreatePost() {
  if (
    confirm(
      "Are you sure you want to cancel? Any unsaved changes will be lost."
    )
  ) {
    showHomePage();
  }
}

async function editPost(postId) {
  try {
    const post = await getPost(postId);
    const mainContent = document.getElementById("mainContent");
    mainContent.innerHTML = `
      <div class="create-post">
        <h2>Edit Post</h2>
        <input type="text" id="postTitle" class="form-control mb-3 editor-Title" value="${post.title}">
        <small class="text-danger">Title is required</small>
        <input type="file" id="postImage" class="form-control mb-3" accept="image/*">
        <textarea id="editor">${post.content}</textarea>
        <small class="text-danger">Content is required</small>
        <button onclick="togglePreview()" class="btn btn-secondary">Toggle Preview</button>
        <button onclick="updatePost(${postId})" class="btn btn-primary">Update Post</button>
        <button onclick="cancelEditPost(${postId})" class="btn btn-danger">Cancel</button>
      </div>
    `;
    initializeEditor();
    setEditorContent(post.content);
  } catch (error) {
    alert(`Error loading post for editing: ${error.message}`);
  }
}

function cancelEditPost(postId) {
  if (
    confirm(
      "Are you sure you want to cancel? Any unsaved changes will be lost."
    )
  ) {
    displaySinglePost(postId);
  }
}

async function updatePost(postId = null) {
  const title = document.getElementById("postTitle").value.trim();
  const content = getEditorContent().trim();
  const image = document.getElementById("postImage").files[0];

  // Client-side validation
  if (!title) {
    alert("Title cannot be empty.");
    return;
  }

  if (!content) {
    alert("Content cannot be empty.");
    return;
  }

  console.log("Updating post with data:", { postId, title, content, image });

  const formData = new FormData();
  if (title) formData.append("title", title);
  if (content) formData.append("content", content);
  if (image) formData.append("image", image);

  try {
    let response;
    if (postId) {
      // Updating existing post
      response = await apiCall(
        `/posts/${postId}`,
        "PUT",
        formData,
        localStorage.getItem("token")
      );
      console.log("Update response:", response);
      alert("Post updated successfully!");
      displaySinglePost(postId);
    } else {
      // Creating new post
      response = await apiCall(
        "/posts",
        "POST",
        formData,
        localStorage.getItem("token")
      );
      console.log("Create response:", response);
      alert("Post created successfully!");
      showHomePage();
    }
  } catch (error) {
    console.error("Error updating/creating post:", error);
    alert(`Error updating/creating post: ${error.message}`);
  }
}

async function confirmDeletePost(postId) {
  if (
    confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    )
  ) {
    try {
      await deletePost(postId);
      await showHomePage();
    } catch (error) {
      console.error("Error in delete operation:", error);
      alert("Failed to delete the post. Please try again.");
    }
  }
}

async function deletePost(postId) {
  try {
    const response = await apiCall(
      `/posts/${postId}`,
      "DELETE",
      null,
      localStorage.getItem("token")
    );
    console.log("Delete post response:", response);

    if (response && response.message === "Post deleted successfully") {
      alert("Post deleted successfully!");

      // Check if we're on the single post view
      const singlePostView = document.querySelector(".single-post");
      if (singlePostView) {
        // If we're on the single post view, redirect to the home page
        showHomePage();
      } else {
        // If we're on the home page, remove the deleted post from the DOM
        const postElement = document.querySelector(
          `.post-card[data-post-id="${postId}"]`
        );
        if (postElement) {
          postElement.remove();
        } else {
          // If we can't find the post element, refresh the entire posts list
          await displayPosts();
        }
      }
    } else {
      throw new Error("Unexpected response from server");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    alert(`Error deleting post: ${error.message}`);
  }
}

async function loadContent() {
  if (isLoggedIn()) {
    await displayPosts();
  } else {
    showLoginForm();
  }
}

function showHomePage() {
  if (isLoggedIn()) {
    displayPosts();
  } else {
    showLoginForm();
  }
}

//BlogNarrative comment forntend implementation
function createCommentsModal() {
  console.log("Creating comments modal");
  const modal = document.createElement("div");
  modal.className = "comments-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h3>Comments</h3>
      <div id="modalCommentList"></div>
      <div id="modalCommentForm"></div>
    </div>
  `;

  modal.querySelector(".close-modal").addEventListener("click", () => {
    modal.classList.remove("active");
  });

  return modal;
}

let commentsModal;

function showCommentsModal(postId) {
  console.log("Showing comments modal for post:", postId);
  if (!commentsModal) {
    commentsModal = createCommentsModal();
    document.body.appendChild(commentsModal);
  }
  commentsModal.classList.add("active");
  setTimeout(() => {
    displayComments(postId);
    displayCommentForm(postId);
  }, 100);
}

async function displayComments(postId) {
  console.log("Displaying comments for post:", postId);
  let commentList = document.getElementById("modalCommentList");
  let attempts = 0;
  const maxAttempts = 5;

  while (!commentList && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    commentList = document.getElementById("modalCommentList");
    attempts++;
  }

  if (!commentList) {
    console.error("Comment list element not found after multiple attempts");
    return;
  }

  try {
    const comments = await getComments(postId);
    console.log("Fetched comments:", comments);
    const currentUserId = getUserId();
    console.log("Current user ID:", currentUserId);
    if (Array.isArray(comments)) {
      commentList.innerHTML =
        comments.length > 0
          ? comments
              .map(
                (comment) => `
          <div class="comment" data-comment-id="${comment.id}">
            <div class="comment-header">
              <p class="comment-author">${comment.author || "Anonymous"}</p>
              <p class="comment-date">${new Date(
                comment.created_at
              ).toLocaleString()}</p>
            </div>
            <p class="comment-content">${comment.content}</p>
            ${
              comment.user_id === currentUserId
                ? `
              <div class="comment-actions">
                <button class="btn btn-sm btn-outline-primary edit-comment-btn" data-comment-id="${comment.id}">Edit</button>
                <button class="btn btn-sm btn-outline-danger delete-comment-btn" data-comment-id="${comment.id}">Delete</button>
              </div>
            `
                : ""
            }
          </div>    
        `
              )
              .join("")
          : "<p>No comments yet. Be the first to comment!</p>";
    } else {
      console.error("Unexpected comments data structure:", comments);
      commentList.innerHTML = "<p>Error: Unexpected comment data structure</p>";
    }
  } catch (error) {
    console.error("Error displaying comments:", error);
    commentList.innerHTML = `<p class="text-danger">Error loading comments: ${error.message}</p>`;
  }
  commentList.removeEventListener("click", handleCommentAction);
  commentList.addEventListener("click", handleCommentAction);
}

function displayCommentForm(postId) {
  const commentForm = document.getElementById("modalCommentForm");
  if (!commentForm) {
    console.error("Comment form element not found");
    return;
  }

  commentForm.innerHTML = `
  <form id="newCommentForm" class="mt-4">
  <div class="form-group">
  <label for="commentContent">Add a comment:</label>
  <textarea id="commentContent" class="form-control" required></textarea>
  </div>
      <button type="submit" class="btn btn-primary mt-2">Submit Comment</button>
      </form>
      `;

  document
    .getElementById("newCommentForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const content = document.getElementById("commentContent").value;
      try {
        await createComment(content, postId);
        document.getElementById("commentContent").value = "";
        await displayComments(postId); // Refresh comments after posting
      } catch (error) {
        console.error("Error creating comment:", error);
        alert("Failed to post comment. Please try again.");
      }
    });
}

async function handleCommentSubmit(event, postId) {
  event.preventDefault();
  const content = document.getElementById("commentContent").value;
  try {
    await createComment(content, postId);
    await displayComments(postId);
    document.getElementById("commentContent").value = "";
  } catch (error) {
    console.error("Error creating comment:", error);
    alert(`Error creating comment: ${error.message}`);
  }
}

function editComment(commentId) {
  const commentDiv = document.querySelector(`[data-comment-id="${commentId}"]`);
  const commentContent =
    commentDiv.querySelector(".comment-content").textContent;
  commentDiv.innerHTML = `
  <form onsubmit="handleCommentUpdate(event, ${commentId})">
  <div class="form-group">
  <textarea class="form-control" required>${commentContent}</textarea>
      </div>
      <button type="submit" class="btn btn-primary mr-2">Update</button>
      <button type="button" class="btn btn-secondary" onclick="displayComments(${getCurrentPostId()})">Cancel</button>
      </form>
      `;
}

function handleCommentAction(event) {
  const target = event.target;
  if (target.classList.contains("delete-comment-btn")) {
    const commentId = target.dataset.commentId;
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteCommentAndUpdateUI(commentId);
    }
  } else if (target.classList.contains("edit-comment-btn")) {
    const commentId = target.dataset.commentId;
    editComment(commentId);
  }
}

async function handleCommentUpdate(event, commentId) {
  event.preventDefault();
  const content = event.target.querySelector("textarea").value;
  try {
    await apiCall(
      `/comments/${commentId}`,
      "PUT",
      { content },
      localStorage.getItem("token")
    );
    displayComments(getCurrentPostId());
  } catch (error) {
    if (
      error.message.includes("You do not have permission to edit this comment")
    ) {
      alert("You can only edit your own comments.");
    } else {
      alert(`Error updating comment: ${error.message}`);
    }
    displayComments(getCurrentPostId()); // Refresh the comments list
  }
}

async function deleteCommentAndUpdateUI(commentId) {
  try {
    await deleteComment(commentId);
    const commentElement = document.querySelector(
      `[data-comment-id="${commentId}"]`
    );
    if (commentElement) {
      commentElement.remove();
    }
    // alert("Comment deleted successfully.");
  } catch (error) {
    console.error("Error deleting comment:", error);
    if (
      error.message.includes(
        "You do not have permission to delete this comment"
      )
    ) {
      alert("You can only delete your own comments.");
    } else {
      alert(`Error deleting comment: ${error.message}`);
    }
  }
}
// function to handle like button clicks
async function handleLikeClick(postId) {
  try {
    const liked = await toggleLike(postId);
    const newCount = await getLikeCount(postId);
    updateLikeButton(postId, liked, newCount);
  } catch (error) {
    console.error("Error handling like:", error);
    alert("Error liking post. Please try again.");
  }
}

// function to get the user's like status for a post
async function getUserLikeStatus(postId) {
  try {
    const response = await apiCall(
      `/posts/${postId}/like`,
      "GET",
      null,
      localStorage.getItem("token")
    );
    return response.liked;
  } catch (error) {
    console.error("Error getting user like status:", error);
    return false;
  }
}

function updateLikeButton(postId, liked, count) {
  const likeButton = document.querySelector(
    `.like-button[data-post-id="${postId}"]`
  );
  if (likeButton) {
    likeButton.innerHTML = `
      <i class="fas fa-heart${liked ? " text-danger" : ""}"></i>
      <span class="like-count">${count}</span>
    `;
    likeButton.setAttribute("aria-pressed", liked);
  }
}

// Helper function to get current user ID (you'll need to implement this)
function getUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.userId;
}

// Helper function to get current post ID (you'll need to implement this)
function getCurrentPostId() {
  const postElement = document.querySelector(".single-post");
  if (!postElement) {
    console.error("No post element found");
    return null;
  }
  const postId = postElement.dataset.postId;
  console.log("Current post ID:", postId);
  return postId;
}

document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();
  loadContent();
  checkForPasswordResetToken();
});
