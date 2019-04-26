import * as React from "react";
import { FlatList, ListRenderItem, Text, View } from "react-native";
import { connect } from "react-redux";

import { Spinner } from "native-base";

import { IReducerState } from "../../reducers";
import { getAutoCompleteScreen, IAutoCompleteScreenData } from "../../reducers/autoComplete";

import ListItem from "../../components/AutoCompleteListItem";

class AutoComplete extends React.Component<IAutoCompleteScreenData> {
  renderListItem: ListRenderItem<string> = ({ item }) => (
    <ListItem text={item} />
  );

  keyExtractor = (item: string, index: number) => `${item}-${this.props.queryId}-${index}`;

  render() {
    const { isLoading, query, autoComplete: { results } } = this.props;
    return (
      <View>
        {
          query ?
            isLoading || isLoading === undefined ?
              <Spinner color={"green"}/>
              :
              results.length ?
                <FlatList
                  keyExtractor={this.keyExtractor}
                  data={results}
                  renderItem={this.renderListItem}
                />
                :
                <Text>No suggestions</Text>
            :
            <Text>Type in the search bar to see suggestions!</Text>
        }
      </View>
    );
  }
}

const mapStateToProps = (state: IReducerState) => getAutoCompleteScreen(state);

export default connect(mapStateToProps)(AutoComplete);
