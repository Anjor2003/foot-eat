import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import 'dotenv/config'

const stripe = new Stripe(process.env.STRIPE_API_KEY);

// place user order from frontend
const placeOrder = async (req, res) => {
   const frontend_url = "http://localhost:5174";

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, {cartData: {}});

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency:"EUR",
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }))

    line_items.push({
      price_data: {
        currency:"EUR",
        product_data: {
          name: "Delivery Charges"
      },
      unit_amount: 2*100,
    },
    quantity: 1,
    })

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });
    res.json({success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "No se ha podido realizar el pago" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId , success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true
      }); 
      res.json({ success: true, message: "El pago se ha realizado con exito" });
    } else {
      await orderModel.findByIdAndDelete(orderId)
      res.json({ success: false, message: "El pago ha sido cancelado" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "No se ha podido realizar el pago" });
  }
}
// Ordernes del usuario desde frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "No se ha podido cargar las ordenes" });
  }
}

// Listado de todos los pedidos en panel de administrador
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "No se ha podido cargar las ordenes" });
  }
}
// Update Order Status
const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to update order status" });
  }
};


export { placeOrder, verifyOrder, userOrders, allOrders, updateOrderStatus };
