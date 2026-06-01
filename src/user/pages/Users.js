import React from "react";
import UserList from "../components/UsersList.js";
import { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElement/ErrorModal.js";
import LoadingSpiner from "../../shared/components/UIElement/LoadingSpinner.js";
import { useHttpClient } from "../../shared/hooks/http-hook.js";

export default function Users() {
    const [loadedUsers, setLoadedUsers] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    useEffect(() => {
        async function fetchUsers() {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + "/user",
                );

                setLoadedUsers(responseData.users);
            } catch (err) {}
        }
        fetchUsers();
    }, [sendRequest]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpiner />
                </div>
            )}
            {!isLoading && loadedUsers && <UserList items={loadedUsers} />}
        </React.Fragment>
    );
}
