import React, { useEffect, useState, useCallback } from "react";
import { compose, withProps, withHandlers } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import { Navbar, Preloader } from "react-materialize";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import axios from "axios";

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

let points = [
  { id: 1, lat: -18.422, lng: 145.321, date: "1/1/2020" },
  { id: 2, lat: -14.118, lng: 144.235, date: "2/3/2020" },
  { id: 3, lat: -19.029, lng: 154.235, date: "1/25/2020" },
  { id: 4, lat: -18.118, lng: 144.235, date: "1/2/2020" },
  { id: 5, lat: -20.029, lng: 135.293, date: "12/3/2019" },
  { id: 6, lat: -21.118, lng: 150.235, date: "2/3/2020" },
  { id: 7, lat: -17.118, lng: 130.235, date: "2/10/2020" },
  { id: 8, lat: -25.118, lng: 123.235, date: "4/3/2019" }
];

const googleMapURL =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyD2LrwDsYJpXri3K9NI7SJw_0Y7PArjuDE&v=3.exp&libraries=geometry,drawing,places";

const ClusterMap = compose(
  withProps({
    googleMapURL,
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
)(({ markers, onMarkerClustererClick, defaultCenter }) => (
  <GoogleMap defaultZoom={10} defaultCenter={defaultCenter}>
    <MarkerClusterer
      onClick={onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      {markers.map((marker, i) => {
        let labelSize = 200;
        let labelPadding = 10;

        return (
          <MarkerWithLabel
            labelStyle={{
              textAlign: "center",
              width: labelSize.width + "px",
              backgroundColor: "#ffffff",
              color: "black",
              fontSize: "14px",
              padding: labelPadding + "px"
            }}
            icon={FlameImg}
            labelAnchor={{ x: 35, y: 80 }}
            key={i}
            position={{ lat: marker.latitude, lng: marker.longitude }}
          >
            <span>{marker.acq_date}</span>
          </MarkerWithLabel>
        );
      })}
    </MarkerClusterer>
  </GoogleMap>
));

function App() {
  const [location, setLocation] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let res = await axios.get("http://localhost:5000/items");
      console.log("items fetched");
      setData(res.data);
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();

    navigator.geolocation.getCurrentPosition(
      position => {
        let { latitude, longitude } = position.coords;
        setLocation({
          lat: Number(latitude),
          lng: Number(longitude)
        });

        setLoading(false);
      },
      () => {
        setLoading(false);
        alert("Unable to obtain your location");
      }
    );
  }, [fetchData]);

  let currentLocation =
    location === undefined ? { lat: 25.0391667, lng: 121.525 } : location;

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
        </Navbar>
        <Route exact path="/">
          {loading ? (
            <Preloader active color="blue" flashing={false} size="big" />
          ) : (
            <ClusterMap markers={data} defaultCenter={currentLocation} />
          )}
        </Route>
      </Router>
    </>
  );
}

export default App;
