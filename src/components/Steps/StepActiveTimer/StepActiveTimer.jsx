import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import React, { Component } from 'react';
import './StepActiveTimer.css';
import audio from '../../../resources/audio/nextStepDing.ogg';
import {
  Typography,
  Icon,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

import { appBlue } from '../../../resources/colors';
const style = {
  label: {
    float: 'right',
    fontSize: '.7em',
    fontColor: appBlue,
  },
};
export default class StepActiveTimer extends Component {
  state = {
    nextStepDing: new Audio(audio),
    seconds: 0,
    isRunning: true,
    max: this.props.max * 60,
    showAlert: true,
    alertOpen: false,
  };

  // If it's counting down then count down and run next at 00:00 if provided.
  countDown = () => {
    if (!this.isCancelled && this.state.isRunning && this.state.seconds < this.state.max) {
      this.setState({ seconds: this.state.seconds + 1 });
    } else if (this.state.seconds >= this.state.max) {
      this.setState({ seconds: 0 });
      if (this.props.next && !this.isCancelled) {
        return this.props.next();
      }
    }
  };
  formatLabel = () => {
    let time;
    let inMins;
    if (this.state.max - this.state.seconds > 60) {
      time = Math.floor((this.state.max - this.state.seconds) / 60);
      inMins = true;
    } else {
      inMins = false;
    }
    return inMins ? `${time} Minutes until next step` : `<1 Minute until next step`;
  };

  handlePause = () => {
    if (!this.state.showAlert)
      this.state.isRunning
        ? this.setState({ isRunning: false })
        : this.setState({ isRunning: true });
    else if (this.state.showAlert && this.state.isRunning) {
      this.handleAlertOpen();
      this.setState({ showAlert: false });
    } else this.setState({ isRunning: true });
  };

  handleAlertOpen = () => {
    this.setState({ alertOpen: true });
  };

  handleAlertClose = () => {
    this.setState({ alertOpen: false });
  };
  handleAlertCloseAndPause = () => {
    this.handleAlertClose();
    this.setState({ isRunning: false });
  };

  // Run countdown every seconds
  componentDidMount = () => {
    !this.isCancelled &&
      this.setState({
        timeOutId: setInterval(() => {
          this.countDown();
        }, 500),
      });
  };

  componentWillUnmount = () => {
    this.state.nextStepDing.play();
    this.isCancelled = true;
  };

  render() {
    return (
      <React.Fragment>
        {/* dialog */}
        <div>
          <Dialog
            open={this.state.alertOpen}
            onClose={this.handleAlertClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{'Pause the Recipe?'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                This may impact when your meal will be finished. Do you still wish to pause?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleAlertClose} color="primary">
                No
              </Button>
              <Button onClick={this.handleAlertCloseAndPause} color="primary" autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <ProgressBar max={this.state.max} now={this.state.seconds} />
        <Typography variant="subheading" style={style.label}>
          {this.formatLabel()}
        </Typography>
        <Button>
          <Icon onClick={this.handlePause}>{this.state.isRunning ? 'pause' : 'play_arrow'}</Icon>
        </Button>
      </React.Fragment>
    );
  }
}
// const mapStateToProps = (state, ownProps) => {
//   return {
//     ...state,
//     steps: state.steps,
//   }
// }
