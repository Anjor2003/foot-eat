import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Comprobar si el email existe
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "El usuario no existe" });
    }

    // Comprobar si la contraseña es correcta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "La contraseña es incorrecta" });
    } else {
      const token = createToken(user._id);
      res.json({ success: true, token }); 
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error al iniciar sesion" });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Comprobar si el email existe
    const existsUser = await userModel.findOne({ email });
    if (existsUser) {
      return res.json({ success: false, message: "El uuario ya existe" });
    }

    // Comprobar si el email es valido y fuerte contraseña
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Por favor, introduce un email valido",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "La contraseña debe tener al menos 8 caracteres",
      });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear el usuario
    const newUser = new userModel({
      name,
      email,
      password: passwordHash,
    });
    const savedUser = await newUser.save();
    const token = createToken(savedUser._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error al registrar el usuario" });
  }
};

export { loginUser, registerUser };
