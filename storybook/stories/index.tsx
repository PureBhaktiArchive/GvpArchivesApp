import * as React from "react";
import { createStackNavigator, NavigationScreenProps } from "react-navigation";

import { action } from "@storybook/addon-actions";
import { Story } from "@storybook/react";
import { storiesOf } from "@storybook/react-native";
import { View } from "native-base";

import { SearchBarStack } from "../../navigation/MainTabNavigator";
import { getQueryId } from "../../reducers/search";
import { SearchHeader } from "../../screens";
import HomeScreen from "../../screens/HomeScreen";
import { AutoComplete } from "../../screens/SearchBarScreen/AutoComplete";
import Filter from "../../screens/SearchBarScreen/Filter";
import { RecentSearches } from "../../screens/SearchBarScreen/RecentSearches";
import { withHeaderSpace, withNavigator, withProvider } from "../utils/decorators";
import CenterView from "./CenterView";

(storiesOf("SearchBarStack", module) as Story)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withNavigator(() => createStackNavigator({
    SearchBarStack: {
      navigationOptions: (props: NavigationScreenProps) => ({
        headerTitle: <SearchHeader {...props} />
      }),
      screen: SearchBarStack
    }
  })))
  .addDecorator(withProvider)
  .add("renders", () => {
    return <View />;
  });

(storiesOf("Home", module) as Story)
  .addDecorator(withHeaderSpace)
  .add("default", ()  => {
    return (
      <HomeScreen
        navigation={{ navigate: (...args: any[]) => action("navigate")(...args) } as any}
      />
    );
  });

(storiesOf("SearchBarScreen", module) as Story)
  .addDecorator(withHeaderSpace)
  .addDecorator(withProvider)
  .add("Filter", () => {
    return (
      <Filter
        scale={1}
        width={400}
        fontScale={1}
        height={400}
      />
    );
  })
  .add("AutoComplete", () => {
    const props: any = {
      autoComplete: { results: ["autocomplete-1", "autocomplete-2", "autocomplete-3"], timeToLive: 123344},
      categories: ["book"],
      isLoading: false,
      navigation: {
        dangerouslyGetParent: () => props.navigation,
        replace: action("autoComplete-replace")
      },
      query: "radha",
      queryId: getQueryId("radha", ["book"])
    };
    return (
      <AutoComplete {...props} />
    );
  })
  .add("RecentSearches", () => {
    const props = {
      navigation: {
        dangerouslyGetParent: () => props.navigation,
        replace: action("recentSearch-replace")
      } as any,
      searches: [
        { query: "radha", categories: ["book"], timestamp: 1234},
        { query: "search2", categories: ["harikatha", "movie"], timestamp: 2234},
        { query: "radha", categories: ["book", "song"], timestamp: 233333}
      ]
    };
    return (
      <RecentSearches {...props} />
    );
  });
