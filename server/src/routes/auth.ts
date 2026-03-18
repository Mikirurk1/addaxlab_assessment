import { Router } from "express";
import { attachCaller, requireAuth } from "../middlewares/taskAuth.js";
import {
  getMe,
  postLogin,
  postSuperAdminBootstrap,
  getNicknameController,
  patchMe,
  postAdmins,
  postAvatar,
  getAvatar,
  getUsersForAdmin,
  deleteAvatarController,
  deleteUserController,
  postPasswordResetRequest,
  postPasswordReset,
} from "../controllers/authController.js";

const router = Router();
router.use(attachCaller);

router.get("/me", getMe);
router.post("/login", postLogin);
router.post("/super-admins/bootstrap", postSuperAdminBootstrap);
router.get("/nickname", getNicknameController);
router.patch("/me", requireAuth, patchMe);
router.post("/admins", requireAuth, postAdmins);
router.post("/avatar", requireAuth, postAvatar);
router.get("/avatar", getAvatar);
router.get("/users", requireAuth, getUsersForAdmin);
router.delete("/avatar", requireAuth, deleteAvatarController);
router.delete("/users/:email", requireAuth, deleteUserController);

// Password reset (forgot password -> email, then token -> password update).
router.post("/password-reset/request", postPasswordResetRequest);
router.post("/password-reset/reset", postPasswordReset);

export default router;
