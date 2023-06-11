import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import {query, collection, onSnapshot} from 'firebase/firestore';

  
const UsersContext = createContext();

export const UsersListContextProvider = ({ children }) => {



    const [userList, setUserList] = useState('')
    useEffect(() => {
        const q = query(collection(db, 'users'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let usersArr = [];
            querySnapshot.forEach((doc) => {
                usersArr.push({ ...doc.data(), id: doc.id });
            });
            setUserList(usersArr);
        });
        
        console.log('asdf')
        console.log(userList)
        return () => unsubscribe();
        
    }, []);
    console.log(userList)
  return (
    <UsersContext.Provider value={{ userList }}>
      {children}
    </UsersContext.Provider>
  );
};

export const UsersList = () => {
  return useContext(UsersContext);
};
