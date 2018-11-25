import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import blue from '@material-ui/core/colors/blue';



const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    show: {
        display: "block"
    },
    hide: {
        display: "none"
    },
    buttonProgress: {
        color: blue[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    wrapper: {
        //margin: theme.spacing.unit,
        position: 'relative',
    }
});

const gapi = window.gapi;

class UploadToGoogleSpreadSheet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            isSuccess: false,
            loading: false
        };
    }

    componentDidMount() {
        this.handleClientLoad();
    }

    handleClientLoad() {
        if (window.gapi)
            gapi.load('client:auth2', () => {
                this.initClient(this.props.apiKey, this.props.clientId);
            });
    }

    initClient(apiKey, clientId) {
        // Initilized the google client API with necessary values;
        var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
        gapi.client.init({
            'apiKey': apiKey,
            'clientId': clientId,
            'scope': SCOPE,
            'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        }).then(() => {
            console.log("Initialized google API");
        });
    }

    handleUploadClick(e) {
        if(!window.gapi) return;
        let isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
        if (!isSignedIn) {
            gapi.auth2.getAuthInstance().signIn();
            gapi.auth2.getAuthInstance().isSignedIn.listen((res) => {
                if (res)
                    this.makeApiCall();
            });
        } else {
            this.makeApiCall();
        }
    }

    makeApiCall() {
        this.setState({ loading: true });
        var params = {
            // The ID of the spreadsheet to update.
            spreadsheetId: this.props.spreadsheetId,

            // The A1 notation of the values to update.
            range: this.props.range,

            // How the input data should be interpreted.
            valueInputOption: this.props.valueInputOption
        };

        var valueRangeBody = {
            "range": this.props.range,
            "majorDimension": this.props.majorDimension,
            "values": this.props.values,
        };

        var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
        request.then((response) => {
            this.props.onUpload(response);
            this.setState({ open: true, isSuccess: true, loading: false });
        }, (reason) => {
            this.setState({ oepn: true, errorMessage: `error:${reason.result.error.message}`, isSuccess: false, loading: false })
            this.props.onUpload(reason);
        });
    }

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <div className={classes.wrapper}>
                    <Button variant="contained" color={this.state.loading ? "" : "primary"} className={classes.button}
                        onClick={(e) => this.handleUploadClick(e)}>
                        Upload to Google SpreadSheet
                <CloudUploadIcon className={classes.rightIcon} />
                    </Button>
                    {this.state.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{this.state.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" className={this.state.isSuccess ? classes.show : classes.hide}>
                            Data is updated to Google spreadsheet. Please click on the link to access the sheet &nbsp;
                            <Button target="_blank" href={`https://docs.google.com/spreadsheets/d/${this.props.spreadsheetId}/edit#gid=0`}>
                                Google SpreadSheet Link
                            </Button>
                        </DialogContentText>
                        <DialogContentText id="alert-dialog-description" className={!this.state.isSuccess ? classes.show : classes.hide}>
                            {this.state.errorMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>);
    }
}

UploadToGoogleSpreadSheet.propTypes = {
    apiKey: PropTypes.string.isRequired,
    clientId: PropTypes.string.isRequired,
    spreadsheetId: PropTypes.string.isRequired,
    range: PropTypes.string.isRequired,
    valueInputOption: PropTypes.string.isRequired,
    majorDimension: PropTypes.string.isRequired,
    values: PropTypes.array.isRequired,
    onUpload: PropTypes.func.isRequired
}

export default withStyles(styles)(UploadToGoogleSpreadSheet);