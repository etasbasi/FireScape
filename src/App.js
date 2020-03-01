import React, { useEffect, useState, useCallback } from "react";
import { compose, withProps, withHandlers } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import { Navbar, Preloader, Toast } from "react-materialize";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import axios from "axios";
import firebase from "firebase";

import FlameImg from "./assets/flame.png";
import "./App.scss";
import News from "./News";

import { toast } from "materialize-css";

import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";

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

toast({ html: "hi there" });

var config = {
  apiKey: "69qUVA3jVbNRBgmAEdAlEhktYHBmbMaQcWKLD4rI",
  authDomain: "friescape.firebaseapp.com",
  databaseURL: "https://friescape.firebaseio.com",
  storageBucket: "firedata.appspot.com"
};

let app = firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

// firebase.functions.database.ref("/server/firedata/").onUpdate(snapshot => {
//   console.log(snapshot.val());
// });

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
            position={{
              lat: Number(marker.latitiude),
              lng: Number(marker.longitude)
            }}
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

  const fetchDataFromFirebase = useCallback(async () => {
    setLoading(true);
    firebase
      .database()
      .ref("/server/firedata/australia")
      .once("value")
      .then(function(snapshot) {
        let data = snapshot.val();
        setData(data);
      });

    // firebase
    //   .database()
    //   .ref("/users/userMobile")
    //   .once("value")
    //   .then(snapshot => {
    //     console.log(snapshot.val());
    //   });

    firebase
      .database()
      .ref("/users")
      .on("child_changed", snapshot => {
        console.log(snapshot.key);
        console.log(snapshot.val());

        toast({
          html: `<h5>New Alert!</h5><p>Latitude: ${
            snapshot.val().latitude
          } Longitude: ${snapshot.val().longitude}</p>`,
          classes: "toast",
          displayLength: 10000
        });
      });

    setLoading(false);
  }, []);

  useEffect(() => {
    // fetchData();
    fetchDataFromFirebase();

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
  }, [fetchDataFromFirebase]);

  let currentLocation =
    location === undefined ? { lat: -24.9929159, lng: 115.2297986 } : location;

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
          <Link to="/news">News</Link>
        </Navbar>
        <Route exact path="/">
          {loading ? (
            <Preloader active color="blue" flashing={false} size="big" />
          ) : (
            <ClusterMap markers={data} defaultCenter={currentLocation} />
          )}
        </Route>

        <Route exact path="/news">
          <News />
        </Route>
      </Router>
    </>
  );
}

export default App;
