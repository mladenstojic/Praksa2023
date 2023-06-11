import Prioritet from './Prioritet.js';
import userimage from "../../images/user.png";

const TItem = ({val, filteredArray}) =>{
    console.log(filteredArray)
    return (
    <div className='card type2' >
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

export default TItem