import { Router } from "express";

import {
  ListBatches,
  ListDeparments,
  ListSemesters,
  ListSubjects,
} from "../controllers/academics.controllers.js";

const router = Router();

router.get("/list-departments", ListDeparments);
router.post("/list-batches", ListBatches);
router.post("/list-semesters", ListSemesters);
router.post("/list-subjects", ListSubjects);

export default router;
