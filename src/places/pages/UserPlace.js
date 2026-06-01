import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from "../../shared/hooks/http-hook.js";
import ErrorModal from "../../shared/components/UIElement/ErrorModal.js";
import LoadingSpiner from "../../shared/components/UIElement/LoadingSpinner.js";

import PlaceList from '../components/PlaceList.js';

export default  function UserPlace() {
    const [loadedPlaces, setLoadedPlaces] = useState();
    const userId = useParams().userId;

    const { isLoading, error, sendRequest, clearError } = useHttpClient();
     useEffect(() => {
        async function fetchPlaces() {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
                );
                setLoadedPlaces(responseData.places);
            } catch (err){

            }
        }
        fetchPlaces();
    }, [sendRequest, userId]);

    function placeDeleteHandler(deletedPlaceId){
        setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId))
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpiner />
                </div>
            )}
            {!isLoading && <PlaceList item={loadedPlaces} onDeletePlace = {placeDeleteHandler}/>}
        </React.Fragment>
    );
}
