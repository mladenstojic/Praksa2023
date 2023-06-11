
import TaskItem from './TaskItem';
import '../../css/Tasks.css'
const TaskLane = ({tasks, tip,setId, setOverlayStat2, setProjID}) =>{



    

    return (
        <div className="card">
            
            <h4>{tip}</h4>
            {tasks && tasks.map((val, id)=>{
             return   <TaskItem setProjID={setProjID} key={id} val={val} setOverlayStat2={setOverlayStat2} setId={setId}/>
            })}
            
            
        </div>
    )
}
export default TaskLane;