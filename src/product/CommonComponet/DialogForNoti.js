import React from 'react';
import propTypes from 'prop-types';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle ,Slide} from "@material-ui/core";


function AnimationTransition(props) {
    return <Slide direction="up" {...props} />;
}


class DialogForNoti extends React.Component {


    state = {
        dialogOpen: true,
        dialogMessage: 'Lacta de dexter vita, imperium apolloniates!',
    };


    dialogClose = () =>{
        console.log('##dialogClose');
        this.setState({ dialogOpen: false });
    }



    render() {

        const { dialogTitle,dialogMessage, confirmButtons} = this.props;



        return (<div>
            <Dialog
                open={this.state.dialogOpen}
                transition={AnimationTransition}
                keepMounted
                // onClose={this.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {dialogTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    { confirmButtons.map( item =>{
                        return (
                            // arrow function(lamda) 형태로 해야지 runtime으로 실행되고
                            // 일반 function으로 설정하는 경우 초기 로딩시 무한 실행으로 빠지게됨 상태가 지속적으로 변경되에 infinite loops 발생
                            <Button onClick={ ()=> { this.dialogClose(); item.func();}} color={item.color}>
                                {item.text}
                            </Button>
                        );
                    })}
                </DialogActions>
            </Dialog>

        </div>);
    }
}

DialogForNoti.propTypes = {
    dialogTitle : propTypes.string.isRequired,
    dialogMessage : propTypes.string.isRequired,
    confirmButtons :propTypes.array.isRequired,
};

DialogForNoti.defaultProps = {
    dialogTitle : 'default title',
    dialogMessage : 'default message',
    confirmButtons : [{ func: () => true, color : 'primary' , text : '확인'}]
};

export default (DialogForNoti);