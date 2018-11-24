import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { DatePicker } from 'material-ui-pickers';
import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';

class WorkItem extends Component {

    constructor(props) {
        super(props);
        const { workItem } = props;
        this.state = {
            workItem: workItem.workItem || "",
            dueDate: workItem.dueDate || new Date(),
            noOfResources: workItem.noOfResources || ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        return {
            workItem : props.workItem.workItem,
            noOfResources : props.workItem.noOfResources,
            dueDate : typeof Date === props.workItem.dueDate ? props.workItem.dueDate : new Date(props.workItem.dueDate)
         };
    }

    handleChange(e) {
        switch (e.target.id) {
            case "item":
                this.setState({ workItem: e.target.value });
                break;
            case "numofresources":
                var nofR = parseInt(e.target.value);
                this.setState({ noOfResources: Number.isNaN(nofR) ? "" : nofR });
                break
            default:
                break;
        }

    }

    handleDateChange(date) {
        this.setState({ dueDate: date.toDate() });
    }

    onSubmit() {
        //ToDo validations.
        var workItem = {
            workItem: this.state.workItem,
            dueDate: this.state.dueDate,
            noOfResources: this.state.noOfResources
        }

        this.props.onSubmit(workItem);
        this.props.handleClose();
        this.resetForm();
    }

    resetForm() {
        this.setState({ workItem: "", dueDate: new Date(), noOfResources: "" });
    }

    render() {
        return (
            <Dialog open={this.props.open}
                onClose={this.props.handleClose}
                disableBackdropClick
                disableEscapeKeyDown
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{this.props.workItemTitle}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="item"
                        label="WorkItem"
                        type="text"
                        fullWidth
                        required
                        value={this.state.workItem}
                        error
                        onChange={this.handleChange}
                        inputProps={{
                            maxLength: 25,
                        }}
                    />
                    <DatePicker
                        value={this.state.dueDate}
                        onChange={this.handleDateChange}
                        format="DD-MM-YYYY"
                        id="duedate"
                        label="Due Date"
                        min={new Date()}
                        fullWidth />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="numofresources"
                        label="No. of Resources"
                        type="number"
                        value={this.state.noOfResources}
                        fullWidth
                        required
                        onChange={this.handleChange}
                        onInput={(e) => {
                            e.target.value = parseInt(e.target.value) === 0 ? "" : Math.max(1, parseInt(e.target.value)).toString().slice(0, 2)
                        }}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.onSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

WorkItem.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    workItemTitle: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export default WorkItem