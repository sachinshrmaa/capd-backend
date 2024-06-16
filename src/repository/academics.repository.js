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
    "SELECT batches.batch_id, batches.name, batches.start_year, batches.end_year FROM batches JOIN departments ON batches.department_id = departments.department_id WHERE departments.department_id = $1";
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

export const getAllSemesters = async (department) => {
  const query =
    "SELECT s.semester_id , s.name, s.start_date, s.end_date FROM semesters s JOIN batches b ON s.batch_id = b.batch_id JOIN departments d ON b.department_id = d.department_id WHERE d.department_id = $1";

  const values = [department];

  const { rows } = await getPool().query(query, values);
  if (rows.length) {
    return rows;
  } else {
    return [];
  }
};

export const getPlatformStats = async () => {
  const query =
    "SELECT (SELECT COUNT(*) FROM subjects) AS total_subjects, (SELECT COUNT(*) FROM students) AS total_students, (SELECT COUNT(*) FROM teachers) AS total_teachers, (SELECT COUNT(*) FROM departments) AS total_departments;";

  const { rows } = await getPool().query(query);
  if (rows.length) {
    return rows;
  } else {
    return [];
  }
};

export const createDepartment = async (name, description) => {
  const query = "INSERT INTO Departments (name, description) VALUES ($1, $2);";
  const values = [name, description];

  const { rows } = await getPool().query(query, values);
  if (rows.length) {
    return rows[0];
  } else {
    return [];
  }
};

export const createBatch = async (departmentId, name, startYear, endYear) => {
  const query = `INSERT INTO Batches (department_id, name, start_year, end_year)
 VALUES ($1, $2, $3, $4)`;
  const values = [departmentId, name, startYear, endYear];

  const { rows } = await getPool().query(query, values);
  return rows[0];
};

export const createSemester = async (name, batchId, startDate, endDate) => {
  const query = `INSERT INTO Semesters (name, batch_id, start_date, end_date) VALUES ($1, $2, $3, $4)`;
  const values = [name, batchId, startDate, endDate];

  const { rows } = await getPool().query(query, values);
  return rows[0];
};

export const createSubject = async (name, code, departmentId, semesterId) => {
  const query =
    "INSERT INTO Subjects (name, code, department_id, semester_id) VALUES ($1, $2, $3, $4);";
  const values = [name, code, departmentId, semesterId];

  const { rows } = await getPool().query(query, values);
  console.log(rows);
  console.log(rows[0]);
  return rows[0];
};
