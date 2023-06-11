import { useState, useEffect } from 'react';
import NavItem from './NavItem.js';
import { Link } from 'react-router-dom';
import {FaUserAlt} from "react-icons/fa";
import {IoMdArrowDropdown, IoMdArrowDropup} from "react-icons/io";
import {ImExit} from 'react-icons/im'
import stock from '../../images/user.png'

import { UserAuth } from '../../contexts/UserContext.js';



function NavUser({aktivan,activeItem}) {


    const [isActive, setIsActive] = useState(false);
    const { user, logout, setProfilnaSlika, photoURL } = UserAuth();
    const prikazi = () => {

        setIsActive(current => !current);
    };

    useEffect(() => {
      if (user?.photoURL) {
        setProfilnaSlika(user.photoURL);
      }

    }, [user,setProfilnaSlika])

  return (
    <>
        <li className={isActive ? "hidden active": "hidden"}><div className="usernav logo" onClick={prikazi}>
         {user.photoURL?<img src={photoURL} alt='profile'/>:<img src={stock} alt='stock'/>}
          {user && <>
          <span className="nav-item">{user.displayName}</span>
          <span className='nav-item nav-subtitle'>{user.email}</span></>}
          {isActive ?(<IoMdArrowDropup size={25}/>):(<IoMdArrowDropdown size={25}/>)} 
          
        </div>
          <ul>
          <NavItem destinacija='/profil' id='navprofil' aktivan={aktivan} activeItem={activeItem} ikonica={<FaUserAlt className='fas'/>} naziv='Moj profil'/>
            <li><Link to = "/" onClick={logout}>
              <ImExit className="fas"/>
              <span className="nav-item">Odjavi se</span>
            </Link></li>
          </ul>
        </li>

  {/*<Profil user={user}/>*/}
      
    </>
  );
}

export default NavUser;