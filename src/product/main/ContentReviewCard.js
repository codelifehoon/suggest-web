import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import {Card,  CardHeader,CardContent, CardActions,Collapse,Avatar,IconButton,Badge,Snackbar } from '@material-ui/core';
import {red} from '@material-ui/core/colors';
import {stateFromHTML} from 'draft-js-import-html';

import {stateToHTML} from 'draft-js-export-html';
import htmlReactParser from 'html-react-parser';

import dateformat from 'dateformat';
import axios from "axios/index";
import SnaShareForKR from "../CommonComponet/SnaShareForKR";
import {withRouter} from "react-router-dom";
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import {Edit,AlarmAdd,Share,ExpandMore,SpeakerNotes,ThumbUp} from "@material-ui/icons";
import {subscribeUser} from "../../registerServiceWorker";
import * as Config from "../util/Config";



const styles = theme => ({
    card: {
        maxWidth: '100%',
    },
    media: {
        height: 194,
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        // backgroundColor: red[500],
    },

});

class ContentReviewCard extends React.Component {
    state = {   expandedDesc: false ,
                expandedShare: false ,
                snackbarOpen: false,
                snackbarMessage:'',
                snackbarVertical: 'top',
                snackbarHorizontal: 'center',
                eventContentNo : 0,
                contentThumbupNo :null,
                contentAlarmNo :null,
                contentCommentCnt : 0,

    };

    componentDidMount(){

        this.setState( {eventContentNo : this.props.content.eventContentNo,
                            contentThumbupNo :this.props.content.contentThumbupNo,
                            contentAlarmNo :this.props.content.contentAlarmNo,
                            contentCommentCnt : this.props.content.contentCommentCnt,
                            expandedDesc: this.props.expandedDesc,
                            expandedShare : this.props.expandedShare,
                        });
    }

    handleExpandClick = () => {
        this.setState({ expandedDesc: !this.state.expandedDesc });
    };

    getFormatDate = (eventStart,eventEnd) =>{

        let retVal = null;
        if (eventStart && eventEnd){
            retVal =  (
                <div>
                    {dateformat(new Date(eventStart),'mm/dd')+' 10:00'}~{dateformat(new Date(eventEnd),'mm/dd')+' 10:00'}
                </div>);

        }

        return retVal;

    }


    pushCheck = (subscription) =>{
        console.log('pushCheck:' + subscription);
    }
    onAlarmAddBtn = () =>{

        const  {contentAlarmNo,eventContentNo} = this.state;

        // 등록 된 후에 삭제할때
        if (contentAlarmNo ) {
            axios.patch(Config.API_URL + '/Content/V1/updateContentAlarm/'+  contentAlarmNo +'/N'
                ,{}
                , {withCredentials: true, headers: {'Content-Type': 'application/json'}}
            )
                .then(res => { this.setState({contentAlarmNo : null}); })
                .catch(err => { console.error('>>>> :' + err); });

        }else{
            //신규 알람 등록
            const jsonValue = {
                "eventContentNo": eventContentNo
            };
            axios.post(Config.API_URL + '/Content/V1/addContentAlarm'
                , jsonValue
                , {withCredentials: true, headers: {'Content-Type': 'application/json'}}
                        )
                .then(res => { this.setState({contentAlarmNo : res.data});subscribeUser(this.pushCheck);})
                .catch(err => { console.error('>>>> :' + err); });

        }

    }

    onThumbUpBtn = () =>{

        const  {contentThumbupNo,eventContentNo} = this.state;

        //신규 알람 등록
        const jsonValue = {
            "eventContentNo": eventContentNo
        };

        // 등록 된 후에 삭제할때
        if (contentThumbupNo ) {

            axios.patch(Config.API_URL + '/Content/V1/updateContentThumbUp/'+  contentThumbupNo +'/N'
                ,{}
                , {withCredentials: true, headers: {'Content-Type': 'application/json'}}
            )
                .then(res => { this.setState({contentThumbupNo : null});})
                .catch(err => { console.error('>>>> :' + err); });

        }else{
            axios.post(Config.API_URL + '/Content/V1/addContentThumbUp'
                , jsonValue
                , {withCredentials: true, headers: {'Content-Type': 'application/json'}}
            )
                .then(res => { this.setState({contentThumbupNo : res.data});})
                .catch(err => { console.error('>>>> :' + err); });
        }

    }
    onCommentListBtn = () =>{
        this.props.history.push('/contentMain?eventContentNo=' + this.state.eventContentNo);
    }

    onShareBtnBtn = () =>{
        // this.setState({ snackbarOpen: true, snackbarMessage:'메세지메세지메세지:onShareBtnBtn'});
        this.setState({ expandedShare: !this.state.expandedShare });

    }

    onClickSnackbarClose = () => {
        this.setState({ snackbarOpen: false });
    };

    onContentEditBtn = () => {
        this.props.history.push('/editRegistryPlan?eventContentNo=' + this.state.eventContentNo)
    }

