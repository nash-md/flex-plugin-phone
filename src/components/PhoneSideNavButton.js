import * as React from "react";

import { SideLink, Actions } from "@twilio/flex-ui";

export default class PhoneSideNavButton extends React.Component {
  render() {
    return (
      <SideLink
        {...this.props}
        icon="Call"
        iconActive="CallBold"
        isActive={this.props.activeView === "phone-view"}
        onClick={() =>
          Actions.invokeAction("NavigateToView", { viewName: "phone-view" })
        }
      >
        Phone
      </SideLink>
    );
  }
}
