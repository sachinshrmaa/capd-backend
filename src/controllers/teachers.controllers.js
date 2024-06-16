import {
  addTeacher,
  assignTeacherSubject,
  getAllTeacherSubjects,
  getAllTeachers,
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
}

export { ListTeachers, ListTeacherSubjects, AddTeacher, AssignTeacherSubject };
