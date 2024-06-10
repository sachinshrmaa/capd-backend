import {
  getAllTeacherSubjects,
  getAllTeachers,
} from "../repository/teachers.repository.js";

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

export { ListTeachers, ListTeacherSubjects };
