import React from 'react';
import {Avatar, Button, Collapse, Grid, IconButton, TextField, Typography, withStyles} from "@material-ui/core";
import PropTypes from 'prop-types';
import dateformat from 'dateformat';
import classNames from 'classnames';
import MoreVertMenu from "../CommonComponet/MoreVertMenu";
import {getWebCertInfoCookie} from "../util/CommonUtils";

const styles = theme => ({
    avatar: {
        backgroundColor: 'red[500]',
    },
    smallAvatar: {
        width: 30,
        height: 30,
    },

});


class ContentComment extends React.Component {


    state = {
        expandEditComment : false,
        editCommentValue : '',
    }

    componentDidMount (){
       this.setState({ editCommentValue : this.props.comment.commentDesc});
    }

    onCommentUpdate = (comment) => {

        this.setState({ expandEditComment : !this.state.expandEditComment});
        comment.commentDesc = this.state.editCommentValue;

        this.props.onCommentUpdateRequested(comment);

    }

    editCommentChange = (e) => {

        this.setState({editCommentValue: e.target.value});

    }

    render() {

        const { contentCommentNo,
                eventContentNo,
                userHash,
                commentDesc,
                commentPw,
                userPhotos,
                userNm,
                createDt,
                updateDt
            } = this.props.comment;
        const { classes ,comment} = this.props;
        const avatarText = userPhotos ? '' : userNm;
        const {editCommentValue,expandEditComment} = this.state;
        let menuItems = null;

        if (userHash === getWebCertInfoCookie().userHash) {
             menuItems = { obj:[
                                {key : 2,meneName:'수정',clickFunc : ()=> this.onCommentUpdate(comment)},
                                {key : 3,meneName:'삭제',clickFunc : ()=> this.props.onCommentDelRequested(comment)},
                                ]};
        }

        return (<div>
            <Grid container>
                <Grid item xs={1} align={'left'}>
                    <Avatar aria-label="Recipe" className={classNames(classes.avatar, classes.smallAvatar)} src={userPhotos} >{avatarText}</Avatar>
                </Grid>
                <Grid item xs={9} align={'left'}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{dateformat(createDt,'yyyy-mm-dd')}
                </Grid>

                <Grid item xs={2} align={'right'}>
                    {menuItems ? <MoreVertMenu itemHeight={30} width={150}   menuItems={menuItems.obj}/> : ''}
                </Grid>

                <Grid container>

                    <Grid item xs={1}/>
                    <Grid item xs={11}>
                        <Collapse in={!expandEditComment} timeout="auto" unmountOnExit>
                        <Typography gutterBottom align={'left'}>
                            {commentDesc}
                        </Typography>
                        </Collapse>
                    </Grid>

                    <Grid item xs={1}/>
                    <Grid item xs={8}>

                        <Collapse in={expandEditComment} timeout="auto" unmountOnExit>
                            <TextField
                                id="editCommentInput"
                                // label="Multiline"
                                multiline
                                rowsMax="5"
                                value={editCommentValue}
                                onChange={this.editCommentChange}
                                // className={classes.textField}
                                margin="normal"
                                style={{width:'100%'}}
                                autoFocus={true}
                            />
                        </Collapse>
                    </Grid>
                    <Grid item xs={3}>
                        {expandEditComment ?
                        <Button variant="raised" color="primary" size="small" onClick={ ()=>{this.onCommentUpdate(comment)}}>
                            수정
                        </Button>
                        :''}
                    </Grid>




                </Grid>
            </Grid>
        </div>);
    }
}


ContentComment.propTypes = {
    classes: PropTypes.object.isRequired,
    onCommentDelRequested : PropTypes.func.isRequired,
    onCommentUpdateRequested : PropTypes.func.isRequired,
};


export default withStyles(styles)(ContentComment);