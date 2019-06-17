import React from "react";

import { withStyles } from "@material-ui/core/styles";
import DialPadButton from "./DialPadButton";

const numbers = [
  [
    { number: 1, letters: null },
    { number: 2, letters: "ABC" },
    { number: 3, letters: "DEF" }
  ],
  [
    { number: 4, letters: "GHI" },
    { number: 5, letters: "JKL" },
    { number: 6, letters: "MNO" }
  ],
  [
    { number: 7, letters: "PQRS" },
    { number: 8, letters: "TUV" },
    { number: 9, letters: "WXYZ" }
  ],
  [
    { number: "*", letters: null },
    { number: 0, letters: null },
    { number: "#", letters: null }
  ]
];

const styles = {
  canvas: {
    marginTop: "15px",
    marginBottom: "15px"
  }
};

function DialPad(props) {
  const { classes, addDigit } = props;

  return (
    <div>
      {numbers.map(row => {
        return (
          <div className={classes.canvas}>
            {row.map(function(item, i) {
              return (
                <DialPadButton addDigit={addDigit} letter={item.letter} number={item.number} />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default withStyles(styles)(DialPad);
