const fs = require('fs');
const beautify = require('js-beautify').html;
const { uppercase } = require('../api/utils');
const uuid = require('uuid').v4;
module.exports = async ({ schema, destination }) => {
  const getReactState = require('../app/components/getReactState');
  const textFieldsByType = require('../app/components/textFieldsByType');
  const getTableColumns = require('../app/components/getTableColumns');

  const componentID = uuid();
  const fileName = `${destination}/${uppercase(schema.name)}/${uppercase(schema.name)}Table.html`;
  const componentName = `${uppercase(schema.name)}Table`
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
    <!-- Fonts to support Material Design -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <!-- Icons to support Material Design -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <script src="https://unpkg.com/zoid@9.0.27/dist/zoid.frameworks.min.js"></script>
    <script src="https://unpkg.com/clsx@1.0.4/dist/clsx.min.js"></script>
    <script src="https://unpkg.com/query-string@6.7.0/index.js"></script>
    <script src="https://unpkg.com/@material-ui/icons@4.1.0/index.js"></script>

    <script src="https://unpkg.com/material-table@1.39.0/dist/index.js"></script>
    <script src="https://unpkg.com/babel-standalone@latest/babel.min.js" crossorigin="anonymous"></script>

    <script src="${host}/${componentName}.js"></script>
  </head>
  <body>
    <div id="container"></div>
    <script type="text/babel">
    console.log('table', window._MaterialTable)
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

const tableIcons = {
  Add: window.AddBox,
  Check: window.Check,
  Clear: window.Clear,
  Delete: window.DeleteOutline,
  DetailPanel: window.ChevronRight,
  Edit: window.Edit,
  Export: window.SaveAlt,
  Filter: window.FilterList,
  FirstPage: window.FirstPage,
  LastPage: window.LastPage,
  NextPage: window.ChevronRight,
  PreviousPage: window.ChevronLeft,
  ResetSearch: window.Clear,
  Search: window.Search,
  SortArrow: window.ArrowUpward,
  ThirdStateCheck: window.Remove,
  ViewColumn: window.ViewColumn,
  Refresh: window.Refresh,
};

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
    this.state.docs = [];
    this.state.limit = 10;
    this.state.totalDocs = 0;
    this.state.offset = 0;
    this.schema = ${JSON.stringify(schema.schema)}
  }
  componentWillMount () {
    this.fetchData();
  }
  fetchData = async (query) => {
    if (!query) query = {};
    query.limit = query.pageSize || 10;
    const res = await apiCall({ url: '${schema.name}s', method: 'GET', params: query });

    return {
      data: res.${schema.name}s.docs,
      page: res.${schema.name}s.offset / res.${schema.name}s.limit,
      totalCount: res.${schema.name}s.totalDocs,
    }
  }
  onSnackbarClose = (e) => {
    this.setState({ snackbar: { message: '', variant: 'info' }})
  }

  onRowAdd = async (newData) => {
    const res = await apiCall({ url: "${schema.name}", method: 'POST', data: newData });
    if (!res.error) this.setState({ snackbar: { variant: 'success', message: '${uppercase(schema.name)} Created.' }});
    else this.setState({ snackbar: { variant: 'error', message: res.error }});
  }
  onRowUpdate = async (newData, oldData) => {
    const res = await apiCall({ url: \`${schema.name}/\${oldData._id}\`, method: 'PUT', data: newData });
    if (!res.error) this.setState({ snackbar: { variant: 'success', message: '${uppercase(schema.name)} Updated.' }});
    else this.setState({ snackbar: { variant: 'error', message: res.error }});
  }
  onRowDelete = async (oldData) => {
    const res = await apiCall({ url: \`${schema.name}/\${oldData._id}\`, method: 'DELETE', })
    if (!res.error) this.setState({ snackbar: { variant: 'success', message: '${uppercase(schema.name)} Deleted.' }});
    else this.setState({ snackbar: { variant: 'error', message: res.error }});
  }

  render () {
    /*

    Cant edit / delete when selection: true

    https://github.com/mbrn/material-table/issues/648

    */
    const { classes } = this.props;
    const { snackbar, ${getReactState(schema, true, true)} } = this.state;
    return (
      <div className={classes.container}>
        <div className={classes.table}>
          <div style={{ maxWidth: "100%" }}>
            <MaterialTable
              columns={${getTableColumns(schema)}}
              data={this.fetchData}
              icons={tableIcons}
              title="${uppercase(schema.name)} Table"
              options={{
                filtering: true,
                selection: false,
                exportButton: true
              }}
              tableRef={this.tableRef}
              localization={{
                body: {
                  editRow: {
                    deleteText: 'Delete this row?'
                  }
                }
              }}
              editable={{
                onRowAdd: this.onRowAdd,
                onRowUpdate: this.onRowUpdate,
                onRowDelete: this.onRowDelete,
                isEditable: (rowData) => {
                  // console.log('ROWDATA', rowData)
                  // const areUnique = [];
                  // const columns = ${getTableColumns(schema)};
                  // console.log('COLUMNS', columns)
                  // columns.forEach((column) => column.readonly ? areUnique.push(column.field) : "");
                  // console.log('AREUNIQUE', areUnique)
                  return true;
                },
                isDeletable: () => true,
               }}
               actions={[
                 {
                   icon: Refresh,
                   tooltip: 'Refresh Data',
                   isFreeAction: true,
                   onClick: () => this.tableRef.current && this.tableRef.current.onQueryChange(),
                 }
               ]}
            />
          </div>
        </div>
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
