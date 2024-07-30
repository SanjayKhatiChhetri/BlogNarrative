async function register(email, password) {
  try {
    const response = await apiCall("/auth/register", "POST", {
      email,
      password,
    });
    alert("Registration successful! Please log in.");
    return response;
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }
}

async function login(email, password) {
  try {
    const response = await apiCall("/auth/login", "POST", { email, password });
    if (response.token) {
      localStorage.setItem("token", response.token);
      return response;
    } else {
      throw new Error("Login failed: No token received");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

function logout() {
  localStorage.removeItem("token");
}

function isLoggedIn() {
  return !!localStorage.getItem("token");
}
