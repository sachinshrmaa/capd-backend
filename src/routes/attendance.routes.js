import { Router } from "express";

import {
  ListStudentOverallAttendance,
  ListStudentSubjectAttendance,
  LogSubjectAttendance,
} from "../controllers/attendance.controllers.js";

const router = Router();

router.post("/log-attendance", LogSubjectAttendance);
router.post("/subject-attendance", ListStudentSubjectAttendance);
router.post("/overall-attendance", ListStudentOverallAttendance);

export default router;
