const fs = require('fs');
const mkdirp = require('mkdirp');
const { uppercase } = require('../../api/utils');
const getReactState = require('./getReactState');
const textFieldsByType = require('./textFieldsByType');

module.exports = async ({ destination }) => {
  const fileName = `${destination}/components/Shared/Chips.js`;

  const componentName = `Chips`;

  const code = `
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

const styles = (theme) => ({

});

class ${componentName} extends Component {
  static defaultProps = {
    items: [],
    chipClick: () => {},
    chipDelete: () => {},
  }


  render() {
    const { classes, items } = this.props;
    return (
      {items.map((itemString, index) => (
        <Chip
        key={\`\${itemString}-\${index}\`}
        label={itemString}
        className={classes.chip}
        onClick={this.props.chipClick}
        onDelete={this.props.chipDelete}
        variant="outlined" />
      ))}
    )
  }

}

${componentName}.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array,
  chipClick: PropTypes.func,
  chipDelete: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(${componentName});
  `;
  fs.writeFileSync(fileName, code);
};
