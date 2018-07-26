import React from 'react';
import PropTypes from 'prop-types';
import {List,ListItem,ListItemAvatar,ListItemSecondaryAction,IconButton,ListItemText,Grid,CircularProgress,FormControl,Select} from '@material-ui/core';
import {ThumbUp,Edit,InsertComment,AlarmAdd,Delete,ExpandMore} from "@material-ui/icons";
import axios from "axios/index";
import {isNextPage} from "../util/CommonUtils";
import { green } from "@material-ui/core/colors";
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import {Link, withRouter} from "react-router-dom";
import * as Config from "../util/Config";


const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
    },
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
});

class ActivityManager extends React.Component {

    state = {
        activityList : { page: -1,
                        responseData : null
                        },
        moreLoading : false,
        moreLoadingSuccess: false,
        activityCode : 'ALL',
    };

    componentDidMount(){

        this.doActivitySearch(this.notiActivitySearch, 'ALL', 0,null)
    }

    notiActivitySearch = (notiData) =>{

        this.setState({activityList: notiData});
    }

    moreContentBtn = () =>{
        this.doActivitySearch(this.notiActivitySearch, this.state.activityCode,this.state.activityList.responseData.number+1, this.state.activityList.responseData.content)

    }
    doActivitySearch = (notiActivitySearch,activityCode  ,page,prevList) =>{

        const reqUrl = Config.API_URL + '/Content/V1/findContentActivityList/' + activityCode
            + '?page=' + page
            + '&size=1000';

        axios.get(reqUrl
            ,{withCredentials: true, headers: {'Content-Type': 'application/json'}})
            .then(res =>{
                let responseData =  res.data;

                if (prevList) {
                    let nextList =  responseData.content;
                    let mergeList = prevList.concat(nextList);
                    responseData.content = mergeList;
                }

                let notiData ={
                    page: page,
                    responseData : responseData };

                notiActivitySearch(notiData);
            } )
            .catch(err => { console.log('>>>> :' + err);});
    };

    clickDeleteActivity = (d)=>{

        if (d.contentActivity.activityCode  === 'CONTENT'){
            this.updateActivityStat(Config.API_URL + '/Content/V1/updateContentStat/' +d.contentActivity.activityRefNo + '/S4',d);
        }else if( d.contentActivity.activityCode  === 'COMMENT'){
            this.updateActivityStat(Config.API_URL + '/Content/V1/deleteContentComment/' + d.contentActivity.activityRefNo,d);
        }else if (d.contentActivity.activityCode === 'ALARM'){
            this.updateActivityStat(Config.API_URL + '/Content/V1/updateContentAlarm/'  + d.contentActivity.activityRefNo + '/N',d);
        }else if (d.contentActivity.activityCode  === 'THUMBSUP'){
            this.updateActivityStat(Config.API_URL + '/Content/V1/updateContentThumbUp/' + d.contentActivity.activityRefNo + '/N',d);
        }
    }

    updateActivityStat = (url,d)  => {
        axios.patch(url
            ,{}
            ,{withCredentials: true, headers: {'Content-Type': 'application/json'}})
            .then(res =>{ this.deleteActivityList(d) } )
            .catch(err => { console.log('>>>> :' + err);});

    }

    deleteActivityList= (d) =>{

    }

    changeActivityCode = name => event => {
        this.setState({ [name]: event.target.value });
        this.doActivitySearch(this.notiActivitySearch, event.target.value, 0,null)
    };


    doubleArrowFuntonTest = (main) =>{

        console.log('someFunton/' + main );

        return (sub) =>{
            console.log('subSomeFunction/' + main + '/ '+ sub);
        }
    }

    removeList = (d) =>{
        alert('removeList');
    }

