import React from 'react';
import {IconButton,Typography,Grid} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import SearchInputBox from "./SearchInputBox";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import axios from "axios/index";
import DateClickSelecter from "../CommonComponet/DateClickSelecter";
import {doIntergateSearch} from "../util/CommonUtils";
import * as Config from "../util/Config";

const styles = theme =>({
});


class SearchBar extends React.Component{


    state ={
        period: '모든날짜',
        searchSentence : 'initSearch',
        autoCompliteList :[]
    };

    componentDidMount(){


        let retUrl = Config.API_URL + '/Content/V1/findAutoCompliteList/type1'

        //GET
        axios.get(retUrl)
            .then(res =>{ this.setState({autoCompliteList : res.data});})
            .catch(err => { console.log('>>>> :' + err); });

        this.doSearch();

    };


    doSearch = () =>{
        const {period,searchSentence}  = this.state;

        doIntergateSearch(this.props.notiIntergrateSearch,period,searchSentence,0,0,0);

    }


    /*
    onTextChange : 검색 값 창에서  변경시  검색텍스트 관리 및 상황에 따른 조회 실행
         newValue: 변경된 검색값
         isSearch : 검색 실행여부
    * */
    onTextChange = (newValue,isSearch) => {


        this.setState({ searchSentence:encodeURIComponent(newValue)});
        console.log('newValue:' + encodeURIComponent(newValue));
        // this.props.notiSearchTextChange(newValue);

        // status 변경이 비동기처리도 되는듯..  변경 후 바로 읽으려니 안되네..
        if (isSearch) Promise.resolve().then(d => this.doSearch());
        // console.log(newValue);
    };

    onDateChange = ( newDate  ) => {
        this.setState({period:newDate});
        Promise.resolve().then(d => this.doSearch());
    };


    doSearchButton = () =>
    {
        this.props.notiIntergrateSearch(this.state.searchSentence);
        console.log('###doSearch###');
    }

    render(){

        const {classes} = this.props;

        return (
            <div>
                <Grid classes={classes.root}>
                    <Grid container classes={classes.row}>

                        <Grid item xs={1} classes={classes.col}></Grid>
                        <Grid item xs={9} classes={classes.col}  >
                            <SearchInputBox onChange={this.onTextChange} autoCompliteList={this.state.autoCompliteList}/>
                            </Grid>
                        <Grid item xs={2}  classes={classes.col}>
                            <Typography noWrap align={'left'}>
                                <IconButton onClick={this.doSearch}><SearchIcon/></IconButton>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} > <DateClickSelecter dateString={this.state.period} onChange={this.onDateChange}/></Grid>
                </Grid>
            </div>
        );
    }
}


SearchBar.propTypes = {
    notiIntergrateSearch : PropTypes.func.isRequired,
}

SearchBar.defaultProps = {
    notiIntergrateSearch : ()=> {},
}



export  default withStyles(styles)(SearchBar);