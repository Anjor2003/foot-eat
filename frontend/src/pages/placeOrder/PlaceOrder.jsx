import "./PlaceOrder.css";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    country: "",
    phone: "",
  });
  const [opcion, setOpcion] = useState("")
  const navigate = useNavigate();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => {
      return {
        ...data,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount()+2
    };
    let response = await axios.post(url + "/api/order/place", orderData, {
      headers: { token } });

    if (response.data.success) {
     const { session_url } = response.data;
     window.location.replace(session_url)
    } else {
      alert(response.data.message);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Por favor inicia sesion", { position: "top-right" });
      navigate("/");
    } else if(getTotalCartAmount() === 0) {
      navigate("/cart");
      toast.error("El carrito esta vacio", { position: "top-right" });
    }
  }, [token]);

  return (
    <form onSubmit={handleSubmit} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            onChange={handleChange}
            name="firstName"
            value={data.firstName}
            type="text"
            placeholder="Nombre"
            required
          />
          <input
            onChange={handleChange}
            name="lastName"
            value={data.lastName}
            type="text"
            placeholder="Apellidos"
            required
          />
        </div>
        <input
          onChange={handleChange}
          name="email"
          value={data.email}
          type="email"
          placeholder="Correo electronico"
          required
        />
        <input
          onChange={handleChange}
          name="address"
          value={data.address}
          type="text"
          placeholder="Direccion"
          required
        />
        <div className="multi-fields">
          <input
            onChange={handleChange}
            name="city"
            value={data.city}
            type="text"
            placeholder="Ciudad"
            required
          />
          <input
            onChange={handleChange}
            name="province"
            value={data.province}
            type="text"
            placeholder="Provincia"
            required
          />
        </div>
        <div className="multi-fields">
          <input
            onChange={handleChange}
            name="postal_code"
            value={data.postal_code}
            type="text"
            placeholder="Codigo postal"
            required
          />
          <input
            onChange={handleChange}
            name="country"
            value={data.country}
            type="text"
            placeholder="Pais"
            required
          />
        </div>
        <input
          onChange={handleChange}
          name="phone"
          value={data.phone}
          type="tel"
          placeholder="Telefono"
          required
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()}€</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Free</p>
              <p>{getTotalCartAmount() === 0 ? 0 : 2}€</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}€
              </b>
            </div>
          </div>
        </div>
        <div className="payment-method">
          <h2>Payment method</h2>
          <div className="radio" onChange={(e) => setOpcion(e.target.value)}>
            <input type="radio" name="pago" value={"cosh"}/>
            <label>(COD) Cash on delivery</label>
          </div>
          <div className="radio">
            <input type="radio" name="pago" value={"tarjeta"} defaultChecked  />
            <label >Stripe (Credit card)</label>
          </div>
          <button type="submit">Proceed To Payment</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
