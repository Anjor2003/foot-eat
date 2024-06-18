import userModel from "../models/userModel.js";

// add to cart
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Agregado al carrito" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "No se ha podido agregar al carrito" });
  }
};
// remove from cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }
    if (cartData[req.body.itemId] === 0) {
      delete cartData[req.body.itemId];
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Quitado del carrito" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "No se ha podido quitar del carrito" });
  }
};

// get all user cart data
const getCartItems = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    res.json({ success: true, cartData});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "No se ha podido obtener el carrito" });
  }
};

export { addToCart, removeFromCart, getCartItems };
