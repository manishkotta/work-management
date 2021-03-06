import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PieChart from '../PieChart'

const styles = theme => ({
    root: {
        flexGrow: 1,
        display: "flex"
    },
    grow: {
        flexGrow: 1,
    },
    toolbar: theme.mixins.toolbar,
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
});

class Header extends Component {

    getActiveWorkItemCount(workItems) {
        if (!workItems || workItems.length <= 0) return 0;
        workItems = workItems.filter(s => s.workStatus === "Active");
        if (!workItems || workItems.length <= 0) return 0;
        return workItems.length;
    }

    render() {
        const { classes } = this.props;
        return (
            <AppBar position="fixed" color="default" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" color="inherit" className={classes.grow}>
                        Work Management
                    </Typography>
                    <PieChart Items={this.props.workItemGroup} />
                    <Typography variant="h6" color="inherit">
                        Number of Work Items : {this.getActiveWorkItemCount(this.props.workItemGroup)}
                    </Typography>
                </Toolbar>
            </AppBar>
        )
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    const { workItem: { workItemGroup } } = state;
    return {
        workItemGroup
    }
}

export default connect(mapStateToProps)(withStyles(styles)(Header));