import { useState, useEffect } from "react";
import { db } from "../firebase";
import Searchbar from "../layouts/Searchbar";
import { AiOutlinePlus } from 'react-icons/ai';
import {RxCaretSort} from 'react-icons/rx'
import {BsFunnel, BsSortAlphaDownAlt, BsSortAlphaDown, BsSortNumericDownAlt, BsSortNumericDown, BsSortDown, BsSortDownAlt}from 'react-icons/bs'
import ProjekatItem from "../components/projects/ProjectItem";
import NewProject from "../components/projects/NewProject";
import { UserAuth } from "../contexts/UserContext";

import {query,
    collection,
    onSnapshot,
    orderBy
  } from 'firebase/firestore';

import "../css/Projects.css"

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [overlayStats, setOverlayStat] = useState(null);
  const [overlayValue, setOverlayValue] = useState('');
  const [filter, setFilter] = useState(false);
  const [filterres, setFilterRes] = useState([])
  const [azSort, setAzSort] = useState(0)
  const [dateSort, setDateSort] = useState(0)
  const [prioritySort, setPrioritySort] = useState(0)

  const{user} = UserAuth()

  
  const filtriraj = () => {
    setFilter((current) => !current);
    handleFilter()
  }


  const sortirajAz = () => {
    setDateSort(0)
    setPrioritySort(0)
    setAzSort(prevCount => prevCount + 1)
    if(azSort===2){
      setAzSort(0)
    }
    if(filter===true){
      setFilter(false)
    }
  }

  const sortirajDatum = () => {
    setAzSort(0)
    setPrioritySort(0)
    setDateSort(prevCount => prevCount + 1)
    if(dateSort===2){
      setDateSort(0)
    }
    if(filter===true){
      setFilter(false)
    }
  }

  const sortirajPrioritet = () => {
    setDateSort(0)
    setAzSort(0)
    setPrioritySort(prevCount => prevCount + 1)
    if(prioritySort===2){
      setPrioritySort(0)
    }
    if(filter===true){
      setFilter(false)

    }
  }





  const otvori = () =>{
      setOverlayStat('otvoren');
  }

  const handleFilter = () => {
    const newFilter = projects.filter((value) => {
      return value.kreator.includes(user.uid) || value.menadzer.includes(user.uid);
    });
    setFilterRes(newFilter)
};
 

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
  
      let q = query(collection(db, 'projekti'), ...constraints, ...constraints2, ...constraints3);
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let listaProj = [];
        querySnapshot.forEach((doc) => {
          listaProj.push({ ...doc.data(), id: doc.id });
        });
        setProjects(listaProj);
      });
    return () => unsubscribe();
      
  }, [azSort, dateSort, prioritySort]);

  return(<><section className="attendance">
      <div className="attendance-list"><div style={{width:"870px"}}>
          <Searchbar tip={"projekte"} podaci={projects} naziv={"naziv"}></Searchbar>
        <button onClick={filtriraj} className={`new-button ${filter?"filter":""}`}><BsFunnel className='px' size={30}/><p>Moji projekti</p></button>
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

        <button onClick={otvori} className='new-button'><AiOutlinePlus className='px' size={30}/><p>Novi projekat</p></button>
      </div>
      <br/>
      <div className="attendance-list" style={{background: "rgba(255, 255, 255, 0.4)", borderRadius: "0px"}}>
          <table className="table">
              <thead>
              <tr>
                  <th style={{textAlign:"left"}}>Naziv:</th>
                  <th style={{textAlign:"left"}}>Opis projekta:</th>
                  <th>Kreirano:</th>
                  <th>Kreator:</th>
                  <th>Menadzer:</th>
                  <th>Prioritet:</th>
                  <th></th>
              </tr>
              </thead>
              <tbody>
                {filter?filterres.map((val, id)=>{
                    return <ProjekatItem key={id} val = {val}  setOverlayStat={setOverlayStat} setOverlayValue={setOverlayValue}/>
                  }):projects.map((val, id)=>{
                    return <ProjekatItem key={id} val = {val}  setOverlayStat={setOverlayStat} setOverlayValue={setOverlayValue}/>
                  })
                }
              </tbody>
          </table>
      </div>
  </section>
  {overlayStats && <NewProject setFilter={setFilter} overlayStats={overlayStats} setOverlayStat={setOverlayStat} overlayValue={overlayValue} setOverlayValue={setOverlayValue}/>}
  </>
  )
}


export default Projects;