import React from 'react';
import {propTypes,instanceOf} from 'prop-types';
import ContentReviewCard from "../main/ContentReviewCard";
import ContentCommentList from "../main/ContentCommentList";
import {Button, Collapse, Input, Paper, TextField} from "@material-ui/core";
import Cookies from 'universal-cookie';
import axios from "axios/index";
import {getUrlParam, getWebCertInfoCookie} from "../util/CommonUtils";
import {withRouter} from "react-router-dom";
import * as Config from "../util/Config";
// import * as util from "../util/CommonUtils";



class ContentMain extends React.Component {

    state = { expandAddComment : false
                ,addCommentValue : ''
                ,commentList : []
                ,content : null
                ,initContentStatus : false
                ,webCertInfo : null
                };


    componentDidMount(){
        const cookies = new Cookies();
        this.setState({webCertInfo : getWebCertInfoCookie()});

        const eventContentNo = getUrlParam(this.props,'eventContentNo');

        this.initContent(eventContentNo);
    }

    initContent = (eventContentNo) =>{

        if (!eventContentNo) return;

        let jsonObj = {};
        http://localhost:8080/Content/V1/findCommentList/91

        axios.get(Config.API_URL + '/Content/V1/findContentForContentMain/' + eventContentNo
            ,{withCredentials: true, headers: {'Content-Type': 'application/json'}})
            .then(res =>{
                const d = res.data;
                let contentTemp = Object.assign({},res.data.eventContent,d.user);

                contentTemp.isEqualLoginUser   =d.isEqualLoginUser
                contentTemp.contentThumbupNo   =d.contentThumbUp.contentThumbupNo;
                contentTemp.contentAlarmNo     =d.contentAlarm.contentAlarmNo;
                contentTemp.contentCommentCnt  =d.commentCnt;
                contentTemp.contensStorage     =d.contensStorage;

                this.setState({content:contentTemp});
                this.initCommentList(eventContentNo);

            })
            .catch(err => { console.log('>>>> :' + err); });

    }

    initCommentList = (eventContentNo) =>{

            axios.get(Config.API_URL + '/Content/V1/findCommentList/'+ eventContentNo)
            .then(res =>{

                const commentListTemp = res.data.map( d=>{
                    return {
                        contentCommentNo : d.contentComment.contentCommentNo,
                        eventContentNo : d.contentComment.eventContentNo,
                        userHash :d.user.userHash,
                        commentDesc : d.contentComment.commentDesc,
                        commentPw :'',
                        userPhotos : d.user.userPhotos,
                        userNm :d.user.userNm,
                        createDt: d.contentComment.createDt,
                        updateDt: d.contentComment.updateDt
                    };
                });

                console.log(commentListTemp);
                this.setState({commentList : commentListTemp, initContentStatus: true});


            })
            .catch(err => { console.log('>>>> :' + err); });

    }




    onNewCommentAdd = () =>{

        const {expandAddComment,addCommentValue,webCertInfo} = this.state;
        const eventContentNo = getUrlParam(this.props,'eventContentNo');

        //회원로그인 안하고 댓글작성 클릭 했을때
        if(!webCertInfo && !addCommentValue)
        {
            alert('로그인 후 댓글 작성 해주세요.');
            return;
        }
        // 댓글등록 상황일때 click 했다면.
        if ( expandAddComment){

            const jsonValue = { commentDesc: addCommentValue,
                                    commentPw: "",
                                    eventContentNo: eventContentNo,
                                    stat: "S2"
                              };

            axios.post(Config.API_URL + '/Content/V1/addContentComment'
                , jsonValue
                , {withCredentials: true, headers: {'Content-Type': 'application/json'}}
            )
                .then(res => {
                    console.log(res.data);

                    axios.get(Config.API_URL + '/Content/V1/findOneComment/' + res.data
                        ,{withCredentials: true, headers: {'Content-Type': 'application/json'}})
                        .then(res =>{

                            const cc = res.data.contentComment;
                            const user = res.data.user;

                            const comment = {contentCommentNo : cc.contentCommentNo,
                                eventContentNo : cc.eventContentNo,
                                userHash : user.userHash,
                                commentDesc : cc.commentDesc,
                                commentPw :'',
                                userPhotos : user.userPhotos,
                                userNm :user.userNm,
                                createDt: new Date(),
                                updateDt:new Date()
                            };

                            let copyList = this.state.commentList;
                            copyList.unshift(comment);

                            this.setState({commentList : copyList});

                        })
                        .catch(err => { console.log('>>>> :' + err); });
                })
                .catch(err => { console.error('>>>> :' + err); });
        }

        this.setState({ expandAddComment : !expandAddComment});
        this.setState({addCommentValue: ''});
    }

    addCommentChange = (e) => {

        this.setState({addCommentValue: e.target.value});

    }


    render() {
        const {content} = this.state;
        const {expandAddComment,addCommentValue,webCertInfo,commentList,initContentStatus} = this.state;

        return (<div>
                {/*ContentReviewCard에 보여줄 정보를 전달 가능할때 화면에 읽어들임*/}

                {   initContentStatus ?
                    <ContentReviewCard content={content} refBy={'ContentMain'} expandedDesc={true} expandedShare={true}/>
                    : ''}
                <div>

                    <Collapse in={this.state.expandAddComment} timeout="auto" unmountOnExit>
                        <TextField
                            id="addCommentInput"
                            // label="Multiline"
                            multiline
                            rowsMax="5"
                            value={addCommentValue}
                            onChange={this.addCommentChange}
                            // className={classes.textField}
                            margin="normal"
                            style={{width:'100%'}}
                            autoFocus={true}
                        />
                    </Collapse>


                    <Button variant="raised" color="primary" style={{width:'100%'}} onClick={this.onNewCommentAdd}>
                        {  expandAddComment ?  '댓글등록': '댓글작성'}
                    </Button>
                </div>

                <br/>
                <Paper  elevation={1}>
                    { initContentStatus ? <ContentCommentList commentList={commentList}/> : ''}
                </Paper>

            </div>
        );



    }
}





ContentMain.propTypes = {};

export default withRouter(ContentMain);