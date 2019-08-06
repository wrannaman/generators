const { uppercase } = require('../../api/utils');

const radio = (name, type, fullObject) => {
  const enumArray = fullObject.enum.map((item) => (`<FormControlLabel value="${item}" control={<Radio />} label="${uppercase(item)}" />`));
  return `
      <FormControl component="fieldset" className={classes.radioRoot}>
        <FormLabel component="legend">${uppercase(name)}</FormLabel>
        <RadioGroup
          aria-label="${uppercase(name)}"
          name="${name}"
          className={classes.radioGroup}
          value={this.state.${name}}
          onChange={this.handleChange("${name}")}
        >
        ${enumArray.join('\n')}
        </RadioGroup>
      </FormControl>
  `;
};

module.exports = (name, type, fullObject) => {
  //              error={this.state.${name}Error}

  let textFieldType = 'text';
  const htmlType = fullObject.htmlType;
  if (!htmlType) {
    textFieldType = type === 'Number' ? 'number' : 'text';
  } else {
    textFieldType = htmlType;
  }
  switch (type) {
    case 'String':
    case 'Number':
      if (htmlType && htmlType === 'radio') return radio(name, type, fullObject);
      return `
               <TextField
                 required={${fullObject.required ? true : false}}
                 label="${name.split('.').map((_name) => uppercase(_name)).join(' ')}"
                 className={classes.textField}
                 margin="normal"
                 type="${textFieldType}"
                 variant="outlined"
                 onChange={this.handleChange("${name}", '${type.toLowerCase()}')}
                 value={this.state.${name}}
               />`;
    case 'Boolean':
      return `
        <div className={classes.switch}>
          <FormControlLabel
             className={classes.switchLabel}
             control={
               <Switch
                 onChange={this.handleChange("${name}", 'boolean')}
                 value={this.state.${name}}
                 classes={{
                   root: classes.switchRoot,
                   switchBase: classes.switchBase,
                   thumb: classes.thumb,
                   track: classes.track,
                   checked: classes.checked,
                 }}
               />
             }
             label="${uppercase(name)}"
           />
        </div>

      `;
    case 'Array':
      return `
      <ChipForm
        label={"${name}"}
        value={this.state.${name}StringValue}
        items={this.state.${name}}
        onChange={this.handleChange("${name}StringValue", 'string')}
        chipDelete={this.chipDelete("${name}")}
        chipClick={this.chipClick("${name}")}
        onChipAddClick={this.onChipAddClick("${name}")}
      />
      `;
    default:

  }


};


// <TextField
//   required
//   id="standard-required"
//   label="Required"
//   defaultValue="Hello World"
//   className={classes.textField}
//   margin="normal"
// />
