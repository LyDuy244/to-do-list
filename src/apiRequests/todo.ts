import {ToDoType} from "@/app/todo/page";

const todoApiRequest = {
    list: async () => {
        try {
            const data = await fetch("/api/todos", {
                method: "GET",
            })
            const response = await data.json()
            return response.data;
        }catch (error){
            console.error(error)
        }
    },
    add:  async (name: string) => {
        const response = await fetch("/api/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to add todo');
        }

        return response.json(); // Giả sử bạn muốn trả về JSON từ server
    },
    edit: async ({todo, name}:{todo: ToDoType, name: string}) => {
        try {
            const response = await fetch("/api/todos/" + todo.id, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    id: todo.id
                })
            })
            return await response.json(); // Giả sử bạn muốn trả về JSON từ server
        }catch (error){
            console.log(error)
        }
    },
    delete: async (id: string) => {
        try {
            const response = await fetch("/api/todos/" + id, {
                method: "DELETE",
                body: JSON.stringify({
                    id
                })
            })
            return await response.json(); // Giả sử bạn muốn trả về JSON từ server
        }catch (error){
            console.log(error)
        }
    },
}

export  default  todoApiRequest;