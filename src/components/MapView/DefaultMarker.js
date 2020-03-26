import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import MapView from 'react-native-maps'
import {
    BASE_COLOR,
    strings,
    CUSTOM_COLOR
} from '../../helper'
import { iconAssets } from '../../assets';
class DefaultMarker extends Component {

    userInsertMarker = (point, index) => {

        const coordinateText = `${Math.round(point.latitude * 100) / 100}°N, ${Math.round(point.longitude * 100) / 100}°E`

        return (
            <MapView.Marker
                key={`${index}`}
                // image={iconAssets.markerMapIcon128}
                pinColor={'red'}
                coordinate={point} >
                <MapView.Callout
                    onPress={() => this.props.onPressMarker(index)}>
                    <View style={styles.calloutContainer}>
                        <View style={styles.coordinateContainer}>
                            <Text style={styles.coordinateText}>{coordinateText}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <View style={styles.removeBtnContainer}>
                                <Text style={styles.questionText}>{strings.remove}</Text>
                            </View>
                        </View>
                    </View>
                </MapView.Callout>
            </MapView.Marker>
        )
    }
    render() {
        const { point, index } = this.props
        return this.userInsertMarker(point, index)
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    calloutContainer: {
        height: 80,
        width: 200,
        backgroundColor: BASE_COLOR.white,
        flex: 1,
    },
    coordinateContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        flex: 0.3,
    },
    coordinateText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    infoContainer: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        flex: 0.8,
    },
    questionContainer: {
        flex: 1,
        backgroundColor: BASE_COLOR.green,
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderRadius: 10,
        padding: 8,
        width: 184,
    },
    questionText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: BASE_COLOR.white
    },
    removeBtnContainer: {
        backgroundColor: CUSTOM_COLOR.btnColor,
        height: 40,
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 8,
        marginTop: 8,
    },
});


export default DefaultMarker;