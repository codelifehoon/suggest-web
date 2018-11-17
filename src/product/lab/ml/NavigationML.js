import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Icon from '@material-ui/core/Icon';

const styles = {
    root: {
        width: '100%',
    },
};

class NavigationML extends React.Component {
    state = {

    };

    handleChange = (event, value) => {

        this.setState({ value });
        if (value === 0 ){
            window.location.href = '/wordclf';
        }
        else if(value === 1 ){
            window.location.href = '/wordcomplete';
        }
        else if(value === 2 ){
            window.location.href = '/catesuggest';
        }

    };



    render() {
        const { classes } = this.props;
        const { value } = this.state;

        return (
            <BottomNavigation
                value={value}
                onChange={this.handleChange}
                showLabels
                className={classes.root}
            >
                <BottomNavigationAction label="Option Classification" icon={<Icon>folder</Icon>} />
                <BottomNavigationAction label="JavaCode Autocomplete" icon={<Icon>folder</Icon>} />
                <BottomNavigationAction label="CategorySuggest" icon={<Icon>folder</Icon>} />

            </BottomNavigation>
        );
    }
}

NavigationML.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavigationML);