import { getPool } from "../db/postgres.js";

export const getAllStudents = async (department, batch) => {
  const query =
    "SELECT students.roll_no, users.name, semesters.name AS semester FROM students JOIN users ON students.user_id = users.user_id JOIN departments ON students.department_id = departments.department_id JOIN batches ON students.batch_id = batches.batch_id JOIN semesters ON students.semester_id = semesters.semester_id WHERE departments.name = $1  AND batches.name = $2";
  const values = [department, batch];

  const { rows } = await getPool().query(query, values);
  if (rows.length) {
    return rows;
  } else {
    return [];
  }
};
