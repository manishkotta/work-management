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
import { connect } from 'react-redux';
import { AddWorkItem, DeleteWorkItem, ModifyWorkItemGroup, EditWorkItem } from '../../../../redux/actions/WorkItemAction';
import { getDateString, transformWorkItemGroupToSpreadSheetFormat } from '../../../../constants/util';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import DeleteConfirmationDialog from '../../../../components/DeleteConfirmationDialog';
import { GOOGLE_API_KEY, GOOGLE_CLIENT_ID, SPREADSHEET_ID } from '../../../../constants/constants';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

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
    formControl: {
        minWidth: 120,
    },
    noData:{
        textAlign:"center"
    }
});

class WorkItemManagement extends Component {
    constructor(props) {
        super(props);
        this.id = 0;
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
            selectedEditWorkItem: {
                workItem: "",
                dueDate: new Date(),
                noOfResources: "",
                workStatus: "",
            },
            isAdd: true,
            filteredWorkItemGroup: [],
            filterWorkStatus: "All",
            spreadSheetColums: ["ID", "WorkItem", "DueDate", "No. Of Resources", "Work Status"]
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

    static getDerivedStateFromProps(props, state) {
        let spreadSheetValues = transformWorkItemGroupToSpreadSheetFormat(state.spreadSheetColums, props.workItemGroup);

        return {
            spreadSheetValues: spreadSheetValues,
            filteredWorkItemGroup: props.workItemGroup
        }
    }

    createData(workItem, dueDate, noOfResources, workStatus, action) {
        var id = this.id += 1;
        return { id, workItem, dueDate, noOfResources, workStatus, action };
    }

    handleAddItem(e) {
        this.setState({ open: true, workItemTitle: 'Add Work Item', isAdd: true });
    }

    handleClose() {
        var workItemObj = {
            workItem: "",
            dueDate: new Date(),
            noOfResources: "",
            workStatus: ""
        }
        this.setState({ open: !this.state.open, selectedEditWorkItem: workItemObj });
    };

    onWorkItemSave(workItem) {
        if (this.state.isAdd)
            this.props.addWorkItem(workItem);
        else {
            var newWorkItem = Object.assign({}, this.state.selectedEditWorkItem, workItem);
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

    handleWorkStatusFilterChange(e, workItemGroup) {
        if (!e || !e.target) return;
        this.setState({ filterWorkStatus: e.target.value })
        if (e.target.value === "All") {
            this.setState({ filteredWorkItemGroup: [...workItemGroup] })
            return;
        }

        let filteredValues = workItemGroup.filter(s => s.workStatus === e.target.value);
        this.setState({ filteredWorkItemGroup: [...filteredValues] });
    }

    onSpreadSheetUpload(result) {
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Grid container direction="row" justify="space-between">
                    <Grid item xs={3}>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel htmlFor="filter-work-status">Filter by Work Status</InputLabel>
                            <Select
                                value={this.state.filterWorkStatus}
                                onChange={(e) => this.handleWorkStatusFilterChange(e, this.props.workItemGroup)}
                                inputProps={{
                                    name: 'filter-work-status',
                                    id: 'filter-work-status',
                                }}
                            >
                                <MenuItem value={"All"}>All</MenuItem>
                                <MenuItem value={"Active"}>Active</MenuItem>
                                <MenuItem value={"In Progress"}>In Progress</MenuItem>
                                <MenuItem value={"Done"}>Done</MenuItem>
                                <MenuItem value={"Overdue"}>Overdue</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <UploadToGoogleSpreadSheet
                            apiKey={GOOGLE_API_KEY}
                            clientId={GOOGLE_CLIENT_ID}
                            spreadsheetId={SPREADSHEET_ID}
                            range="Sheet1"
                            valueInputOption="RAW"
                            majorDimension="ROWS"
                            values={this.state.spreadSheetValues}
                            onUpload={this.onSpreadSheetUpload}
                        />
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
                                {this.state.filteredWorkItemGroup.length > 0 && <TableBody>
                                    {this.state.filteredWorkItemGroup.map(row => {
                                        return (
                                            <TableRow key={row.id}>
                                                <TableCell component="th" scope="row" numeric>
                                                    {row.id}
                                                </TableCell>
                                                <TableCell>{row.workItem}</TableCell>
                                                <TableCell>{getDateString(row.dueDate)}</TableCell>
                                                <TableCell numeric>{row.noOfResources}</TableCell>
                                                <TableCell>{row.workStatus}</TableCell>
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
                                </TableBody>}

                            </Table>
                            {this.state.filteredWorkItemGroup.length <= 0 && <Card><CardContent>
                                <Typography className={classes.noData}>
                                    No records found
                                    </Typography>
                            </CardContent></Card>
                            }
                        </Paper>
                    </Grid>
                </Grid>
                <WorkItem open={this.state.open}
                    handleClose={this.handleClose}
                    workItemTitle={this.state.workItemTitle}
                    onSubmit={this.onWorkItemSave}
                    workItem={this.state.selectedEditWorkItem}
                    isAdd={this.state.isAdd} />
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