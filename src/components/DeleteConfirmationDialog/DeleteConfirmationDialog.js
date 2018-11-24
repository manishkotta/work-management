import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';

class DeleteConfirmationDialog extends Component {
    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={this.props.handleDeleteConfirmDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this item ?
                </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button id="disagree" onClick={(e) => this.props.handleDeleteConfirmDialog(e, "disagree")} color="primary">
                            Disagree
                </Button>
                        <Button id="agree" onClick={(e) => this.props.handleDeleteConfirmDialog(e, "agree")} color="primary" autoFocus>
                            Agree
                </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

DeleteConfirmationDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleDeleteConfirmDialog: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
}

export default DeleteConfirmationDialog;