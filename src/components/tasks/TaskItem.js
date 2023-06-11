
import { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import Prioritet from './Prioritet.js';
import userimage from "../../images/user.png";
import { UsersList } from '../../contexts/UsersContext.js';
import { db } from '../../firebase.js';
import { query, collection, onSnapshot } from 'firebase/firestore';
function TaskItem ({val, setId, setOverlayStat2,setProjID }){

const{userList} = UsersList()


const [radnici, setRadnici] = useState([])
const params = useParams();

const otvori = ()=>{
  setId(val.id);
  if(val.hasOwnProperty('projID')){
    setProjID(val.projID)
  }
  setOverlayStat2(true);
}



useEffect(() => {
  let q = ''
  if (val.hasOwnProperty('projID')) {
    q = query(collection(db, 'projekti',val.projID,"taskovi",val.id,"rade"));
  } else {
    q = query(collection(db, 'projekti',params.id,"taskovi",val.id,"rade"));
  }
      
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let listaProj = [];
        querySnapshot.forEach((doc) => {
          listaProj.push({ ...doc.data(), id: doc.id });
        });
        setRadnici(listaProj);
      });
    return () => unsubscribe();
      
  }, [params.id, val.id, val.projID]);

  const filteredArray = userList.filter(item =>
    radnici.some(filterItem => filterItem.uid === item.id)
  );

    return (
        
        <div className='card type2' onClick={otvori} >
            <span>{val.naziv}</span><br/><br/>
            <p>{val.opis}</p>
            <Prioritet val={val.prioritet}/>
            <div className='avatar-box'>
                <div className='avatar-group'>
                    {filteredArray && filteredArray.map(( val, id)=>{
                        return <div key={id} className='avatar'>
                        {val.photoURL?<img src={val.photoURL} alt='profslika'/>:<img src={userimage} alt='profslika'/> } 
                    </div>
                    })}
                </div>
            </div>
        </div>         
        
    )
}
export default TaskItem;