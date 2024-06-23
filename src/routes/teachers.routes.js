import { Router } from "express";

import {
  AddTeacher,
  AddTeacherWards,
  AddWardsCounsellingLog,
  AssignTeacherSubject,
  ListTeacherSubjects,
  ListTeacherWards,
  ListTeachers,
  ListWardsAttendanceLogs,
} from "../controllers/teachers.controllers.js";
import { requireAuth } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/list-teachers", ListTeachers);
router.get("/list-teacher-subjects", requireAuth, ListTeacherSubjects);
router.post("/add-teacher", requireAuth, AddTeacher);
router.post("/assign-subject-teacher", requireAuth, AssignTeacherSubject);
router.get("/list-teacher-wards", requireAuth, ListTeacherWards);
router.post("/add-teacher-wards", requireAuth, AddTeacherWards);
router.post("/add-counselling-log", requireAuth, AddWardsCounsellingLog);
router.get("/list-wards-attendance", requireAuth, ListWardsAttendanceLogs);

export default router;
