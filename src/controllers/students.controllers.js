import { getAllStudents } from "../repository/students.repository.js";

const ListAllStudents = async (req, res) => {
  try {
    const students = await getAllStudents();
    if (!students) {
      return res.status(404).json({ message: "No students found" });
    }
    res.status(200).json({ students: students });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
  res.json({ message: "List of students" });
};

export { ListAllStudents };
