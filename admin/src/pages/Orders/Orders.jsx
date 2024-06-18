import './Orders.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import {toast } from 'react-toastify'
import{assets} from '../../assets/assets'

const Orders = ({url}) => {
  const [orders, setOrders] = useState([])

  const getOrders = async () => {
    const res = await axios.get(url+"/api/order/list")
    if(res.data.success) setOrders(res.data.data)
      else toast.error(res.data.message)
  }

  const statusHandler = async (event,orderId) => {
    const res = await axios.post(url+"/api/order/status", {
      orderId,
      status: event.target.value,
    })
    if (res.data.success) {
      await getOrders()
    }
  }

  useEffect(() => {
    getOrders()
  }, [])


  return (
    <div className="orders add">
      <h3>Ordenes</h3>
      <div className="orders-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p className="order-item-name">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.address + ", "}</p>
                <p>
                  {order.address.postal_code +
                    " " +
                    order.address.city +
                    ", " +
                    order.address.country}
                </p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p className="order-item-price">items: {order.items.length}</p>
            <p>{order.amount}€</p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
              <option value="Food Procesing">Food Procesing</option>
              <option value="Out for Delibery">Out for Delibery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders