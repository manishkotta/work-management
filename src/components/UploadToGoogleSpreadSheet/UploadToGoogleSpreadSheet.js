import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
});

class UploadToGoogleSpreadSheet extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <Button variant="contained" color="primary" className={classes.button}>
                Upload to Google SpreadSheet
                <CloudUploadIcon className={classes.rightIcon} />
            </Button>);
    }
}

export default withStyles(styles)(UploadToGoogleSpreadSheet);