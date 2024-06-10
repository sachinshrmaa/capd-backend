import { Router } from "express";

import { ListAllStudents } from "../controllers/students.controllers.js";

const router = Router();

router.post("/list-students", ListAllStudents);

export default router;
