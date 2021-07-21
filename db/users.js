const client = require("./client");
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

const hashPassword = async string => {
  const hash = await bcrypt.hash(string, SALT_COUNT);
  return hash;
};

async function createUser({ username, email, password }) {
  const hashedPassword = await hashPassword(password);

  try {
    const { rows: [user] } = await client.query(/*sql*/`
        INSERT INTO users(username, email, password)
        VALUES ($1, $2, $3)
        RETURNING *;
      `, [username, email, hashedPassword]);

    delete user.password;

    return user;
  } catch (error) {
    throw error;
  }
}

async function createAdmin({ username, email, password }) {
  const hashedPassword = await hashPassword(password);

  try {
    const { rows: [user] } = await client.query(/*sql*/`
        INSERT INTO users(username, email, password, "isAdmin")
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `, [username, email, hashedPassword, true]);

    delete user.password;

    return user;
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  try {
    const { rows } = await client.query(/*sql*/`
    SELECT id, username, email
    FROM users;
    `);

    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getUserWithAllInfo({ id, username, email }) {
  try {
    const { rows: [user] } = await client.query(/*sql*/`
    SELECT id, username, email
    FROM users
    WHERE id=$1, username=$2, email=$3;
    `, [id, username, email]);

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;

    if (await bcrypt.compare(password, hashedPassword)) {
      delete user.password;
      return user;
    }
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const { rows: [user] } = await client.query(/*sql*/`
    SELECT * 
    FROM users
    WHERE username=$1;
    `, [username]);

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(id) {
  try {
    const { rows: [user] } = await client.query(/*sql*/`
    SELECT id, username, email, "isAdmin"
    FROM users
    WHERE id=$1;
    `, [id]);

    return user;
  } catch (error) {
    throw error;
  }
}

//should we include isAdmin??
async function updateUser({ id, email, password }) {
  try {
    const { rows: [user] } = await client.query(/*sql*/`
    UPDATE users
    SET email = $1, password = $2
    WHERE id = $3
    RETURNING *;
    `, [email, password, id]);
    return user;
  } catch (error) {
    throw error;
  }
}

async function makeAdmin({ isAdmin, id }) {
  try {
    const { rows: [user] } = await client.query(/*sql*/`
    UPDATE users
    SET "isAdmin" = true
    WHERE id = $1
    RETURNING *;
    `, [isAdmin, id]);
    return user;
  } catch (error) {
    throw error;
  }
}

async function deleteUser(id) {
  try {
    const { rows: [user] } = await client.query(/*sql*/`
    DELETE FROM users
    WHERE id = $1
    `, [id]);

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,
  createUser,
  createAdmin,
  getAllUsers,
  getUserWithAllInfo,
  getUserByUsername,
  getUser,
  getUserById,
  updateUser,
  makeAdmin,
  deleteUser
}