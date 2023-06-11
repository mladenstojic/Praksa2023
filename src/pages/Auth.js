import {useState} from "react";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Logo from "../images/logo.png"
import '../css/Auth.css';
import { UserAuth } from "../contexts/UserContext";

function Auth() {
  const { 
    setEmailError,
    setPassError, 
    setUsernameError} = UserAuth();


    

  const [isLogin, setIsLogin] = useState(false);

  const handleLogreg = () => {
      setIsLogin((current) => !current);
      setEmailError("");
      setPassError("");
      setUsernameError("");
       
  };
  
    return (
    <>
      <div className="background"></div>
        <div className="container">
        <div className="item">
            <h2 className="txt"><i className='bx bxl-xing'></i>Praksa 2023</h2>
            <img className="logo" src={Logo} alt="logo-skole"/>
           
        </div>
        
        <div className="login-section">
            <Login isLogin ={isLogin} handleLogreg = {handleLogreg}/>
            <Register isLogin={isLogin} handleLogreg = {handleLogreg}/>
        </div>
    </div>
    </>
    );
  }
  
  export default Auth;




