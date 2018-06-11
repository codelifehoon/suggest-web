import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import {MoveToInbox,Star as StatIcon,Send} from '@material-ui/icons';


export const mailFolderListItems = (
    <div>
        <ListItem button>
            <ListItemIcon>
                <MoveToInbox />
            </ListItemIcon>
            <ListItemText primary="나의등록관리" onClick={()=>{window.location.href='/ActivityManager';}}>
            </ListItemText>
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <StatIcon />
            </ListItemIcon>
            <ListItemText primary="관심사항" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <Send />
            </ListItemIcon>
            <ListItemText primary="푸시관리" />
        </ListItem>

    </div>
);

export const otherMailFolderListItems = (
    <div>
        <ListItem button>
            <ListItemIcon>
                <MoveToInbox />
            </ListItemIcon>
            <ListItemText primary="나의등록관리" />
        </ListItem>
    </div>
);