import { Router } from "express";

import {
  ListStudentOverallAttendance,
  ListStudentSubjectAttendance,
  ListStudentsForAttendance,
  ListSubjectOverallAttendance,
  LogSubjectAttendance,
} from "../controllers/attendance.controllers.js";

const router = Router();

router.post("/log-attendance", LogSubjectAttendance);
router.post("/subject-attendance", ListStudentSubjectAttendance);
router.post("/overall-attendance", ListStudentOverallAttendance);
router.post("/subject-overall-attendance", ListSubjectOverallAttendance);
router.post("/list-students", ListStudentsForAttendance);

export default router;
