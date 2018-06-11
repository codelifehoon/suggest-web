/*global google*/
import React from 'react';
import _ from 'lodash';
import { compose, withProps, lifecycle } from 'recompose';
import {withScriptjs, withGoogleMap, GoogleMap, Marker,InfoWindow} from 'react-google-maps';
import {SearchBox} from 'react-google-maps/lib/components/places/SearchBox';
import {Typography} from "@material-ui/core";
import {withRouter} from "react-router-dom";
import * as Config from '../util/Config';
//
//
// const _ = require("lodash");
// const { compose, withProps, lifecycle } = require("recompose");
// const {
//     withScriptjs,
//     withGoogleMap,
//     GoogleMap,
//     Marker,
// } = require("react-google-maps");
// const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
// const google = window.google;
const MapWithASearchBox = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=" + Config.GOOGLE_KEY +"&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: '100%' }} />,
        containerElement: <div style={{ height: `800px` }} />,
        mapElement: <div style={{ height: '100%' }} />,
    }),
    lifecycle({
        componentWillMount() {
            const refs = {}
            let latDefault = 37.497889;
            let lngDefault = 127.027616;

            if (this.props.lat) latDefault=this.props.lat;
            if (this.props.lng) lngDefault=this.props.lng;

            console.log(this.props.lat);
            console.log(this.props.lng);


            this.setState({
                bounds: null,
                center: {
                    lat: latDefault, lng: lngDefault
                },
                markers: [],
                onMapMounted: ref => {
                    refs.map = ref;
                },
                onBoundsChanged: () => {
                    this.setState({
                        bounds: refs.map.getBounds(),
                        center: refs.map.getCenter(),
                    })
                },
                onSearchBoxMounted: ref => {
                    refs.searchBox = ref;
                },
                onPlacesChanged: () => {
                    const places = refs.searchBox.getPlaces();
                    const bounds = new google.maps.LatLngBounds();

                    places.forEach(place => {
                        if (place.geometry.viewport) {
                            bounds.union(place.geometry.viewport)
                        } else {
                            bounds.extend(place.geometry.location)
                        }
                    });
                    const nextMarkers = places.map(place => ({
                        position: place.geometry.location,
                    }));
                    const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

                    this.setState({
                        center: nextCenter,
                        markers: nextMarkers,
                    });
                    // refs.map.fitBounds(bounds);

                    console.log(nextMarkers);
                },

                onClickMap : (e) =>{
                    const bounds = new google.maps.LatLngBounds();
                    console.log('######');
                    console.log(e);
                    // const nextMarkers = places.map(place => ({
                    //     position: place.geometry.location,
                    // }));

                    const nextMarkers =  [{
                        position: e.latLng,
                            }];

                    this.setState({
                        markers: nextMarkers,
                    });

                },
                onClickSelectBtn : () =>{
                    this.props.history.push(this.props.returnUrl + '?latLng=' + JSON.stringify(this.state.markers[0].position));
                },
                onClickCloseBtn : () =>{
                    this.props.history.push(this.props.returnUrl);
                }

            })
        },
    }),
    withScriptjs,
    withGoogleMap
)(props =>
    <div>
    <GoogleMap
        ref={props.onMapMounted}
        defaultZoom={15}
        center={props.center}
        onBoundsChanged={props.onBoundsChanged}
        onClick={props.onClickMap}

    >
        <SearchBox
            ref={props.onSearchBoxMounted}
            bounds={props.bounds}
            controlPosition={google.maps.ControlPosition.TOP_LEFT}
            onPlacesChanged={props.onPlacesChanged}
        >
            <input
                type="text"
                placeholder="위치를 입력 해주세요"
                style={{
                    boxSizing: `border-box`,
                    border: `1px solid transparent`,
                    width: `240px`,
                    height: `32px`,
                    marginTop: `27px`,
                    padding: `0 12px`,
                    borderRadius: `3px`,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`,
                }}
            />
        </SearchBox>
        {props.markers.map((marker, index) => {

         return (
             <Marker key={index} position={marker.position} >
                 <InfoWindow  onCloseClick={props.onClickCloseBtn}>
                     <Typography onClick={props.onClickSelectBtn}>선택해주세요.</Typography >
                 </InfoWindow>
             </Marker>
            )
        })}
    </GoogleMap>

    </div>
);

<MapWithASearchBox />

export  default withRouter((MapWithASearchBox));