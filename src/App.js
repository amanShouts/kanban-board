import "./css/App.css"
import { Task } from './components/Task';
import { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { add } from "./redux/taskSlice"

function App() {
  const inputRef = useRef(null)

  let taskList = useSelector(store => store.task)
  let dispatch = useDispatch()

  function addTask() {
    // add Task component to the page 
    let taskName = inputRef.current.value
    console.log(taskName)
    let obj = {
      name: taskName,
      cards: []
    }
    dispatch(add(obj))
    inputRef.current.value = ""
  }

  return (
    <div className='main'>
      {
        taskList.length > 0 &&
        taskList.map((elem, index) => {
          return <Task key={index} name={elem.name} cards={elem.cards} />
        })
      }
      <div className="main_task_create">
        <input ref={inputRef} placeholder="Task Name" />
        <button onClick={addTask}>
          Add Task
        </button>
      </div>
    </div>
  );
}

export default App;
