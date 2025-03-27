"use client"

import { Fragment } from "react"
import { FormControl, InputLabel, TextField, Typography, InputAdornment } from "@mui/material"

function InputField(props) {
  const {
    inputRef,
    variant,
    size,
    dir,
    label,
    labelIcon,
    placeholder,
    defaultValue,
    value,
    register,
    error,
    rows,
    multiline,
    type,
    InputProps,
    disabled,
    inputProps,
    onInput,
    onBlur,
    helperText,
    style,
    id,
    inputStyle,
    startAdornment,
    endAdornment,
    custom,
    max,
    readOnly,
  } = props

  return (
    <Fragment>
      <InputLabel
        error={error && true}
        sx={
          custom
            ? custom
            : {
              textTransform: "capitalize",
              textAlign: "left",
              fontWeight: 600,
              fontSize: "14px",
              color: "#333",
              marginBottom: "4px",
            }
        }
      >
        {" "}
        {labelIcon ? <img src={labelIcon || "/placeholder.svg"} alt="" width={"13px"} height={"13px"} /> : ""} {label}
      </InputLabel>
      <FormControl variant="standard" fullWidth sx={{ mt: 1, mb: 2, ...style, ".MuiFormHelperText-root": { ml: 0 } }}>
        <TextField
          inputRef={inputRef}
          variant={variant ?? "outlined"}
          size={size}
          dir={dir}
          value={value}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          defaultValue={defaultValue}
          id={id}
          error={error && true}
          multiline={multiline}
          rows={rows ? 4 : ""}
          onBlur={onBlur}
          InputProps={{
            startAdornment: startAdornment && <InputAdornment position="start">{startAdornment}</InputAdornment>,
            endAdornment: endAdornment && <InputAdornment position="end">{endAdornment}</InputAdornment>,
            ...InputProps,
          }}
          inputProps={{
            ...inputProps,
            readOnly: readOnly, // Ensure this is passed here
          }}
          onInput={onInput}
          helperText={helperText}
          {...register}
          sx={{
            borderRadius: "12px",
            ".MuiOutlinedInput-root": {
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              outline: "none",
              transition: "all 0.2s ease-in-out",
              "& fieldset": { border: "none" },
              "&:hover": {
                border: "1px solid #0076bf",
              },
              "&.Mui-focused": {
                border: "1px solid #0076bf",
                "& fieldset": { border: "none" },
                svg: {
                  path: {
                    fill: "#0076bf",
                  },
                },
              },
            },
            ...inputStyle,
          }}
        />

        <Typography color="error" sx={{ fontSize: 12, textAlign: "left" }}>
          {error}
        </Typography>
      </FormControl>
    </Fragment>
  )
}

export default InputField

