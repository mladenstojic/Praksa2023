import {useRef,useState, useEffect} from 'react'
import { useParams } from 'react-router';
import {BiSearchAlt} from 'react-icons/bi'
import { MdClose } from 'react-icons/md';
import {query, where,collectionGroup, onSnapshot } from "firebase/firestore";
import TaskLane from '../components/tasks/TaskLane';
import { db } from '../firebase';
import TaskInfo from '../components/tasks/TaskInfo';
const MyTasks = () => {
    const params = useParams();

    const [tasks, setTasks] = useState([])
    const [pretraga, setPretraga]=useState('');
    const [filter1, setFilter1] = useState([])
    const [filter2, setFilter2] = useState([])
    const [filter3, setFilter3] = useState([])
    const [filter4, setFilter4] = useState([])
    const [id, setId] = useState()
    const [projID, setProjID]= useState('')

    const [overlayStats2, setOverlayStat2] = useState(false)
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
      const subcollectionName = "rade";
      const uidValue = params.uid;
      let niz = []
      const queryRef = query(
        collectionGroup(db, subcollectionName),
        where("uid", "==", uidValue)
      );
    
      const unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
        const tasksPromises = querySnapshot.docs.map(async (doc) => {
          const taskoviDocRef = doc.ref.parent.parent;
          const projektiDocRef = doc.ref.parent.parent.parent.parent;
          
          const taskoviUnsubscribe = onSnapshot(taskoviDocRef, (taskoviDocSnapshot) => {
            const taskData = taskoviDocSnapshot.data();
            const taskDataWithIds = {
              id: taskoviDocSnapshot.id,
              projID: projektiDocRef.id,
              ...taskData
            };
           setTasks(niz)
               
          
          if (niz.some(obj => obj.id === taskDataWithIds.id)) {
            const newArray = niz.filter(obj => obj.id !== taskDataWithIds.id );
            niz = newArray
            niz.push({ ...taskDataWithIds});
            console.log(niz)
          } else {
            niz.push({ ...taskDataWithIds});
          }

           if(rezultatPretrage.length===0){
            const filteredTasks1 = niz.filter((value) => {
              return value.status.includes('to do');
            });
            setFilter1(filteredTasks1)
            const filteredTasks2 = niz.filter((value) => {
              return value.status.includes('in progress');
            });
            setFilter2(filteredTasks2)   
            const filteredTasks3 = niz.filter((value) => {
              return value.status.includes('qa');
            }); 
            setFilter3(filteredTasks3) 
            const filteredTasks4 = niz.filter((value) => {
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
  
          });
    
          return () => {
            if (taskoviUnsubscribe) {
              taskoviUnsubscribe();
            }
          };
        });
    
        Promise.all(tasksPromises).then((unsubscribeFunctions) => {
          return () => {
            unsubscribeFunctions.forEach((unsubscribeFunction) => {
              unsubscribeFunction();
            });
          };
        });
      });
    
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }, [params.uid, rezultatPretrage]);





    return(<>
    <section className="attendance">
    <div className="attendance-list">
        <div className="searchbar">
            {pretraga.length===0?<span className="icon"><BiSearchAlt color="white"/></span>:<span onClick={ponistiPretragu} className="icon"><MdClose color="white"/></span>}
            <input ref={inputRef} value={pretraga} onChange={handleFilter} required type="text" placeholder={`Pretraži korisnike...`}/>
        </div>
    </div>
    <br/>
    <div className='users'>
        <TaskLane setProjID={setProjID} setId={setId} setOverlayStat2={setOverlayStat2} tasks= {filter1} tip={"to do"} isMytask={"yes"}/>
        <TaskLane setProjID={setProjID} setId={setId} setOverlayStat2={setOverlayStat2} tasks= {filter2} tip={"in progress"} isMytask={"yes"}/>
        <TaskLane setProjID={setProjID} setId={setId} setOverlayStat2={setOverlayStat2} tasks= {filter3} tip={"QA"} isMytask={"yes"}/>
        <TaskLane setProjID={setProjID} setId={setId} setOverlayStat2={setOverlayStat2} tasks= {filter4} tip={"završeni"} isMytask={"yes"}/>
    </div>
    </section>
    {overlayStats2 && <TaskInfo disabled ={true}  projID={projID}  setOverlayStat2={setOverlayStat2} id={id} />}
    </>)
}

export default MyTasks;