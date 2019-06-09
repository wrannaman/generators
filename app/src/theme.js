const fs = require('fs');
const beautify = require('js-beautify').js;

module.exports = async (file) => {
  const fileName = `${file}/src/theme.js`

  const code = `
  import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;
  `;
  const pretty = beautify(code, { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(fileName, pretty);
};
