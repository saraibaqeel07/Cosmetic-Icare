import { Fragment } from "react";
import { Autocomplete, InputLabel, TextField, Typography, createFilterOptions } from "@mui/material";
import { Debounce } from "../../utils";


function SelectField(props) {

  const { label, size, disabled, onSearch, addNew, multiple, selected, onSelect, register, error, options, fullWidth, newLabel, readOnly } = props

  const filter = createFilterOptions();


  // *For Handle Filter Option
  const handleFilterOptions = (options, params) => {

    const filtered = filter(options, params);


    const { inputValue } = params;
    // *Suggest the creation of a new value
    const isExisting = options.some((option) => inputValue === option.name);
    if (inputValue !== '' && !isExisting && addNew) {
      filtered.push({
        inputValue,
        name: `Add "${inputValue}"`,
      });
    }

    return filtered;
  }

  // *For Handle Option Label
  const handleOptionLabel = (option) => {

    // *Value selected with enter, right from the input
    if (typeof option === 'string') {
      return option;
    }
    // *Add new option created dynamically
    if (option.inputValue && addNew) {
      return option.inputValue;
    }
    // *Regular option
    return option.name;

  }

  // *For Handle Change
  const handleChange = (newValue) => {
    if (typeof newValue === 'string') {
      onSelect(newValue)
      return
    }
    if (newValue && newValue.inputValue && addNew) {
      addNew(newValue?.inputValue)
      return
    }
    return onSelect(newValue)
  }

  // *For Handle Search
  const handleSearch = (value) => {
    if (onSearch) {
      Debounce(() => onSearch(value));
    }
  }

  return (
    <Fragment>
      <InputLabel sx={{ fontWeight: 'bold', fontSize: '16px', mb: '10px' }} error={error && selected === '' && true}>{label}</InputLabel>
      <Autocomplete
        readOnly={readOnly}
        disabled={disabled}
        size={size}
        fullWidth={fullWidth}
        multiple={multiple}
        isOptionEqualToValue={(option, value) => option?.name === value?.name}
        value={selected}
        options={options}
        filterOptions={(options, params) => handleFilterOptions(options, params)}
        getOptionLabel={(option) => handleOptionLabel(option)}
        onChange={(event, newValue) => handleChange(newValue)}
        onInputChange={(event, newInputValue) => handleSearch(newInputValue)}
        sx={{ mb: !error && 2 }}
        renderOption={(props, option) => <li {...props}>{option.name}</li>}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: '1px solid #e0e0e0 !important',
                  borderRadius: '12px',

                }
              }
            }}
            placeholder={newLabel ? newLabel : label}
            error={error}
            {...register}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }}
          />
        )}
      />
      {error && (
        <Typography variant="caption" color="error" sx={{ textAlign: 'left' }}>{error}</Typography>
      )}
    </Fragment>
  );
}

export default SelectField