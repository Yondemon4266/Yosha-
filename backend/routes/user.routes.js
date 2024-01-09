const multer = require("multer");
const router = require("express").Router();
const upload = multer({ dest: "../utils/images/" });
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
//auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);
router.delete("/delete/:id", authController.deleteUser);

// user DB
router.get("/getAllUsers/", userController.getAllUsers);
router.get("/:id", userController.userInfo);

// USER INFO CHANGES

router.patch("/emailchange/:id", userController.userEmailChange);
router.patch("/pseudochange/:id", userController.userPseudoChange);
router.patch("/passwordchange/:id", userController.userPasswordChange);

// PROFIL PICTURES
router.patch(
  "/bgpatch/:id",
  upload.single("image"),
  userController.userBgPatch
);
router.patch(
  "/imgpatch/:id",
  upload.single("image"),
  userController.userImgPatch
);

// // PROFIL PICTURES
module.exports = router;
