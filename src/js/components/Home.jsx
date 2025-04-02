import React, { useEffect, useState } from 'react'

const API_URL_BASE = "https://playground.4geeks.com/todo/todos/{todo_id}";

const Home = () => {
	const [todos, setTodos] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [hoveredIndex, setHoveredIndex] = useState(null);

	const getTodos = async () => {
		try {
			const response = await fetch("https://playground.4geeks.com/todo/users/bermont134geeks", {
				method: "GET"
			});
			
			if (!response.ok) {
				if (response.status == 404){
					createUser()
				}
				throw new Error("Sucedió un error al consultar el endpoint.");
			}
	
			const data = await response.json();
			console.log("Tareas obtenidas:", data.todos);
			setTodos(data.todos); // Asegura que accedes correctamente a la lista de tareas
		} catch (error) {
			console.error("Error al consultar el endpoint:", error);
		}
	};
	
	const createUser = async () => {
		const response = await fetch(`https://playground.4geeks.com/todo/users/bermont134geeks`, {
			method: "POST",
			
		});

		if (!response.ok) {
			throw new Error("Ocurrió un error al crear el usuario")
		}
	}

	const createTodo = async () => {
		if (inputValue.trim() === "") return; // Evita tareas vacías

		try {
			const task = { label: inputValue, is_done: false };

			const response = await fetch(`https://playground.4geeks.com/todo/todos/bermont134geeks`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(task)
			});

			if (!response.ok) {
				throw new Error("Ocurrió un error al crear la tarea.");
			}

			setInputValue(""); // Limpia el input después de agregar
			getTodos(); //  Recarga la lista de tareas después de agregar
		} catch (error) {
			console.log(error);
		}
	};


	const deleteTodo = async (todo_id) => {
		try {
			console.log("Eliminando tarea con ID:", todo_id); //  Debugging

			if (!todo_id) {
				throw new Error("El ID de la tarea es inválido.");
			}

			const response = await fetch(`https://playground.4geeks.com/todo/todos/${todo_id}`, {
				method: "DELETE"
			});

			if (!response.ok) {
				throw new Error(`Error eliminando la tarea con ID: ${todo_id}`);
			}

			getTodos(); //  Recargar la lista después de eliminar
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		getTodos();
	}, []);

	return (
		<div className="container">
			<div className="row">
				<div className="col">
					<h2>Lista de tareas</h2>
					<input
						type="text"
						className="form-control"
						placeholder="Escribe tu tarea..."
						value={inputValue}
						onChange={(event) => setInputValue(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								console.log("Agregando tarea...");
								createTodo();
							}
						}}
					/>
				</div>
			</div>
	
			<div className="row">
				<div className="col">
					<ul>
						{todos.map((todo, index) => (
							<div key={todo.id} className="d-flex justify-content-between align-items-center"
								onMouseOver={() => setHoveredIndex(index)}
								onMouseOut={() => setHoveredIndex(null)}
							>
								<li>{todo.label}</li>
								{hoveredIndex === index && (
									<span
										onClick={() => deleteTodo(todo.id)}
										style={{ cursor: "pointer", color: "red", marginLeft: "10px" }}
									>
										🗑️
									</span>
								)}
							</div>
						))}
					</ul>
				</div>
			</div>
	
			{/* 🔹 Contador de tareas (ESTRUCTURA CORRECTA) */}
			<div className="row mt-3">
				<div className="col text-center">
					<p style={{ fontWeight: "bold", fontSize: "18px" }}>
						Total de tareas: {todos.length}
					</p>
				</div>
			</div>
		</div>
	);
	
}

export default Home