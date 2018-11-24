import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import UploadToGoogleSpreadSheet from '../../../../components/UploadToGoogleSpreadSheet';
import WorkItem from '../../../../components/WorkItem';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';
import { AddWorkItem, DeleteWorkItem, RetrieveWorkItemGroup, ModifyWorkItemGroup, EditWorkItem } from '../../../../redux/actions/WorkItemAction';
import { getDateString } from '../../../../constants/util';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import DeleteConfirmationDialog from '../../../../components/DeleteConfirmationDialog';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 2,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    button: {
        margin: theme.spacing.unit,
    },
    iconCell: {
        display: 'flex',
    },
});

class WorkItemManagement extends Component {
    constructor(props) {
        super(props);
        this.id = 0;
        this.rows = [
            this.createData("Start Templating", "10/11/2018", 4, "In Progress", "Edit"),
            this.createData("Draw Code", "10/11/2018", 4, "Done", "Edit"),
        ];
        this.handleAddItem = this.handleAddItem.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onWorkItemSave = this.onWorkItemSave.bind(this);
        this.onWorkItemDelete = this.onWorkItemDelete.bind(this);
        this.onWorkItemEdit = this.onWorkItemEdit.bind(this);
        this.handleDeleteConfirmDialog = this.handleDeleteConfirmDialog.bind(this);
        this.state = {
            open: false,
            deleteConfirmDialogOpen: false,
            workItemTitle: 'Add Work Item',
            deleteConfirmDialogTitle: 'Delete Work Item',
            selectedDeleteWorkItem: {},
            selectedEditWorkItem: {},
            isAdd: true
        }
    }

    componentDidMount() {
        var wLS = localStorage.getItem('work-item-group');
        try {
            if (wLS) {
                var workItemGroup = JSON.parse(wLS);
                this.props.modifyWorkItemGroup(workItemGroup);
            }
        }
        catch (err) {
            console.error("unable to parse work Item group")
        }
    }

    createData(workItem, dueDate, noOfResources, workItemStatus, action) {
        var id = this.id += 1;
        return { id, workItem, dueDate, noOfResources, workItemStatus, action };
    }

    handleAddItem(e) {
        this.setState({ open: true, workItemTitle: 'Add Work Item', isAdd: true });
    }

    handleClose() {
        this.setState({ open: !this.state.open });
    };

    onWorkItemSave(workItem) {
        if (this.state.isAdd)
            this.props.addWorkItem(workItem);
        else{
            var newWorkItem = Object.assign({},this.state.selectedEditWorkItem,workItem);
            console.log(newWorkItem,"manish");
            this.props.editWorkItem(newWorkItem);
        }
    }

    onWorkItemDelete(e, row) {
        this.setState({ deleteConfirmDialogOpen: true, selectedDeleteWorkItem: row });
    }

    onWorkItemEdit(e, row) {
        this.setState({ open: true, selectedEditWorkItem: row, workItemTitle: "Edit Work Item", isAdd: false });
    }

    handleDeleteConfirmDialog(e, status) {
        switch (status) {
            case "agree":
                this.props.deleteWorkItem(this.state.selectedDeleteWorkItem);
                this.setState({ deleteConfirmDialogOpen: false });
                break;
            case "disagree":
                this.setState({ deleteConfirmDialogOpen: false });
                break;
            default:
                break;
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Grid container direction="row" justify="flex-end">
                    <Grid item>
                        <UploadToGoogleSpreadSheet />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" className={classes.button} onClick={(e) => this.handleAddItem(e)}>
                            Add Item
                        <AddIcon />
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.root}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell numeric>ID</TableCell>
                                        <TableCell>WorkItem</TableCell>
                                        <TableCell>Due Date</TableCell>
                                        <TableCell numeric>No. Resources needed</TableCell>
                                        <TableCell>WorkItem Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.props.workItemGroup.map(row => {
                                        return (
                                            <TableRow key={row.id}>
                                                <TableCell component="th" scope="row" numeric>
                                                    {row.id}
                                                </TableCell>
                                                <TableCell>{row.workItem}</TableCell>
                                                <TableCell>{getDateString(row.dueDate)}</TableCell>
                                                <TableCell numeric>{row.noOfResources}</TableCell>
                                                <TableCell>{row.workItemStatus}</TableCell>
                                                <TableCell className={classes.iconCell}>
                                                    <IconButton onClick={(e) => this.onWorkItemEdit(e, row)}>
                                                        <EditIcon color="primary" />
                                                    </IconButton>
                                                    <IconButton onClick={(e) => this.onWorkItemDelete(e, row)}>
                                                        <DeleteIcon color="secondary" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
                <WorkItem open={this.state.open}
                    handleClose={this.handleClose}
                    workItemTitle={this.state.workItemTitle}
                    onSubmit={this.onWorkItemSave}
                    workItem={this.state.selectedEditWorkItem} />
                <DeleteConfirmationDialog
                    open={this.state.deleteConfirmDialogOpen}
                    handleDeleteConfirmDialog={this.handleDeleteConfirmDialog}
                    title={this.state.deleteConfirmDialogTitle}
                />
            </div>
        )
    }
}

WorkItemManagement.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    const { workItem: { workItemGroup } } = state;
    return {
        workItemGroup
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addWorkItem: (workItem) => dispatch(AddWorkItem(workItem)),
        deleteWorkItem: (workItem) => dispatch(DeleteWorkItem(workItem)),
        modifyWorkItemGroup: (workItemGroup) => dispatch(ModifyWorkItemGroup(workItemGroup)),
        editWorkItem: (workItem) => dispatch(EditWorkItem(workItem))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(WorkItemManagement))