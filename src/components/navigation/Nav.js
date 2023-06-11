import { useState } from 'react';
import NavUser from './NavUser.js';
import NavItem from './NavItem.js';
import {FaTasks, FaUsers, FaFolderOpen} from "react-icons/fa";
import { UserAuth } from '../../contexts/UserContext.js';
import '../../css/Nav.css'


const Nav = () =>{
const [activeItem, setActiveItem] = useState('idiprojektinav');

const {user} = UserAuth()
const aktivan = (item) => {
    setActiveItem(item.currentTarget.id); 
};



return(
    <nav>
        <ul>
            <NavUser aktivan={aktivan} activeItem={activeItem}/>
            <NavItem destinacija='/projekti' id='idiprojektinav' aktivan={aktivan} activeItem={activeItem} ikonica={<FaFolderOpen className="fas"/>} naziv='Projekti'/>
            <NavItem destinacija={'/moji-taskovi/'+user.uid} id='mytasknav' aktivan={aktivan} activeItem={activeItem} ikonica={<FaTasks className='fas'/>} naziv='Moji taskovi'/>
            <NavItem destinacija='/korisnici' id='idkorisnicinavi' aktivan={aktivan} activeItem={activeItem} ikonica={<FaUsers className="fas"/>} naziv='Korisnici'/>
        </ul>
    </nav>
)

}

export default Nav;