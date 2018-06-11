import React from 'react';
import {FacebookButton, FacebookCount ,KaKaoTalkButton ,TwitterButton } from "react-social";
import {Button, IconButton} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {
    FacebookShareCount,
    GooglePlusShareCount,
    TumblrShareCount,
    FacebookShareButton,
    GooglePlusShareButton,
    TwitterShareButton,
    TumblrShareButton,
    FacebookIcon,
    TwitterIcon,
    GooglePlusIcon,
    TumblrIcon,
} from 'react-share';

import './css/SnsShareForKR.css';

const styles = theme => ({
});



class SnaShareForKR extends React.Component {
    render() {
        
        const shareUrl = this.props.pathname;
        const title = '공유하기';

        return (
            <div className="Demo__container">
                <div className="SnsStyle">
                    <FacebookShareButton
                        url={shareUrl}
                        quote={title}
                        className="SnsStyle_button">
                        <FacebookIcon
                            size={32}
                            round />
                    </FacebookShareButton>

                    <FacebookShareCount
                        url={shareUrl}
                        className="SnsStyle_count">
                        {count => count}
                    </FacebookShareCount>
                </div>

                <div className="SnsStyle">
                    <TwitterShareButton
                        url={shareUrl}
                        title={title}
                        className="SnsStyle_button">
                        <TwitterIcon
                            size={32}
                            round />
                    </TwitterShareButton>

                    <div className="SnsStyle_count">
                        &nbsp;
                    </div>
                </div>

                <div className="SnsStyle">
                    <GooglePlusShareButton
                        url={shareUrl}
                        className="SnsStyle_button">
                        <GooglePlusIcon
                            size={32}
                            round />
                    </GooglePlusShareButton>

                    <GooglePlusShareCount
                        url={shareUrl}
                        className="SnsStyle_count">
                        {count => count}
                    </GooglePlusShareCount>
                </div>

                <div className="SnsStyle">
                    <TumblrShareButton
                        url={shareUrl}
                        title={title}
                        windowWidth={660}
                        windowHeight={460}
                        className="SnsStyle_button">
                        <TumblrIcon
                            size={32}
                            round />
                    </TumblrShareButton>

                    <TumblrShareCount url={shareUrl}
                                      className="SnsStyle_count" />
                </div>

            </div>
        );
    }
}

export  default withStyles(styles)(SnaShareForKR);
