import React from "react";

import * as Context from "../Context";

import ToInput from "./ToInput";
import WorkerList from "./WorkerList";
import DialPad from "./DialPad";
import CallButton from "./CallButton";

class PhoneCanvas extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      to: Context.PHONE_NUMBER_PLACEHOLDER,
      isFriendlyName: false,
      isValid: true,
      isLoading: false,
      workers: []
    };
  }

  componentDidMount() {
    this.props.insightsClient.instantQuery("tr-worker").then(q => {
      q.on("searchResult", items => {
        const list = Object.values(items).filter(
          worker => worker.friendly_name !== this.props.identity
        );

        this.setState({ workers: list });
      });

      q.search("");
    });
  }

  isValidTo = value => {
    if (
      this.state.workers.filter(worker => worker.attributes.full_name === value)
        .length > 0 ||
      this.isValidPhoneNumber(value)
    ) {
      return true;
    } else {
      return false;
    }
  };

  isValidPhoneNumber(value) {
    const isPhoneNumberExpression = /^\+\d+$/g;

    return isPhoneNumberExpression.test(value);
  }

  updateTo = value => {
    const isNumberExpression = /^\d+$/g;

    if (isNumberExpression.test(value)) {
      console.log("add prefix");
      value = `+${value}`;
    }

    this.setState({
      to: value,
      isValid: this.isValidTo(value)
    });
  };

  setFriendlyName = value => {
    this.setState({
      to: value,
      isFriendlyName: true
    });
  };

  getWorkerByFriendlyName(name) {
    const values = this.state.workers.filter(worker => {
      return worker.attributes.full_name === name;
    });
    return values[0].friendly_name;
  }

  addDigit = digit => {
    if (this.state.isFriendlyName) {
      this.setState(
        {
          isFriendlyName: false
        },
        this.updateTo(digit)
      );
    } else {
      this.updateTo(`${this.state.to}${digit}`);
    }
  };

  call = () => {
    console.log(`call: ${this.state.to}`);

    this.setState({
      isLoading: true
    });

    const identity = this.isValidPhoneNumber(this.state.to)
      ? this.state.to
      : this.getWorkerByFriendlyName(this.state.to);

    this.props.phoneControlManager
      .create(identity)
      .then(task => {
        console.log(`task ${task.sid}`);

        this.setState({
          isLoading: false
        });
      })
      .catch(error => console.log(error));
  };

  render() {
    return (
      <div>
        <ToInput
          isLoading={this.state.isLoading}
          updateTo={this.updateTo}
          to={this.state.to}
        />
        <WorkerList
          workers={this.state.workers}
          isLoading={this.state.isLoading}
          setFriendlyName={this.setFriendlyName}
        />
        <DialPad addDigit={this.addDigit} />
        <CallButton
          isLoading={this.state.isLoading}
          isValid={this.state.isValid}
          call={this.call}
        />
      </div>
    );
  }
}

export default PhoneCanvas;
