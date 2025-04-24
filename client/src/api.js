import axios from "axios";

const API = axios.create({
    baseURL: 'http://localhost:5000/api'
});

export const fetchTodos = async () => await API.get('/todos');

export const addTodo = async (data) => await API.post('/todos', data);

export const updateTodo = async (id, data) => await API.post('/todos/update', {id, ...data});

export const deleteTodo = async (id) => await API.delete('/todos/delete', {data: {id}});