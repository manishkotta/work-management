import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import PropTypes from 'prop-types';

const drawerWidth = 240;
const styles = theme => ({
    root: {
        flexGrow: 1,
        display: "flex"
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
});

class SideBar extends Component {

    render() {
        const { classes } = this.props;
        return (<Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor="left"
        >
            <div className={classes.toolbar} />
            <Divider />
            <List>
                {['Dashboard', 'Notifications', 'Tickets', 'Resources'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['User Stories', 'Enchancements', 'Bugs'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>)
    }
}

SideBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SideBar)  