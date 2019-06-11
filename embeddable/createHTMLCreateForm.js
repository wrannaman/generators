const fs = require('fs');
const beautify = require('js-beautify').html;
const { uppercase } = require('../api/utils');
const uuid = require('uuid').v4;
module.exports = async ({ schema, destination }) => {
  console.log('make html');
  const getReactState = require('../app/components/getReactState');
  const textFieldsByType = require('../app/components/textFieldsByType');

  const componentID = uuid()
  const fileName = `${destination}/${uppercase(schema.name)}/${uppercase(schema.name)}CreateForm.html`;
  const componentName = `${uppercase(schema.name)}CreateForm`
  console.log('FILENAME', fileName)

  const host = "http://localhost:8080"
  const code = [
`
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>${componentName}</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
    <script src="https://unpkg.com/react@latest/umd/react.development.js" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/react-dom@latest/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@material-ui/core@latest/umd/material-ui.development.js" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/babel-standalone@latest/babel.min.js" crossorigin="anonymous"></script>
    <!-- Fonts to support Material Design -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <!-- Icons to support Material Design -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <script src="https://unpkg.com/zoid@9.0.27/dist/zoid.frameworks.min.js"></script>
    <script src="https://unpkg.com/clsx@1.0.4/dist/clsx.min.js"></script>
    <script src="https://unpkg.com/query-string@6.7.0/index.js"></script>
    <script src="${host}/${componentName}.js"></script>
  </head>
  <body>
    <div id="container"></div>
    <script type="text/babel">

// mui defs


const {
  colors,
  CssBaseline,
  MuiThemeProvider,
  Typography,
  Container,
  makeStyles,
  createMuiTheme,
  Box,
  SvgIcon,
  Link,
  withStyles,
  FormGroup,
  TextField,
  Button,
  Snackbar,
  SnackbarContent,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Switch,
} = MaterialUI;

const apiCall = ({ apiURL, url, method, data, params = null, fullURL = null,  }) => {
    // Default options are marked with *
    let stringified = "";
    if (params) {
      Object.keys(params).forEach((param) => {
        if (param === 'orderBy' && params[param]) {
          const orderBy = {};
          orderBy[params[param].field] = params.orderDirection;
          delete params.orderDirection;
          delete params.orderBy;
          params.sort = JSON.stringify(orderBy);
        }
        if (typeof params[param] === 'object') params[param] = JSON.stringify(params[param]);
      })
      stringified = \`?\${queryString.stringify(params)}\`;
    }
    const fetchObject = {
      headers: {
        'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        // Authorization?
      },
      // credentials: 'include', // include, *same-origin, omit
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      mode: 'cors', // no-cors, cors, *same-origin
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
    }
    if (method) fetchObject.method = method;
    if (data) fetchObject.body = JSON.stringify(data);

    return fetch(fullURL ? fullURL : \`\${apiURL}/\${url}\${stringified}\`, fetchObject).then(response => response.json());
  }

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
      main: colors.red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

const styles = {
  root: {
    margin: theme.spacing(6, 0, 3),
  },
  lightBulb: {
    verticalAlign: 'middle',
    marginRight: theme.spacing(1),
  },
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
};


class ${componentName} extends React.Component {


  static getInitialProps = () => {
    return style = {};
  }

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

  errorString = (e) => {
    const snackbar = Object.assign({}, this.state);
    snackbar.variant = 'error';
    snackbar.message = e.message ? e.message : e
    this.setState({ snackbar });
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
            ${textFieldsByType(schema)}
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
  const ${componentName}WithStyles = withStyles(styles, { withTheme: true })(${componentName})

  ReactDOM.render(
    <MuiThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <${componentName}WithStyles { ...window.xprops }/>
    </MuiThemeProvider>,
    document.querySelector('#container'),
  );
      </script>
    </body>
  </html>
`];

  const pretty = beautify(code.join("\n"), { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(fileName, pretty);
};
