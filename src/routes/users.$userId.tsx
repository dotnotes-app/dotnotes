import { useSuspenseQuery } from "@tanstack/react-query";
import {
    createFileRoute,
    ErrorComponent,
    type ErrorComponentProps,
} from "@tanstack/react-router";
import { NotFound } from "~/components/NotFound";
import userQueries from "~/queries/users";

export const Route = createFileRoute("/users/$userId")({
    loader: async ({ context, params: { userId } }) => {
        await context.queryClient.ensureQueryData(userQueries.user(userId));
    },
    component: UserComponent,
    errorComponent: UserErrorComponent,
    notFoundComponent: () => {
        return <NotFound>User not found</NotFound>;
    },
});

function UserErrorComponent({ error }: ErrorComponentProps) {
    return <ErrorComponent error={error} />;
}

function UserComponent() {
    const params = Route.useParams();
    const userQuery = useSuspenseQuery(userQueries.user(params.userId));
    const user = userQuery.data;

    return (
        <div className="space-y-2">
            <h4 className="text-xl font-bold underline">{user.name}</h4>
            <div className="text-sm">{user.email}</div>
        </div>
    );
}
