import React, { useState, useContext } from "react";

import { AuthContext } from "../../shared/context/auth-context.js";
import Card from "../../shared/components/UIElement/Card.js";
import Button from "../../shared/components/FormElemnts/Button.js";
import Modal from "../../shared/components/UIElement/Modal.js";
import Map from "../../shared/components/UIElement/Map.js";
import "./PlaceItem.css";
import { useHttpClient } from "../../shared/hooks/http-hook.js";
import ErrorModal from "../../shared/components/UIElement/ErrorModal.js";
import LoadingSpiner from "../../shared/components/UIElement/LoadingSpinner.js";

export default function PlaceItem(props) {
    const {isLoading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext);
    const [showMap, setShowMap] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    function showDeleteWarningHandler() {
        setShowConfirmModal(true);
    }
    function cancelDeleteHandler() {
        setShowConfirmModal(false);
        console.log("cancle");
    }
    async function confirmDeleteHandler() {
        setShowConfirmModal(false);
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
                "DELETE",
                null,
                { Authorization: "Bearer " + auth.token }
            );
            props.onDelete(props.id);
        } catch (err) {}
    }

    function openMapHandler() {
        setShowMap(true);
    }
    function closeMapHandler() {
        setShowMap(false);
    }
    return (
        <>
            <ErrorModal error={error} onClear={clearError}/>
            <Modal
                show={showMap}
                onCancle={closeMapHandler}
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className="map-container">
                    <Map center={props.coordinates} zoom={16} />
                </div>
            </Modal>
            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteHandler}
                header="Are you sure?"
                footerClass="place-item__modal-actions"
                footer={
                    <React.Fragment>
                        <Button inverse onClick={cancelDeleteHandler}>
                            CANCEL
                        </Button>
                        <Button danger onClick={confirmDeleteHandler}>
                            DELETE
                        </Button>
                    </React.Fragment>
                }
            >
                <p>
                    Do you want to proceed and delete this place? Please note
                    that it can't be undone thereafter.
                </p>
            </Modal>
            <li className="place-item">
                <Card className="place-item__content">
                    {isLoading && <LoadingSpiner asOverlay />}
                    <div className="place-item__image">
                        <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={openMapHandler}>
                            VIEW ON MAP
                        </Button>
                        {auth.userId === props.creatorId && (
                            <Button to={`/places/${props.id}`}>EDIT</Button>
                        )}
                        {auth.userId === props.creatorId && (
                            <Button danger onClick={showDeleteWarningHandler}>
                                DELETE
                            </Button>
                        )}
                    </div>
                </Card>
            </li>
        </>
    );
}
