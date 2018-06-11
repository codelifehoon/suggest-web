import React from 'react';
import {Grid,Button, CircularProgress, Icon, IconButton} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from 'prop-types';
import * as dateformat from "dateformat";
import ContentReviewCardList from "./ContentReviewCardList";
import 'typeface-roboto';
import {ExpandMore} from "@material-ui/icons";
import {doIntergateSearch, getWebCertInfoCookie, isNextPage} from "../util/CommonUtils";
import green from '@material-ui/core/colors/green';
import classNames from 'classnames';
import NoSearchResultsCard from "./NoSearchResultsCard";
;

const styles = theme => ({
    alignCenter : {
        marginTop :'auto',
        marginBottom:'auto'
    },
    nextButton: {
        margin: theme.spacing.unit,
        width  : '80%',
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    }, button: {
        margin: theme.spacing.unit,
    },
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative',
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },

});


class BodyContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchDate : dateformat(new Date(),'yyyy-mm-dd'),
            contentList: null,
            moreLoading : false,
            moreLoadingSuccess: false,
            webCertInfo : null,
        };
    }


    componentDidMount(){
        this.setState({webCertInfo : getWebCertInfoCookie()});
    }


    createContentList= (responseData) => {

        const data = responseData;
        let jsonList = [];


        for (let key in data.content){
            if(data.content.hasOwnProperty(key)) {

                let d = data.content[key];
                let contentTemp = Object.assign({},d.eventContent,d.user);
                contentTemp.isEqualLoginUser   =d.isEqualLoginUser
                contentTemp.contentThumbupNo   =d.contentThumbUp.contentThumbupNo;
                contentTemp.contentAlarmNo     =d.contentAlarm.contentAlarmNo;
                contentTemp.contentCommentCnt  =d.commentCnt;
                jsonList.push(contentTemp);

            }
        }
        return jsonList;
    }

    moreContnetComplite = () => {

    }


    moreContentBtn = () =>{

        const  {notiIntergrateSearch,intergratSearchResult} = this.props;

        if (intergratSearchResult.responseData)
        {
            this.setState({moreLoading:true,moreLoadingSuccess:false});

            doIntergateSearch(notiIntergrateSearch
                ,intergratSearchResult.period
                ,intergratSearchResult.searchSentence
                ,intergratSearchResult.latitude
                ,intergratSearchResult.longitude
                ,intergratSearchResult.responseData.number + 1
                ,intergratSearchResult.responseData.content
                ,()=>{this.setState({moreLoading:false,moreLoadingSuccess:false});});

        };
    }



    render() {

        const  {classes,intergratSearchResult} = this.props;
        const  {moreLoading,moreLoadingSuccess} = this.state;
        let contentList= null;
        let moreBtnFlag = false;
        const buttonClassname = classNames({
            [classes.buttonSuccess]: moreLoadingSuccess,
        });

        if (intergratSearchResult.responseData) contentList = this.createContentList(intergratSearchResult.responseData);
        if (isNextPage(intergratSearchResult.responseData) ) moreBtnFlag = true;


        return (

            <Grid container>

                {/*2 row*/}
                <Grid item xs={12}>
                    { contentList == null ? <CircularProgress   size={150} />
                        : contentList.length === 0 ? <NoSearchResultsCard/>
                            : <ContentReviewCardList contentList={contentList}/>
                    }
                </Grid>
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
            </Grid>
        );

    }
}

BodyContent.propTypes = {
    intergratSearchResult: PropTypes.object.isRequired,
};

BodyContent.defaultProps = {
    intergratSearchResult: null,
};

export default withStyles(styles)(BodyContent);