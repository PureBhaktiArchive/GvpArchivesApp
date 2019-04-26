import * as React from "react";
import { BackHandler, View } from "react-native";
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import _ from "lodash";
import { Header as BaseHeader, Input, Item } from "native-base";

import { Icon } from "../../components/Icon";

import { search } from "../../actions";
import { getQuerySuggestions } from "../../actions/search";
import { IReducerState } from "../../reducers";
import { getSearch, SearchStateAndActions } from "../../reducers/search";

interface IProps extends NavigationScreenProps, SearchStateAndActions<"query" | "updateSearchQuery" | "categories"> {
  getQuerySuggestions: (query: string, categories: string[]) => any;
}

export class Header extends React.Component<IProps> {
  textRef!: any;
  didFocus!: any;
  willBlur!: any;

  querySuggestions = _.debounce(this.props.getQuerySuggestions, 150);

  componentDidMount() {
    this.didFocus = this.props.navigation.addListener("didFocus", () => {
      this.textRef && this.textRef._root.focus();
      BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    });
    this.willBlur = this.props.navigation.addListener("willBlur", () => {
      BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    });
  }

  componentWillUnmount(): void {
    this.didFocus && this.didFocus.remove();
    this.willBlur && this.willBlur.remove();
  }

  setTextRef = (el: Input) => this.textRef = el;

  handleBackButton = () => {
    this.props.navigation.goBack();
    return true;
  };

  updateQuery = (query: string) => {
    this.props.updateSearchQuery(query);
    this.querySuggestions(query, this.props.categories);
  };

  render() {
    return (
      <View style={{ width: "100%" }}>
        <BaseHeader noShadow={true} style={{ backgroundColor: "white" }} searchBar={true}>
          <Item rounded={true}>
            <Icon name={"ios-search"} />
            <Input
              value={this.props.query}
              onChangeText={this.updateQuery}
              ref={this.setTextRef}
              placeholder={"Search"}
            />
          </Item>
        </BaseHeader>
      </View>
    );
  }
}

const mapStateToProps = (state: IReducerState) => getSearch(state);

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getQuerySuggestions: (...args: any[]) => dispatch((getQuerySuggestions as any)(...args)),
  updateSearchQuery: (query: string) => dispatch(search.updateSearchQuery(query))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
