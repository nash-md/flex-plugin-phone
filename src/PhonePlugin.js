import { FlexPlugin } from "flex-plugin";
import React from "react";
import PhoneCanvas from "./components/PhoneCanvas";
import PhoneSideNavButton from "./components/PhoneSideNavButton";
import { PhoneControlManager } from "./services/PhoneControlManager";
import { registerCustomActions } from "./CustomActions";
import { registerCustomTaskChannel } from "./CustomTaskChannel";

const PLUGIN_NAME = "PhonePlugin";

export default class PhonePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */

  init(flex, manager) {
    const runtimeDomain = manager.serviceConfiguration.runtime_domain;
    const identity = manager.store.getState().flex.session.identity;
    const fullName = manager.store.getState().flex.worker.attributes.full_name;
    const token = manager.store.getState().flex.session.ssoTokenPayload.token;

    const phoneControlManager = new PhoneControlManager(
      runtimeDomain,
      token,
      identity,
      fullName
    );

    flex.SideNav.Content.add(
      <PhoneSideNavButton key="phone-side-nav-button" />
    );

    flex.ViewCollection.Content.add(
      <flex.View name="phone-view" key="phone-view">
        <PhoneCanvas
          key="dialpad-view"
          identity={identity}
          insightsClient={manager.insightsClient}
          phoneControlManager={phoneControlManager}
        />
      </flex.View>
    );

    manager.workerClient.on("reservationCreated", reservation => {
      if (reservation.task.attributes.autoAnswer === true) {
        flex.Actions.invokeAction("AcceptTask", { sid: reservation.sid });
        //select the task
        flex.Actions.invokeAction("SelectTask", { sid: reservation.sid });
      }
    });

    registerCustomActions(phoneControlManager);
    registerCustomTaskChannel(flex);
  }
}
