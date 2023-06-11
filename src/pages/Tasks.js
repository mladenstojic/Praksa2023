import {useParams} from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import TaskLane from '../components/tasks/TaskLane.js'
import TaskMaker from '../components/tasks/TaskMaker';
import TaskInfo from '../components/tasks/TaskInfo';
import { BiSearchAlt } from 'react-icons/bi'
import { MdClose }from 'react-icons/md'
import {BsClipboard2Plus} from 'react-icons/bs'
import {RxCaretSort} from 'react-icons/rx'
import { UsersList } from '../contexts/UsersContext';
import {BsSortAlphaDownAlt, BsSortAlphaDown, BsSortNumericDownAlt, BsSortNumericDown, BsSortDown, BsSortDownAlt}from 'react-icons/bs'
import { query, collection, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { UserAuth } from '../contexts/UserContext';
import {RiMenuFoldLine, RiMenuUnfoldLine}from 'react-icons/ri'
const Tasks = () => {

  const [tasks, setTasks] = useState([])
  const [id, setId] = useState()
  const [overlayStats2, setOverlayStat2] = useState(false)
  const [overlayStats3, setOverlayStat3] = useState(false)
  const [projectInfo, setProjectInfo] = useState([])
  const [filter1, setFilter1] = useState([])
  const [filter2, setFilter2] = useState([])
  const [filter3, setFilter3] = useState([])
  const [filter4, setFilter4] = useState([])
  const [overlayStats, setOverlayStat] = useState(null);
  const [otvoriOpis, setOtvoriOpis] = useState(false);
  const [azSort, setAzSort] = useState(0)
  const [dateSort, setDateSort] = useState(0)
  const [prioritySort, setPrioritySort] = useState(0)
  const {userList} = UsersList();
  const [loading, setLoading] = useState(userList === "");
  const {user} = UserAuth();

  
  const [pretraga, setPretraga]=useState('');
  const [rezultatPretrage, setRezultatPretrage] = useState([]);
  const inputRef = useRef();
  const handleFilter = (event) => {
      const searchWord = event.target.value;
      setPretraga(searchWord);
      const newFilter = tasks.filter((value) => {
        return value.naziv.toLowerCase().includes(searchWord.toLowerCase());
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
let currMngr = ''
let kreator = ''
if(!loading){
  const usernames = userList.map(({id, username}) => ({id, username}));

  currMngr = usernames.filter((value) => {
        return value.id.includes(projectInfo.menadzer);
    });
  

  kreator = usernames.filter((value) => {
        return value.id.includes(projectInfo.kreator);
    });

}
  
  const otvori = () =>{
    setOverlayStat('otvoren');
  }
 const opisOtvori = ()=>{
  setOtvoriOpis((current)=>!current)
 } 


 const sortirajAz = () => {
  setDateSort(0)
  setPrioritySort(0)
  setAzSort(prevCount => prevCount + 1)
  if(azSort===2){
    setAzSort(0)
  }
}

const sortirajDatum = () => {
  setAzSort(0)
  setPrioritySort(0)
  setDateSort(prevCount => prevCount + 1)
  if(dateSort===2){
    setDateSort(0)
  }
}

const sortirajPrioritet = () => {
  setDateSort(0)
  setAzSort(0)
  setPrioritySort(prevCount => prevCount + 1)
  if(prioritySort===2){
    setPrioritySort(0)
  }
}


  const params = useParams();
  useEffect(() => {
    let constraints = []
    let constraints2 = []
    let constraints3 = []
    switch (azSort){
      case 0: 
        constraints = [];        
        break;
      case 1:
        constraints.push(orderBy("naziv","asc"));
        break;
      case 2:
        constraints.push(orderBy("naziv","desc"));;
        break;
      
      default:
        constraints = [];        
        break;
    }

    switch (dateSort){
      case 0: 
        constraints2 = [];        
        break;
      case 1:
        constraints2.push(orderBy("createdAt","desc"));
        break;
      case 2:
        constraints2.push(orderBy("createdAt","asc"));;
        break;
      
      default:
        constraints2 = [];        
        break;
    }  

    switch (prioritySort){
      case 0: 
        constraints3 = [];        
        break;
      case 1:
        constraints3.push(orderBy("prioritet","desc"));
        break;
      case 2:
        constraints3.push(orderBy("prioritet","asc"));;
        break;
      
      default:
        constraints3 = [];        
        break;
    }  

      const q = query(collection(db, 'projekti',params.id,'taskovi'), ...constraints, ...constraints2, ...constraints3);
      

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let tasksLista = [];
        
        querySnapshot.forEach((doc) => {
          tasksLista.push({ ...doc.data(), id: doc.id });
        });
        setTasks(tasksLista);
        
        if(rezultatPretrage.length===0){
        const filteredTasks1 = tasksLista.filter((value) => {
          return value.status.includes('to do');
        });
        setFilter1(filteredTasks1)
        const filteredTasks2 = tasksLista.filter((value) => {
          return value.status.includes('in progress');
        });
        setFilter2(filteredTasks2)   
        const filteredTasks3 = tasksLista.filter((value) => {
          return value.status.includes('qa');
        }); 
        setFilter3(filteredTasks3) 
        const filteredTasks4 = tasksLista.filter((value) => {
          return value.status.includes('završen');
        }); 
        setFilter4(filteredTasks4)
      }else{
        const filteredTasks1 = rezultatPretrage.filter((value) => {
          return value.status.includes('to do');
        });
        setFilter1(filteredTasks1)
        const filteredTasks2 = rezultatPretrage.filter((value) => {
          return value.status.includes('in progress');
        });
        setFilter2(filteredTasks2)   
        const filteredTasks3 = rezultatPretrage.filter((value) => {
          return value.status.includes('qa');
        }); 
        setFilter3(filteredTasks3) 
        const filteredTasks4 = rezultatPretrage.filter((value) => {
          return value.status.includes('završen');
        }); 
        setFilter4(filteredTasks4)


      } 
      })
      let rez = ""
      const q2 = query(doc(db, "projekti", params.id))
      getDoc(q2).then((docSnapshot) =>{
        if(docSnapshot.exists()){
          rez = docSnapshot.data();
        }
        setProjectInfo(rez)

      }).catch((error) => {
        console.log('Error getting document:', error);
      });
      
  
    return () => {unsubscribe()};
      
  }, [params.id,azSort, dateSort, prioritySort, rezultatPretrage]);
  return(<>
    <section className="attendance">
      <div style={{flexWrap:"wrap"}} className="attendance-list">
          <div style={{width:"720px"}}>
          <div className="searchbar">
            {pretraga.length===0?<span className="icon"><BiSearchAlt color="white"/></span>:<span onClick={ponistiPretragu} className="icon"><MdClose color="white"/></span>}
            <input ref={inputRef} value={pretraga} onChange={handleFilter} required type="text" placeholder={`Pretraži korisnike...`}/>
        </div>     
          <button onClick={sortirajPrioritet} className={`new-button`}>
          {prioritySort===0 &&<RxCaretSort className='px' size={30}/>}
          {prioritySort===1 &&<BsSortDown className='px' size={30}/>}
          {prioritySort===2 &&<BsSortDownAlt className='px' size={30}/>}<p>Prioritet</p></button>
        <button onClick={sortirajAz} className={`new-button`}>
          {azSort===0 &&<RxCaretSort className='px' size={30}/>}
          {azSort===1 &&<BsSortAlphaDown className='px' size={30}/>}
          {azSort===2 &&<BsSortAlphaDownAlt className='px' size={30}/>}<p>Sortiraj</p></button>
        <button onClick={sortirajDatum} className={`new-button`}>
          {dateSort===0 &&<RxCaretSort className='px' size={30}/>}
          {dateSort===1 &&<BsSortNumericDownAlt className='px' size={30}/>}
          {dateSort===2 &&<BsSortNumericDown className='px' size={30}/>}<p>Datum</p></button>
          
        </div> 
        {(user.uid === projectInfo.kreator || user.uid===projectInfo.menadzer) && <button onClick={otvori} className='new-button'><BsClipboard2Plus className='px' size={30}/><p>Novi zadatak</p></button>}
     <div style={{flexBasis:"100%"}}></div>
      <div className={`projectDetails ${otvoriOpis?"otvori-opis":""}`}>
      
        <div className='levi'> 
          <h1 className='opis-naslov'>{otvoriOpis?(<div onClick={opisOtvori} className='otvarac'>
            <RiMenuFoldLine style={{marginRight:"5px"}} size={32}/>
            <span style={{fontSize:"14px", textTransform:"lowercase"}}>Manje</span>
            </div>):
            (<div className='otvarac' onClick={opisOtvori}>
              <RiMenuUnfoldLine style={{marginRight:"5px"}} size={32}/>
              <span style={{fontSize:"14px", textTransform:"lowercase"}}>detaljno</span>
              </div>)}
            <span className={otvoriOpis?"open":"colapsed"}>{projectInfo.naziv}</span>
          </h1>
          <h4>Kreator: {!loading &&(kreator.length>0 && kreator[0].username)} </h4>
          <h4>Menadžer: {!loading &&(currMngr.length>0 && currMngr[0].username)} </h4>
          <h4>Prioritet: {projectInfo.prioritet} </h4>
          <h4>Datum: {projectInfo.kreiran}</h4>
        </div>
        <div style={{width:"60%"}}>
          <h3 style={{padding:"30px 0"}}>Opis</h3>
          <p className='opisProj'>{projectInfo.opis}</p>
        </div>
      </div>
      </div>
      <br/>

    <div className='users'>
        <TaskLane setId={setId} setOverlayStat2={setOverlayStat2} tasks= {filter1} tip={"to do"} isMytask={"no"}/>
        <TaskLane setId={setId} setOverlayStat2={setOverlayStat2} tasks= {filter2} tip={"in progress"} isMytask={"no"}/>
        <TaskLane setId={setId} setOverlayStat2={setOverlayStat2} tasks= {filter3} tip={"QA"} isMytask={"no"}/>
        <TaskLane setId={setId} setOverlayStat2={setOverlayStat2} tasks= {filter4} tip={"završeni"} isMytask={"no"}/>
    </div>
    </section>
    {overlayStats && <TaskMaker overlayStats={overlayStats} setOverlayStat={setOverlayStat} projID={params.id}/>}
    {overlayStats2 && <TaskInfo  disabled = {false} projID={params.id} overlayStats3={overlayStats3} setOverlayStat3={setOverlayStat3} setOverlayStat2={setOverlayStat2} id={id} />}
   
  </>)
}

export default Tasks;