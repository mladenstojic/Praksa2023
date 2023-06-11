
import Auth from './pages/Auth';
import MyTasks from './pages/MyTasks';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import NotFound from './pages/NotFound';
import IsLogin from './validation/IsLogin';
import { AuthContextProvider } from './contexts/UserContext';
import { UsersListContextProvider } from './contexts/UsersContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';

function App() {


  return (
    <Router>
      <AuthContextProvider>
      <UsersListContextProvider>
      <Routes>
        <Route path='/' element={<Auth/>}/>
        <Route path='/moji-taskovi/:uid' element={<IsLogin><MyTasks/></IsLogin>}/>
        <Route path='/profil' element={<IsLogin><Profile/></IsLogin>}/>
        <Route path='/projekti' element={<IsLogin><Projects/></IsLogin>}/>
        <Route path='/korisnici' element={<IsLogin><Users/></IsLogin>}/>
        <Route path='*' element={<IsLogin><NotFound/></IsLogin>}/>
        <Route path='/projekat/:id' element={<IsLogin><Tasks/></IsLogin>}/>
      </Routes>     
      </UsersListContextProvider>
      </AuthContextProvider>
     
    </Router>
  );
}

export default App;
