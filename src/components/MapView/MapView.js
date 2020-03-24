import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Heatmap, Marker } from 'react-native-maps';
import DefaultMarker from './DefaultMarker';
import {
    typeOfGoogleMap,
    isAndroid,
    heatMapGradient,
    BASE_COLOR,
} from '../../helper'
import {
    iconAssets,
} from '../../assets'
class CustomMapView extends Component {

    state = {
        currentMap: typeOfGoogleMap.standard,
    }
    getInnerRef = () => this._map;

    mapContent = () => {
        const { currentMap } = this.state
        const { region, points, userPoints, userLocation } = this.props

        return (
            <View style={styles.mapContainer}>
                <MapView
                    mapType={currentMap}
                    ref={component => this._map = component}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={region}
                    onLongPress={e => this.props.onPressLongMap(e)}
                    onRegionChangeComplete={this.props.onRegionChange}
                    onTouchStart={Keyboard.dismiss}>
                    {points.length > 0 ?
                        <Heatmap
                            points={points}
                            opacity={isAndroid ? 1 : 0.7}
                            radius={isAndroid ? 20 : 20}
                            gradient={heatMapGradient} />

                        : null}
                    {userLocation != null ?
                        this.userLocationMarker(userLocation)
                        : null}
                    {userPoints.map((point, index) => {
                        return <DefaultMarker
                            key={index}
                            point={point}
                            index={index}
                            onPressMarker={(index) => this.props.onPressMarker(index)} />
                    })}

                </MapView>
                {this.typeMapBtn()}
                {this.userLocationBtn()}
            </View >
        )
    }
    userLocationBtn = () => {
        return (
            <TouchableOpacity
                onPress={() => this.props.showUserLocationHandler()}
                style={styles.userLocationBtnContainer}>
                <Image
                    source={iconAssets.targetIcon}
                    resizeMode={'contain'}
                    style={{
                        tintColor: BASE_COLOR.blueGray,
                        height: '100%',
                        width: '100%',
                    }} />
            </TouchableOpacity>
        )
    }
    changeTypeMapHandler = () => {
        const currentMap = this.state.currentMap == typeOfGoogleMap.standard ? typeOfGoogleMap.satellite : typeOfGoogleMap.standard
        this.setState({
            currentMap
        })
    }
    typeMapBtn = () => {
        const icon = this.state.currentMap == typeOfGoogleMap.standard ? iconAssets.satelliteMapIcon : iconAssets.standardMapIcon
        return (
            <TouchableOpacity
                onPress={() => this.changeTypeMapHandler()}
                style={styles.typeMapBtnContainer}>
                <Image
                    source={icon}
                    resizeMode={'contain'}
                    style={{
                        height: '100%',
                        width: '100%',
                    }} />
            </TouchableOpacity>
        )
    }
    userLocationMarker = (coordinate) => {
        return (
            <Marker coordinate={coordinate} title={'JA'}>
                <View style={styles.userMarkerBlue}>
                    <View style={styles.userMarkerWhite} />
                </View>
            </Marker>
        )
    }
    render() {
        return (
            <View style={styles.mainContainer}>
                {this.mapContent()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: BASE_COLOR.white
    },
    mapContainer: {
        flex: 1
    },
    map: {
        flex: 1
    },
    userLocationBtnContainer: {
        backgroundColor: BASE_COLOR.white,
        borderWidth: 1,
        borderColor: BASE_COLOR.blueGray,
        position: 'absolute',
        right: 0,
        bottom: isAndroid ? 0 : 44,
        margin: 8,
        height: 40,
        width: 40,
        borderRadius: 20,
        overflow: 'hidden',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    typeMapBtnContainer: {
        backgroundColor: BASE_COLOR.white,
        borderWidth: 1,
        borderColor: BASE_COLOR.blueGray,
        position: 'absolute',
        top: isAndroid ? undefined : 44,
        right: 0,
        margin: 8,
        height: 40,
        width: 40,
        overflow: 'hidden',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    userMarkerWhite: {
        backgroundColor: 'rgba(66, 133, 244, 1.0)',
        borderRadius: 9,
        borderColor: BASE_COLOR.white,
        borderWidth: 2,
        width: 18,
        height: 18
    },
    userMarkerBlue: {
        width: 36,
        height: 36,
        borderRadius: 36 / 2,
        backgroundColor: 'rgba(66, 133, 244, 0.3)',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
});


export default CustomMapView;