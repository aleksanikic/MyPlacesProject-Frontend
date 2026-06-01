import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context.js";

import "./PlaceForm.css";
import Input from "../../shared/components/FormElemnts/Input.js";
import Button from "../../shared/components/FormElemnts/Button.js";
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH,
} from "../../shared/util/validators.js";
import { useForm } from "../../shared/hooks/form-hook.js";
import Card from "../../shared/components/UIElement/Card.js";
import { useHttpClient } from "../../shared/hooks/http-hook.js";
import ErrorModal from "../../shared/components/UIElement/ErrorModal.js";
import LoadingSpiner from "../../shared/components/UIElement/LoadingSpinner.js";

export default function UpdatePlace() {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const history = useHistory();
    const [loadedPlace, setLoadedPlace] = useState();
    const placeId = useParams().placeId;
    console.log(placeId);
    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: "",
                isValid: false,
            },
            description: {
                value: "",
                isValid: false,
            },
        },
        false,
    );

    useEffect(() => {
        async function fetchPlaces() {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
                );
                setLoadedPlace(responseData.place);
                setFormData(
                    {
                        title: {
                            value: responseData.place.title,
                            isValid: true,
                        },
                        description: {
                            value: responseData.place.description,
                            isValid: true,
                        },
                    },
                    true,
                );
            } catch (err) {}
        }
        fetchPlaces();
    }, [sendRequest, placeId, setFormData]);

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpiner></LoadingSpiner>
            </div>
        );
    }

    if (!loadedPlace && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }

    async function preventUpdateSubmitHandler(event) {
        event.preventDefault();
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
                "PATCH",
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                }),
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                },
            );
            history.push("/" + auth.userId + "/places");
        } catch (err) {}
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace && (
                <form
                    className="place-form"
                    onSubmit={preventUpdateSubmitHandler}
                >
                    <Input
                        id="title"
                        element="input"
                        type="text"
                        label="Title"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter the valid title"
                        onInput={inputHandler}
                        initalValue={loadedPlace.title}
                        initalValid={true}
                    />
                    <Input
                        id="description"
                        element="input"
                        label="Description"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter the valid description(minimum 5 characters)"
                        onInput={inputHandler}
                        initalValue={loadedPlace.description}
                        initalValid={true}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        UPDATE PLACE
                    </Button>
                </form>
            )}
        </React.Fragment>
    );
}
