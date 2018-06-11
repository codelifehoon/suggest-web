import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {KeyboardArrowLeft, KeyboardArrowRight} from '@material-ui/icons';
import {Grid, Typography,Button} from '@material-ui/core';
import propTypes from 'prop-types';
import dateformat from 'dateformat';

const styles = theme => ({
    root : {
        flexGrow:1,


    },
    button: {
        margin: theme.spacing.unit,
    },
    borderCss: {
        border: '0px solid silver',
    },
});

class DateClickSelecter extends React.Component {

    constructor(props) {

        super(props);
        dateformat.i18n = {
            dayNames: [
                'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
                'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
            ],
            monthNames: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
            ],
            timeNames: [
                'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
            ]
        };

    }


    state = {
        selectedDay : '모든날짜'
    }

    keyboardArrowLeftClick = (e) =>{

        this.modifyDay(-1);

    }

    keyboardArrowRightClick = (e) =>{

        this.modifyDay(1);
    }

    modifyDay = (day) => {

        let nextDate;

        if (this.state.selectedDay === '모든날짜' && day < 0 ) return;
        if (this.state.selectedDay === '모든날짜'){
             nextDate = new Date();
             day = 0;
        }else {
            nextDate = this.state.selectedDay;
            nextDate.setDate(nextDate.getDate() + day);

        }



        if (dateformat(nextDate,'yyyy-mm-dd') < dateformat(new Date(),'yyyy-mm-dd')){
            nextDate = '모든날짜';
        }

        this.setState({selectedDay: nextDate});
        this.props.onChange(nextDate);
    }


    render() {
        const {classes} = this.props;
        const {selectedDay} = this.state;

        return (
            <div>
            <Grid container className={classes.root}>
                <Grid item xs={3} className={classes.borderCss}  >
                        <Button variant='fab' mini color="secondary" aria-label="edit" className={classes.button}>
                            <KeyboardArrowLeft  onClick={this.keyboardArrowLeftClick}/>
                        </Button>
                </Grid>

                <Grid item xs={6} className={classes.borderCss} style={{paddingTop:'15px'}}>
                    <Typography variant={'headline'} className={classes.borderCss} >
                        { selectedDay !== '모든날짜' ? dateformat(selectedDay,'yyyy-mm-dd') : selectedDay }
                    </Typography>
                    <Typography className={classes.borderCss} >
                        {selectedDay !== '모든날짜' ? dateformat(selectedDay,'dddd') : '' }
                    </Typography>
                </Grid>


                <Grid item xs={3} className={classes.borderCss}>
                    <Button variant='fab' mini color="secondary" aria-label="edit" className={classes.button}>
                        <KeyboardArrowRight onClick={this.keyboardArrowRightClick}/>
                    </Button>
                </Grid>
            </Grid>
            </div>
        );

    }
}

DateClickSelecter.propTypes = {

    onChange : propTypes.func.isRequired,
    classes : propTypes.object.isRequired
};


DateClickSelecter.defaultProps = {

};

export default withStyles(styles)(DateClickSelecter );