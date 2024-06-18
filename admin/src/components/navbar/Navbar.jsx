import './Navbar.css'
import {assets} from '../../assets/assets'

const Navbar = () => {
  return (
    <div className='navbar'>
      <p className='logo'>Food&Eat</p>
      <img  className='profile' src={assets.profile_image} alt="" />
    </div>
  )
}

export default Navbar