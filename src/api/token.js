export const getToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return token;
  } else {
    return null;
  }
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
  return token;
};

export const getUsername = () => {
  const username = localStorage.getItem("username");
  if (username) {
    return username;
  } else {
    return null;
  }
};

export const setUsername = (username) => {
  localStorage.setItem("username", username);
  return username;
};

export function getTokenConfig() {
  const token = getToken();
  const headers = token
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    : {};
  const config = { headers };

  return { token, config };
}
