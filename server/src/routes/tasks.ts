import { Router } from "express";
import { attachCaller, requireAuth } from "../middlewares/taskAuth.js";
import {
  getTasks,
  postTask,
  postTasksBulk,
  reorderTaskList,
  patchTask,
  patchSeries,
  detachTask,
  deleteTask,
} from "../controllers/tasksController.js";

const router = Router();
router.use(attachCaller);

router.get("/", getTasks);
router.post("/", requireAuth, postTask);
router.post("/bulk", requireAuth, postTasksBulk);
router.put("/reorder", requireAuth, reorderTaskList);
router.patch("/series/:seriesId", requireAuth, patchSeries);
router.patch("/:id", requireAuth, patchTask);
router.patch("/:id/detach", requireAuth, detachTask);
router.delete("/:id", requireAuth, deleteTask);

export default router;
