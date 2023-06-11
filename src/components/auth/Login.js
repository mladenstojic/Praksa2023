import { UserAuth } from '../../contexts/UserContext';
import { BsEnvelope,BsUnlock } from 'react-icons/bs' 

const Login = ({isLogin, handleLogreg})=>{

    const { signIn,
        setEmail,
        setPassword, 
        emailError,
        passError} = UserAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        signIn()
      };

    return(
        <>
            <div className={isLogin ? "form-box login active": "form-box login"}>
                <form onSubmit={handleSubmit}>
                    <h2>Sign In</h2>
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
                    
                    <button className="btn">Login In</button>
                    <div className="create-account">
                        <p>Create A New Account? <span className="logreg-link" onClick={handleLogreg}>Sign Up</span></p>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Login;