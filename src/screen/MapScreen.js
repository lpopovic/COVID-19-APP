import React, { Component } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    Dimensions,
} from 'react-native';
import {
    getRegionForCoordinates,
    getZoomRegion,
    isAndroid,
    points,
    BASE_COLOR,
    heatMapGradient,
    customMessages,
    getRadiusFromRegion,
} from '../helper'
import MapView, { PROVIDER_GOOGLE, Heatmap } from 'react-native-maps';
import BaseScreen from './BaseScreen';
import { showDefaultSnackBar } from '../components/common/CustomSnackBar'
import { LocationNetwork } from '../service/api';
const pauseTimeOutListener = 2000 //ms
const zoom = 0
const distanceDelta = Math.exp(Math.log(360) - (zoom * Math.LN2));
let activeTimerOnChangeLocation = false
class MapScreen extends BaseScreen {

    constructor(props) {
        super(props)
        this._firstTimeInitialMap = false
        this.state = {
            points: [],
            currentCountry: 'Test',
            loading: true,
            region: {
                latitude: 34.669358,
                longitude: -40.957031,
                latitudeDelta: distanceDelta,
                longitudeDelta:
                    Dimensions.get('window').width /
                    Dimensions.get('window').height *
                    distanceDelta
            }
        }
    }
    componentDidMount() {
        super.componentDidMount()
        this.apiCallInitialHandler()
        this.disableDetectChangeRegion()
    }
    componentWillUnmount() {
        super.componentWillUnmount()
    }
    apiCallInitialHandler = () => {
        const { region } = this.state
        const radius = getRadiusFromRegion(region)
        LocationNetwork.fetchGetPointsForRegion(region, radius).then(
            res => {
                this.setNewStateHandler({
                    // region: getRegionForCoordinates(res.data),
                    points: res,
                    loading: false,
                })
            },
            err => {
                this.showAlertMessage(err)
                this.setNewStateHandler({
                    loading: false,
                })
                this._firstTimeInitialMap = true

            }
        )
    }
    disableDetectChangeRegion = () => {
        activeTimerOnChangeLocation = false
        clearTimeout(this._activeTimerOnChangeLocation)
        this._activeTimerOnChangeLocation = setTimeout(() => {
            activeTimerOnChangeLocation = true

        }, pauseTimeOutListener);
    }
    apiCallOnChangeRegionHandler = (region) => {
        const radius = getRadiusFromRegion(region)
        LocationNetwork.fetchGetPointsForRegion(region, radius).then(
            res => {
                if (res.length > 0) {
                    this.setNewStateHandler({
                        points: res,
                    })
                } else {
                    showDefaultSnackBar(customMessages.noNearbyFound)
                }

            },
            err => {
                this.showAlertMessage(err)
                this._firstTimeInitialMap = true

            }
        )
    }
    onPressLongMap = (e) => {
        const { region } = this.state
        const zoom = getZoomRegion(region)
        if (zoom >= 9) {
            LocationNetwork.fetchPostCreateNewPoint(e.nativeEvent.coordinate).then(
                res => {
                    showDefaultSnackBar(customMessages.locationSaved)
                },
                err => {
                    this.showAlertMessage(err)
                }
            )
        } else {
            showDefaultSnackBar(customMessages.cantUseLocation)
        }
    }
    onRegionChange = (region) => {
        if (this._firstTimeInitialMap == true) {
            clearTimeout(this.onRegionChangeTimeOut)
            this.setNewStateHandler({ region, currentRegion: region })
            if (activeTimerOnChangeLocation === true) {
                this.onRegionChangeTimeOut = setTimeout(() => {
                    const { currentRegion } = this.state
                    this.apiCallOnChangeRegionHandler(currentRegion)

                }, pauseTimeOutListener);
            }
        } else {
            this._firstTimeInitialMap = true
        }

    }
    mapContent = () => {
        return (
            <View style={styles.mapContainer}>
                <MapView
                    ref={component => this._map = component}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={this.state.region}
                    onLongPress={e => this.onPressLongMap(e)}
                    onRegionChangeComplete={this.onRegionChange}
                    onTouchStart={Keyboard.dismiss}>
                    {this.state.points.length > 0 ?
                        <Heatmap
                            points={this.state.points}
                            opacity={1}
                            radius={isAndroid ? 20 : 50}
                            gradient={heatMapGradient} />

                        : null}
                </MapView>

            </View >
        )
    }
    render() {
        const { loading } = this.state
        const mainDisplay = loading ? this.activityIndicatorContent(BASE_COLOR.black) : this.mapContent()
        return (
            <SafeAreaView style={styles.mainContainer}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerAlignItems}>
                        <TouchableOpacity onPress={() => alert("Press country")}>
                            <View style={styles.btnCountry}>
                                <Text style={styles.btnTitle}>Drzava:</Text>
                                <Text style={[{ marginLeft: 8 }, styles.btnTitle]}>{this.state.currentCountry}</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.lineShadowView} />
                </View>
                {mainDisplay}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    headerContainer: {
        height: 50,
    },
    mapContainer: {
        flex: 1
    },
    map: {
        flex: 1,
    },
    lineShadowView: {
        height: 1,
        width: '100%',
        backgroundColor: BASE_COLOR.black,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 1.90,
        shadowRadius: 4.5,
        elevation: 8,
    },
    headerAlignItems: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    btnCountry: {
        flexDirection: 'row',
        padding: 4,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 4,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: BASE_COLOR.darkOrange,
        width: 170,
        margin: 8
    },
    btnTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
});


export default MapScreen;