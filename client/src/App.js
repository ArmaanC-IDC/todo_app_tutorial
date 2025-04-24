import React, {useState, useEffect} from "react";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "./api";
import {Dialog} from './components/dialog.js';

const COLORS = {
  CARD: "#FFFFFF",

  BUTTON_TEXT: "#333333",
  HEADER: "#000000",

  BG1: "#FFFFFF",
  BG2: "lightgrey",

  PRIMARY: "#FE7743",
  NEUTRAL: "#000000"
};

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif",
  },
  container: {
    display: 'inline-block',
    padding: '1vh 1vw',
    margin: '3vh 3vw',
    boxShadow: '0 0px 50px rgba(0, 0, 0, 0.42)',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  buttonPrimary: {
    backgroundColor: COLORS.PRIMARY,
    border: "0px",
    borderRadius: "15px",
    fontWeight: 'bold',
    color: 'white',
    padding: '1.5vh 1vw',
    textAlign: 'center',
    cursor: 'pointer',
  },
  buttonSecondary: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    border: "2px solid " + COLORS.PRIMARY,
    borderRadius: "15px",
    fontWeight: 'bold',
    color: COLORS.BUTTON_TEXT,
    padding: '0.5vw 1vw',
    textAlign: 'center',
    cursor: 'pointer',
  },
  header: {
    color: COLORS.HEADER,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    fontSize: '14px',
    textAlign: 'left',
  },
  tableRowOdd: {
    backgroundColor: COLORS.ROW_ODD,
  },
  tableRowEven: {
    backgroundColor: COLORS.ROW_EVEN,
  },
  cellHeader: {
    borderBottom: `2px solid ${COLORS.NEUTRAL}`,
    padding: '12px 16px',
    verticalAlign: 'middle',
    fontWeight: '800',
  },
  cell: {
    borderBottom: `1px solid ${COLORS.NEUTRAL}`,
    padding: '12px 16px',
    verticalAlign: 'middle',
  },
};

const todoInputItems = [
  { name: "title", type: "text", label: "Title:" },
  { name: "due_date", type: "datetime-local", label: "Due Date"},
  { name: "priority", type: "range", label: "Priority", min: "0", max: "10"}
];

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
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* ADD TODO BUTTON */}
        <div style={styles.topBar}>
          <button style={styles.buttonPrimary} onClick={() => setOpenedTodo(-1)}>+ ADD TODO</button>
        </div>

        {/* HEADER */}
        <center><h1 style={styles.header}>Todo List</h1></center>

        {/* TODO DISPLAY TABLE */}
        <table style={{...styles.table, ...styles.tableHeaderRow}}>
          <thead>
            <tr>
                <td style={styles.cellHeader}>TITLE</td>
                <td style={styles.cellHeader}>DUE DATE</td>
                <td style={styles.cellHeader}>PRIORITY</td>
                <td style={styles.cellHeader}>EDIT</td>
                <td style={styles.cellHeader}>DONE ✅</td>
            </tr>
          </thead>
          <tbody>
            {todos.sort((a, b) => {
                return b.priority - a.priority;
            }).map((todo, i) => (
              <tr 
                key={todo.id} 
                style={i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
              >
                <td style={styles.cell}>{todo.title}</td>
                <td style={styles.cell}>
                  {todo.due_date == null 
                    ? "Not Provided" 
                    : new Date(todo.due_date).toLocaleString('en-US', { 
                        dateStyle: 'long', 
                        timeStyle: 'short', 
                      })
                  }
                </td>
                <td style={styles.cell}>{todo.priority}</td>
                <td style={styles.cell}>
                  <button style={styles.buttonSecondary} onClick={() => setOpenedTodo(openedTodo == null ? todo.id : null)}>
                    EDIT
                  </button>
                </td>
                <td style={styles.cell}>
                  <button style={styles.buttonSecondary}
                    onClick={async () => {
                    await deleteTodo(todo.id);
                    await getTodos();
                  }}>
                    ✅ DONE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ADD TODO DIALOG */}
        {openedTodo === -1 && 
          <Dialog 
            setShow={setOpenedTodo} 
            title={"ADD TODO"}
            params={todoInputItems}
            onSubmit={async (data) => {
              console.log("added submit");
              await addTodo(data);
              await getTodos();
            }}
          />
        }

        {/* UPDATE TODO DIALOG */}
        {(openedTodo != null && openedTodo >= 0) && 
          <Dialog 
            todo={todos.find(todo => todo.id === openedTodo)}
            setShow={setOpenedTodo} 
            title={"UPDATE"}
            params={todoInputItems}
            onSubmit={async (data) => {
              console.log("update submit");
              await updateTodo(openedTodo, data);
              await getTodos();
            }}
          />
        }
      </div>
    </div>
  );
};

export default App;