import axios from "axios";
import { setToken, setUsername, getTokenConfig, setEmail } from "./token";

const URL = `/api`;

//for admins
export async function getUser(userId) {
  try {
    const { data } = await axios.get(`${URL}/users/${userId}`);

    return data;
  } catch (error) {
    console.log("Error in api/getUser");
    throw error;
  }
}

export async function getAllUsers() {
  const { config } = getTokenConfig();
  try {
    const {data: users} = await axios.get(`${URL}/users`, config);

    return users;
  } catch (error) {
    console.log("Error in api/getAllUsers");
    throw error;
  }
}

export const loginUser = (username, password) => {
  return fetch("/api/users/login", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((d) => d.json())
    .then((r) => {
      const { user, token, error } = r;
      if (token && user) {
        setToken(token);
        setUsername(user.username);
      }
      return { user, error };
    });
};

export const registerUser = (username, email, password) => {
  return fetch("/api/users/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((d) => d.json())
    .then((r) => {
      const { user, token, error } = r;
      if (token && user) {
        setToken(token);
        setUsername(user.username);
      }
      return { user, error };
    });
};