import { useState, useEffect, useRef } from "react";
import {IoMdArrowDropdown, IoMdArrowDropup} from "react-icons/io";

const Dropdown = ({labela, lista, pocetna, referenca}) =>{
    const [isActive, setIsActive] = useState(false);
    const [izbor, setIzbor] = useState(pocetna);

    const ref = useRef();
    const prikazi = () => {
    setIsActive((current) => !current);
    };

    const zatvoriIzvan = (e) => {
        if (!ref.current.contains(e.target)) {
          setIsActive(false);
        }
    };

    const handleChange = (text) => {
        setIzbor(text);  
      };



    useEffect(() => {
        document.addEventListener("mousedown", zatvoriIzvan);
    
        return () => document.removeEventListener("mousedown", zatvoriIzvan);
    }, []);
    return (
    <>
    <label>{labela}:</label> 
    <div  ref={ref} className='padajucimeni-cont' onClick={prikazi}>
        <div className='izabran'><span id={izbor.id} ref={referenca}>{izbor.username}</span> {isActive?<IoMdArrowDropup style={{float:"right", height:"28px", marginRight:"5px"}}/>:<IoMdArrowDropdown style={{float:"right", height:"28px", marginRight:"5px"}}/>}
            <div className="opcije-holde" style={{display: isActive ? "block" : "none"}}>
                {lista.map((val)=>{
                    return <div key={val.id} onClick={() => handleChange(val)} className='opcije'>{val.username}</div>
                  })
                }
            </div>
        </div>
    </div>   
    </>)
}

export default Dropdown;