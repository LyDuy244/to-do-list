"use client"
import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {FaTrash, FaPen} from "react-icons/fa";
import todoApiRequest from "@/apiRequests/todo";
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from "yup";
import {Skeleton} from "@/components/ui/skeleton";

export type ToDoType = {
  name: string,
  id?: string
}

const schema = yup.object({
  name: yup.string().required("Bạn phải nhập tên công việc"),
  id: yup.string().optional()
}).required();

const Page = () => {
  const {register, handleSubmit, reset, formState: {errors}, setValue} = useForm<ToDoType>({
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(schema)
  })
  const [todoCurentEdit, setTodoCurentEdit] = useState<ToDoType | null>(null)
  const [todoList, setTodoList] = useState<ToDoType[]>([])
  const fetchTodos =   () => {
    try {
      const data = fetch("/api/todos", {
        method: "GET",
      }).then(response => response.json())
        .then(data => setTodoList(data.data))
    }catch (error){
      console.error(error)
    }
  }
  
 
  
  const handleAddTodo = async (data: ToDoType) => {
    if (!todoCurentEdit) {
      const result = await todoApiRequest.add(data.name)
      let newTodoList = [...todoList, {...result.data}]
      setTodoList(newTodoList)
    } else {
      const index = todoList.findIndex(todo => todo.id === todoCurentEdit.id)
      if(index !== -1) {
        const result = await todoApiRequest.edit({name: data.name, todo: todoCurentEdit})
        let newTodoList = [...todoList];
        newTodoList.splice(index, 1, {...result.data})
        setTodoList(newTodoList)
        setTodoCurentEdit(null)
      }
    }
    reset();
  }
  const handleEditTodo = (todo: ToDoType) => {
    setTodoCurentEdit(todo)
    setValue("name", todo.name)
  }
  const handleDeleteTodo = async (id: string) => {
    const index = todoList.findIndex(todo => todo.id === id)
    if(index !== -1) {
      await todoApiRequest.delete(id)
      let newTodoList = [...todoList];
      newTodoList.splice(index, 1)
      setTodoList(newTodoList)
    }
  }
  
  useEffect(() => {
    fetchTodos()
  }, []);
  
  
  return (
    <div className="flex items-center justify-center min-h-[100vh]">
      <Card className="w-[350px] max-h-[400px] overflow-y-auto">
        <CardHeader className={"sticky top-0 left-0 right-0 shadow-lg bg-white"}>
          <CardTitle>Todo List</CardTitle>
          <form onSubmit={handleSubmit(handleAddTodo)}>
            <div>
              <div className="flex flex-col space-y-1.5">
                <div className="flex gap-2">
                  <Input {...register("name")} placeholder="Name of your project"/>
                  <Button type={"submit"}>{todoCurentEdit ? "Edit" : "Add"}</Button>
                </div>
                <div className={"text-red-400 text-sm"}>{errors.name?.message}</div>
              </div>
            </div>
          </form>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-1.5 mt-2">
            {
              todoList && todoList.length > 0 ? todoList.map((item: ToDoType) => (
                <div key={item.id}
                     className={`flex items-center justify-between p-2 rounded-lg ${todoCurentEdit?.id === item.id ? "bg-green-400" : ""}`}>
                  <div>{item.name}</div>
                  <div className={"flex items-center gap-2"}>
                    <Button onClick={() => handleEditTodo(item)} className={"bg-purple-400"}>
                        <FaPen/>
                      </Button>
                      <Button onClick={() => handleDeleteTodo(item.id as string)} className={"bg-red-400"}>
                        <FaTrash/>
                      </Button>
                    </div>
                  </div>
                )
              ) : (
                Array(5).fill(null).map((_, index) => (
                  <div key={index} className={'flex items-center justify-between'}>
                    <Skeleton className="w-[150px] h-[30px] rounded-full"/>
                    <div className={'flex items-center gap-1'}>
                      <Skeleton className="w-[60px] h-[30px] rounded-full"/>
                      <Skeleton className="w-[60px] h-[30px] rounded-full"/>
                    </div>
                  </div>
                ))
              )
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;