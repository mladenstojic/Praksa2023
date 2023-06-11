import stock from '../../images/user.png'
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { query,collection,onSnapshot, where, collectionGroup } from "firebase/firestore";
import {FaUserTie, FaUserEdit, FaUserCog} from 'react-icons/fa'






const UserBox = ({val, setOverlayValue, setOverlayStat}) =>{

    const [countKreator, setCountKreator] = useState(0);
    const [countMenadzer, setCountMenadzer] = useState(0);
    const [countRadnik, setCountRadnik] = useState(0);

    const otvori = () =>{
        setOverlayStat('otvoren');
        setOverlayValue(val);     
    }

    useEffect(() => {
       
        const subcollectionRef = collectionGroup(db, 'rade');
        let q = query(collection(db, 'projekti'), where("kreator","==",val.id));
        let q2 = query(collection(db, 'projekti'),where("menadzer","==",val.id));
        let q3 = query(subcollectionRef, where('uid', '==', val.id));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let prebroj =  querySnapshot.size; 
            setCountKreator(prebroj);
        });

        const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
            let prebroj2 =  querySnapshot.size; 
            setCountMenadzer(prebroj2);
        });

        const unsubscribe3 = onSnapshot(q3, (querySnapshot) => {
            let prebroj3 = querySnapshot.size;
            setCountRadnik(prebroj3)
        })

        return () => {
            unsubscribe();
            unsubscribe2();
            unsubscribe3();
        };
        
        
    }, [val.id]);
    

    return(
        <div onClick={otvori} className="user-box">
            <div className="user-image">
                {val.photoURL?<img src={val.photoURL} alt="stock"/>:<img src={stock} alt="stock"/>}
            </div>
            <div className="user-credentials">            
                <p className="username">{val.username}</p>
                <p className="email">{val.email}</p>
            </div>
            <div className="icon-container">
                <div className="icon-holder"><FaUserEdit size={24}/><span className="icon-text">{countKreator}</span></div>
                <div className="icon-holder"><FaUserTie size={20}/><span className="icon-text">{countMenadzer}</span></div> 
                <div className="icon-holder"><FaUserCog size={24}/><span className="icon-text">{countRadnik}</span></div>
            </div>
        </div>
    );
};

export default UserBox;