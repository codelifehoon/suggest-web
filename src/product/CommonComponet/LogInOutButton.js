import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Button, Icon} from "@material-ui/core";
import propTypes from 'prop-types';
import {withRouter} from "react-router-dom";
import {getWebCertInfoCookie} from "../util/CommonUtils";
import * as Config from "../util/Config";


const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
        marginLeft: 0,
        marginRight: 0,
    },
    input: {
        display: 'none',
    },
});

class LogInOutButton extends React.Component {

    constructor(props){
        super(props);



    }

    componentDidMount(){

        if (getWebCertInfoCookie() !== ''){
            this.setState({loginStr : '로그아웃',webCertInfo : getWebCertInfoCookie()});
        }
    }


    state = {
        webCertInfo : '',
        loginStr : '로그인'
    }

    isLogin= () =>{
        if (this.state.webCertInfo !== '') {
            return true;
        }
        else{
            return false;
        }
    }

    loginOutClick = () => {
        // 로그인 여부 확인 api call
         console.log('##loginOutClick');
         const redirUrl = encodeURIComponent(Config.WEB_URL);
        console.log(redirUrl);
        if (this.isLogin())
        {
             window.location.href = Config.SERVICE_URL + '/sv/Auths/setLogout/'  + redirUrl;
        }
        else{


            let locaiton = Config.WEB_URL + this.props.location.pathname;
            if (this.props.location.search) locaiton += this.props.location.search;

            window.location.href = '/memberLogin?cb='+ encodeURIComponent(locaiton);
        }

    }

    render() {
        const { classes } = this.props;

        return (<div>

            <Button variant="flat" color="inherit" aria-label="edit" className={classes.button}   onClick={this.loginOutClick} >
                {this.state.loginStr}
            </Button>


        </div>);
    }
}


LogInOutButton.propTypes = {
    classes: propTypes.object.isRequired,

};

export default withStyles(styles)(withRouter(LogInOutButton));