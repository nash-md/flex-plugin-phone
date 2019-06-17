import React from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Phone from "@material-ui/icons/Phone";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  canvas: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex"
  },
  button: {
    "&:hover": {
      backgroundColor: "#07ca82"
    },
    "&:disabled": {
      backgroundColor: "#E0E0E0"
    },
    height: "50px;",
    width: "140px",
    backgroundColor: "#07ca82",
    borderRadius: 0
  },
  makeItWhite: {
    color: "white"
  }
};

function CallButton(props) {
  const { classes, call, isValid, isLoading } = props;

  return (
    <div className={classes.canvas}>
      <Button
        disabled={!isValid || isLoading}
        onClick={e => call()}
        className={classes.button}
      >
        {isLoading ? (
          <CircularProgress className={classes.makeItWhite} />
        ) : (
          <Phone className={classes.makeItWhite} />
        )}
      </Button>
    </div>
  );
}

export default withStyles(styles)(CallButton);
