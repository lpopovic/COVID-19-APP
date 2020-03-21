import React, { Component } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { BASE_COLOR } from '../../helper/styles'
import BackgroundButton from './BackgroundButton'
const addOrRemove = (array, item) => {
  let exists = false
  for (let i = 0; i < array.length; i++) {
    if (item.id === array[i].id) {
      exists = true
    }
  }
  if (exists) {
    return array.filter((c) => { return c.id !== item.id })
  } else {
    const result = array
    result.push(item)
    return result
  }
}

class TagsView extends Component {

  state = {
    selected: [],
    objectArray: [],
  }
  componentDidMount() {
    this.setState({ selected: this.props.selected, objectArray: this.props.arrayAllItems })
  }
  render() {

    return (
      <View style={styles.container}>
        <FlatList
          horizontal
          extraData={this.props.extraData}
          data={this.props.arrayAllItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) =>

            this.makeButtons(item, index)
          }

        />
      </View>
    )
  }
  onPress = (item) => {
    let selected
    if (this.props.isExclusive) {
      selected = [item]
    } else {
      selected = addOrRemove(this.props.selected, item)
    }
    this.props.selectedItem(selected)
    const objectArray = this.state.objectArray.map(item => {

      return item;

    })
    this.setState({
      selected,
      objectArray
    })

  }
  makeButtons = (item, i) => {

    let checkExist = false
    for (let i = 0; i < this.state.selected.length; i++) {
      if (item.id === this.state.selected[i].id) {
        checkExist = true
      }
    }
    const on = checkExist && this.props.isSelectedOther
    const backgroundColor = on ? BASE_COLOR.buttonBackgroundColorSelected : BASE_COLOR.buttonBackgroundColor
    const textColor = on ? BASE_COLOR.white : BASE_COLOR.textDarkGrey
    const borderColor = on ? BASE_COLOR.transparent : BASE_COLOR.transparent
    return (
      <BackgroundButton
        backgroundColor={backgroundColor}
        textColor={textColor}
        borderColor={borderColor}
        onPress={() => {
          this.onPress(item)
        }}
        key={i}
        showImage={on}
        title={item.name} />
    )

  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  flatListContainer: {
    flex: 1
  }
})

export default TagsView
