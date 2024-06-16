import {
  getAllDepartments,
  getAllBatches,
  getAllSubjects,
  getAllSemesters,
  getPlatformStats,
  createDepartment,
  createSubject,
  createBatch,
  createSemester,
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

const ListSubjects = async (req, res) => {
  const { departmentId, semesterId } = req.body;
  if (!departmentId || !semesterId) {
    return res
      .status(400)
      .json({ message: "Department and semester are required" });
  }

  try {
    const subjects = await getAllSubjects(departmentId, semesterId);
    if (!subjects) {
      return res.status(404).json({ message: "No subjects found" });
    }
    res.status(200).json({ subjects: subjects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const ListSemesters = async (req, res) => {
  const { department } = req.body;

  if (!department) {
    return res.status(400).json({ message: "Department is required" });
  }

  try {
    const semesters = await getAllSemesters(department);
    if (!semesters) {
      return res.status(404).json({ message: "No semester found" });
    }
    res.status(200).json({ semesters: semesters });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const ListPlatformStats = async (req, res) => {
  try {
    const stats = await getPlatformStats();
    if (!stats) {
      return res.status(404).json({ message: "No stats found" });
    }
    res.status(200).json({ stats: stats });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const AddDepartment = async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Name and Department are required" });
  }

  // @todo: Add validation existing departemnts

  try {
    const department = await createDepartment(name, description);
    if (!department) {
      return res.status(404).json({ message: "No department found" });
    }
    res.status(200).json({ message: "Department created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const AddSubject = async (req, res) => {
  const { name, code, semesterId, departmentId } = req.body;
  if (!name || !code || !semesterId || !departmentId) {
    return res
      .status(400)
      .json({ message: "Name and Department are required" });
  }

  // @todo: Add validation existing subject code

  try {
    const subject = await createSubject(name, code, departmentId, semesterId);
    // if (!subject) {
    //   return res.status(404).json({ message: "No subject found" });
    // }
    res
      .status(200)
      .json({ message: "Subject created successfully", subject: subject });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const AddBatch = async (req, res) => {
  const { departmentId, name, startYear, endYear } = req.body;
  if (!departmentId || !name || !startYear || !endYear) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const batch = await createBatch(departmentId, name, startYear, endYear);
    res
      .status(200)
      .json({ message: "Batch created successfully", batch: batch });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const AddSemester = async (req, res) => {
  const { name, batchId, startDate, endDate } = req.body;
  if (!batchId || !name || !startDate || !endDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const semester = await createSemester(name, batchId, startDate, endDate);
    res
      .status(200)
      .json({ message: "Semester created successfully", semester: semester });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export {
  ListDeparments,
  ListBatches,
  ListSubjects,
  ListSemesters,
  ListPlatformStats,
  AddDepartment,
  AddSubject,
  AddBatch,
  AddSemester,
};
