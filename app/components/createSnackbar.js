const fs = require('fs');
const mkdirp = require('mkdirp');
const { uppercase } = require('../../api/utils');
const getReactState = require('./getReactState');
const textFieldsByType = require('./textFieldsByType');

module.exports = async ({ destination, schema }) => {
  const dir = `${destination}/components/Shared`;
  mkdirp.sync(dir);
  const fileName = `${dir}/Snackbar.js`;

  const code = `
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';

import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';

import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};


const styles = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  snackbar: {

  },
  message: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

class SharedSnackbar extends Component {

  static defaultProps = {
    message: '',
    variant: 'info',
    handleClose: () => {},
  }

  render () {
    const { handleClose, classes, className, message, onClose, variant, ...other } = this.props;
    const Icon = variantIcon[variant];
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={message ? true : false}
        autoHideDuration={6000}
        onClose={handleClose}
      >
      <SnackbarContent
        className={clsx(classes[variant], className)}
        aria-describedby="client-snackbar"
        message={
          <span className={classes.message}>
            <Icon className={clsx(classes.icon, classes.iconVariant)} />
            {message}
          </span>
        }
        action={[
          <IconButton key="close" aria-label="Close" color="inherit" onClick={handleClose}>
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
        {...other}
        onClose={handleClose}
      />
    </Snackbar>
    );
  }
}

SharedSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
  variant: PropTypes.string,
  message: PropTypes.string,
  handleClose: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(SharedSnackbar);
  `;
  fs.writeFileSync(fileName, code);
};
