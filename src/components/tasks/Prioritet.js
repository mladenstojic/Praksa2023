import {BsChevronDoubleDown, BsChevronDown,BsDashLg,BsChevronUp,BsChevronDoubleUp} from  "react-icons/bs";

function Prioritet ({val}){

    switch (val){
        case "1":
            return (
                <div className="prioritet p-c1">
                   <h5>veoma  nizak</h5> <BsChevronDoubleDown size={24} />
                </div>
            );
        case "2":
            return (
                <div className="prioritet p-c2">
                    <h5>nizak </h5><BsChevronDown size={24}/>
                </div>
            );
        case "3":
            return (
                <div className="prioritet p-c3">
                    <h5>srednji </h5><BsDashLg size={24}/>
                </div>
            );
        case "4": 
            return (
                <div className="prioritet p-c4">
                    <h5>visok </h5><BsChevronUp size={24}/>
                </div>
            );  
        case "5":
            return (
                <div className="prioritet p-c5">
                    <h5>veoma visok </h5><BsChevronDoubleUp size={24}/>
                </div>
            );       
        default:
          return (<></>);
    }
}
export default Prioritet;