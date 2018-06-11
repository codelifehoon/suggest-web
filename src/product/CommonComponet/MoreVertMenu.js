import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu, { MenuItem } from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';

class MoreVertMenu extends React.Component {
    state = {
        anchorEl: null,
    };

    onVertBtnClick = event => {
        console.log('###########');
        console.log(event.currentTarget);
        this.setState({ anchorEl: event.currentTarget });
    };

    onMenuClose = () => {
        console.log('###onMenuClose');
        this.setState({ anchorEl: null });
    };

    onMenuItemClose = menuItem => {
        console.log('###onMenuItemClose');


        menuItem.clickFunc();

        this.setState({ anchorEl: null });
    };

    render() {
        const { anchorEl } = this.state;
        const {itemHeight,width,menuItems} = this.props;

        return (
            <div>
                <IconButton
                    aria-label="More"
                    aria-owns={anchorEl ? 'long-menu' : null}
                    aria-haspopup="true"
                    onClick={this.onVertBtnClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.onMenuClose}
                    PaperProps={{
                        style: {
                            maxHeight: {itemHeight} * 4.5,
                            width: {width},
                        },
                    }}
                >
                    {menuItems.map(menuItem => (
                        <MenuItem key={menuItem.key}  onClick={()=>{this.onMenuItemClose(menuItem)}}>
                            {menuItem.meneName}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        );
    }
}


MoreVertMenu.defaultProps = {
    itemHeight :  30,
    width : 150,
    menuItems : [{key : 1,meneName:'Armarium',clickFunc : ()=> alert('key1')},
                {key : 2,meneName:'Armarium1',clickFunc : ()=> alert('key2')},
                {key : 3,meneName:'Armarium2',clickFunc : ()=> alert('key3')},
                {key : 4,meneName:'Armarium3',clickFunc : ()=> alert('key4')},
                ]
}

export default (MoreVertMenu);
