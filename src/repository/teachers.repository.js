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
    "SELECT s.name AS subject_name, s.code, sem.name as sem FROM subjects s JOIN departments d ON s.department_id = d.department_id JOIN semesters sem ON s.semester_id = sem.semester_id JOIN teacher_subjects ts ON s.subject_id = ts.subject_id JOIN teachers t ON ts.teacher_id = t.teacher_id JOIN users u ON t.user_id = u.user_id WHERE u.user_id = $1;";
  const values = [userId];

  const { rows } = await getPool().query(query, values);
  if (rows.length) {
    return rows;
  } else {
    return [];
  }
};

export const addTeacher = async (name, email, password, departmentId) => {
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");

    // Insert into Users table
    const userQuery = `
      INSERT INTO Users (name, email, password, role)
      VALUES ($1, $2, $3, 'Teacher')
      RETURNING user_id;
    `;
    const userValues = [name, email, password];
    const userResult = await client.query(userQuery, userValues);
    const userId = userResult.rows[0].user_id;

    // Insert into Teachers table
    const teacherQuery = `
      INSERT INTO Teachers (user_id, department_id)
      VALUES ($1, $2);
    `;
    const teacherValues = [userId, departmentId];
    await client.query(teacherQuery, teacherValues);

    await client.query("COMMIT");
    return { user_id: userId, name, email, department_id: departmentId };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const assignTeacherSubject = async (teacherId, subjectId) => {
  const query = `
    insert into teacher_subjects (teacher_id, subject_id) values($1, $2)
  `;
  const values = [teacherId, subjectId];
  const { rows } = await getPool().query(query, values);
  return rows;
};

