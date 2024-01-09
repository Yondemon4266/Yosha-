const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(400).send({ message: "Pas pu récupérer allusers" });
  }
};

module.exports.userInfo = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Id non reconnu : " + req.params.id);
  try {
    await UserModel.findById(req.params.id)
      .select("-password")
      .then((docs) => {
        if (!docs) {
          return res
            .status(404)
            .send("Utilisateur non trouvé pour l'ID: " + req.params.id);
        }

        res.status(200).send(docs);
      });
  } catch (err) {
    return res
      .status(404)
      .send({ message: "Utilisateur non trouvé pour l'ID: " + req.params.id });
  }
};

module.exports.userEmailChange = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Id non reconnu : " + req.params.id);
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        message: "Adresse email déjà utilisée par un autre utilisateur",
      });
    } else {
      user.email = req.body.email;
      await user.save();
      return res.status(200).json({
        message: "Adresse email mise à jour avec succès",
        mail: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur", err });
  }
};

module.exports.userPseudoChange = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Id non reconnu : " + req.params.id);
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    const existingUser = await UserModel.findOne({ pseudo: req.body.pseudo });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Pseudo déjà utilisé par un autre utilisateur" });
    } else {
      user.pseudo = req.body.pseudo;
      await user.save();
      return res.status(200).json({
        message: "Pseudo mis à jour avec succès",
        pseudo: user.pseudo,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur", err });
  }
};

module.exports.userPasswordChange = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("Id non reconnu : " + req.params.id);
  }

  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const salt = await bcrypt.genSalt();

    // Vérifier que le nouveau mot de passe est différent de l'ancien
    if (await bcrypt.compare(req.body.password, user.password)) {
      return res.status(400).json({
        message: "Le nouveau mot de passe doit être différent de l'ancien",
      });
    }
    if (await bcrypt.compare(req.body.oldpassword, user.password)) {
      // Mettre à jour le mot de passe haché dans la base de données
      user.password = req.body.password;
      await user.save();

      return res
        .status(200)
        .json({ message: "Mot de passe mis à jour avec succès" });
    } else {
      return res
        .status(400)
        .json({ message: "L'ancien mot de passe n'est pas valide" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur", err });
  }
};

module.exports.userBgPatch = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Id non reconnu : " + req.params.id);
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    const fileName = path.basename(req.file.path);
    user.bgimg = fileName;
    await user.save();

    return res.status(200).json({
      message: "Image Background sélectionnée avec succès",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur", err });
  }
};
module.exports.userImgPatch = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Id non reconnu : " + req.params.id);
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    const fileName = path.basename(req.file.path);
    user.img = fileName;
    await user.save();

    return res.status(200).json({
      message: "Image sélectionnée avec succès",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur", err });
  }
};
