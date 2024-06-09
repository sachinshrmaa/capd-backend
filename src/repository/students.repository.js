import { getPool } from "../db/postgres.js";

export const getAllStudents = async () => {
  const query = "SELECT * FROM Students";

  const { rows } = await getPool().query(query);
  if (rows.length) {
    return rows;
  } else {
    return [];
  }
};
