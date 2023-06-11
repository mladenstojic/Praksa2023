import { BsEnvelope,BsUnlock, BsPerson } from 'react-icons/bs'
import { UserAuth } from '../contexts/UserContext';
import { useEffect } from 'react';
import stock from '../images/user.png';
const Profile = () => {

    const { azurirajUsername,
            azurirajEmail,
            azurirajPass ,
            user,
            username,
            email,
            password,
            setEmail,
            setPassword,
            setUsername, 
            emailError,
            passError,
            usernameError,
            setPhoto,
            upload,
            setProfilnaSlika,
            photoURL
         } = UserAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        azurirajUsername();
    }; 
    
    const handleSubmit2 = (e) => {
        e.preventDefault();
        azurirajEmail();
    };  

    const handleSubmit3 = (e) => {
        e.preventDefault();
        azurirajPass();
    };  

    function handleChange(e) {
        if (e.target.files[0]) {
            setPhoto(e.target.files[0])
        }
    }

    function handleClick(e) {
        e.preventDefault()
        upload();
    }
  

    useEffect(() => {
        if (user?.photoURL) {
          setProfilnaSlika(user.photoURL);
        }
  
      }, [user])


    return(<>
        
        <div className="container">
        <div className="item">
            <div className="profile">
            <form className="">
                {user.photoURL?<img src={photoURL} className="profilepic" alt='profpic'/>:<img src={stock} className="profilepic" alt='stock'/>}
                <h2><input type="file" onChange={handleChange} /></h2>
                <button onClick={handleClick} className="btn">Promeni sliku</button>
            </form>
            </div>   
        </div>
        
        <div className="login-section">
            <div className="form-box register active">
                <div>
                <form onSubmit={handleSubmit} className="">
                    <h2>Profil</h2>
                    <div className="input-box">
                        <span className="icon"><button className='edit'><div className='edit-text-box'>Ažuriraj</div><div><BsPerson fontSize={"24px"}/></div></button></span>
                        <input placeholder=' ' value={username} onChange={(e) => setUsername(e.target.value)} type="text"/>
                        <p className="errorMsg">{usernameError}</p>
                        <label>{user.displayName}</label>
                    </div>
                </form>
                <form onSubmit={handleSubmit2}>
                    <div className="input-box">
                        <span className="icon"><button className='edit'><div className='edit-text-box'>Ažuriraj</div><BsEnvelope  fontSize={"24px"}/></button></span>
                        <input placeholder=' ' value={email} onChange={(e) => setEmail(e.target.value)} type="text"/>
                        <p className="errorMsg">{emailError}</p>
                        <label>{user.email}</label>
                    </div>
                </form>
                <form onSubmit={handleSubmit3}>
                    <div className="input-box">
                        <span className="icon"><button className='edit'><div className='edit-text-box'>Ažuriraj</div><BsUnlock fontSize={"24px"}/></button></span>
                        <input placeholder=' ' value={password} onChange={(e) => setPassword(e.target.value)} type="password"/>
                        <p className="errorMsg">{passError}</p>
                        <p className='errorMsg'></p>
                        <label>Password</label>
                    </div>
                </form>
                </div>
            </div>
        </div>
    </div>
    </>)
}

export default Profile;