import React from 'react';
import {Button, Card, CardActions, CardContent, CardMedia, Typography, withStyles} from "@material-ui/core";
import PropTypes from 'prop-types';


const styles = {
    card: {
        maxWidth: '100%',
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
};


class NoSearchResultsCard extends React.Component {

    render() {

        const { classes } = this.props;

        return (<div>
            <Card className={classes.card}>
                <CardMedia
                    className={classes.media}
                    image="https://cdn.pixabay.com/photo/2015/06/28/09/37/keyboard-824317_960_720.jpg"
                    title="no search result"
                />
                <CardContent>
                    <Typography gutterBottom variant="headline" component="h2">
                        검색 결과가 없습니다.
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary">
                        요청하기
                    </Button>
                    <Button size="small" color="primary">
                        내가 등록하기
                    </Button>
                </CardActions>
            </Card>
        </div>);
    }
}


NoSearchResultsCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NoSearchResultsCard);