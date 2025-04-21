import { queryOptions } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import axios from "redaxios";

export type User = {
    id: number;
    name: string;
    email: string;
};

const fetchUsers = createServerFn({ method: "GET" }).handler(async () => {
    try {
        const users = await axios.get<Array<User>>(
            "https://jsonplaceholder.typicode.com/users/"
        );

        return users.data;
    } catch (err) {
        console.error(err);

        if (err instanceof Error && "status" in err && err.status === 404) {
            throw notFound();
        }

        throw err;
    }
});

const usersQuery = () => {
    return queryOptions({
        queryKey: ["users"],
        queryFn: () => fetchUsers(),
    });
};

const fetchUser = createServerFn({ method: "GET" })
    .validator((id: string) => id)
    .handler(async ({ data }) => {
        try {
            const user = await axios.get<User>(
                `https://jsonplaceholder.typicode.com/users/${data}`
            );

            return user.data;
        } catch (err) {
            console.error(err);

            if (err instanceof Error && "status" in err && err.status === 404) {
                throw notFound();
            }

            throw err;
        }
    });

const userQuery = (id: string) =>
    queryOptions({
        queryKey: ["users", id],
        queryFn: () => fetchUser({ data: id }),
    });

export default {
    user: userQuery,
    users: usersQuery,
};
