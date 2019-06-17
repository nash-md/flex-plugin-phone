import React from "react";

import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";

const styles = {};

function WorkerListItem(props) {
  return (
    <MenuItem value={props.worker.attributes.full_name}>
      {props.worker.attributes.full_name} ({props.worker.state})
    </MenuItem>
  );
}

export default withStyles(styles)(WorkerListItem);
