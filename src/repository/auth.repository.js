import { getPool } from "../db/postgres.js";

export const getUserByEmail = async (email) => {
  const query = "SELECT * FROM Users WHERE email = $1";
  const values = [email];

  const { rows } = await getPool().query(query, values);
  if (rows.length) {
    return rows[0];
  } else {
    return null;
  }
};

export const createUser = async (userData) => {
  const query =
    "INSERT INTO Users (name, email, password, role) VALUES ($1, $2, $3, $4)";

  const values = [
    userData.name,
    userData.email,
    userData.password,
    userData.role,
  ];

  const { rows } = await getPool().query(query, values);
  return rows[0];
};
