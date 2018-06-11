
import {connect} from 'react-redux';
import * as actions from './ReducerActions';
import  SearchBar from '../product/main/SearchBar';
import  BodyContent from '../product/main/BodyContent'

let mapStatusintergratSearch = (state) =>{
    return {
                intergratSearchResult : state.intergratSearchReducer.intergratSearchResult,
            };
    };

let mapDispatchIntergratSearch = (dispatch) =>{
    return {
        notiIntergrateSearch : (notiData) => dispatch(actions.intergratSearchAction(notiData)),
    };
};


/*
let mapStatusToMainBodyContentProps = (state) =>{
    return {
            content : state.intergratSearchReducer.content,
    };
};
*/

export  const SearchBarContainer = connect(mapStatusintergratSearch,mapDispatchIntergratSearch)(SearchBar);
export  const BodyContentContainer = connect(mapStatusintergratSearch,mapDispatchIntergratSearch)(BodyContent);
