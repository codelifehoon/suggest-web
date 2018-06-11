import React from 'react';
import axios from "axios/index";
import * as Config from './Config'



export const getFormattedAddressFromLocation = (latLngObj) =>{

    let url =  'https://maps.googleapis.com/maps/api/geocode/json?latlng='
    + latLngObj.lat  +','+ latLngObj.lng
    + '&key=' + Config.GOOGLE_KEY;

    return axios.get(url)
        .then(res =>{
                if (res.data)
                {
                    console.log(res.data);

                    if (res.data.results.length > 0)
                    {
                        let result = res.data.results[0];
                        let address  = result.formatted_address;

                        return Promise.resolve(result.formatted_address);
                    }
                }
        }).catch(err => { console.error('>>>> :' + err); return Promise.reject(err);});


};






