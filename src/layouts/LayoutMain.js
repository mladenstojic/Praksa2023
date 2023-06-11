
import Nav from "../components/navigation/Nav"
import { useLocation } from 'react-router-dom';
import '../css/MainLayout.css'

const LayoutMain = ({children})=>{
    const location = useLocation();
    const isDefaultRoute = location.pathname === '/';

    return !isDefaultRoute && <div className="kontejner">
        <Nav/>
        <section className="main">           
            {children}
        </section>
    </div>
        
}
export default LayoutMain