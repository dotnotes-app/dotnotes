import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { tasksQuery, useCreateTask } from "../../queries/tasks";

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

    const createTask = useCreateTask({
        onSuccess: () => {
            setTaskTitle("");
            setTaskDescription("");
        },
    });

    return (
        <div className="p-2">
            <h3 className="text-4xl my-10">Tasks</h3>
            <div className="flex gap-2 my-4">
                <input
                    className="border-2 border-gray-300 rounded-md px-4 py-2 text-sm"
                    type="text"
                    placeholder="Task Title"
                    disabled={createTask.isPending}
                    value={taskTitle}
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
            </div>

            <button
                className="border-gray-400 border-2 rounded-md px-4 py-2 text-sm"
                disabled={createTask.isPending}
                onClick={async () => {
                    await createTask.mutateAsync({
                        userId: 1,
                        title: taskTitle,
                        description: taskDescription,
                        isCompleted: false,
                    });
                }}
            >
                {createTask.isPending ? "Creating Task..." : "Create Task"}
            </button>

            <hr className="my-4" />

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
                                        onClick={async () => {
                                            console.log(
                                                "TODO: Delete Task",
                                                task.id
                                            );
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
