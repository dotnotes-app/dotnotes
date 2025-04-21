import {
    queryOptions,
    useMutation,
    UseMutationOptions,
    useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";

import { db } from "../db";
import { InsertTask, tasksTable } from "../db/schema";

const TOPIC = "tasks" as const;

const fetchTasksServerFn = createServerFn({ method: "GET" }).handler(async () => {
    try {
        return await db.select().from(tasksTable);
    } catch (err) {
        console.error(err);
        throw err;
    }
});

export const tasksQuery = () => {
    return queryOptions({
        queryKey: [TOPIC],
        queryFn: () => fetchTasksServerFn(),
    });
};

const createTaskServerFn = createServerFn({ method: "POST" })
    .validator((data: InsertTask) => data)
    .handler(async ({ data }) => {
        try {
            return await db.insert(tasksTable).values(data);
        } catch (err) {
            console.error(err);
            throw err;
        }
    });

export const useCreateTask = (
    options?: UseMutationOptions<unknown, Error, InsertTask>
) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const createTask = useServerFn(createTaskServerFn);

    return useMutation({
        ...options,
        mutationKey: [TOPIC],
        mutationFn: (task) => createTask({ data: task }),
        onSuccess: (data, variables, context) => {
            router.invalidate();
            queryClient.invalidateQueries({ queryKey: [TOPIC] });
            options?.onSuccess?.(data, variables, context);
        },
    });
};
