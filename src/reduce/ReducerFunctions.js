import {combineReducers} from 'redux';
import * as types from './ActionTypes';


const IntergrateSearchInitialState = {
    intergratSearchResult :'',
    pos : 'none'
};

const serviceDataInitState = {
    saveKind : '',
    jsonData :{},
};



// action 발생시 처리 logic 및 action 부가정보를 받아서 state 값을 변경하든. 뭔가를 하는 module
// every reducer function  recive notification
export  const  intergratSearchReducer = (state=IntergrateSearchInitialState , action) => {

    switch (action.type){
        case types.INTERGRATE_SEARCH :
            return Object.assign({},state,{intergratSearchResult:action.notiData});
        default:
            return Object.assign({},state,{intergratSearchResult:{}, pos :''});
    }
}


/*

export  const  serviceDataSwitch = (state=serviceDataInitState , action) => {

    switch (action.type){
        case types.SERVICE_RESERVE_DATA :
            return Object.assign({},state,{saveKind:action.saveKind,jsonData:action.jsonData});
        case types.SERVICE_CLEAN_DATA :
            return Object.assign({},state,{saveKind:'',jsonData:{}});
        default:
            console.error('serviceDataSwitch type not define');
            return state;
    }
}
*/



const reducerFunctions = combineReducers({
    intergratSearchReducer,
    // serviceDataSwitch,

});

export default reducerFunctions;
