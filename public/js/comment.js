async function getComments(postId) {
  try {
    const response = await apiCall(`/comments/${postId}`);
    console.log("API response for comments:", response);
    return response;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
}

async function createComment(content, postId) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }
  try {
    return await apiCall("/comments", "POST", { content, postId }, token);
  } catch (error) {
    console.error("Error in createComment:", error);
    throw error;
  }
}

async function updateComment(id, content) {
  return apiCall(
    `/comments/${id}`,
    "PUT",
    { content },
    localStorage.getItem("token")
  );
}

async function deleteComment(id) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }
    await apiCall(`/comments/${id}`, "DELETE", null, token);
  } catch (error) {
    console.error("Error in deleteComment:", error);
    throw error;
  }
}