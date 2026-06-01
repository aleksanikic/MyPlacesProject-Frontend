import React, { useState, useContext } from "react";

import { AuthContext } from "../../shared/context/auth-context.js";
import Input from "../../shared/components/FormElemnts/Input.js";
import Card from "../../shared/components/UIElement/Card.js";
import ImageUpload from "../../shared/components/FormElemnts/ImageUpload.js";
import "./Auth.css";
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from "../../shared/util/validators.js";
import Button from "../../shared/components/FormElemnts/Button.js";
import { useForm } from "../../shared/hooks/form-hook.js";
import ErrorModal from "../../shared/components/UIElement/ErrorModal.js";
import LoadingSpiner from "../../shared/components/UIElement/LoadingSpinner.js";
import { useHttpClient } from "../../shared/hooks/http-hook.js";

export default function Auth() {
    const auth = useContext(AuthContext);
    const [isLogin, setIsLoagin] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: "",
                isValid: false,
            },
            password: {
                value: "",
                isValid: false,
            },
        },
        false,
    );

    function switchModeHandler() {
        if (!isLogin) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                    image: undefined,
                },
                formState.inputs.email.isValid &&
                    formState.inputs.password.isValid,
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: "",
                        isValid: false,
                    },
                    image: {
                        value: null,
                        isValid: false,
                    },
                },
                false,
            );
        }
        setIsLoagin((isLogin) => !isLogin);
    }

    async function SubmitHandler(event) {
        event.preventDefault();

        if (isLogin) {
            try {
                const reasponseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + "/user/login",
                    "POST",
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value,
                    }),
                    { "Content-Type": "application/json" },
                );
                auth.login(reasponseData.userId, reasponseData.token);
            } catch (err) {}
        } else {
            try {
                const formData = new FormData();
                formData.append("name", formState.inputs.name.value);
                formData.append("email", formState.inputs.email.value);
                formData.append("password", formState.inputs.password.value);
                formData.append("image", formState.inputs.image.value);
                const reasponseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL+"/user/signup",
                    "POST",
                    formData,
                );

                auth.login(reasponseData.userId, reasponseData.token);
            } catch (err) {}
        }
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LoadingSpiner asOverlay />}
                <h2>Login required</h2>
                <hr />
                <form onSubmit={SubmitHandler}>
                    {!isLogin && (
                        <Input
                            id="name"
                            element="input"
                            type="text"
                            label="Your Name"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a name"
                            onInput={inputHandler}
                        ></Input>
                    )}
                    {!isLogin && (
                        <ImageUpload
                            center
                            id="image"
                            onInput={inputHandler}
                            errorText="Please provide an image!"
                        />
                    )}
                    <Input
                        id="email"
                        element="input"
                        type="email"
                        label="E-Mail"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter the valid email"
                        onInput={inputHandler}
                    ></Input>
                    <Input
                        id="password"
                        element="input"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter the valid password. Least 6 characters"
                        onInput={inputHandler}
                    ></Input>
                    <Button type="submit" disabled={!formState.isValid}>
                        {isLogin ? "LOGIN" : "SIGNUP"}
                    </Button>
                </form>
                <Button inverse onClick={switchModeHandler}>
                    SWITCH TO {isLogin ? "SIGNUP" : "LOGIN"}
                </Button>
            </Card>
        </React.Fragment>
    );
}