    contentComponet = (d) =>{
        if (!d.eventContent) return '';
        return (<ListItem key={d.contentActivity.contentActivityNo}>
            <ListItemAvatar>
                    <IconButton  aria-label="Contens"  style={{color: 'red'}}>
                        <Edit/>
                    </IconButton>
            </ListItemAvatar>
            <Link to={'/contentMain?eventContentNo=' + d.eventContent.eventContentNo}>
                <ListItemText primary={d.eventContent.title} />
            </Link>
            <ListItemSecondaryAction>
                <IconButton  aria-label="Delete to Contens" onClick={()=>{this.clickDeleteActivity(d)}} >
                    <Delete />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>);
    }
    commentComponent = (d) => {
        if (!d.eventContent) return '';
        return ( <ListItem key={d.contentActivity.contentActivityNo}>
            <ListItemAvatar>
                    <IconButton  aria-label="Comment" style={{color: 'red'}}>
                        <InsertComment/>
                    </IconButton>
            </ListItemAvatar>
            <Link to={'/contentMain?eventContentNo=' + d.eventContent.eventContentNo}>
                <ListItemText primary={d.eventContent.title}/>
            </Link>
            <ListItemSecondaryAction>
                <IconButton  aria-label="Delete to Comment" onClick={()=>{this.clickDeleteActivity(d)}}   >
                    <Delete />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>);
    }

    alarmComponent = (d) => {
        if (!d.eventContent) return '';
        return ( <ListItem key={d.contentActivity.contentActivityNo}>
            <ListItemAvatar>
                    <IconButton  aria-label="Alarm"  style={{color: 'red'}} >
                        <AlarmAdd />
                    </IconButton>
            </ListItemAvatar>
            <Link to={'/contentMain?eventContentNo=' + d.eventContent.eventContentNo}>
                <ListItemText primary={d.eventContent.title}/>
            </Link>
            <ListItemSecondaryAction>
                <IconButton  aria-label="Delete to Alarm" onClick={()=>{this.clickDeleteActivity(d)}}  >
                    <Delete />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>);
    }
    thumbsupComponent = (d) => {
        if (!d.eventContent) return '';
        return (<ListItem key={d.contentActivity.contentActivityNo}>
            <ListItemAvatar>
                <IconButton  aria-label="ThumbUp"  style={{color: 'red'}}>
                    <ThumbUp/>
                </IconButton>
            </ListItemAvatar>
            <Link to={'/contentMain?eventContentNo=' + d.eventContent.eventContentNo}>
                <ListItemText primary={d.eventContent.title}/>
            </Link>
            <ListItemSecondaryAction>
                <IconButton  aria-label="Delete to Alarm" onClick={()=>{this.clickDeleteActivity(d)}}  >
                    <Delete />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>);
    }




    render() {
        const { classes } = this.props;
        const { page, responseData} = this.state.activityList;
        const { moreLoading , moreLoadingSuccess ,activityCode} = this.state;
        let moreBtnFlag = false;
        const buttonClassname = classNames({
            [classes.buttonSuccess]: moreLoadingSuccess,
        });

        if (0 > page) return <div></div>;
        if (isNextPage(responseData)) moreBtnFlag = true;

        return (<div>
            <div className={classes.root}>
                <br/>
                <Grid item xs={12}>

                    <FormControl className={classes.formControl}>
                        <Select native value={activityCode} onChange={this.changeActivityCode('activityCode')} inputProps={{id: 'activityCodeInput',}} >
                            <option value={'ALL'}>전체보기</option>
                            <option value={'CONTENT'}>작성 게시물 보기</option>
                            <option value={'COMMENT'}>작성댓글 게시물 보기</option>
                            <option value={'ALARM'}>알람 신청 게시물 보기</option>
                            <option value={'THUMBSUP'}>좋아요 신청 게시물 보기</option>
                        </Select>
                    </FormControl>


                </Grid>
                <List dense={true}>
                    {
                        responseData.content.map(d=>{
                            return (
                            d.contentActivity.activityCode  === 'CONTENT' ? this.contentComponet(d)
                                : d.contentActivity.activityCode  === 'COMMENT' ? this.commentComponent(d)
                                    : d.contentActivity.activityCode === 'ALARM' ? this.alarmComponent(d)
                                        : d.contentActivity.activityCode  === 'THUMBSUP' ? this.thumbsupComponent(d)
                                            :''
                            )
                        })
                    }
                </List>
                {
                    moreBtnFlag
                        ?<Grid item xs={12}>
                            <div className={classes.wrapper}>
                                <IconButton
                                    variant="raised"
                                    color="primary"
                                    className={buttonClassname}
                                    disabled={moreLoading}
                                    onClick={this.moreContentBtn}
                                >
                                    more     <ExpandMore />
                                </IconButton>
                                {moreLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
                            </div>
                        </Grid>
                        : ''
                }

            </div>
        </div>);
    }
}



ActivityManager.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(ActivityManager));



