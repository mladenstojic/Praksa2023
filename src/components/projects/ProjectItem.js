import { Link } from "react-router-dom";
import { UsersList } from "../../contexts/UsersContext";
import { UserAuth } from "../../contexts/UserContext";
function ProjekatItem ({val, setOverlayStat,setOverlayValue}){
    const {userList} = UsersList();

    const{user}=UserAuth()
    const usernames = userList.map(({id, username}) => ({id, username}));
    const currMngr = usernames.filter((value) => {
        return value.id.includes(val.menadzer);
    });

    const kreator = usernames.filter((value) => {
        return value.id.includes(val.kreator);
    });
    const otvori = ()=>{
        setOverlayValue(val);
        setOverlayStat('1');
    }

    let prioritet1=""
    
    switch (val.prioritet){
        case "1":
        prioritet1 = "veoma visok";        
            break;
        case "2": 
        prioritet1 = "visok"
          break;
        case "3": 
            prioritet1 = "srednji"
          break;
        case "4":
            prioritet1 = "nizak" 
            break;
        case "5": 
            prioritet1 = "veoma nizak"
            break;
        default:
            prioritet1 = "";        
          break;
      }  

    return (
            <>
            <tr>
                <td><Link className="width-0" to={'/projekat/'+val.id}>{val.naziv}</Link></td>
                <td ><div className="opis">{val.opis}</div></td>
                <td>{val.kreiran}</td>
                <td>{kreator[0].username}</td>
                <td>{currMngr[0].username}</td>
                <td className="prioritet"><div className={"bouble " + prioritet1}>{prioritet1}</div></td>
                <td style={{width:"110px"}}>
                   {(val.menadzer===user.uid || val.kreator===user.uid) &&
                    <div onClick={otvori} className="edit-btn">Izmeni</div>}
                </td>
            </tr>
            </>
            
        
    )
}
export default ProjekatItem;