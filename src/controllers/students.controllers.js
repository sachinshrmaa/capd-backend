import bycrypt from "bcryptjs";
import { addStudents, getAllStudents } from "../repository/students.repository.js";


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



const AddStudents = async (req, res) => {
  const students = req.body;

  try {
    const hashedStudents = await Promise.all(students.map(async (student) => {
      const { name, email, password, departmentId, batchId, semesterId, rollNo } = student;

      if (!name || !email || !password || !departmentId || !batchId || !semesterId || !rollNo) {
        throw new Error("All fields are required");
      }

      const hashedPassword = await  bycrypt.hashSync(password, 10);
      return {
        name,
        email,
        password: hashedPassword,
        departmentId,
        batchId,
        semesterId,
        rollNo
      };
    }));

    const result = await addStudents(hashedStudents);
    if (!result) {
      return res.status(404).json({ message: "No students found" });
    }
    res.status(200).json({ students: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { ListAllStudents, AddStudents };
