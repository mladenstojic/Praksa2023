import Dropdown from '../../layouts/Dropdown';
import {BsXLg, BsCheck2,BsTrash} from 'react-icons/bs'
import { UserAuth } from '../../contexts/UserContext';
import { useState, useRef } from 'react';
import { UsersList } from '../../contexts/UsersContext';
import { getDocs, query, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import {
    updateDoc,
    doc,
    collection,
    addDoc,
    serverTimestamp
  } from 'firebase/firestore';


const NewProject = ({setFilter, setOverlayStat, overlayValue, setOverlayValue})=>{

    const nazivRef = useRef()
    const opisRef = useRef()
    const prioritetRef = useRef()
    const menadzerRef = useRef()
    const [nazivError, setNazivError] = useState("");
    const [opisError, setOpisError] = useState("");
    const [prioritetError, setPrioritetError] = useState("");

    const prioritetList= [
        {
            id:1,
            username:"veoma visok"
        },
        {
            id:2,
            username:"visok"
        },
        {
            id:3,
            username:"srednji"
        },
        {
            id:4,
            username:"nizak"
        },
        {
            id:5,
            username:"veoma nizak"
        },
    ]


    let prioritet1=""
    
    switch (overlayValue.prioritet){
        case "1":
        prioritet1 = "veoma visok";        
            break;
        case "2": 
        prioritet1 = "visok"
          break;
        case "3": 
            prioritet1 = "srednji"
          break;
        case "4":
            prioritet1 = "nizak" 
            break;
        case "5": 
            prioritet1 = "veoma nizak"
            break;
        default:
            prioritet1 = "";        
          break;
      }  

    
    const { user } = UserAuth();
    const {userList} = UsersList();

    const klikni = (e) => {
        
        if(e.target.classList.contains("dismiss")) {
            setOverlayValue('')
            setOverlayStat(null)
            
        }
    }
    const date = new Date();
    let currentDay= String(date.getDate()).padStart(2, '0');
    let currentMonth = String(date.getMonth()+1).padStart(2,"0");
    let currentYear = date.getFullYear();

    let currentDate = `${currentDay}/${currentMonth}/${currentYear}`;


    const usernames = userList.map(({id, username}) => ({id, username}));

    const currMngr = usernames.filter((value) => {
        return value.id.includes(overlayValue.menadzer);
    });
    


    const kreirajProjekat = (e) => {
        e.preventDefault(e);

        setNazivError('');
        setOpisError('');
        setPrioritetError('');

        if(nazivRef.current.value===""){
            setNazivError("Unesite naziv projekta");
            return;
        }
        if(opisRef.current.value===""){
            setOpisError("Unesite opis projekta");
            return;
        }
        if(prioritetRef.current.innerHTML==="Odaberi..."){
            setPrioritetError("Oraberite prioritet")
            return;
        }

        addDoc(collection(db,'projekti'),{
            naziv: nazivRef.current.value,
            opis: opisRef.current.value,
            kreator: user.uid,
            kreiran: currentDate,
            prioritet: prioritetRef.current.id,
            menadzer: menadzerRef.current.id,
            status: "nezapočet",
            createdAt: serverTimestamp()
        })
        setOverlayStat(null)
        setFilter(false)
        
    }

    const azurirajProjekat =  (e) => {
        e.preventDefault(e);
        setNazivError('');
        setOpisError('');
        setPrioritetError('');

        if(nazivRef.current.value===""){
            setNazivError("Unesite naziv projekta");
            return;
        }
        if(opisRef.current.value===""){
            setOpisError("Unesite opis projekta");
            return;
        }
        if(prioritetRef.current.innerHTML==="Odaberi..."){
            setPrioritetError("Oraberite prioritet")
            return;
        }

        
         updateDoc(doc(db, 'projekti', overlayValue.id), {
            naziv: nazivRef.current.value,
            opis: opisRef.current.value,
            prioritet: prioritetRef.current.id,
            menadzer: menadzerRef.current.id,
        });
        setOverlayStat(null)
        setFilter(false)
      };

      const obrisi = async ()=>{
        const projektiDocumentRef = doc(collection(db, 'projekti'),  overlayValue.id);


        await deleteDoc(projektiDocumentRef);
      
        const taskoviQuerySnapshot = await getDocs(query(collection(projektiDocumentRef, 'taskovi')));
        taskoviQuerySnapshot.forEach(async (taskoviDoc) => {
          const radeQuerySnapshot = await getDocs(query(collection(taskoviDoc.ref, 'rade')));
          radeQuerySnapshot.forEach(async (radeDoc) => {
            await deleteDoc(radeDoc.ref);
          });
      
          await deleteDoc(taskoviDoc.ref);
        });

        setOverlayStat(false)
    }

    return(      
        <section className="overlay dismiss" onClick={klikni}>
            <div className="modul">
            <button className='x-button dismiss'><BsXLg className='dismiss' size={30}/></button>
            <form onSubmit={overlayValue?azurirajProjekat:kreirajProjekat}>
                <label>Projekat:</label>
                <input ref={nazivRef} type="text" defaultValue={overlayValue?overlayValue.naziv:""}/>
                <p className='errorMsg'>{nazivError}</p>
                <label>Opis:</label>
                <textarea ref={opisRef} defaultValue={overlayValue?overlayValue.opis:""}/>
                <p className='errorMsg'>{opisError}</p>
                <div className='spliter'>
                    {overlayValue==="" && <><div className='cont'>
                        <label>Kreator:</label>
                        <input style={{backgroundColor:"lightgray"}} type='text' readOnly value={user.displayName}/>
                    </div>
                    <div className='cont'>
                        <label>Datum:</label> 
                        <input style={{backgroundColor:"lightgray"}} type='text' readOnly value={currentDate}/>
                    </div></>}
                    
                </div>
                <div className='spliter'>
                    <div className='cont'>
                        {<Dropdown referenca={prioritetRef} labela={"Prioritet"} pocetna={overlayValue===""?{id:0,username:"Odaberi..."}:{id:overlayValue.prioritet,username:prioritet1}} lista={prioritetList}/>}
                        <p className='errorMsg'>{prioritetError}</p>
                    </div>
                    <div className='cont'>
                        <Dropdown referenca={menadzerRef} labela={"Menadžer"} pocetna={overlayValue===""?{id:user.id, username:user.displayName}:{id:currMngr[0].id, username:currMngr[0].username}} lista={usernames}/>     
                    </div>        
                </div>
                <div className='spliter'>
                    {overlayValue==="" && <div className='cont'>
                            <label>Status:</label>
                            <input style={{backgroundColor:"lightgray"}} type='text' readOnly value="Nezapočet"/>
                    </div>}
                    <div className='cont'>
                    
                    </div>
                </div>
                     
            

            {!overlayValue?<button className='new-button napravi'><BsCheck2 className='px' size={30}/><p>Kreiraj</p></button>:
            <button className='new-button napravi'><BsCheck2 className='px' size={30}/><p>Ažuriraj</p></button>}
            </form>
            {overlayValue && <button onClick={obrisi} className='new-button odbaci dismiss'><BsTrash className='px dismiss' size={30}/><p className='dismiss'>Obriši</p></button>}
            </div>
        </section>
    )
}

export default NewProject