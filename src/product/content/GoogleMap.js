import React from 'react';
import {geolocated} from 'react-geolocated';
import MapWithASearchBox from "./MapWithASearchBox";
import {CircularProgress, Grid} from "@material-ui/core";
import {withRouter} from "react-router-dom";
import * as util from "../util/CommonUtils";

class GoogleMap extends React.Component {

    state = {
        returnUrl:''
    }
    componentDidMount(){

        this.setState({returnUrl : util.getUrlParam(this.props,'returnUrl')});

    }
    render() {


        return !this.props.isGeolocationAvailable
            ? <MapWithASearchBox returnUrl={this.state.returnUrl}/>
            : !this.props.isGeolocationEnabled
                ? <MapWithASearchBox returnUrl={this.state.returnUrl}/>
                : this.props.coords
                    ? <MapWithASearchBox lat={this.props.coords.latitude} lng={this.props.coords.longitude}
                                         returnUrl={this.state.returnUrl}/>
                    : <Grid container alignItems='center' style={{height: '300px'}}>
                        <Grid item xs={12}>
                            <CircularProgress size={100}/>
                        </Grid>
                    </Grid>
}}

GoogleMap.propTypes = {};

export default geolocated({
    positionOptions: { enableHighAccuracy: false,},
    userDecisionTimeout: 2000,
}) (withRouter(GoogleMap));