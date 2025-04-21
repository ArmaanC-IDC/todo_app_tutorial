import React, {useState, useEffect} from "react";
import { fetchTodos } from "./api";

const App = () => {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
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
        getTodos();
    }, []);

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
            <button>ADD TODO</button>
          <center><h1>My Todo List</h1></center>
          <table style={{...allTableElementStyles, ...tableStyles, ...headerRowStyles}}>
            <tr style={{...allTableElementStyles, ...trStyles}}>
                <th style={{...allTableElementStyles, ...tdStyles}}>
                    TITLE
                </th>
                <th style={{...allTableElementStyles, ...tdStyles}}>
                    
                </th>
                <th>

                </th>
            </tr>
            {todos.map((todo, i) => (
              <tr 
                key={todo.id} 
                style={{...allTableElementStyles, ...(i%2==0 ? trEvenStyles : trStyles)}}>
                <td style={{...allTableElementStyles, ...tdStyles}}>
                    {todo.title}
                </td>
                <td style={{...allTableElementStyles, ...tdStyles}}>
                    <button>EDIT</button>
                </td>
                <td style={{...allTableElementStyles, ...tdStyles}}>
                    <button>MARK AS DONE</button>
                </td>
              </tr>
            ))}
          </table>
        </div>
      );
}

export default App;