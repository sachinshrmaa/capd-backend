import {
  getAllDepartments,
  getAllBatches,
  getAllSubjects,
} from "../repository/academics.repository.js";

const ListDeparments = async (req, res) => {
  try {
    const departments = await getAllDepartments();
    if (!departments) {
      return res.status(404).json({ message: "No departments found" });
    }
    res.status(200).json({ departments: departments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const ListBatches = async (req, res) => {
  const { department } = req.body;
  if (!department) {
    return res.status(400).json({ message: "Department is required" });
  }

  try {
    const batches = await getAllBatches(department);
    if (!batches) {
      return res.status(404).json({ message: "No batches found" });
    }
    res.status(200).json({ batches: batches });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const ListSemesters = async (req, res) => {};

const ListSubjects = async (req, res) => {
  const { department, semester } = req.body;
  if (!department || !semester) {
    return res
      .status(400)
      .json({ message: "Department and semester are required" });
  }

  try {
    const subjects = await getAllSubjects(department, semester);
    if (!subjects) {
      return res.status(404).json({ message: "No subjects found" });
    }
    res.status(200).json({ subjects: subjects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { ListDeparments, ListBatches, ListSemesters, ListSubjects };
