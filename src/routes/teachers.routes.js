import { Router } from "express";

import {
  AddTeacher,
  AssignTeacherSubject,
  ListTeacherSubjects,
  ListTeachers,
} from "../controllers/teachers.controllers.js";
import { requireAuth } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/list-teachers", ListTeachers);
router.get("/list-teacher-subjects", requireAuth, ListTeacherSubjects);
router.post("/add-teacher", requireAuth, AddTeacher);
router.post("/assign-subject-teacher", requireAuth, AssignTeacherSubject);

export default router;
