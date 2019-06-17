const fs = require('fs');
const mkdirp = require('mkdirp');
const { uppercase } = require('../../api/utils');
const getReactState = require('./getReactState');
const textFieldsByType = require('./textFieldsByType');

module.exports = async ({ destination }) => {
  const fileName = `${destination}/components/Shared/ChipForm.js`;

  const componentName = `ChipsWithInput`;

  const code = `
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chips from './Chips';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = (theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  chip: {
    margin: theme.spacing(1),
  },
});

class ${componentName} extends Component {
  static defaultProps = {
    items: [],
    label: '',
    chipClick: () => {},
    chipDelete: () => {},
    value: '',
    onChange: () => {},
    onChipAddClick: () => {},
  }


  render() {
    const { classes } = this.props;
    return (
      <div>
        <TextField
          label={this.props.label}
          className={classes.textField}
          value={this.props.value}
          onChange={this.props.onChange}
          margin="normal"
        />

        <Chips
          items={this.props.items}
          chipClick={this.props.chipClick}
          chipDelete={this.props.chipDelete}
        />

        <Button
          onClick={this.props.onChipAddClick}
        >
          Add
        </Button>
      </div>
    )
  }

}

${componentName}.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array,
  chipClick: PropTypes.func,
  chipDelete: PropTypes.func,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onChipAddClick: PropTypes.func,
  label: PropTypes.string,
};

export default withStyles(styles, { withTheme: true })(${componentName});
  `;
  fs.writeFileSync(fileName, code);
};
