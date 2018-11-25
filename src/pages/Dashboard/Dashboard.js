import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import WorkItemManagement from './components/WorkItemManagement';
import { connect } from 'react-redux';

const styles = theme => ({
    root: {
        flexGrow: 1,
    }
});
class Dashboard extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Grid container>
                    <WorkItemManagement />
                </Grid>
            </div>
        );
    }


}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    const {workItem : { workItemGroup }} = state;
    return {
        workItemGroup
    };
}

export default connect(mapStateToProps)(withStyles(styles)(Dashboard));