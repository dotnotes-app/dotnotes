import { queryOptions } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import axios from "redaxios";

export type PostType = {
    id: string;
    title: string;
    body: string;
};

const TOPIC = "posts" as const;

const fetchPosts = createServerFn({ method: "GET" }).handler(async () => {
    const response = await axios.get<Array<PostType>>(
        "https://jsonplaceholder.typicode.com/posts"
    );

    return response.data.slice(0, 10);
});

const postsQuery = () => {
    return queryOptions({
        queryKey: [TOPIC],
        queryFn: () => fetchPosts(),
    });
};

const fetchPost = createServerFn({ method: "GET" })
    .validator((d: string) => d)
    .handler(async ({ data }) => {
        console.info(`Fetching post with id ${data}...`);
        try {
            const response = await axios.get<PostType>(
                `https://jsonplaceholder.typicode.com/posts/${data}`
            );
            return response.data;
        } catch (err) {
            console.error(err);

            if (err instanceof Error && "status" in err && err.status === 404) {
                throw notFound();
            }

            throw err;
        }
    });

const postQuery = (id: string) => {
    return queryOptions({
        queryKey: ["post", id],
        queryFn: () => fetchPost({ data: id }),
    });
};

export default {
    posts: postsQuery,
    post: postQuery,
};
