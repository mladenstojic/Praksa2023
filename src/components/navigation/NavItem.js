
import { Link } from "react-router-dom";
const NavItem = ({aktivan, activeItem, id, destinacija, ikonica, naziv}) =>{

    return (
        <>
            
            <li onClick={aktivan} id={id}>
                <Link to={destinacija}  className={activeItem === id ? 'navaktivan':""}>
                {ikonica}
                <span className="nav-item">{naziv}</span>
            </Link></li>
      
          
        </>
      )
    
    }
    
    export default NavItem;