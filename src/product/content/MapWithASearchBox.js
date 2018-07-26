/*global google*/
import React from 'react';
import _ from 'lodash';
import { compose, withProps, lifecycle } from 'recompose';
import {withScriptjs, withGoogleMap, GoogleMap, Marker,InfoWindow} from 'react-google-maps';
import {SearchBox} from 'react-google-maps/lib/components/places/SearchBox';
import {withRouter} from "react-router-dom";
import * as Config from '../util/Config';
import {withStyles} from "@material-ui/core/styles/index";
import {Button,FormControl,Select} from "@material-ui/core";




const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },


});

const MapWithASearchBox = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=" + Config.GOOGLE_KEY +"&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />
    }),
    lifecycle({

        componentWillMount() {
            const refs = {}
            let latDefault = 37.497889;
            let lngDefault = 127.027616;
            let returnUrl = "";

            if (this.props.lat) latDefault=this.props.lat;
            if (this.props.lng) lngDefault=this.props.lng;
            if (this.props.returnUrl) returnUrl=this.props.returnUrl;


            this.setState({
                bounds: null,
                center: {
                    lat: latDefault, lng: lngDefault
                },
                markers: [],
                distanceOption : '15000',
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
                    if (this.state.markers.length != 1) {alert("위치 하나를 선택 해주세요."); return;}

                    // 지정 위치가 변경 되었으니 다시 검색 돌 수 있도록 조치
                    sessionStorage.setItem('contentReload',true);
                    this.props.history.push(this.props.returnUrl + '?latLng=' + JSON.stringify(this.state.markers[0].position)
                                            +'&distance=' + this.state.distanceOption
                                        );
                },
                onClickGoBackBtn : ()=>{
                    this.props.history.goBack();
                },
                onClickCloseBtn : () =>{
                    this.props.history.push(this.props.returnUrl);
                },

                changeDistanceOption : (name) => event => {
                    this.setState({ [name]: event.target.value });
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
        // onBoundsChanged={props.onBoundsChanged}
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
             <Marker key={index} position={marker.position} />
            )
        })}    </GoogleMap>

        {props.returnUrl === '/' ? <FormControl className={props.classes.formControl}>
                                    <Select native value={props.distanceOption} onChange={props.changeDistanceOption('distanceOption')} inputProps={{id: 'distanceOptionInput',}} >
                                        <option value={'500'}>10분거리(500M)</option>
                                        <option value={'5000'}>20분거리(5KM)</option>
                                        <option value={'15000'}>30분거리(15KM)</option>
                                        <option value={'30000'}>1시간거리(30KM)</option>
                                        <option value={'100000'}>2시간거리(100KM)</option>
                                        <option value={'300000'}>3시간거리(300KM)</option>
                                    </Select>
                                </FormControl>
                                : ''
        }

        <Button className={props.classes.button} variant='raised' color="primary" onClick={props.onClickSelectBtn}>
            위치선택하기
        </Button>
        <Button className={props.classes.button} variant='outlined' color="primary" onClick={props.onClickGoBackBtn}>
            돌아가기
        </Button>

    </div>
);

<MapWithASearchBox />

export  default withStyles(styles)(withRouter(MapWithASearchBox));

