import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { url } from "./assets/assets";

const App = () => {
    const url_server = url;
  return (
    <div>
      <ToastContainer position="bottom-right" />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
            <Route path="/add" element={<Add url={url_server}/>} />
            <Route path="/list" element={<List url={url_server}/>} />
            <Route path="/orders" element={<Orders url={url_server}/>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
