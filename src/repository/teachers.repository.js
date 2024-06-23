import { getPool } from "../db/postgres.js";

export const getAllTeachers = async (department) => {
  const query =
    "SELECT teachers.teacher_id, users.name, users.email FROM teachers JOIN users ON teachers.user_id = users.user_id JOIN departments ON teachers.department_id = departments.department_id WHERE departments.department_id = $1";
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
    "SELECT s.name AS subject_name, s.code, sem.name as sem, s.subject_id, sem.semester_id FROM subjects s JOIN departments d ON s.department_id = d.department_id JOIN semesters sem ON s.semester_id = sem.semester_id JOIN teacher_subjects ts ON s.subject_id = ts.subject_id JOIN teachers t ON ts.teacher_id = t.teacher_id JOIN users u ON t.user_id = u.user_id WHERE u.user_id = $1;";
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

export const getAllTeacherWards = async (teacherId) => {
  const query = `select u.name as student_name, tg.roll_no , sem.name as sem_name from teacher_guardians tg join students s on tg.roll_no = s.roll_no join users u on s.user_id = u.user_id join semesters sem on s.semester_id = sem.semester_id join teachers t on tg.teacher_id = t.teacher_id where t.user_id  = $1`;
  const values = [teacherId];

  const { rows } = await getPool().query(query, values);
  if (rows.length) {
    return rows;
  } else {
    return [];
  }
};

export const addTeacherWards = async (teacherId, rollNumbers) => {
  if (!Array.isArray(rollNumbers) || rollNumbers.length === 0) {
    throw new Error("rollNumbers must be a non-empty array");
  }

  const values = [];
  const placeholders = rollNumbers
    .map((rollNo, index) => {
      values.push(rollNo);
      return `((SELECT teacher_id FROM Teachers WHERE user_id = $${
        rollNumbers.length + 1
      }), $${index + 1})`;
    })
    .join(", ");

  const query = `INSERT INTO teacher_guardians (teacher_id, roll_no) VALUES ${placeholders}`;

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // Start transaction
    const { rowCount } = await client.query(query, [...values, teacherId]);
    await client.query("COMMIT"); // Commit transaction
    return { success: true, insertedRows: rowCount };
  } catch (err) {
    await client.query("ROLLBACK"); // Rollback transaction in case of error
    console.error("Error inserting students:", err);
    return { success: false, error: err.message };
  } finally {
    client.release();
  }
};

export const logCounsellingSessions = async (counsellingData) => {
  const { absentStudents, presentStudents, userId, remarks } = counsellingData;

  const presentValues = presentStudents
    .map(
      (roll_no) =>
        `('${roll_no}', (SELECT teacher_id FROM Teachers WHERE user_id = ${userId}), 'Present', '${remarks}')`
    )
    .join(", ");

  const absentValues = absentStudents
    .map(
      (roll_no) =>
        `('${roll_no}', (SELECT teacher_id FROM Teachers WHERE user_id = ${userId}), 'Absent', '${remarks}')`
    )
    .join(", ");

  const values = [presentValues, absentValues].filter(Boolean).join(", ");

  const query = `
    INSERT INTO Counselling (roll_no, teacher_id, status, remarks)
    VALUES ${values}
    RETURNING *;`;

  try {
    const client = await getPool().connect();
    const result = await client.query(query);
    client.release();
    console.log(`Inserted ${result.rowCount} counselling records.`);
    return result.rows;
  } catch (err) {
    console.error("Error logging counselling sessions:", err);
    throw err;
  }
};

export const getAllWardsAttendance = async (userId) => {
  const query = `SELECT 
	u."name",
    c.roll_no,
    COUNT(CASE WHEN status = 'Present' THEN 1 END) AS present_count,
    COUNT(CASE WHEN status = 'Absent' THEN 1 END) AS absent_count
FROM Counselling c
join students s on c.roll_no = s.roll_no
join users u on s.user_id = u.user_id
WHERE teacher_id = (SELECT teacher_id FROM Teachers WHERE user_id = $1)
GROUP BY c.roll_no, u."name" ;`;
  const values = [userId];

  const { rows } = await getPool().query(query, values);
  if (rows.length) {
    return rows;
  } else {
    return [];
  }
};
