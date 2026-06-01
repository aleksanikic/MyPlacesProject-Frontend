import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";

// import Users from "./user/pages/Users.js";
//import UserPlace from "./places/pages/UserPlace.js";
//import NewPlace from "./places/pages/NewPlace.js";
import MainNavigation from "./shared/components/Navigation/MainNavigation.js";
//import UpdatePlace from "./places/pages/UpdatePlace.js";
// import Auth from "./user/pages/auth.js";
import LoadingSpinner from "../src/shared/components/UIElement/LoadingSpinner.js"
import { AuthContext } from "./shared/context/auth-context.js";
import { useAuth } from "./shared/hooks/auth-hook.js"

const Users = React.lazy(()=> import("./user/pages/Users.js"))
const NewPlace = React.lazy(()=> import("./places/pages/NewPlace.js"))
const UserPlace = React.lazy(()=> import("./places/pages/UserPlace.js"))
const UpdatePlace = React.lazy(()=> import("./places/pages/UpdatePlace.js"))
const Auth = React.lazy(()=> import("./user/pages/auth.js"))

function App() {
    const { token, login, logout, userId } = useAuth();

    let routes;

    if (token) {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Users />
                </Route>
                <Route path="/:userId/places" exact>
                    <UserPlace />
                </Route>
                <Route path="/places/new" exact>
                    <NewPlace />
                </Route>
                <Route path="/places/:placeId">
                    <UpdatePlace />
                </Route>
                <Redirect to="/" />
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Users />
                </Route>
                <Route path="/:userId/places" exact>
                    <UserPlace />
                </Route>
                <Route path="/auth">
                    <Auth />
                </Route>
                <Redirect to="/auth" />
            </Switch>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!token,
                token: token,
                userId: userId,
                login: login,
                logout: logout,
            }}
        >
            <Router>
                <MainNavigation />
                <main><React.Suspense fallback={<div className="center"><LoadingSpinner/></div>}>{routes}</React.Suspense></main>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
