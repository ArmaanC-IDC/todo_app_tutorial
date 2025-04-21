import axios from "axios";

const API = axios.create({
    baseURL: 'http://localhost:5000/api'
});

export const fetchTodos = () => API.get('/todos');

export const addTodo = (title) => API.post('/todos', {title});

export const updateTodo = (id, title) => API.post('/todos/update', {id, title});