import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import EmptyState from "../EmptyState/EmptyState";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export const MapComponent = ({ lat, lon, businessName, height }) => {
    if (!lat || !lon) {
        return (
            <EmptyState title="Souřadnice podniku nejsou k dispozici" message=""/>
        );
    }

    return (
        <div style={{ height: `${height}px`, width: "100%", borderRadius: "12px", overflow: "hidden", border: "2px solid #e0e0e0" }}>
            <MapContainer 
                center={[lat, lon]} 
                zoom={16} 
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Marker position={[lat, lon]}>
                    <Popup>
                        <strong>{businessName}</strong> <br /> 
                        Tady nás najdete!
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};