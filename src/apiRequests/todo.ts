import {ToDoType} from "@/app/todo/page";

const todoApiRequest = {
    list: async () => {
        try {
            const data = await fetch("/api/todos", {
                method: "GET",
            })
            const response = await data.json()
            // setTodoList(response.data)
            return response;
        }catch (error){
            console.error(error)
        }
    },
    add:  async (todo: string) => {
        const response = await fetch("/api/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: todo,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to add todo');
        }

        return response.json(); // Giả sử bạn muốn trả về JSON từ server
    },
    edit: async ({todoEdit, todo}:{todoEdit: ToDoType, todo: string}) => {
        try {
            const response = await fetch("/api/todos/" + todoEdit.id, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: todo
                })
            })
            return response.json(); // Giả sử bạn muốn trả về JSON từ server
        }catch (error){
            console.log(error)
        }
    },
    delete: async (id: string) => {
        try {
            const response = await fetch("/api/todos/" + id, {
                method: "DELETE"
            })
            return response.json(); // Giả sử bạn muốn trả về JSON từ server
        }catch (error){
            console.log(error)
        }
    },
}

export  default  todoApiRequest;