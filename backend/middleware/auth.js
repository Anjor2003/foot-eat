import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token)
    return res.json({
      success: false,
      message: "No estas autenticado, debes iniciar sesion.",
    });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = verified.id;
    next();
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Invalid token" });
  }
};
export default authMiddleware;
