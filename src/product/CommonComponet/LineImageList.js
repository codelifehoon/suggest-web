import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import {DeleteForever} from '@material-ui/icons';


const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    title: {
        color: theme.palette.secondary.main,
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)',
    },
});

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const tileData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */
class LineImageList extends  React.Component{

    onClickDelete = data =>{
        console.log(data);
        this.props.onDelete(data);
    }

    render(){
    const { classes,tileList } = this.props;


    return (
        <div className={classes.root}>
            <GridList className={classes.gridList} cols={5}>
                {tileList.map(tile => (
                    <GridListTile key={tile.img}>
                        <img src={tile.img} alt={tile.title} />
                        <GridListTileBar
                            title={tile.title}
                            classes={{
                                root: classes.titleBar,
                                title: classes.title,
                            }}
                            actionIcon={
                                    <DeleteForever className={classes.title} onClick={()=>{this.onClickDelete(tile);}} />
                            }
                        />
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
    }
}

LineImageList.propTypes = {
    classes: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    tileList: PropTypes.array.isRequired,
};

LineImageList.defaultProps = {
    tileList : [{key : '1' , tile : 'img1',img : 'https://firebasestorage.googleapis.com/v0/b/suggest-life.appspot.com/o/gokgok_upload%2F268bcf64-330f-4c54-aa82-292e33c4b6ba.jpg?alt=media&token=52975441-8d82-4806-8c74-99d638f781e8'}
                ,{key : '2' ,tile : 'img2',img : 'https://firebasestorage.googleapis.com/v0/b/suggest-life.appspot.com/o/gokgok_upload%2Fb2f29d8e-93df-442e-a0c4-88f50bb8eec7.jpg?alt=media&token=530ca8a0-4db4-47bd-9ec6-e6257815e70c'}
                ],
    onDelete : data => { console.log(data);}
};

export default withStyles(styles)(LineImageList);
