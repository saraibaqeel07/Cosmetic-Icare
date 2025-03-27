import { LoadingButton } from "@mui/lab";
import { CircularProgress } from "@mui/material";

export const PrimaryButton = ({ title,onClick,type,loader,sx,disabled}) => {
  return (
    <LoadingButton
      variant="contained"
      onClick={onClick}
      type={type}
      disabled={disabled}
      sx={{
        textTransform: "capitalize",
        boxShadow: "none",
        borderRadius:'10px',
        pl: "25px",
        pr: "25px",
        py: 1.2,
        background: "#0052a8",
        color: "white",
        fontSize: { xs: 12, md: 14 },
        border: "none",
        outline: "none",
        "&:focus": {
          outline: "none",
        },
        "&:focus-visible": {
          outline: "none",
        },
        ...sx
      }}
    >
      {loader ? <CircularProgress size={25} color="white"/> : title}
    </LoadingButton>
  );
};
