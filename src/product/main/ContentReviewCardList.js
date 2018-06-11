import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Paper, Snackbar} from "@material-ui/core";
import ContentReviewCard from "./ContentReviewCard";


const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 0,
        paddingBottom: 16,
        // marginTop: theme.spacing.unit * 3,
    }),
});


class ContentReviewCardList extends React.Component {


    render() {
        const { classes,contentList } = this.props;

        return (
            <div className={classes.root}>
            { contentList.map( d  => { return (
                <ContentReviewCard key={d.eventContentNo} content={d} ></ContentReviewCard>
            )
            })}
            </div>

        );
    }
}

ContentReviewCardList.propTypes = {
    classes: PropTypes.object.isRequired,
};


ContentReviewCardList.defaultProps = {
    contentList: [ ]
};

// state = {
//     title:'',
//     eventAddress:'',
//     eventStart:dateformat(new Date(),'yyyy-mm-dd')+'T10:00',
//     eventEnd:dateformat(new Date(),'yyyy-mm-dd')+'T18:00',
//     chipData: [
//         { key: 'Angular'},
//         { key: 'jQuery'},
//     ],
// };



export default withStyles(styles)(ContentReviewCardList);
