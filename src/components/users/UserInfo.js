
import {BsXLg} from 'react-icons/bs'
import stock from '../../images/user.png'
const UserInfo = ({setOverlayStat, overlayValue})=>{


    const klikni = (e) => {
    
        if(e.target.classList.contains("dismiss")) {
            setOverlayStat(null)
        }
    }

    return(       
        <section className="overlay dismiss" onClick={klikni}>
            <div className="modul">
            <div className='dismiss close-button' onClick={klikni}><BsXLg className='dismiss' onClick={klikni} size={30}/></div>
            <br></br>
            <div className='user-info'>
                {overlayValue.photoURL?<img src={overlayValue.photoURL} alt='stock'/>:<img src={stock} alt='stock'/>}
                <p className='user-info-username'>{overlayValue.username}</p>
                <p className='user-info-email'>{overlayValue.email}</p>

                <p>Nalog kreiran: 22/22/2222</p>
                <p>Kreator projekata:</p>
                <p>Menadžer projekata:</p>
                <p>Broj zadataka:</p>
            </div>

            
            
            </div>
        </section>
    )
}

export default UserInfo