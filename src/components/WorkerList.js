import React from "react";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import { withStyles } from "@material-ui/core/styles";

const styles = {
  container: {
    marginTop: "10px",
    alignItems: "center",
    justifyContent: "center",
    display: "flex"
  },
  select: {
    width: "300px"
  },
  isOffline: {
    width: "8px",
    height: "8px",
    marginRight: "10px",
    display: "inline-block"
  },
  isOnline: {
    width: "8px",
    height: "8px",
    borderRadius: "4px",
    marginRight: "10px",
    backgroundColor: "#07ca82",
    display: "inline-block"
  }
};

class WorkerList extends React.Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;

    this.state = {
      friendlyName: ""
    };
  }

  handleChange(event) {
    console.log("handle change: " + event.target.value);

    this.setState(
      {
        friendlyName: event.target.value
      },
      this.props.setFriendlyName(event.target.value)
    );
  }
  render() {
    return (
      <div className={this.classes.container}>
        <Select
          disabled={this.props.isLoading}
          className={this.classes.select}
          input={
            <Input name="friendlyName" id="worker-name-label-placeholder" />
          }
          displayEmpty
          name="friendlyName"
          value={this.state.friendlyName}
          onChange={this.handleChange.bind(this)}
        >
          <MenuItem value="" />
          {this.props.workers.map(worker => {
            return (
              <MenuItem value={worker.attributes.full_name}>
                {worker.activity_name === "Offline" ? (
                  <span className={this.classes.isOffline} />
                ) : (
                  <span className={this.classes.isOnline} />
                )}
                {worker.attributes.full_name}
              </MenuItem>
            );
          })}
        </Select>
      </div>
    );
  }
}

export default withStyles(styles)(WorkerList);
