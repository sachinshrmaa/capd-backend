import { getPool } from "../db/postgres.js";

export const getAllTeachers = async (department) => {
  const query =
    "SELECT users.name, users.email FROM teachers JOIN users ON teachers.user_id = users.user_id JOIN departments ON teachers.department_id = departments.department_id WHERE departments.name = $1";
  const values = [department];

  const { rows } = await getPool().query(query, values);
  if (rows.length) {
    return rows;
  } else {
    return [];
  }
};

export const getAllTeacherSubjects = async (userId) => {
  const query =
    "SELECT s.name AS subject_name, s.code, sem.name FROM subjects s JOIN departments d ON s.department_id = d.department_id JOIN semesters sem ON s.semester_id = sem.semester_id JOIN teacher_subjects ts ON s.subject_id = ts.subject_id JOIN teachers t ON ts.teacher_id = t.teacher_id JOIN users u ON t.user_id = u.user_id WHERE u.user_id = $1;";
  const values = [userId];

  const { rows } = await getPool().query(query, values);
  if (rows.length) {
    return rows;
  } else {
    return [];
  }
};
