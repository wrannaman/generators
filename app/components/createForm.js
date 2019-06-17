const fs = require('fs');
const mkdirp = require('mkdirp');
const { uppercase } = require('../../api/utils');
const getReactState = require('./getReactState');
const textFieldsByType = require('./textFieldsByType');

module.exports = async ({ destination, schema }) => {
  const dir = `${destination}/components/${uppercase(schema.name)}`;
  mkdirp.sync(dir);
  const fileName = `${dir}/Create${uppercase(schema.name)}Form.js`;

  const code = `
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import apiCall from '../../src/apiCall';

import { ThemeProvider } from '@material-ui/styles';
import { withStyles } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';

import Snackbar from '../Shared/Snackbar';
import ChipForm from '../Shared/ChipForm';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: 600,
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  },
  fields: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  form: {
    // flexDirection: 'column',
    // display: 'flex',
    maxWidth: 600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioGroup: {
    flexDirection: 'row',
    display: 'flex',
  },
  switch: {
    // width: 200,
    // minHeight: 56,
    // margin: '16px 8px 8px 8px',
  },
  switchRoot: {
    root: {
      width: 42,
      height: 26,
      padding: 0,
      margin: theme.spacing(1),
    },
  },
  radioRoot: {
    width: 200,
    minHeight: 56,
    margin: '16px 8px 8px 8px',
  },
  switchLabel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 200,
    minHeight: 56,
    margin: '16px 8px 8px 8px',
  },
  button: {
    margin: theme.spacing(1),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});

class Create${uppercase(schema.name)}Form extends Component {

  constructor(props) {
    super(props);
    this.state = ${getReactState(schema, true)}
    this.state.snackbar = {
      variant: 'success',
      message: '',
    }
    this.schema = ${JSON.stringify(schema.schema)}
  }

  handleChange = (name, type = '') => event => {
    let value = event.target.value;

    if (type && type === 'boolean' && typeof event.target.checked !== 'undefined') {
      value = event.target.checked;
    }
    if (type && type === 'number') {
      value = typeof value === 'string' ? Number(value) : value;
    }

    if (name.indexOf('.') === -1) {
      this.setState({ [name] : value });
    } else {
      name = name.split('.')
      const item = this.state[name[0]];
      item[name[1]] = value;
      this.setState({ [name[0]]: item });
    }
  }

  chipClick = (name) => (value) => (event) => {
    console.log('chip click ', name, value, event);
  }

  chipDelete = (name) => (value, index) => (event) => {
    const copy = this.state[name].slice();
    copy.splice(index, 1);
    console.log('COPY', copy)
    this.setState({ [name]: copy });
  }

  errorString = (e) => {
    const snackbar = Object.assign({}, this.state);
    snackbar.variant = 'error';
    snackbar.message = e.message ? e.message : e
    this.setState({ snackbar });
  }

  onChipAddClick = (name) => (e) => {
    console.log('on chip add click  ', name, this.state[\`\${name}StringValue\`]);
    const _copy = this.state[\`\${name}\`];
    _copy.push(this.state[\`\${name}StringValue\`]);
    this.setState({ [\`\${name}StringValue\`]: "", [name]: _copy });
  }

  submit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiCall({ url: '${schema.name}', method: 'POST', data: this.state });
      if (res && res.error) return this.errorString(res.error);
      else return this.setState({ snackbar: { variant: 'success', message: '${uppercase(schema.name)} Created.' }});
    } catch (e) {
      console.error('submit error', e);
      this.errorString(e);
    }
  }

  onSnackbarClose = (e) => {
    this.setState({ snackbar: { message: '', variant: 'info' }})
  }

  render () {
    const { classes } = this.props;
    const { snackbar, ${getReactState(schema, true, true)} } = this.state;
    return (
      <div className={classes.container}>
        <form onSubmit={this.submit} className={classes.form}>
          <FormGroup className={classes.fields}>
            ${textFieldsByType(schema, destination)}
          </FormGroup>
          <Button
            type="submit"
            variant="contained"
            className={classes.button}
            color="primary"
           >
            Create ${uppercase(schema.name)}
          </Button>
        </form>
        <Snackbar
          variant={snackbar.variant}
          message={snackbar.message}
          handleClose={this.onSnackbarClose}
        />
      </div>
    );
  }
}

Create${uppercase(schema.name)}Form.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Create${uppercase(schema.name)}Form);
  `;
  fs.writeFileSync(fileName, code);
};
