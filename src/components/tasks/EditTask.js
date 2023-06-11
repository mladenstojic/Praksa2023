import { useState, useRef } from 'react';
import Dropdown from '../../layouts/Dropdown';
import { MdClose } from 'react-icons/md';
import { BsXLg, BsCheck2 } from 'react-icons/bs';
import { UsersList } from '../../contexts/UsersContext';
import { db } from '../../firebase';
import { updateDoc, doc, setDoc, deleteDoc} from 'firebase/firestore';
const EditTask = ({setOverlayStat3,  overlayValueA, overlayValueB, id, projID }) =>{

    const nazivRef = useRef();
    const opisRef = useRef();
    const prioritetRef = useRef();
    const staturRef = useRef();
    const {userList} = UsersList()
    const usernames = userList.map(({id, username}) => ({id, username}));


    const [pretraga, setPretraga]=useState([]);
    const [rezultatPretrage, setRezultatPretrage] = useState([]);
    const [listaNovihRadnika, setListaNovihRadnika] = useState([]);

    const [nazivZadatkaErr, setNazivZadatkaErr] = useState('');
    const [opisZadatkaErr, setOpisZadatkaErr] = useState('');

    const [radniciErr, setRadniciErr] = useState('')

    const [trenutniRadnici, setTrenutniRadnici] = useState(overlayValueB)
    const [uklonjeni, setUkonjeni] = useState('')



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

        if(listaNovihRadnika.some((user) => user.id === id)===false && overlayValueB.some((user) =>user.id === id)===false){
            setListaNovihRadnika((previous)=>[...previous,{id:id,username:username}])
            ponistiPretragu()
        }  
    }

    const ukliniKorisnika = (e,id,tip) => {
        if(tip==="novi"){
            setListaNovihRadnika(prevUsers => prevUsers.filter(user => user.id !== id));
        }else if(tip ==="trenutni"){
            let filter = trenutniRadnici.filter((value) => {
                return value.id === id;
              })
            setUkonjeni((previous)=>[...previous,filter[0]])
            setTrenutniRadnici(prevUsers => prevUsers.filter(user => user.id !== id))
        }else if(tip === "za brisanje"){
            let filter = uklonjeni.filter((value) => {
                return value.id === id;
            })
            setTrenutniRadnici((previous)=>[...previous,filter[0]])
            setUkonjeni(prevUsers => prevUsers.filter(user => user.id !==id))
        }
    };

    const klikni = (e) => {
        
        if(e.target.classList.contains("dismiss")) {
            setOverlayStat3(null)   
        }
    }

    const azurirajTask = (e)=>{
        e.preventDefault("")
        setNazivZadatkaErr("")
        setOpisZadatkaErr("")


        if(nazivRef.current.value===""){
            setNazivZadatkaErr("Unesite naziv zadatka")
            return;
        }
        if(opisRef.current.value===""){
            setOpisZadatkaErr("Unesite opis zadatka")
            return;
        }
        if(trenutniRadnici.length===0){
            setRadniciErr("Mora biti minimum jedan radnik")
            return;
        }


    

        updateDoc(doc(db, 'projekti', projID, "taskovi",id), {
            naziv: nazivRef.current.value,
            opis: opisRef.current.value,
            prioritet: prioritetRef.current.id,
            status: staturRef.current.id,
        });
        for (let i = 0; i<listaNovihRadnika.length;i++){

            setDoc(doc(db, 'projekti', projID,"taskovi",id,"rade",listaNovihRadnika[i].id),{
                uid:listaNovihRadnika[i].id,
            })
        } 
    
        if(trenutniRadnici.length>=1)
        for(let i = 0; i<uklonjeni.length; i++){
            deleteDoc(doc(db, 'projekti', projID,"taskovi",id,"rade",uklonjeni[i].id))
        }
        setOverlayStat3(false)
    }
    

    

    

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

    const statusList= [
        {
            id:"to do",
            username:"to do"
        },
        {
            id:"in progress",
            username:"in progress"
        },
        {
            id:"qa",
            username:"qa"
        },
        {
            id:"zavrsen",
            username:"zavrsen"
        }

    ]


    let prioritet1=""
    
    switch (overlayValueA.prioritet){
        case "1":
        prioritet1 = "veoma nizak";        
            break;
        case "2": 
        prioritet1 = "nizak"
          break;
        case "3": 
            prioritet1 = "srednji"
          break;
        case "4":
            prioritet1 = "visok" 
            break;
        case "5": 
            prioritet1 = "veoma visok"
            break;
        default:
            prioritet1 = "";        
          break;
      }  

    return(
    <section className="overlay dismiss" onClick={klikni}>
    <div className="modul">
    <form onSubmit={azurirajTask}>
        <label>Zatakat:</label>
        <input ref={nazivRef} type="text" defaultValue={overlayValueA.naziv}/>
        <p className='errorMsg'>{nazivZadatkaErr}</p>
        <label>Opis:</label>
        <textarea ref={opisRef} defaultValue={overlayValueA.opis}/>
        <p className='errorMsg'>{opisZadatkaErr}</p>
        <div className='spliter'>
            <div className='cont'>
                {<Dropdown referenca={prioritetRef} labela={"Prioritet"} pocetna={{id:overlayValueA.prioritet,username:prioritet1}} lista={prioritetList}/>}
            </div>    
            <div className='cont'>
                {<Dropdown referenca={staturRef} labela={"Status"} pocetna={{id:overlayValueA.status,username:overlayValueA.status}} lista={statusList}/>}
            </div>
        </div>
        <label>Zadatak radi:</label>
            {trenutniRadnici && trenutniRadnici.map((val, id)=>(
                <div key={id} className='userbubble'><span id={val.id} >{val.username}</span> <MdClose onClick={(e) => ukliniKorisnika(e, val.id, "trenutni")} className='xStyle'/></div>
            ))}
            {uklonjeni && uklonjeni.map((val, id)=>(
                <div key={id} className='userbubble oboj-crveno'><span id={val.id} >{val.username}</span> <MdClose onClick={(e) => ukliniKorisnika(e, val.id, "za brisanje")} className='xStyle green'/></div>
            ))}
            {listaNovihRadnika && listaNovihRadnika.map((val, id)=>(
                <div key={id} className='userbubble oboj-zeleno'><span id={val.id} >{val.username}</span> <MdClose onClick={(e) => ukliniKorisnika(e, val.id, "novi")} className='xStyle'/></div>
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
    <button className='new-button napravi'><BsCheck2 className='px' size={30}/><p>Ažuriraj</p></button></form>
    <button onClick={klikni} className='new-button odbaci dismiss'><BsXLg className='px dismiss' size={30}/><p className='dismiss'>Odbaci</p></button>
    </div>
    </section>
    )
}

export default EditTask