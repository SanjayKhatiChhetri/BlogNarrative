const API_URL = "http://localhost:3000/api";

async function apiCall(endpoint, method = "GET", data = null, token = null) {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    Authorization: token ? `Bearer ${token}` : "",
  };

  const options = {
    method,
    headers,
  };

  if (data) {
    if (data instanceof FormData) {
      options.body = data;
      console.log("Sending FormData:");
      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(data);
      console.log("Sending JSON data:", options.body);
    }
  }

  console.log("API call details:", { url, method, headers: options.headers });

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API error response:", errorData);
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }
  const responseData = await response.json();
  console.log("API response:", responseData); // Add this line
  return responseData;
}
