import React, {useState, useEffect} from "react";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "./api";
import {Dialog} from './components/dialog.js';

const totoInputItems = [
    { name: "title", type: "text", label: "Title:" },
    { name: "due_date", type: "datetime-local", label: "Due Date"},
]

const App = () => {
    const [todos, setTodos] = useState([]);
    const [openedTodo, setOpenedTodo] = useState(null);

    const getTodos = async () => {
        console.log("getting todos");
        try{
            const res = await fetchTodos();
            setTodos(res.data);
            console.log("todos", res.data);
        } catch (e){
            console.error("error fetching todos", e);
        }
    }
    
    useEffect(() => {
        getTodos();
    }, []);

    //TABLE STYLING
    const allTableElementStyles = {
        border: '1px solid black',
        borderCollapse: 'collapse',
    }

    const tableStyles = {
        width: '100%',
    }

    const headerRowStyles = {
        // backgroundColor: 'white',
    }

    const trStyles = {
        backgroundColor: 'white',
    }

    const trEvenStyles = {
        backgroundColor: 'lightgrey',
    }

    const tdStyles = {
        
    }

    return (
        <div style={{ padding: '2rem' }}>
            {/* <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = Object.fromEntries(new FormData(e.target).entries());
                await addTodo(formData.title, formData.due_date);
                await getTodos();
                e.target.reset();
            }}>
                <input type="text" name="title"></input>
                <input type="datetime-local" name="due_date"></input>
                <button type="submit">SUBMIT</button>
            </form> */}
            <button onClick={() => setOpenedTodo(-1)}>ADD TODO</button>
          <center><h1>My Todo List</h1></center>
          <table style={{...allTableElementStyles, ...tableStyles, ...headerRowStyles}}>
            <tr style={{...allTableElementStyles, ...trStyles}}>
                <th style={{...allTableElementStyles, ...tdStyles}}>
                    TITLE
                </th>
                <th style={{...allTableElementStyles, ...tdStyles}}>
                    DUE DATE
                </th>
                <th style={{...allTableElementStyles, ...tdStyles}}>
                    EDIT
                </th>
                <th>
                    MARK DONE
                </th>
            </tr>
            {todos.map((todo, i) => (
              <tr 
                key={todo.id} 
                style={{...allTableElementStyles, ...(i%2==0 ? trEvenStyles : trStyles)}}>
                {/* TITLE */}
                <td style={{...allTableElementStyles, ...tdStyles}}>
                    {todo.title}
                </td>

                {/* DUE DATE */}
                <td style={{...allTableElementStyles, ...tdStyles}}>
                    {todo.due_date==null ? "Not Provided" : 
                        new Date(todo.due_date).toLocaleString('en-US', { 
                            dateStyle: 'long', 
                            timeStyle: 'short', 
                        })
                    }
                </td>

                {/* EDIT */}
                <td style={{...allTableElementStyles, ...tdStyles}}>
                    <button onClick={() => setOpenedTodo(openedTodo==null ? todo.id : null)}>EDIT</button>
                </td>

                {/* MARK DONE */}
                <td style={{...allTableElementStyles, ...tdStyles}}>
                    <button onClick={async () => {
                        await deleteTodo(todo.id);
                        await getTodos();
                    }}>MARK AS DONE</button>
                </td>
              </tr>
            ))}
          </table>
            {openedTodo==-1 && 
                <Dialog 
                    setShow={setOpenedTodo} 
                    title={"ADD TODO"}
                    params={totoInputItems}
                    onSubmit={async (data) => {
                        console.log("added submit")
                        await addTodo(data);
                        await getTodos();
                    }}
                />
            }

            {(openedTodo!=null && openedTodo>=0) && 
                <Dialog 
                    todo={todos.find(todo => todo.id==openedTodo)}
                    setShow={setOpenedTodo} 
                    title={"UPDATE"}
                    params={totoInputItems}
                    onSubmit={async (data) => {
                        console.log("update submit")
                        await updateTodo(openedTodo, data);
                        await getTodos();
                    }}
                />}
        </div>
      );
}

export default App;