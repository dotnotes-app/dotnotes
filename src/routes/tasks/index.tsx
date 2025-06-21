import { useEffect, useRef } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import DelayedLoadingIndicator from "../../components/DelayedLoadingSpinner";
import { tasksQuery, useCreateTask, useDeleteTask } from "../../queries/tasks";

export const Route = createFileRoute("/tasks/")({
    component: RouteComponent,
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData(tasksQuery());
    },
    validateSearch: (search) => {
        return {
            title: (search.title as string) || "",
            description: (search.description as string) || "",
        };
    },
});

function RouteComponent() {
    const tasks = useSuspenseQuery(tasksQuery());

    const titleInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate({ from: Route.fullPath });
    const search = Route.useSearch();

    const createTask = useCreateTask();
    const deleteTask = useDeleteTask();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await createTask.mutateAsync(
            {
                userId: 1,
                title: search.title,
                description: search.description,
                isCompleted: false,
            },
            {
                onSuccess: () => {
                    navigate({ search: { title: "", description: "" } });
                },
            }
        );
    };

    useEffect(() => {
        if (search.title.length === 0) {
            titleInputRef.current?.focus();
        }
    }, [search.title]);

    return (
        <div className="p-8">
            <form onSubmit={handleSubmit}>
                <h3 className="my-10 text-4xl">
                    Tasks {createTask.isPending && <DelayedLoadingIndicator />}
                </h3>
                <div className="my-4 flex gap-2">
                    <div className="flex flex-grow gap-4">
                        <input
                            ref={titleInputRef}
                            className="w-1/3 rounded-md border-2 border-gray-300 px-4 py-2 text-sm"
                            type="text"
                            placeholder="Task Title"
                            disabled={createTask.isPending}
                            autoFocus
                            onChange={(e) => {
                                navigate({
                                    search: {
                                        title: e.target.value,
                                        description: search.description,
                                    },
                                });
                            }}
                        />
                        <input
                            className="w-2/3 rounded-md border-2 border-gray-300 px-4 py-2 text-sm"
                            type="text"
                            placeholder="Task Description"
                            disabled={createTask.isPending}
                            onChange={(e) => {
                                navigate({
                                    search: {
                                        description: e.target.value,
                                        title: search.title,
                                    },
                                });
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="rounded-md border-2 bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600"
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
                                className="flex items-center gap-4 rounded-lg border-2 border-gray-300 p-2"
                            >
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={task.isCompleted}
                                        onChange={() => {
                                            console.log(
                                                "TODO: Update Task",
                                                task.id
                                            );
                                        }}
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 transition-colors checked:border-green-600 checked:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                                    />
                                    <svg
                                        className="pointer-events-none absolute left-1 top-1 h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div className="flex flex-grow flex-col gap-2">
                                    <h3 className="font-bold">{task.title}</h3>
                                    {task.description && (
                                        <p className="text-gray-500">
                                            {task.description}{" "}
                                        </p>
                                    )}
                                </div>
                                <div className="">
                                    <button
                                        className="rounded-md border-2 bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
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
