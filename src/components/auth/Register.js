
import { UserAuth } from '../../contexts/UserContext';
import { BsEnvelope,BsUnlock, BsPerson } from 'react-icons/bs' 

const Register = ({isLogin, handleLogreg})=>{


    const { createUser,
            setEmail,
            setPassword,
            setUsername, 
            emailError,
            passError,
            usernameError } = UserAuth();


    const handleSubmit = (e) => {
        e.preventDefault();
        createUser();
      };

    return(
        <>
            <div className={isLogin ? "form-box register active" : "form-box register"}>
                <form  onSubmit={handleSubmit}>

                    <h2>Sign Up</h2>

                    <div className="input-box">
                        <span className="icon"><BsPerson/></span>
                        <input placeholder=' ' type="text" onChange={(e) => setUsername(e.target.value)}/>
                        <p className="errorMsg">{usernameError}</p>
                        <label >Username</label>
                    </div>
                    <div className="input-box">
                        <span className="icon"><BsEnvelope/></span>
                        <input placeholder=' ' type="text" onChange={(e) => setEmail(e.target.value)}/>
                        <p className="errorMsg">{emailError}</p>
                        <label >Email</label>
                    </div>
                    <div className="input-box">
                        <span className="icon"><BsUnlock/></span>
                        <input placeholder=' ' type="password" onChange={(e) => setPassword(e.target.value)}/>
                        <p className="errorMsg">{passError}</p>
                        <label>Password</label>
                    </div>
                   
                    <button className="btn">Sign Up</button>
                    <div className="create-account">
                        <p>Already Have An Account? <span className="logreg-link" onClick={handleLogreg}>Sign In</span></p>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Register;