import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';


class CustomActivityIndicator extends Component {

    render() {
        return (
            <View style={styles.mainContainer}>
                <ActivityIndicator size={this.props.size} color={this.props.color} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }
});


export default CustomActivityIndicator;