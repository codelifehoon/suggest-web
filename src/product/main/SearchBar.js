import React from 'react';
import {IconButton,Typography,Grid} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import SearchInputBox from "./SearchInputBox";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import axios from "axios/index";
import DateClickSelecter from "../CommonComponet/DateClickSelecter";
import {doIntergateSearch, getIntergratSearchReload, isNextPage, setIntergratSearchReload} from "../util/CommonUtils";
import * as Config from "../util/Config";
import {MyLocation} from "@material-ui/icons";
import {withRouter} from "react-router-dom";
import * as util from "../util/CommonUtils";
import * as GoogleAPI from "../util/GoogleAPI";
import Cookies from 'universal-cookie';

const styles = theme =>({
});


class SearchBar extends React.Component{


    state ={
        period: '모든날짜',
        searchSentence : '',
        latitude : 0,
        longitude : 0,
        locationDistance : 0,
        address :'',
        autoCompliteList :[]
    };


    componentWillMount(){


        this.initLocation();


        this.initLoading();


    };


    initLoading = () =>{

        // 기존 내역이 없거나  reload가 true 이면 새로 조회하지 않는다.
        if (!this.props.intergratSearchResult.responseData  || getIntergratSearchReload() ) {
            setIntergratSearchReload('');

            // setState 비동기 후 검색 될 수 있도록 검색을 비동기 처리 대상으로 처리하여 state값이 적용된 후 조회 될 수 있도록 한다.
            Promise.resolve().then(() => this.doSearch());
        }

            // 화면 처음 접근해서 기존 조회 결과가 없을때 최초 조회를 한다.
            // let retUrl = Config.API_URL + '/Content/V1/findAutoCompliteList/type1'
            // //GET
            // axios.get(retUrl)
            //     .then(res =>{ this.setState({autoCompliteList : res.data});})
            //     .catch(err => { console.log('>>>> :' + err); });


    }

    initLocation = () => {

        const cookies = new Cookies();
        const intergratSearch = cookies.get('intergratSearch');
        const distance = util.getUrlParam(this.props,'distance');
        let latLng = util.getUrlParam(this.props,'latLng');
        if (latLng) latLng =  JSON.parse(latLng);


        if (intergratSearch){
            intergratSearch.searchSentence = decodeURIComponent(intergratSearch.searchSentence);
        }


        // param 정보가 없고 쿠키가 있다면 쿠키정보를 그대로 사용함
        if( !latLng  && intergratSearch)
        {
            this.setState(intergratSearch);
            return;
        }

        // 위치기준이 없을 경우
        if (distance === ''){
            this.setState({
                latitude : 0,
                longitude : 0,
                locationDistance : 0,
                address : ''
            });
            return;
        }

        // param으로 전달 된 위치 정보와 쿠키의 위치정보가 같다면 쿠키정보를 그대로 사용 함.
        if (latLng
            && intergratSearch
            && latLng.lat === intergratSearch.latitude
            && latLng.lng === intergratSearch.longitude
            && distance === intergratSearch.locationDistance )
        {

            this.setState(intergratSearch);
            return;
        }

        if (latLng) {

            this.setState({
                latitude : latLng.lat,
                longitude : latLng.lng,
                locationDistance : distance,
                searchSentence :  intergratSearch ? intergratSearch.searchSentence : '',
                address : this.getDistanceStr(distance)
            });


            GoogleAPI.getFormattedAddressFromLocation(latLng)
                .then(formattedAddress => {
                    const cookies = new Cookies();

                    this.setState({address:formattedAddress + this.getDistanceStr(distance)});
                    cookies.set('intergratSearch',this.state);

                })
                .catch(e => {console.error(e); });
        }
    }
/*
    setStateAndCookie =  (stateObj) =>{

        console.log(stateObj);
        if (stateObj) this.setState(stateObj);

        console.log(this.state);

        const cookies = new Cookies();
        cookies.set('intergratSearch',this.state);
    }
*/

    getDistanceStr = (distance)=>{

        if (distance)
        {
            let regexp = /\B(?=(\d{3})+(?!\d))/g;

            if (distance > 1000)
                distance =  '(주변 ' + (distance/1000).toString().replace(regexp, ',') + 'KM)' ;
            else
                distance =  '(주변 ' + distance.toString().replace(regexp, ',') + 'M)' ;
        }
        return distance;
    }


    doSearch = () =>{
        const cookies = new Cookies();
        let {period,searchSentence,latitude,longitude,locationDistance}  = this.state;

        cookies.set('intergratSearch',this.state);

        if (!searchSentence) searchSentence = 'initSearch';
        doIntergateSearch(this.props.notiIntergrateSearch,period,searchSentence,latitude,longitude,locationDistance,0);

    }


    /*
    onTextChange : 검색 값 창에서  변경시  검색텍스트 관리 및 상황에 따른 조회 실행
         newValue: 변경된 검색값
         isSearch : 검색 실행여부
    * */
    onTextChange = (newValue,isSearch) => {

        console.log(newValue);
        newValue = newValue.trim();
        this.setState({ searchSentence:encodeURIComponent(newValue)});


        // status 변경이 비동기처리도 되는듯..  변경 후 바로 읽으려니 안되네..
        if (isSearch) Promise.resolve().then(d => this.doSearch());

    };

    onDateChange = ( newDate  ) => {
        this.setState({period:newDate});
        Promise.resolve().then(d => this.doSearch());



    };


    onChoiceMapClick = () => {

        const cookies = new Cookies();
        const returnUrl = encodeURIComponent('/');

        // 이미 주소가 선택 되어 있다면 위치 초기화.
        if (this.state.latitude != 0){

            this.setState({
                latitude : 0,
                longitude : 0,
                locationDistance : 0,
                address : ''
            });

            cookies.set('intergratSearch',this.state);
            setIntergratSearchReload(true);
            this.props.history.push("/");
            // setState 비동기 후 검색 될 수 있도록 검색을 비동기 처리 대상으로 처리하여 state값이 적용된 후 조회 될 수 있도록 한다.
            Promise.resolve().then(()=>this.doSearch());

        }else {
            cookies.set('intergratSearch',this.state);
            this.props.history.push('/Map?returnUrl=' + returnUrl);
        }
    };

    render(){

        const {classes} = this.props;
        const {address,latitude,searchSentence} = this.state;
        let  locationBtnColor  = "default";

        if (latitude != 0)  locationBtnColor  = "secondary";

        return (
            <div>
                <Grid >
                    <Grid container >
                        <Grid item xs={2} align={'right'}><IconButton color={locationBtnColor} onClick={this.onChoiceMapClick} ><MyLocation/></IconButton></Grid>
                        <Grid item xs={8}>
                            {address ? <Typography color='inherit' variant="caption" gutterBottom align="center" style={{margin:0,padding:0}}>{address}</Typography> : ''}
                            <SearchInputBox onChange={this.onTextChange} autoCompliteList={this.state.autoCompliteList} searchTextValue={searchSentence}/>
                            </Grid>
                        <Grid item xs={2}>
                            <Typography noWrap align={'left'}>
                                <IconButton onClick={this.doSearch}><SearchIcon/></IconButton>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} > <DateClickSelecter dateString={this.state.period} onChange={this.onDateChange} /></Grid>
                </Grid>
            </div>
        );
    }
}

SearchBar.propTypes = {
    notiIntergrateSearch : PropTypes.func.isRequired,
    intergratSearchResult: PropTypes.object.isRequired,
}

SearchBar.defaultProps = {
    notiIntergrateSearch : ()=> {},
}



export  default withStyles(styles)(withRouter(SearchBar));