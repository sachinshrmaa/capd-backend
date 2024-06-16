import { getPool } from "../db/postgres.js";

export const getAllStudents = async (department, batch) => {
  const query =
    "SELECT students.roll_no, users.name, semesters.name AS semester FROM students JOIN users ON students.user_id = users.user_id JOIN departments ON students.department_id = departments.department_id JOIN batches ON students.batch_id = batches.batch_id JOIN semesters ON students.semester_id = semesters.semester_id WHERE departments.department_id = $1  AND batches.name = $2";
  const values = [department, batch];

  const { rows } = await getPool().query(query, values);
  if (rows.length) {
    return rows;
  } else {
    return [];
  }
};

export const getStudentDetails = async (userId) => {
  const query = "SELECT * from students where user_id = $1";
  const values = [userId];

  const { rows } = await getPool().query(query, values);
  if (rows.length) {
    return rows;
  } else {
    return [];
  }
};


export const addStudents = async (students) => {
  const client = await getPool().connect();
  
  try {
    await client.query('BEGIN');
    
    for (const student of students) {
      const { name, email, password, departmentId, batchId, semesterId, rollNo } = student;

      // Insert into Users table
      const userQuery = `
        INSERT INTO Users (name, email, password, role)
        VALUES ($1, $2, $3, 'Student')
        RETURNING user_id;
      `;
      const userValues = [name, email, password];
      const userResult = await client.query(userQuery, userValues);
      const userId = userResult.rows[0].user_id;

      // Insert into Students table
      const studentQuery = `
        INSERT INTO Students (user_id, department_id, batch_id, semester_id, roll_no)
        VALUES ($1, $2, $3, $4, $5);
      `;
      const studentValues = [userId, departmentId, batchId, semesterId, rollNo];
      await client.query(studentQuery, studentValues);
    }

    await client.query('COMMIT');
    return { message: "All students added successfully" };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};