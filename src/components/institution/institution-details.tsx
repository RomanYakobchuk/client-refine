import {GoogleMap, Marker, useJsApiLoader} from "@react-google-maps/api";
import {center, containerStyle, options} from "./mapsOptrions";
import React, {useRef, useState} from "react";
import {Box, CircularProgress} from "@mui/material";
import {useParams} from "react-router-dom";

const InstitutionDetails = () => {

    const {id} = useParams();

    const mapRef = useRef<google.maps.Map | null>(null);
    const [location, setLocation] = useState<google.maps.LatLngLiteral | any>({} as google.maps.LatLngLiteral);


    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY!
    });


    const onLoad = (map: google.maps.Map): void => {
        mapRef.current = map
    }

    const onUnmount = (): void => {
        mapRef.current = null
    }

    const onMapClick = (e: google.maps.MapMouseEvent) => {
        setLocation({lat: e.latLng?.lat(), lng: e.latLng?.lng()})
    }
    return (
        <div>
            {
                isLoaded ?
                    <Box sx={{
                        width: "100%",
                        height: {xs: "350px", md: "400px"},
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            options={options as google.maps.MapOptions}
                            zoom={10}
                            onLoad={onLoad}
                            onClick={onMapClick}
                            onUnmount={onUnmount}>
                            {
                                location.lat ? <Marker position={location}/> : null
                            }
                        </GoogleMap>
                    </Box> : <Box sx={{
                        width: "100%",
                        height: {xs: "350px", md: "400px"},
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <CircularProgress/>
                    </Box>
            }
        </div>
    );
};

export default InstitutionDetails