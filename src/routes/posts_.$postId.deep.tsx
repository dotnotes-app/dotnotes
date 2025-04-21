import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import postQueries from "~/queries/posts";

import { PostErrorComponent } from "./posts.$postId";

export const Route = createFileRoute("/posts_/$postId/deep")({
    loader: async ({ params: { postId }, context }) => {
        const data = await context.queryClient.ensureQueryData(
            postQueries.post(postId)
        );

        return {
            title: data.title,
        };
    },
    head: ({ loaderData }) => ({
        meta: loaderData ? [{ title: loaderData.title }] : undefined,
    }),
    errorComponent: PostErrorComponent,
    component: PostDeepComponent,
});

function PostDeepComponent() {
    const { postId } = Route.useParams();
    const postQuery = useSuspenseQuery(postQueries.post(postId));

    return (
        <div className="p-2 space-y-2">
            <Link
                to="/posts"
                className="block py-1 text-blue-800 hover:text-blue-600"
            >
                ← All Posts
            </Link>
            <h4 className="text-xl font-bold underline">{postQuery.data.title}</h4>
            <div className="text-sm">{postQuery.data.body}</div>
        </div>
    );
}
