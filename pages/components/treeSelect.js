import React, { Component } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import TreeSelect from "react-native-tree-select";

export default class TreeSelectComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeHolder: null,
      treeselectData: [
        {
          id: "A",
          name: "农、林、牧、渔业",
          sortNo: "A",
          parentId: "0",
          children: [
            {
              id: "A01",
              name: "农业",
              sortNo: "A01",
              parentId: "A",
              children: [
                {
                  id: "A011",
                  name: "谷物种植",
                  sortNo: "A011",
                  parentId: "A01"
                },
                {
                  id: "A012",
                  name: "豆类、油料和薯类种植",
                  sortNo: "A012",
                  parentId: "A01"
                },
                {
                  id: "A013",
                  name: "棉、麻、糖、烟草种植",
                  sortNo: "A013",
                  parentId: "A01"
                },
                {
                  id: "A014",
                  name: "蔬菜、食用菌及园艺作物种植",
                  sortNo: "A014",
                  parentId: "A01"
                },
                {
                  id: "A015",
                  name: "水果种植",
                  sortNo: "A015",
                  parentId: "A01"
                },
                {
                  id: "A016",
                  name: "坚果、含油果、香料和饮料作物种植",
                  sortNo: "A016",
                  parentId: "A01"
                },
                {
                  id: "A017",
                  name: "中药材种植",
                  sortNo: "A017",
                  parentId: "A01"
                }
              ]
            }
          ]
        },
        {
          id: "B",
          name: "采矿业",
          sortNo: "B",
          parentId: "0",
          children: [
            {
              id: "B06",
              name: "煤炭开采和洗选业",
              sortNo: "B06",
              parentId: "B",
              children: [
                {
                  id: "B061",
                  name: "烟煤和无烟煤开采洗选",
                  sortNo: "B061",
                  parentId: "B06"
                },
                {
                  id: "B062",
                  name: "褐煤开采洗选",
                  sortNo: "B062",
                  parentId: "B06"
                },
                {
                  id: "B069",
                  name: "其他煤炭采选",
                  sortNo: "B069",
                  parentId: "B06"
                }
              ]
            }
          ]
        }
      ]
    };
  }
  componentWillMount = async () => {};
  componentDidMount = async () => {};

  _onTreeClick = ({ item, routes }) => {
    this.props.onSelectedItem(item);
  };

  _onTreeClickLeaf = ({ item, routes }) => {
    this.props.onSelectedItem(item);
  };
  render() {
    return (
      <View style={styles.treeContainer}>
        <TreeSelect
          data={this.state.treeselectData}
          isOpen
          onClick={this._onTreeClick}
          onClickLeaf={this._onTreeClickLeaf}
          itemStyle={{
            // backgroudColor: '#8bb0ee',
            fontSize: 14,
            color: "black"
          }}
          selectedItemStyle={{
            blackgroudColor: "#F9F9F9",
            fontSize: 16,
            color: "back"
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  treeContainer: {
    display: "flex",
    position: "absolute",
    zIndex: 999,
    left: 0,
    top: 0,
    height: 300,
    width: Dimensions.get("window").width - 50,
    marginLeft:
      (Dimensions.get("window").width - (Dimensions.get("window").width - 50)) /
      2,
    marginTop: 10,
    paddingLeft: 0
  },
  treeSelect: {
    height: "100%",
    width: "100%"
  }
});
