import React from 'react';
import SocialLoginButton from 'react-social-login-buttons/lib/buttons/SocialLoginButton';

/** My Google login button. */
export const GoogleLoginButton = (props) => {
    const customProps = {
        style: {
            background: '#cb3f22',
            color: '#ffffff'
        },
        activeStyle: {
            background: '#b5b5b5',
        }
    };

    return <SocialLoginButton {...{...customProps, ...props}}>
        <img style={{verticalAlign: 'middle', height: 26, paddingRight: 10}}
             src="http://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-128.png"/>
        <span style={{verticalAlign: 'middle'}}>Sign in with Google</span>
    </SocialLoginButton>
};

export const FacebookLoginButton = (props) => {
    const customProps = {
        style: {
            background: '#3b5998',
            color: '#ffffff'
        },
        activeStyle: {
            background: '#b5b5b5',
        }
    };
    return <SocialLoginButton {...{...customProps, ...props}}>
        {/*<img style={{verticalAlign: 'middle', height: 26, paddingRight: 10}} src="https://cdn3.iconfinder.com/data/icons/socialnetworking/32/facebook.png"/>*/}
        <span style={{verticalAlign: 'middle'}}>Sign in with Facebook</span>
    </SocialLoginButton>
};


export const NaverLoginButton = (props) => {
    const customProps = {
        style: {
            background: '#ffffff',
            color: '#00ca30'
        },
        activeStyle: {
            background: '#b5b5b5',
        }
    };

    return <SocialLoginButton {...{...customProps, ...props}}>
        <img style={{verticalAlign: 'middle', height: 26, paddingRight: 10}}
             src="https://ssl.pstatic.net/sstatic/search/common/og_v3.png"/>
        <span style={{verticalAlign: 'middle'}}>Sign in with Naver</span>
    </SocialLoginButton>
};
