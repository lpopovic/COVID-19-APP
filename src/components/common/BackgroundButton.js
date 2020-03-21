import React, { Component } from 'react'
import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native'
import { TouchableOpacity as RNGHTouchableOpacity } from "react-native-gesture-handler";

class BackgroundButton extends Component {
    render() {
        const styles = this.makeStyles()

        if (Platform.OS === "android") {
            return (
                <RNGHTouchableOpacity style={styles.touchable} onPress={this.props.onPress}>
                    <View style={styles.view}>
                        <Text style={styles.text}>{this.props.title}</Text>
                    </View>
                </RNGHTouchableOpacity>
            )
        }
        return (
            <TouchableOpacity style={styles.touchable} onPress={this.props.onPress}>
                <View style={styles.view}>
                    <Text style={styles.text}>{this.props.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    makeStyles() {
        return StyleSheet.create({
            view: {
                flexDirection: 'row',
                borderRadius: 10,
                borderColor: this.props.borderColor,
                borderWidth: 1,
                backgroundColor: this.props.backgroundColor,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: 16,
                paddingRight: 16,
            },
            touchable: {
                marginLeft: 4,
                marginRight: 4,
                marginBottom: 8
            },
            text: {
                textAlign: 'center',
                color: this.props.textColor,
                fontSize: 15,
                fontWeight: '500'
            }
        })
    }
}
export default BackgroundButton