import { getClient, getPool } from "../db/postgres.js";

export const logSubjectAttendance = async (attendanceData) => {
  const { absentStudents, presentStudents, subjectId, semesterId, date } =
    attendanceData;

  const presentValues = presentStudents
    .map(
      (roll_no) =>
        `('${roll_no}', ${subjectId}, ${semesterId}, '${date}', 'Present')`
    )
    .join(", ");
  const absentValues = absentStudents
    .map(
      (roll_no) =>
        `('${roll_no}', ${subjectId}, ${semesterId}, '${date}', 'Absent')`
    )
    .join(", ");

  const query = `
    INSERT INTO Attendance (roll_no, subject_id, semester_id, attendance_date, status)
    VALUES ${presentValues}${
    presentValues && absentValues ? ", " : ""
  }${absentValues}
    RETURNING *;`;

  try {
    const client = await getClient();
    const result = await client.query(query);
    client.release();
    console.log(`Inserted ${result.rowCount} attendance records.`);
    return result.rows;
  } catch (err) {
    console.error("Error logging attendance:", err);
    throw err;
  }
};

export const getStudentSubjectAttendance = async (subjectId, rollNo) => {
  const query =
    "select a.attendance_date, a.status  from attendance a where a.roll_no =$1 and a.subject_id = $2";
  const values = [rollNo, subjectId];

  const { rows } = await getPool().query(query, values);
  if (rows.length) {
    return rows;
  } else {
    return [];
  }
};

export const getStudentOverallSubjectAttendance = async (
  semesterId,
  rollNo
) => {
  const query =
    "SELECT s.name, s.code as subject_code, count(*) as total_classes, count(case when a.status = 'Absent' then 1 else null end) as absent_classes FROM attendance a JOIN subjects s ON a.subject_id = s.subject_id WHERE a.roll_no = $1 and a.semester_id = $2 GROUP BY s.name, s.code";
  const values = [rollNo, semesterId];

  const { rows } = await getPool().query(query, values);
  if (rows.length) {
    return rows;
  } else {
    return [];
  }
};

export const getOverallStudentsSubjectAttendance = async (subjectId) => {
  const query =
    "SELECT a.roll_no, u.name, COUNT(*) AS total_classes, COUNT(CASE WHEN a.status = 'Absent' THEN 1 ELSE NULL END) AS absent_classes FROM attendance a JOIN students s2 ON a.roll_no = s2.roll_no JOIN users u ON s2.user_id = u.user_id JOIN subjects s ON a.subject_id = s.subject_id WHERE a.subject_id = $1 GROUP BY a.roll_no, u.name";
  const values = [subjectId];

  const { rows } = await getPool().query(query, values);
  if (rows.length) {
    return rows;
  } else {
    return [];
  }
};

export const getStudentsBySubjectCode = async (subjectCode) => {
  const query =
    "SELECT s.roll_no, u.name , ss.subject_id, s.semester_id FROM Students s join Users u on s.user_id =u.user_id JOIN Student_Subjects ss ON s.roll_no  = ss.roll_no WHERE ss.subject_id IN (    SELECT subject_id  FROM Subjects where code=$1)";

  const values = [subjectCode];
  const { rows } = await getPool().query(query, values);
  if (rows.length) {
    return rows;
  } else {
    return [];
  }
};
