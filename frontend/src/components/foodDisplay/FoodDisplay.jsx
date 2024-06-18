import { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodIten from "../foodItem/FooodIten";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((food) => {
          if (category === "All" || category === food.category) {
            return(
            <FoodIten
              key={food._id}
              id={food._id}
              name={food.name}
              price={food.price}
              description={food.description}
              image={food.image}
            />
            
            )}
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
