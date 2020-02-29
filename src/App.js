import React from "react";
import { compose, withProps, withHandlers } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import { Navbar } from "react-materialize";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";

import FlameImg from "./assets/flame.png";
import "./App.scss";
const {
  MarkerClusterer
} = require("react-google-maps/lib/components/addons/MarkerClusterer");

var locations = [
  { lat: -31.56391, lng: 147.154312 },
  { lat: -33.718234, lng: 150.363181 },
  { lat: -33.727111, lng: 150.371124 },
  { lat: -33.848588, lng: 151.209834 },
  { lat: -33.851702, lng: 151.216968 },
  { lat: -34.671264, lng: 150.863657 },
  { lat: -35.304724, lng: 148.662905 },
  { lat: -36.817685, lng: 175.699196 },
  { lat: -36.828611, lng: 175.790222 },
  { lat: -37.75, lng: 145.116667 },
  { lat: -37.759859, lng: 145.128708 },
  { lat: -37.765015, lng: 145.133858 },
  { lat: -37.770104, lng: 145.143299 },
  { lat: -37.7737, lng: 145.145187 },
  { lat: -37.774785, lng: 145.137978 },
  { lat: -37.819616, lng: 144.968119 },
  { lat: -38.330766, lng: 144.695692 },
  { lat: -39.927193, lng: 175.053218 },
  { lat: -41.330162, lng: 174.865694 },
  { lat: -42.734358, lng: 147.439506 },
  { lat: -42.734358, lng: 147.501315 },
  { lat: -42.735258, lng: 147.438 },
  { lat: -43.999792, lng: 170.463352 }
];

const ClusterMap = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyD2LrwDsYJpXri3K9NI7SJw_0Y7PArjuDE&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: (
      <div style={{ height: `${window.innerHeight - 65}px` }} />
    ),
    mapElement: <div style={{ height: `100%` }} />
  }),
  withHandlers({
    onMarkerClustererClick: () => markerClusterer => {
      const clickedMarkers = markerClusterer.getMarkers();
    }
  }),
  withScriptjs,
  withGoogleMap
)(({ markers, onMarkerClustererClick }) => (
  <GoogleMap defaultZoom={3} defaultCenter={{ lat: 25.0391667, lng: 121.525 }}>
    <MarkerClusterer
      onClick={onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      {markers.map((marker, i) => (
        <Marker icon={FlameImg} position={marker} key={i} />
        // <MarkerWithLabel
        //   icon={FlameImg}
        //   key={i}
        //   position={marker}
        //   labelStyle={{
        //     backgroundColor: "yellow",
        //     fontSize: "32px",
        //     padding: "16px"
        //   }}
        // >
        //   <h3>Firee</h3>
        // </MarkerWithLabel>
      ))}
    </MarkerClusterer>
  </GoogleMap>
));

function App() {
  return (
    <>
      <Router>
        <Navbar
          alignLinks="right"
          brand={
            <div
              style={{ cursor: "pointer", marginLeft: "20px" }}
              className="brand-logo"
            >
              FireScape
            </div>
          }
          menuIcon={<i className="fas fa-bars"></i>}
          options={{
            draggable: true,
            edge: "left",
            inDuration: 250,
            onCloseEnd: null,
            onCloseStart: null,
            onOpenEnd: null,
            onOpenStart: null,
            outDuration: 200,
            preventScrolling: true
          }}
        >
          <Link to="/">Map</Link>
          {/* <NavItem href="components.html">Components</NavItem> */}
        </Navbar>
        <Route exact path="/">
          <ClusterMap markers={locations} />
        </Route>
      </Router>
    </>
  );
}

const Map = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyD2LrwDsYJpXri3K9NI7SJw_0Y7PArjuDE&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: (
      <div style={{ height: `${window.innerHeight - 65}px` }} />
    ),
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(() => (
  <GoogleMap
    style={{ height: "100%" }}
    className="map"
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
    {locations.map((location, index) => {
      return <Marker key={index} position={location} icon={FlameImg} />;
    })}
  </GoogleMap>
));

export default App;
