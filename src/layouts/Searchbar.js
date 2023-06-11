import { BiSearchAlt } from 'react-icons/bi'
import { Link } from 'react-router-dom';
import { MdClose }from 'react-icons/md'
import { useState, useRef} from 'react'
import "../css/Searchbar.css"
const Searchbar = ({tip, podaci, naziv})=>{

    
    const [pretraga, setPretraga]=useState('');
    const [rezultatPretrage, setRezultatPretrage] = useState([]);
    const inputRef = useRef();

    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setPretraga(searchWord);
        const newFilter = podaci.filter((value) => {
          return value[naziv].toLowerCase().includes(searchWord.toLowerCase());
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

    return(
        <>
        <div className="searchbar">
            {pretraga.length===0?<span className="icon"><BiSearchAlt color="white"/></span>:<span onClick={ponistiPretragu} className="icon"><MdClose color="white"/></span>}
            <input ref={inputRef} value={pretraga} onChange={handleFilter} required type="text" placeholder={`Pretraži ${tip}...`}/>
        </div>
        <div className={`results ${rezultatPretrage.length===1&& "size1 "}  ${rezultatPretrage.length===2&& "size2"} ${rezultatPretrage.length===3&& "size3"}  ${rezultatPretrage.length>3&& "size4"}`}>
        
            {rezultatPretrage.map((val, id)=>{
                    return <Link key={id} className='reset' to={'/projekat/'+val.id}><div  className='result'>
                        <p style={{fontSize:"14px"}}>{val[naziv]}</p>
                    </div></Link>
                  })
                } 
        </div>
        </>
    )
}

export default Searchbar