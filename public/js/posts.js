async function getAllPosts() {
  try {
    return await apiCall("/posts");
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

async function getPost(id) {
  return apiCall(`/posts/${id}`);
}

async function createPost(title, content, image) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  if (image) {
    formData.append("image", image);
  }

  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
}

async function updatePost(postId) {
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
  formData.append("title", title);
  formData.append("content", content);
  if (image) formData.append("image", image);

  try {
    const response = await apiCall(
      `/posts/${postId}`,
      "PUT",
      formData,
      localStorage.getItem("token")
    );
    console.log("Update response:", response);
    alert("Post updated successfully!");
    displaySinglePost(postId);
  } catch (error) {
    console.error("Error updating post:", error);
    alert(`Error updating post: ${error.message}`);
  }
}

function getEditorContent() {
  // Implement this function based on your editor implementation
  // For example, if you're using a simple textarea:
  return document.getElementById("editor").value;
}

async function deletePost(id) {
  return apiCall(`/posts/${id}`, "DELETE", null, localStorage.getItem("token"));
}

async function toggleLike(postId) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }
  try {
    const response = await apiCall(
      `/posts/${postId}/like`,
      "POST",
      null,
      token
    );
    return response.liked;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
}

async function getLikeCount(postId) {
  try {
    const response = await apiCall(`/posts/${postId}/likes`);
    if (response && typeof response.count === "number") {
      return response.count;
    } else {
      console.error("Unexpected response format:", response);
      return 0; // Return 0 if the response is not in the expected format
    }
  } catch (error) {
    console.error("Error getting like count:", error);
    return 0; // Return 0 in case of an error
  }
}

async function searchPosts(query) {
  try {
    return await apiCall(`/posts/search?query=${encodeURIComponent(query)}`);
  } catch (error) {
    console.error("Error searching posts:", error);
    throw error;
  }
}
