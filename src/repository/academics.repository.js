import { getPool } from "../db/postgres.js";

export const getAllDepartments = async () => {
  const query = "SELECT * FROM departments";
  const { rows } = await getPool().query(query);
  if (rows.length) {
    return rows;
  } else {
    return [];
  }
};

export const getAllBatches = async (department) => {
  const query =
    "SELECT batches.name, batches.start_year, batches.end_year FROM batches JOIN departments ON batches.department_id = departments.department_id WHERE departments.name = $1";
  const values = [department];

  const { rows } = await getPool().query(query, values);
  if (rows.length) {
    return rows;
  } else {
    return [];
  }
};

export const getAllSubjects = async (departmentId, semesterId) => {
  const query =
    "SELECT s.subject_id, s.name AS subject_name, s.code, u.name AS teacher_name FROM subjects s JOIN departments d ON s.department_id = d.department_id JOIN semesters sem ON s.semester_id = sem.semester_id LEFT JOIN teacher_subjects stm ON s.subject_id = stm.subject_id LEFT JOIN teachers t ON stm.teacher_id = t.teacher_id LEFT JOIN users u ON t.user_id = u.user_id WHERE d.department_id = $1 AND sem.semester_id = $2;";
  const values = [departmentId, semesterId];

  const { rows } = await getPool().query(query, values);
  if (rows.length) {
    return rows;
  } else {
    return [];
  }
};
