import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { DatePicker } from 'material-ui-pickers';
import PropTypes from 'prop-types';
import { getValidDate } from '../../constants/util';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


const styles = theme => ({
    marginBottom: {
        marginBottom: theme.spacing.unit,
    },
    formControl: {
        minWidth: 120,
    },
});

class WorkItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            workItem: "",
            dueDate: new Date(),
            noOfResources: "",
            workStatus: "",
            errors: {
                workItem: { error: false, errorText: "" },
                noOfResources: { error: false, errorText: "" }
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleWorkStatusChange = this.handleWorkStatusChange.bind(this);

    }

    static getDerivedStateFromProps(props, state) {
        var dateObj = getValidDate(props.workItem.dueDate);

        return {
            workItem: props.workItem.workItem,
            noOfResources: props.workItem.noOfResources,
            dueDate: dateObj.isValid ? dateObj.date : new Date(),
            workStatus: props.workItem.workStatus
        };
    }

    handleChange(e) {
        let obj = {};
        switch (e.target.id) {
            case "item":
                if (this.validateText(e.target.value)) {
                    obj = Object.assign({}, this.state.errors, { workItem: { error: false, errorText: "" } });
                    this.setState({ errors: obj, workItem: e.target.value });
                }
                else {
                    obj = Object.assign({}, this.state.errors, { workItem: { error: true, errorText: "Required" } })
                    this.setState({ errors: obj, workItem: e.target.value });
                }
                break;
            case "numofresources":
                var nofR = parseInt(e.target.value, 10);
                if (this.validateNumber(e.target.value)) {
                    obj = Object.assign({}, this.state.errors, { noOfResources: { error: false, errorText: "" } })
                    this.setState({ errors: obj, noOfResources: Number.isNaN(nofR) ? "" : nofR });
                }
                else {
                    obj = Object.assign({}, this.state.errors, { noOfResources: { error: true, errorText: "Not a valid Number" } })
                    this.setState({ errors: obj, noOfResources: Number.isNaN(nofR) ? "" : nofR });
                }
                break
            default:
                break;
        }
    }

    handleWorkStatusChange(e) {
        if (!e || !e.target) return;
        this.setState({ workStatus: e.target.value });
    }

    validateText(text) {
        return (text && text.length > 0);
    }

    validateNumber(number) {
        let n = parseInt(number, 10);
        return !Number.isNaN(n);
    }

    handleDateChange(date) {
        this.setState({ dueDate: date.toDate() });
    }

    onSubmit() {
        var isValidForm = true, errorList = this.state.errors;
        if (!this.validateText(this.state.workItem)) {
            errorList = Object.assign({}, errorList, { workItem: { error: true, errorText: "Required" } });
            isValidForm = false;
        }

        if (!this.validateNumber(this.state.noOfResources)) {
            isValidForm = false;
            errorList = Object.assign({}, errorList, { noOfResources: { error: true, errorText: "Not a valid Number" } });
        }

        this.setState({ errors: errorList });
        if (!isValidForm) return;

        var workItemObj = {
            workItem: this.state.workItem,
            dueDate: this.state.dueDate,
            noOfResources: this.state.noOfResources,
            workStatus: this.state.workStatus
        }

        this.props.onSubmit(workItemObj);
        this.props.handleClose();

    }

    resetForm() {
        //this.setState({ workItem: "", dueDate: new Date(), noOfResources: "", workStatus: "" });
    }

    resetFormValidations() {
        const errors = {
            workItem: { error: false, errorText: "" },
            noOfResources: { error: false, errorText: "" }
        }
        this.setState({ errors: errors });
    }

    handleClose() {
        this.props.handleClose();
        this.resetForm();
        this.resetFormValidations();
    }

    render() {
        const { classes } = this.props;
        return (
            <Dialog open={this.props.open}
                onClose={this.handleClose}
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
                        error={this.state.errors.workItem.error}
                        onChange={this.handleChange}
                        inputProps={{
                            maxLength: 60,
                        }}
                        helperText={this.state.errors.workItem.errorText}
                        className={classes.marginBottom}
                    />
                    <DatePicker
                        value={this.state.dueDate}
                        onChange={this.handleDateChange}
                        format="DD-MM-YYYY"
                        id="duedate"
                        label="Due Date"
                        min={new Date()}
                        fullWidth
                        className={classes.marginBottom}
                    />
                    {!this.props.isAdd &&
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel htmlFor="work-status">Work Status</InputLabel>
                            <Select
                                value={this.state.workStatus}
                                onChange={this.handleWorkStatusChange}
                                inputProps={{
                                    name: 'work-status',
                                    id: 'work-status',
                                }}
                            >
                                <MenuItem value={"In Progress"}>In Progress</MenuItem>
                                <MenuItem value={"Done"}>Done</MenuItem>
                                <MenuItem value={"Overdue"}>Overdue</MenuItem>
                            </Select>
                        </FormControl>}
                    <TextField

                        margin="dense"
                        id="numofresources"
                        label="No. of Resources"
                        type="number"
                        value={this.state.noOfResources}
                        fullWidth
                        required
                        onChange={this.handleChange}
                        onInput={(e) => {
                            e.target.value = parseInt(e.target.value, 10) === 0 ? "" : Math.max(1, parseInt(e.target.value, 10)).toString().slice(0, 2)
                        }}
                        className={classes.marginBottom}
                        error={this.state.errors.noOfResources.error}
                        helperText={this.state.errors.noOfResources.errorText}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
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

export default withStyles(styles)(WorkItem)