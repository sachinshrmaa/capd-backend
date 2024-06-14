import {
  getOverallStudentsSubjectAttendance,
  getStudentOverallSubjectAttendance,
  getStudentSubjectAttendance,
  getStudentsBySubjectCode,
  logSubjectAttendance,
} from "../repository/attendance.repository.js";

const LogSubjectAttendance = async (req, res) => {
  const { absentStudents, presentStudents, subjectId, semesterId, date } =
    req.body;
  if (
    !absentStudents ||
    !presentStudents ||
    !subjectId ||
    !semesterId ||
    !date
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const attendanceData = {
    absentStudents,
    presentStudents,
    subjectId,
    semesterId,
    date,
  };

  try {
    const attendance = await logSubjectAttendance(attendanceData);
    res
      .status(201)
      .json({ message: "Attendance logged successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ListStudentSubjectAttendance = async (req, res) => {
  const { subjectId, rollNo } = req.body;
  if (!subjectId || !rollNo) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const attendance = await getStudentSubjectAttendance(subjectId, rollNo);
    res.status(200).json({ attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ListStudentOverallAttendance = async (req, res) => {
  const { semesterId, rollNo } = req.body;
  if (!semesterId || !rollNo) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const attendance = await getStudentOverallSubjectAttendance(
      semesterId,
      rollNo
    );
    res.status(200).json({ attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ListSubjectOverallAttendance = async (req, res) => {
  const { subjectId } = req.body;
  if (!subjectId) {
    return res.status(400).json({ message: "subject id is required" });
  }

  try {
    const attendance = await getOverallStudentsSubjectAttendance(subjectId);
    res.status(200).json({ attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ListStudentsForAttendance = async (req, res) => {
  const { subjectCode } = req.body;
  if (!subjectCode) {
    return res.status(400).json({ message: "Subject code is required" });
  }

  try {
    const students = await getStudentsBySubjectCode(subjectCode);
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  LogSubjectAttendance,
  ListStudentSubjectAttendance,
  ListStudentOverallAttendance,
  ListSubjectOverallAttendance,
  ListStudentsForAttendance,
};
