import { useState, useEffect, useRef } from "react";
import { UsersList } from '../contexts/UsersContext';
import { BiSearchAlt } from 'react-icons/bi'
import { MdClose }from 'react-icons/md'
import UserBox from "../components/users/UserBox";
import '../css/User.css'



  


const Users = () => {

    const [overlayStats, setOverlayStat] = useState(null);
    const [overlayValue, setOverlayValue] = useState('');
    const {userList} = UsersList();
    const [loading, setLoading] = useState(userList === "");

    const [pretraga, setPretraga]=useState('');
    const [rezultatPretrage, setRezultatPretrage] = useState([]);
    const inputRef = useRef();

    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setPretraga(searchWord);
        const newFilter = userList.filter((value) => {
          return value.username.toLowerCase().includes(searchWord.toLowerCase());
        });
    
        if (searchWord === "") {
            setRezultatPretrage([]);
        } else {
            setRezultatPretrage(newFilter);
        }
    };

    const ponistiPretragu = ()=>{
        setPretraga('');
        setRezultatPretrage([]);
    }

    useEffect(() => {
        setLoading(userList === "");
    }, [userList]);

    return(<><section className="attendance">
    <div className="attendance-list">
        <div className="searchbar">
            {pretraga.length===0?<span className="icon"><BiSearchAlt color="white"/></span>:<span onClick={ponistiPretragu} className="icon"><MdClose color="white"/></span>}
            <input ref={inputRef} value={pretraga} onChange={handleFilter} required type="text" placeholder={`Pretraži korisnike...`}/>
        </div>
    </div>
    <br/>
    <div className="attendance-list" style={{background: "rgba(255, 255, 255, 0.4)", borderRadius: "0px", flexWrap:"wrap"}}>
    {loading?<></>:(
        rezultatPretrage.length===0 ? userList.map((val,id)=>{
            return <UserBox key={id} val={val} setOverlayValue={setOverlayValue} setOverlayStat={setOverlayStat}/>}):
            rezultatPretrage.map((val,id)=>{
            return <UserBox key={id} val={val} setOverlayValue={setOverlayValue} setOverlayStat={setOverlayStat}/>}))
    
    }
    

      
        <div className="user-box-empty"></div>
        <div className="user-box-empty"></div>
        <div className="user-box-empty"></div>
        <div className="user-box-empty"></div>
        <div className="user-box-empty"></div>

    </div>
</section>
</>)
}

export default Users;