import { useState, useEffect } from 'react'
import {BsXLg, BsTrash} from 'react-icons/bs'
import {AiOutlineEdit} from 'react-icons/ai'
import Prioritet from './Prioritet'
import { UsersList } from '../../contexts/UsersContext'
import { query, doc, updateDoc, collection, onSnapshot, deleteDoc, getDocs } from 'firebase/firestore'
import EditTask from './EditTask'
import { db } from '../../firebase'
import { UserAuth } from '../../contexts/UserContext'
const TaskInfo = ({setOverlayStat2, setOverlayStat3, id, projID, overlayStats3, disabled})=>{

console.log(disabled)
    const[overlayValueA, setOverlayValueA] = useState('')
    const[overlayValueB, setOverlayValueB] = useState([])
    const[padajuci, setPadajuci] = useState(false)
    const {userList} = UsersList();
    const {user} = UserAuth();
    
    const klikni = (e) => {
        
        if(e.target.classList.contains("dismiss")) {
            setOverlayStat2(false)   
        }
    }

    const prikaziPadajuci = () =>{

        const exists = overlayValueB.some(obj => obj.id === user.uid);
        if (exists) {
            setPadajuci((current) => !current)
        } 
    }

    const promeniStatus = (tip)=>{
        
        updateDoc(doc(db, 'projekti', projID, "taskovi",id), {
            status: tip,
        });
        setPadajuci(false)
    }

    const editClick=() => {
        setOverlayStat3(true)
    }

    const obrisi = ()=>{
        const documentRef = doc(db, 'projekti', projID,"taskovi",id);

        deleteDoc(documentRef)
        .then(()=>{
            const subcollRef = query(collection(db,'projekti', projID,"taskovi",id,"rade"))
            getDocs(subcollRef)
            .then((querySnapshot)=>{
                querySnapshot.forEach((docSnapshot) => {
                    deleteDoc(doc(docSnapshot.ref.parent, docSnapshot.id));
                });
            })
        })

        setOverlayStat2(false)
    }
    
    let kreator =""
    
    const usernames = userList.map(({id, username}) => ({id, username}));

    kreator = usernames.filter((value) => {
        return value.id.includes(overlayValueA.kreator);
    })

    const kreatorUsername = kreator.length > 0 ? kreator[0].username : "";
    
    useEffect(()=>{
       
        const q = query(doc(db, "projekti",projID,"taskovi",id))
        const unsubscribe2 = onSnapshot(q, (querySnapshot) => {
            let rez =[];
            rez = querySnapshot.data()
            setOverlayValueA(rez)
        })
        
      let q2 = query(collection(db, 'projekti',projID,"taskovi",id,"rade"));
      
        const unsubscribe = onSnapshot(q2, (querySnapshot) => {
        let rez2 = [];
        querySnapshot.forEach((doc) => {
            rez2.push({ ...doc.data(), id: doc.id });
        });
        setOverlayValueB(rez2);
      });
    return () => {unsubscribe();
                  unsubscribe2();}


    },[projID,id])

    const filteredArray = userList.filter(item =>
        overlayValueB.some(filterItem => filterItem.uid === item.id)
      );
    return (<>
    <section className="overlay dismiss" onClick={klikni}>
            <div className="task-info-box">

            <div className="task-opis">
                <h1>{overlayValueA.naziv}</h1>
                <br></br>
                <p>{overlayValueA.opis}</p>

            </div>
            <div className="task-details">
                <button  className='dismiss close-button' onClick={klikni}><BsXLg className='dismiss' onClick={klikni} size={30}/></button>     
                <div className='task-det'>
                    <h4>Kreator:</h4>
                    <p>{kreatorUsername}</p>
                    <h4>Datum: </h4>
                    <p>{overlayValueA.kreiran}</p>
                    <h4>Prioritet: </h4>
                    <Prioritet val={overlayValueA.prioritet}/> 
                    <h4>Status: </h4>
                    <div style={{position:"relative"}}>
                    <div onClick={prikaziPadajuci} className='status-box'>
                    <p>{overlayValueA.status}</p><AiOutlineEdit size={24}/>
                    </div>
                   {padajuci && <div className='status-type refferenca'>
                        <div onClick={()=> promeniStatus("to do")} className='refferenca status-selection'>to do</div>
                        <div onClick={()=> promeniStatus("in progress")} className='refferenca status-selection'>in progress</div>
                        <div onClick={()=>promeniStatus("qa")} className='refferenca status-selection'>qa</div>
                        <div onClick={()=>promeniStatus("završen")} className='refferenca status-selection'>završen</div>
                    </div>}
                    </div>
                    
                    <br></br>
                    <h1>Zadatak rade:</h1>
                    {filteredArray && filteredArray.map((val, id)=>{
                        return <div key={id} className='userbubble'><span>{val.username}</span></div>
                    })}
                    
                </div>  
            </div>
            <div style={{flexBasis:"100%"}}></div>
                <div className='button-cont'>
                    <div className='flex-levi'>
                    {(disabled===false && overlayValueA.kreator === user.uid) && <button onClick={editClick}><AiOutlineEdit size={28}/> Izmeni</button>}
                    </div>
                    <div className='flex-desni'>
                    {(disabled===false && overlayValueA.kreator === user.uid) && <button onClick={obrisi} className='desni'><BsTrash size={28}/> Obriši</button>}</div>
                </div>
            </div>
    </section>
    {overlayStats3 && <EditTask id={id} projID={projID} setOverlayStat3={setOverlayStat3}  overlayValueA={overlayValueA} overlayValueB={filteredArray} setOverlayStat2={setOverlayStat2}/>}
    </>)

    
}

export default TaskInfo