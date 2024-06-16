import { Router } from "express";

import { AddStudents, ListAllStudents } from "../controllers/students.controllers.js";

const router = Router();

router.post("/list-students", ListAllStudents);
router.post("/add-students", AddStudents)

export default router;
