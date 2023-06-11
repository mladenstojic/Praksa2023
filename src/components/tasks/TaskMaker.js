import Dropdown from '../../layouts/Dropdown';
import {BsXLg, BsCheck2} from 'react-icons/bs'
import { UserAuth } from '../../contexts/UserContext';
import { useState, useRef } from 'react';
import { UsersList } from '../../contexts/UsersContext';
import { db } from '../../firebase';
import {MdClose} from 'react-icons/md'
import {
    collection,
    addDoc,
    serverTimestamp,setDoc,doc
  } from 'firebase/firestore';


const TaskMaker = ({setOverlayStat, projID})=>{
    const {user} = UserAuth()
    const {userList} = UsersList();

    const nazivRef = useRef();
    const opisRef = useRef();
    const prioritetRef = useRef();


    const [pretraga, setPretraga]=useState([]);
    const [rezultatPretrage, setRezultatPretrage] = useState([]);
    const [listaNovihRadnika, setListaNovihRadnika] = useState([]);
    const [nazivZadatkaErr, setNazivZadatkaErr] = useState('');
    const [opisZadatkaErr, setOpisZadatkaErr] = useState('');
    const [prioritetErr, setPrioritetErr] = useState('');
    const [radniciErr, setRadniciErr] = useState('')

    
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

    const dodajRadnika = (e, id, username)=>{

        if(listaNovihRadnika.some((user) => user.id === id)===false){
            setListaNovihRadnika((previous)=>[...previous,{id:id,username:username}])
            ponistiPretragu()
        }  
    }

    const ukliniKorisnika = (e,id,tip) => {
        if(tip==="novi"){
            setListaNovihRadnika(prevUsers => prevUsers.filter(user => user.id !== id));
        }
    };

    const prioritetList= [
        {
            id:1,
            username:"veoma nizak"
        },
        {
            id:2,
            username:"nizak"
        },
        {
            id:3,
            username:"srednji"
        },
        {
            id:4,
            username:"visok"
        },
        {
            id:5,
            username:"veoma visok"
        },
    ]


    const klikni = (e) => {
        
        if(e.target.classList.contains("dismiss")) {
            setOverlayStat(null)   
        }
    }

    const kreirajZadatak = (e) =>{
        e.preventDefault()
        setNazivZadatkaErr('')
        setOpisZadatkaErr('')
        setPrioritetErr('')
        setRadniciErr('')

        if(nazivRef.current.value===''){
            setNazivZadatkaErr('Unesite naziv zadatka')
            return;
        }

        if(opisRef.current.value===""){
            setOpisZadatkaErr("Unesite opis zadatka")
            return;
        }
        if(prioritetRef.current.id==="0"){
            setPrioritetErr("Odaberite prioritet")
            return;
        }
        if(listaNovihRadnika.length===0){
            setRadniciErr("Odaberite makar jednog radnika")
        }
        
        addDoc(collection(db,'projekti',projID,"taskovi"),{
            naziv: nazivRef.current.value,
            opis: opisRef.current.value,
            kreator: user.uid,
            kreiran: currentDate,
            prioritet: prioritetRef.current.id,
            status: "to do",
            createdAt: serverTimestamp()
        }).then(docRef => {
            for(let i = 0; i<listaNovihRadnika.length;i++){
                setDoc(doc(db,'projekti',projID,"taskovi",docRef.id,"rade",listaNovihRadnika[i].id),{
                    uid:listaNovihRadnika[i].id,
                })
            }
        })
        setOverlayStat(null)
    }
    


    const date = new Date();
    let currentDay= String(date.getDate()).padStart(2, '0');
    let currentMonth = String(date.getMonth()+1).padStart(2,"0");
    let currentYear = date.getFullYear();

    let currentDate = `${currentDay}/${currentMonth}/${currentYear}`;

    return(      
        <section className="overlay dismiss" onClick={klikni}>
            <div className="modul">
            <form onSubmit={kreirajZadatak}>
                <label>Zadatak:</label>
                <input ref={nazivRef}  type="text"/>
                <p className='errorMsg'>{nazivZadatkaErr}</p>
                <label>Opis:</label>
                <textarea ref={opisRef}/>
                <p className='errorMsg'>{opisZadatkaErr}</p>
                <div className='spliter'>
                     <div className='cont'>
                        <label>Kreator:</label>
                        <input style={{backgroundColor:"lightgray"}} type='text' readOnly value={user.displayName}/>
                    </div>
                    <div className='cont'>
                        <label>Datum:</label> 
                        <input style={{backgroundColor:"lightgray"}} type='text' readOnly value={currentDate}/>
                    </div>
                    
                </div>
                <div className='spliter'>
                    <div className='cont'>
                        {<Dropdown referenca={prioritetRef} labela={"Prioritet"} pocetna={{id:0,username:"Odaberi..."}} lista={prioritetList}/>}
                        <p className='errorMsg'>{prioritetErr}</p>
                    </div>    
                    <div className='cont'>
                        <label>Status:</label>
                        <input style={{backgroundColor:"lightgray"}} type='text' readOnly value="to do"/>
                    </div>
                </div>
                <label>Zadatak radi:</label>
                    {listaNovihRadnika && listaNovihRadnika.map((val, id)=>(
                        <div key={id} className='userbubble'><span id={val.id} >{val.username}</span> <MdClose onClick={(e) => ukliniKorisnika(e, val.id, "novi")} className='xStyle'/></div>
                    ))}
                <div className='spliter'>
                    <div className='cont' style={{position:"relative"}}>
                        {pretraga.length>0&&<span onClick={ponistiPretragu} className='user-close-icon'><MdClose size={20} /></span>}
                        <input value={pretraga} onChange={handleFilter} id='userInput' placeholder='dodaj...' type="text" autoComplete="off"/>
                        <p className='errorMsg'>{radniciErr}</p>
                        <div className='userResult-cont'>
                            <div className='userResult-nosac' >
                            {rezultatPretrage !=="" && rezultatPretrage.map((val,id)=>
                                <div key={id} className='userResult'>
                                        <p onClick={(e) => dodajRadnika(e, val.id, val.username)} id={val.id} style={{fontSize:"14px"}}>{val.username}</p>
                                </div>)} 
                            </div>
                        </div>
                    </div>
                </div>
                
                        
            

            {/*!overlayValue?<button className='new-button napravi'><BsCheck2 className='px' size={30}/><p>Kreiraj</p></button>*/}
            <button className='new-button napravi'><BsCheck2 className='px' size={30}/><p>Kreiraj</p></button></form>
            <button onClick={klikni} className='new-button odbaci dismiss'><BsXLg className='px dismiss' size={30}/><p className='dismiss'>Odbaci</p></button>
            </div>
        </section>
    )
}

export default TaskMaker