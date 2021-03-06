import * as React from "react";
import { createAppContainer } from "react-navigation";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore, Middleware } from "redux";
import { enableBatching } from "redux-batched-actions";
import thunk from "redux-thunk";

import { action } from "@storybook/addon-actions";
import { View } from "native-base";

import { callApiMiddleware } from "../../callApiMiddleware";
import reducers, { IReducerState } from "../../reducers";

const logActionToStorybook: Middleware<{}, IReducerState> = ({ getState }) => {
  return (next) => async (rAction) => {
    const beforeActionState = getState();
    const actionResults = await next(rAction);
    action(rAction.type)({
      actionResults,
      beforeActionState,
      action: rAction,
      state: getState()
    });
    return actionResults;
  };
};

export const makeStore = (
  ...args: Array<Middleware<any, IReducerState>>
) => createStore(enableBatching(reducers), compose(
  applyMiddleware(thunk, callApiMiddleware, ...args)
));

const store = makeStore(logActionToStorybook);

export const withProvider = (story: any) => {
  return (
    <Provider store={store}>
      {story()}
    </Provider>
  );
};

// render react-navigation screen instead of story
export const withNavigator = (navigator: any) => () => {
  const Navigator = createAppContainer(navigator());
  return <Navigator />;
};

export const withHeaderSpace = (story: any) => {
  return (
    <View style={{ paddingTop: 50, paddingBottom: 50, flex: 1 }}>
      {story()}
    </View>
  );
};
