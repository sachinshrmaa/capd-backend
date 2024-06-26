import {
  addTeacher,
  addTeacherWards,
  assignTeacherSubject,
  getAllTeacherSubjects,
  getAllTeacherWards,
  getAllTeachers,
  getAllWardsAttendance,
  logCounsellingSessions,
} from "../repository/teachers.repository.js";
import bycrypt from "bcryptjs";

const ListTeachers = async (req, res) => {
  const { department } = req.body;

  if (!department) {
    return res.status(400).json({ message: "Department is required" });
  }

  try {
    const teachers = await getAllTeachers(department);
    if (!teachers) {
      return res.status(404).json({ message: "No teachers found" });
    }
    res.status(200).json({ teachers: teachers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const ListTeacherSubjects = async (req, res) => {
  const userId = req.user.user_id;
  if (!userId) {
    return res.status(400).json({ message: "Please login" });
  }

  try {
    const subjects = await getAllTeacherSubjects(userId);
    if (!subjects) {
      return res.status(404).json({ message: "No subjects found" });
    }
    res.status(200).json({ subjects: subjects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const AddTeacher = async (req, res) => {
  const { name, email, password, departmentId } = req.body;

  if (!name || !email || !password || !departmentId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword = bycrypt.hashSync(password, 10);

  try {
    const teacher = await addTeacher(name, email, hashedPassword, departmentId);
    res
      .status(200)
      .json({ message: "Teacher added successfully", teacher: teacher });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const AssignTeacherSubject = async (req, res) => {
  const { teacherId, subjectId } = req.body;

  if (!teacherId || !subjectId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const teacher = await assignTeacherSubject(teacherId, subjectId);
    res
      .status(200)
      .json({ message: "Teacher assigned to subject successfully", teacher });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const ListTeacherWards = async (req, res) => {
  const userId = req.user.user_id;
  if (!userId) {
    return res.status(401).json({ message: "Please login" });
  }

  try {
    const wards = await getAllTeacherWards(userId);
    if (!wards) {
      return res.status(404).json({ message: "No wards found" });
    }
    res.status(200).json({ wards: wards });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const AddTeacherWards = async (req, res) => {
  const { students } = req.body;
  const userId = req.user.user_id;
  if (!userId) {
    return res.status(401).json({ message: "Please login" });
  }

  if (!students) {
    return res.status(400).json({ message: "Students are required" });
  }

  try {
    const wards = await addTeacherWards(userId, students);
    // if (!wards) {
    //   return res.status(404).json({ message: "No wards found" });
    // }
    res
      .status(201)
      .json({ message: "Wards added successfully.", wards: wards });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const AddWardsCounsellingLog = async (req, res) => {
  const userId = req.user.user_id;
  const { absentStudents, presentStudents, remarks } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Please login" });
  }

  if (!absentStudents || !presentStudents || !remarks) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const attendanceData = {
    absentStudents,
    presentStudents,
    userId,
    remarks,
  };

  try {
    const logs = await logCounsellingSessions(attendanceData);
    res
      .status(201)
      .json({ message: "Wards logs added successfully.", logs: logs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const ListWardsAttendanceLogs = async (req, res) => {
  const userId = req.user.user_id;

  if (!userId) {
    return res.status(401).json({ message: "Please login" });
  }

  try {
    const wardsLogs = await getAllWardsAttendance(userId);
    if (!wardsLogs) {
      return res.status(404).json({ message: "No sessions found" });
    }
    res.status(200).json({ attendance: wardsLogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  ListTeachers,
  ListTeacherSubjects,
  AddTeacher,
  AssignTeacherSubject,
  ListTeacherWards,
  AddTeacherWards,
  AddWardsCounsellingLog,
  ListWardsAttendanceLogs,
};
