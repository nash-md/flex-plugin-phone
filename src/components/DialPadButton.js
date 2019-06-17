import React from "react";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { withStyles } from "@material-ui/core/styles";

const styles = {
  button: {
    width: "80px",
    display: "flex",
    flexDirection: "column"
  },
  subtitle: {
    color: "#607D8B"
  }
};

class DialPadButton extends React.Component {
  constructor(props) {
    super(props);

    this.classes = this.props.classes;
    this.addDigit = this.props.addDigit;
  }

  render() {
    return (
      <Button
        onClick={() => this.addDigit(this.props.number)}
        size="large"
        key={this.props.number}
      >
        <div className={this.classes.button}>
          <Typography component="h5" variant="h5"> {this.props.number}</Typography>
          <Typography className={this.classes.subtitle} variant="subtitle2" color="textSecondary">
            {this.props.letters}
          </Typography>
        </div>
      </Button>
    );
  }
}

export default withStyles(styles)(DialPadButton);
