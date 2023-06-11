import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword
} from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { db } from '../firebase';
import { auth } from '../firebase';


const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const [photo, setPhoto] = useState(null);
  const [photoURL, setProfilnaSlika] = useState('');

  const navigate = useNavigate();

  
  /*const signIn = (email, password) =>  {
    return signInWithEmailAndPassword(auth, email, password)
  };*/

  const signIn = async () => {

    setEmailError('');
    setPassError('');

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/projekti')
    } catch (e) {
      switch (e.code){
            case "auth/invalid-email":
                setEmailError("Neispravan email");
                break;
            case "auth/user-not-found":
                setEmailError("Korisnik ne postoji");
              break;
            case "auth/wrong-password":
                setPassError("Pogrešna šifra");
              break;
            default:
                setEmailError('');
                setPassError('');
              break;
          }
      console.log(e.message)
    }
    setEmail('')
    setPassword('')
    setUsername('')   
  };




  const logout = () => {
    return signOut(auth)
  };
  
  const kreirajKorisnika = async(user) =>{

    if(user){await setDoc(doc(db, "users", user.uid),{
      username: user.displayName,
      email: user.email
    })}
  }

  const createUser = async () => {
   
    setEmailError('');
    setPassError('');
    setUsernameError('');
    if(username === ''){
      setUsernameError("Unesite validno korisničko ime")
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      switch (e.code){
        case "auth/email-already-in-use":
          setEmailError("Email je već zauzet");
          break;
        case "auth/invalid-email":
          setEmailError("Neispravan email");
          break;
        case "auth/requires-recent-login":
          setEmailError("Morate se ponovo prijaviti");
          break;
          
        default:
          setEmailError('');
          break;
      }
    console.log(e.message)
    }
    if(auth.currentUser){
      await updateProfile(auth.currentUser,{displayName:username}).catch(
        (err) => console.log(err)
      );
      navigate('/projekti')
    }
    kreirajKorisnika(auth.currentUser)
    setEmail('')
    setPassword('')
    setUsername('')   

  };

  const azurirajUsername = async () => {
    setEmailError('')
    setPassError('')
    setUsernameError('')

    const userRef = doc(db, 'users', user.uid);
    if(username!==""){

      await  updateProfile(auth.currentUser, { displayName: username}).catch(
          () => setUsernameError("Neispravno korisničko ime")
        );
        await  updateDoc(userRef, {
          username: username
        });  
       
    } else if(username===""){
      setUsernameError("Niste uneli korisničko ime");   
    }else{
      
    };
  
    setEmail('')
    setPassword('')
    setUsername('')   
  };

const azurirajEmail = async ()=>{
    setEmailError('')
    setPassError('')
    setUsernameError('')
  const userRef = doc(db, 'users', user.uid);
  if(email===""){
    setEmailError("Unesite validan email");
    return;
  }
  await updateEmail(auth.currentUser, email).catch(
    (e) =>{ 
      switch (e.code){
        case "auth/email-already-in-use":
          setEmailError("Email je već zauzet");
          break;
        case "auth/invalid-email":
          setEmailError("Neispravan email");
          break;
        default:
          setEmailError('');
          setPassError('');
          
          break;
      }
    }
  );
  if(emailError===''){
    await updateDoc(userRef, {
      email: email
    });  
  }else{

  }
  setEmail('')
  setPassword('')
  setUsername('')   
}

const azurirajPass = async ()=>{

  setEmailError('')
  setPassError('')
  setUsernameError('')

  if(password===""){
    setPassError("Unesite validnu šifru");
    return;
  }
  await updatePassword(auth.currentUser, password).catch(
    (err) => setPassError(err.message)
  );  
  setEmail('')
  setPassword('')
  setUsername('')   
}



  const storage = getStorage();

  const upload = async () => {
    const fileRef = ref(storage, auth.currentUser.uid + '.png');
    const userRef = doc(db, 'users', user.uid);
    await uploadBytes(fileRef, photo);
    const photoURL = await getDownloadURL(fileRef);
    setProfilnaSlika(photoURL)
    updateProfile(auth.currentUser, {photoURL});

    updateDoc(userRef, {
      photoURL:photoURL
    });  

  }





  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{azurirajUsername,azurirajEmail, azurirajPass, setProfilnaSlika, upload, photoURL, setPhoto, createUser, user, logout, signIn, emailError, passError, usernameError, setEmail, setPassword, setUsername, setEmailError, setPassError, setUsernameError, username,email, password }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
