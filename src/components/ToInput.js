import React from "react";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  canvas: {
    marginTop: "10px",
    alignItems: "center",
    justifyContent: "center",
    display: "flex"
  },
  container: {
    width: "300px"
  },
  input: {
    fontSize: "20px",
    "&:disabled": {
      color: "#E0E0E0"
    }
  }
};

function ToInput(props) {
  const { classes, isLoading } = props;

  return (
    <div className={classes.canvas}>
      <TextField
        disabled={isLoading}
        onChange={e => props.updateTo(e.target.value)}
        value={props.to}
        InputProps={{
          classes: {
            input: classes.input
          }
        }}
        className={classes.container}
      />
    </div>
  );
}

export default withStyles(styles)(ToInput);
