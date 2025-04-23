import { useEffect, useRef, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import DelayedLoadingIndicator from "../../components/DelayedLoadingSpinner";
import { tasksQuery, useCreateTask, useDeleteTask } from "../../queries/tasks";

export const Route = createFileRoute("/tasks/")({
    component: RouteComponent,
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData(tasksQuery());
    },
});

function RouteComponent() {
    const tasks = useSuspenseQuery(tasksQuery());

    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const titleInputRef = useRef<HTMLInputElement>(null);

    const createTask = useCreateTask();
    const deleteTask = useDeleteTask();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await createTask.mutateAsync(
            {
                userId: 1,
                title: taskTitle,
                description: taskDescription,
                isCompleted: false,
            },
            {
                onSuccess: () => {
                    setTaskTitle("");
                    setTaskDescription("");
                },
            }
        );
    };

    useEffect(() => {
        if (taskTitle.length === 0) {
            titleInputRef.current?.focus();
        }
    }, [taskTitle]);

    return (
        <div className="p-8">
            <form onSubmit={handleSubmit}>
                <h3 className="text-4xl my-10">
                    Tasks {createTask.isPending && <DelayedLoadingIndicator />}
                </h3>
                <div className="flex gap-2 my-4">
                    <input
                        ref={titleInputRef}
                        className="border-2 border-gray-300 rounded-md px-4 py-2 text-sm"
                        type="text"
                        placeholder="Task Title"
                        disabled={createTask.isPending}
                        value={taskTitle}
                        autoFocus
                        onChange={(e) => setTaskTitle(e.target.value)}
                    />
                    <input
                        className="border-2 border-gray-300 rounded-md px-4 py-2 text-sm"
                        type="text"
                        placeholder="Task Description"
                        disabled={createTask.isPending}
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-green-500 border-green-400 text-blue-950 border-2 rounded-md px-4 py-2 text-sm"
                        disabled={createTask.isPending}
                    >
                        Add Task
                    </button>
                </div>

                <hr className="my-4" />
            </form>

            <div className="grid gap-4">
                {tasks.data
                    .sort(
                        (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                    )
                    .map((task) => {
                        return (
                            <div
                                key={task.id}
                                className="border-2 border-gray-300 rounded-lg p-2 gap-4 flex items-center"
                            >
                                <input
                                    type="checkbox"
                                    checked={task.isCompleted}
                                    onChange={() => {
                                        console.log("TODO: Update Task", task.id);
                                    }}
                                />
                                <h3>{task.title}</h3>
                                <p className="text-gray-400">{task.description}</p>
                                <div className="self-end">
                                    <button
                                        className="bg-red-300 text-white rounded-md px-2 py-1 text-sm"
                                        onClick={() => {
                                            deleteTask.mutate({ id: task.id });
                                        }}
                                    >
                                        Delete Task
                                    </button>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
