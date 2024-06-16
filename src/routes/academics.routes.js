import { Router } from "express";

import {
  AddBatch,
  AddDepartment,
  AddSemester,
  AddSubject,
  ListBatches,
  ListDeparments,
  ListPlatformStats,
  ListSemesters,
  ListSubjects,
} from "../controllers/academics.controllers.js";

const router = Router();

router.get("/list-departments", ListDeparments);
router.post("/list-batches", ListBatches);
router.post("/list-subjects", ListSubjects);
router.post("/list-semesters", ListSemesters);
router.get("/platform-stats", ListPlatformStats);
router.post("/add-department", AddDepartment);
router.post("/add-subject", AddSubject);
router.post("/add-batch", AddBatch);
router.post("/add-semester", AddSemester);

export default router;
