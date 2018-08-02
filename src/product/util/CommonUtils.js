import React from 'react';
import queryString from "query-string";
import axios from "axios/index";
import Cookies from 'universal-cookie';
import dateformat from "dateformat";
import * as Config from "./Config";


// Router 통해서 보여지는 page는  param을 읽기위해서 component export에 withRouter 추가 되어여합니다.
export const getUrlParam = (props,value) =>{

    if (typeof( props.location) !== 'undefined'
        &&  queryString.parse( props.location.search))  {

        let retValue =  queryString.parse(props.location.search)[value];
        if (typeof(retValue)  !== 'undefined' ) return retValue;
    }

    return '';
};


export const getWebCertInfoCookie = () =>{

    const cookies = new Cookies();
    const webCertInfo = cookies.get('webCertInfo');
    if (webCertInfo) return JSON.parse(cookies.get('webCertInfo').replace('j:',''));
    else return '';

};





export const  doIntergateSearch = (notiIntergrateSearch,period,searchSentence,latitude,longitude,locationDistance,page,prevList,callBack) =>{


    if (period !== '모든날짜')  {period = dateformat(period,'yyyy-mm-dd');}
    else  {period = dateformat(new Date(),'yyyy-mm-dd');}

    const reqUrl = Config.API_URL + '/Content/V1/findEventList'
        + '/' + searchSentence
        + '/' + period
        + '/' + latitude
        + '/' + longitude
        + '/' + locationDistance
        + '?page=' + page;


    // new search init
    if ( !prevList){
        let notiData ={ period : period,
            searchSentence : searchSentence,
            latitude : latitude,
            longitude : longitude,
            locationDistance : locationDistance,
            page: page,
            responseData : null };
        notiIntergrateSearch(notiData);
    }

    axios.get(reqUrl
        ,{withCredentials: true, headers: {'Content-Type': 'application/json'}})
        .then(res =>{
            let responseData =  res.data;

            if (prevList) {
                let nextList =  responseData.content;
                let mergeList = prevList.concat(nextList);

                responseData.content = mergeList;
            }

            let notiData ={ period : period,
                            searchSentence : searchSentence,
                            latitude : latitude,
                            longitude : longitude,
                            locationDistance : locationDistance,
                            page: page,
                            responseData : responseData };

            notiIntergrateSearch(notiData);
            if (callBack) callBack();
        } )
        .catch(err => { console.log('>>>> :' + err); if (callBack) callBack();});
};

export  const isNextPage= (responseData) => {
    return responseData && !responseData.last;
}


export const unEscapeHTML = (html) => {
    var entityPairs = [
        {character: '&amp;', html: '&'},
        {character: '&lt;', html: '<'},
        {character: '&gt;', html: '>'},
        {character: "&apos;", html: "'"},
        {character: '&quot;', html: '"'},
    ];

    entityPairs.forEach(function(pair){
        var reg = new RegExp(pair.character, 'g');
        html = html.replace(reg, pair.html);
    });
    return html;
}


export const setIntergratSearchReload = (flag) => { sessionStorage.setItem('contentReload', flag); }
export const getIntergratSearchReload = () => { return sessionStorage.getItem('contentReload'); }