    render() {

        const {snackbarOpen,snackbarVertical,snackbarHorizontal,snackbarMessage,contentThumbupNo,contentAlarmNo,contentCommentCnt,expandedDesc,expandedShare} = this.state;
        const { classes  , refBy} = this.props;
        const { eventContentNo
            ,eventDesc
            ,eventDescText
            ,eventDescThumbnails
            ,eventLocations
            ,contentStorages
            ,eventStart
            ,eventEnd
            ,refPath
            ,repeatKind
            ,title
            ,userPhotos
            ,userNm
            ,isEqualLoginUser
            } = this.props.content;
        const avatarText = userPhotos ? '' : userNm;
        let alarmAddIconColor, thumbUpIconColor;


        if (contentAlarmNo  ) alarmAddIconColor = 'red';
        else alarmAddIconColor = '';

        if (contentThumbupNo ) thumbUpIconColor = 'red';
        else thumbUpIconColor = '';


        // 이미지 변환시 최대 사이즈 조정을 위해서 style추가
        let options = {
            entityStyleFn: (entity) => {
                const entityType = entity.get('type').toLowerCase();
                if (entityType === 'image') {
                    const data = entity.getData();

                    return {
                        element: 'img',
                        attributes: {
                            src: data.src,
                        },
                        style: {
                            'max-width' : '100%','max-height': '100%',
                        },
                    };
                }
            },
        };



        const shortEventDesc=  eventDescText ? eventDescText.substr(0,40) : "";  //eventDescText null check
        const eventPeriod = this.getFormatDate(eventStart,eventEnd);
        const contentState = stateFromHTML(eventDesc);      // markdown으로 생각하고 state 구조를 가져오고
        let eventDescHtml =  stateToHTML(contentState,options);       // satet를 Html로 변경 (html 변경시 < 테그는  &lt;로 전환됨
         // let eventDescHtml = eventDesc;
        // eventDescHtml = unEscapeHTML(eventDescHtml).replace(/\\s\\s/g,'<BR>');

        const attachImages = contentStorages.map(d => { return {original:d.storageValue};});
        let thumbnailImages = [];


        // console.log("#################");
        // console.log(eventDescThumbnails);
        // console.log(contentStorages);
        //
        if (eventDescThumbnails) JSON.parse(eventDescThumbnails).map(d =>{thumbnailImages.push({original: d});});

        thumbnailImages = thumbnailImages.concat(attachImages);


        return (
            <div>

                <Card className={classes.card}>

                    <CardHeader style={{textAlign:'left'}}
                        avatar={
                            <Avatar aria-label="Recipe" className={classes.avatar} src={userPhotos}>{avatarText}</Avatar>
                        }
                        // action={
                        //     <IconButton onClick={this.OnClickIconBtn}>
                        //         <MoreVert />
                        //     </IconButton>
                        // }
                        title={title}
                        subheader={eventPeriod}
                    />

                    { refBy !== 'ContentMain' && thumbnailImages.length > 0 ? <ImageGallery items={thumbnailImages} lazyLoad={true} showPlayButton={false} showThumbnail={false}  onClick={this.onCommentListBtn}/>
                        : '' }

                    { refBy !== 'ContentMain' ? <CardContent style={{wordBreak:'break-all'}}  onClick={this.handleExpandClick}>{shortEventDesc} </CardContent>
                        : ''
                    }


                    <CardActions className={classes.actions} disableActionSpacing>
                        <IconButton  aria-label="Add to Alarm" onClick={this.onAlarmAddBtn}  style={{color: alarmAddIconColor}} >
                            <AlarmAdd />
                        </IconButton>
                        <IconButton  aria-label="Add to ThumbUp" onClick={this.onThumbUpBtn} style={{color: thumbUpIconColor}}>
                            <ThumbUp/>
                        </IconButton>
                        <IconButton aria-label="Add to favorites"  onClick={this.onCommentListBtn}>
                            <Badge  badgeContent={contentCommentCnt} color="secondary">
                                <SpeakerNotes  />
                            </Badge>
                        </IconButton>

                        <IconButton  aria-label="Share" onClick={this.onShareBtnBtn}>
                            <Share/>
                        </IconButton>
                        {
                            isEqualLoginUser ? <IconButton  aria-label="Contens Edit"onClick={this.onContentEditBtn} ><Edit/></IconButton>
                                : ''
                        }

                        <IconButton
                            className={classnames(classes.expand, {
                                [classes.expandOpen]: expandedDesc,
                            })}
                            onClick={this.handleExpandClick}
                            aria-expanded={expandedDesc}
                            aria-label="Show more"
                        >
                            <ExpandMore/>
                        </IconButton>

                    </CardActions>

                    <Collapse in={expandedShare} timeout="auto" unmountOnExit>
                        <SnaShareForKR pathname={ Config.WEB_URL +'/contentMain?eventContentNo='+ eventContentNo}/>
                    </Collapse>


                    <Collapse in={expandedDesc} timeout="auto" unmountOnExit>

                        <CardContent style={{wordBreak:'break-all',textAlign:'left'}}>
                            {htmlReactParser(eventDescHtml)}
                            {refBy === 'ContentMain' ?  attachImages.map(d=>{return <img key={d.original} src={d.original} style={{'maxWidth' : '100%','maxHeight': '100%'}}/>})
                                                    :''
                            }
                        </CardContent>
                    </Collapse>

                </Card>


                <Snackbar
                    anchorOrigin={{vertical:snackbarVertical, horizontal:snackbarHorizontal }}
                    open={snackbarOpen}
                    onClose={this.onClickSnackbarClose}
                    SnackbarContentProps={{'aria-describedby': 'message-id',}}
                    message={<span id="message-id">{snackbarMessage}</span>}
                />

            </div>
        );





    }
}

ContentReviewCard.propTypes = {
    classes: PropTypes.object.isRequired,
    content: PropTypes.object.isRequired,
};



export default withStyles(styles)(withRouter(ContentReviewCard));
