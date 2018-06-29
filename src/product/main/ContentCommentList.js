import React from 'react';
import ContentComment from "./ContentComment";
import PropTypes from 'prop-types';
import axios from "axios/index";
import * as Config from "../util/Config";


class ContentCommentList extends React.Component {



    constructor(props){
        super(props);
        this.state = { commentList : props.commentList};

    }
    onCommentDelRequested = (comment) =>{

        axios.patch(Config.API_URL + '/Content/V1/deleteContentComment/'+  comment.contentCommentNo
            ,{}
            , {withCredentials: true, headers: {'Content-Type': 'application/json'}}
        )
            .then(res => {this.modifyComment('del',comment); })
            .catch(err => { console.error('>>>> :' + err); });
    }
    onCommentUpdateRequested = (comment) =>{

        const jsonValue = {
            contentCommentNo: comment.contentCommentNo,
            commentDesc: comment.commentDesc,
        }
        axios.patch(Config.API_URL + '/Content/V1/updateContentComment'
            ,jsonValue
            , {withCredentials: true, headers: {'Content-Type': 'application/json'}}
        )
            .then(res => { this.modifyComment('update',comment);})
            .catch(err => { console.error('>>>> :' + err); });
    }

    modifyComment = (proc,comment) =>{
        const {commentList}  = this.state;
        let newCommentList = null;

        if (proc === 'del')
        {
            newCommentList = commentList.filter((d) => {
                return d.contentCommentNo !== comment.contentCommentNo
            });
        }
        if (proc === 'update'){
            newCommentList = commentList.map((d) => {
                if (d.contentCommentNo === comment.contentCommentNo) d.commentDesc = comment.commentDesc
                return d;
            });

        }


        this.setState({ commentList : newCommentList});
    }


    render() {

        return (
            <div>

            { this.state.commentList.map( d  => { return (
                <ContentComment key={d.contentCommentNo}
                                comment={d}
                                onCommentDelRequested={this.onCommentDelRequested}
                                onCommentUpdateRequested={this.onCommentUpdateRequested}></ContentComment>
            )
            }) }
        </div>);
    }
}

ContentCommentList.propTypes = {
    commentList : PropTypes.array
};


export default (ContentCommentList);


