import { Router } from "express";

import {
  ListTeacherSubjects,
  ListTeachers,
} from "../controllers/teachers.controllers.js";
import { requireAuth } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/list-teachers", ListTeachers);
router.get("/list-teacher-subjects", requireAuth, ListTeacherSubjects);

export default router;
