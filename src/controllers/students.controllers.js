import { getAllStudents } from "../repository/students.repository.js";

const ListAllStudents = async (req, res) => {
  const { department, batch } = req.body;

  if (!department) {
    return res.status(400).json({ message: "Department is required" });
  }

  try {
    const students = await getAllStudents(department, batch);
    if (!students) {
      return res.status(404).json({ message: "No students found" });
    }
    res.status(200).json({ students: students });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { ListAllStudents };
