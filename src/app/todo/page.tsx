"use client"
import React, {useEffect, useState} from 'react';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FaTrash,FaPen  } from "react-icons/fa";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import todoApiRequest from "@/apiRequests/todo";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
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
    const [todoEdit, setTodoEdit] = useState<ToDoType | null>(null)
    const queryClient = useQueryClient();
    const {data: todoList} = useQuery({ queryKey: ['todos'], queryFn: todoApiRequest.list})

    const addTodoMutation = useMutation({
        mutationFn: todoApiRequest.add,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['todos']
            })
        }
    })
    const editTodoMutation = useMutation({
        mutationFn: todoApiRequest.edit,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['todos']
            })
        }
    })
    const deleteTodoMutation = useMutation({
        mutationFn: todoApiRequest.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['todos']
            })
        }
    })

    const handleAddTodo =async (data: ToDoType) => {
        if(!todoEdit){
            await  addTodoMutation.mutateAsync(data.name)
        }else{
            await editTodoMutation.mutateAsync({todo: data.name, todoEdit})
            setTodoEdit(null)
        }
        reset();
    }
    const handleEditTodo = (todo: ToDoType) => {
        setTodoEdit(todo)
        setValue("name", todo.name)
    }
    const handleDeleteTodo =async (todoId: string) => {
        await  deleteTodoMutation.mutateAsync(todoId)
    }

    return (
       <div className="flex items-center justify-center min-h-[100vh]">
           <Card className="w-[350px]">
               <CardHeader>
                   <CardTitle>Todo List</CardTitle>
               </CardHeader>
               <CardContent>
                   <form onSubmit={handleSubmit(handleAddTodo)}>
                       <div>
                           <div className="flex flex-col space-y-1.5">
                               <div className="flex gap-2">
                                   <Input {...register("name")} placeholder="Name of your project"/>
                                   <Button type={"submit"}>{todoEdit ? "Edit" : "Add"}</Button>
                               </div>
                               <div className={"text-red-400 text-sm"}>{errors.name?.message}</div>
                           </div>
                       </div>
                   </form>
                   <div className="flex flex-col space-y-1.5 mt-2">
                       {
                           todoList?.data && todoList?.data.length > 0 ? todoList?.data.map((item: ToDoType) =>
                               <div key={item.id} className={`flex items-center justify-between p-2 rounded-lg ${todoEdit?.id === item.id ? "bg-green-400" : ""}`}>
                                   <div>{item.name}</div>
                                   <div className={"flex items-center gap-2"}>
                                       <Button onClick={() => handleEditTodo(item)} className={"bg-purple-400"}>
                                           <FaPen/>
                                       </Button>
                                       <Button onClick={() => handleDeleteTodo(item.id as string)} className={"bg-red-400"}>
                                           <FaTrash/>
                                       </Button>
                                   </div>
                               </div>)
                               :
                               (
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