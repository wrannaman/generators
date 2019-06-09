const fs = require('fs');
const mkdirp = require('mkdirp');
const { uppercase } = require('../../api/utils');
const getReactState = require('./getReactState');
const getTableColumns = require('./getTableColumns');
const textFieldsByType = require('./textFieldsByType');

module.exports = async ({ destination, schema }) => {
  const dir = `${destination}/components/${uppercase(schema.name)}`;
  mkdirp.sync(dir);
  const fileName = `${dir}/${uppercase(schema.name)}Table.js`;

  const code = `
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from "material-table";

import { withStyles } from '@material-ui/core/styles';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';


import apiCall from '../../src/apiCall';

import Snackbar from '../Shared/Snackbar';

const styles = theme => ({

});

const tableIcons = {
  Add: AddBox,
  Check: Check,
  Clear: Clear,
  Delete: DeleteOutline,
  DetailPanel: ChevronRight,
  Edit: Edit,
  Export: SaveAlt,
  Filter: FilterList,
  FirstPage: FirstPage,
  LastPage: LastPage,
  NextPage: ChevronRight,
  PreviousPage: ChevronLeft,
  ResetSearch: Clear,
  Search: Search,
  SortArrow: ArrowUpward,
  ThirdStateCheck: Remove,
  ViewColumn: ViewColumn
};

class ${uppercase(schema.name)}Table extends Component {



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
      // this.schema = ${JSON.stringify(schema.schema)}
    }

    componentWillMount () {
      this.fetchData();
    }

    fetchData = async (query) => {
      console.log('QUERY ${schema.name}s', query)
      if (!query) query = {};
      query.limit = query.pageSize || 10;
      const res = await apiCall({ url: '${schema.name}s', method: 'GET', params: query });
      console.log('JSON${schema.name}s', res.${schema.name}s)

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
      console.log('NEWDATA', newData)
    }
    onRowUpdate = async (newData) => {
      console.log('NEWDATA', newData)
    }
    onRowDelete = async (newData) => {
      console.log('NEWDATA', newData)
    }

    render () {
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
                  filtering: true
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

  ${uppercase(schema.name)}Table.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles, { withTheme: true })(${uppercase(schema.name)}Table);
  `;
  fs.writeFileSync(fileName, code);
};
