import React from 'react';
import {Grid,Typography} from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import {getUrlParam} from "../util/CommonUtils";
import {withRouter} from "react-router-dom";
import {FacebookLoginButton, GoogleLoginButton, NaverLoginButton} from "./SocialLoginButton";
import * as Config from "../util/Config";


const styles = theme => ({
    button: {
            width:'200px',

    },

    leftIcon: {

    },
    rightIcon: {

    },

});


class MemberLogin extends React.Component {


    componentDidMount(){
        // const cb = getUrlParam(this.props,'cb');
        // console.log(cb);

    }
    oAuthOnClick = (authType) => {

        const cb = encodeURIComponent(getUrlParam(this.props,'cb'));

        let oAuthUrl = '';
        if (authType === 'google'){
            oAuthUrl = Config.NODE_URL + '/sv/oAuth/google?cb='+cb;
        }else if (authType === 'facebook'){
            oAuthUrl = Config.NODE_URL + '/sv/oAuth/facebook?cb='+cb;
        }
        else {
            oAuthUrl = Config.NODE_URL + '/sv/oAuth/naver?cb='+cb;
        }

        console.log(oAuthUrl);
        window.location.href = oAuthUrl;

    }

    render() {
    const  {classes} = this.props;

        return (
            <div>

                <Grid container>
                    {/* title row*/}
                    <Grid item xs={1}/>
                    <Grid item xs={11}>
                        <br/><br/>
                        <Typography variant={'display1'} color={'primary'} align={'left'}>로그인 해주세요.</Typography>
                        <br/>
                        <Typography gutterBottom align={'left'}>
                            {`
                      회원가입은 없습니다.
                      보유하고 서비스 중 하나로 로그인 해주세요.
                            `}
                        </Typography>
                        <br/>
                    </Grid>
                    
                    <Grid item xs={1}/>
                    <Grid item xs={11}>
                        <GoogleLoginButton text="Google 로그인"  onClick={() => {this.oAuthOnClick('google')}}>
                            google
                        </GoogleLoginButton>
                    </Grid>

                    <Grid item xs={1}/>
                    <Grid item xs={11}>
                        <FacebookLoginButton text="Facebook 로그인" onClick={() => {this.oAuthOnClick('facebook')}}>
                            facebook
                        </FacebookLoginButton>
                    </Grid>

                    <Grid item xs={1}/>
                    <Grid item xs={11}>
                        <NaverLoginButton  text="Naver 로그인" onClick={() => {this.oAuthOnClick('naver')}}>
                            naver
                        </NaverLoginButton>
                    </Grid>

                    <Grid item xs={12}>
                    <Typography gutterBottom align={'center'} color={'secondary'} >
                        <br/>
                        최초 로그인시 로그인 정보는 1년 동안 유지 됩니다.
                    </Typography>

                    </Grid>

                </Grid>

            </div>
        );

    console.log(classes);

}
}

MemberLogin.propTypes = {};

export default withStyles(styles)(withRouter(MemberLogin));