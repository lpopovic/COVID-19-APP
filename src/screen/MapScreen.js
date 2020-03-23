import React, { Component } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    Dimensions,
    Image,
    Alert,
    TouchableHighlight,
} from 'react-native';
import {
    getZoomRegion,
    isAndroid,
    BASE_COLOR,
    heatMapGradient,
    customMessages,
    getRadiusFromRegion,
    typeOfGoogleMap,
    getStorageData,
    STORAGE_KEY,
} from '../helper'
import { TouchableOpacity as RNGHTouchableOpacity, TouchableNativeFeedback } from "react-native-gesture-handler";
import BottomSheet from 'reanimated-bottom-sheet'
import TagsView from '../components/common/TagsView'
import MapView, { PROVIDER_GOOGLE, Heatmap, Marker } from 'react-native-maps';
import BaseScreen from './BaseScreen';
import { showDefaultSnackBar } from '../components/common/CustomSnackBar'
import { LocationNetwork } from '../service/api';
import { iconAssets } from '../assets';
const pauseTimeOutListener = 2000 //ms
const zoom = 1
const zoomMarker = 13
const latitudeDeltaMarker = Math.exp(Math.log(360) - (zoomMarker * Math.LN2));
const longitudeDeltaMarker = Dimensions.get('window').width / Dimensions.get('window').height * latitudeDeltaMarker
const latitudeDeltaInitial = Math.exp(Math.log(360) - (zoom * Math.LN2));
const longitudeDeltaInitial = Dimensions.get('window').width / Dimensions.get('window').height * latitudeDeltaInitial
let activeTimerOnChangeLocation = false



class MapScreen extends BaseScreen {

    constructor(props) {
        super(props)

        const latitude = 0
        const longitude = 0
        const latitudeDelta = latitudeDeltaInitial
        const longitudeDelta = longitudeDeltaInitial
        this._firstTimeInitialMap = false
        this.state = {
            userPoints: [],
            points: [],
            currentMap: typeOfGoogleMap.standard,
            loading: true,
            region: {
                latitude,
                longitude,
                latitudeDelta,
                longitudeDelta
            },
            changeTag1: 0,
            changeTag2: 0,
            tagListSelect1: true,
            tagListSelect2: true,
            answer1: [{ name: 'Yes', id: 0 }],
            answer2: [{ name: 'No', id: 1 }],
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

    apiCallInitialHandler = async () => {
        const { region } = this.state
        const radius = getRadiusFromRegion(region)
        LocationNetwork.fetchGetPointsForRegion(region, radius).then(
            res => {
                this.setNewStateHandler({
                    points: res,
                    loading: false,
                })
            },
            err => {
                this.showAlertMessage(err)
                this.setNewStateHandler({
                    loading: false,
                })
            }
        )
        const uuid = await getStorageData(STORAGE_KEY.UUID_APP)
        if (uuid !== null) {
            LocationNetwork.fetchGetPointsInsertByUser(uuid).then(
                res => {

                    this.setNewStateHandler({
                        userPoints: res,
                    })
                },
                err => {
                    this.showAlertMessage(err)
                }
            )
        }
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

            }
        )
    }
    onPressLongMap = (e) => {
        const { region } = this.state
        const zoom = getZoomRegion(region)
        if (zoom >= 5) {
            this.bottomSheet.snapTo(0)
            const onPressPoint = e.nativeEvent.coordinate
            this.setNewStateHandler({
                onPressPoint
            })
        } else {
            showDefaultSnackBar(customMessages.cantUseLocation)
        }
    }
    onRegionChange = (region) => {
        if (this._firstTimeInitialMap == true) {
            clearTimeout(this.onRegionChangeTimeOut)
            this.setNewStateHandler({ currentRegion: region, region })
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
    showUserLocationHandler = () => {
        if (this.props.userLocation !== null) {
            this._map.animateToRegion(
                {
                    ...this.props.userLocation,
                    latitudeDelta: latitudeDeltaMarker,
                    longitudeDelta: longitudeDeltaMarker,
                },
                350
            );
        } else {
            this.props.requestUserLocation()
        }
    }
    onPressMarker = (position) => {
        let { userPoints } = this.state

        const onPressOkStatus = () => {
            const point = userPoints[position]
            userPoints = userPoints.filter(function (value, index, arr) {

                return index != position;

            });
            this.setNewStateHandler({ userPoints })
            LocationNetwork.fetchDeleteRemovePoint(point).then(
                res => {
                    showDefaultSnackBar(res)
                },
                err => {
                    this.showAlertMessage(err)
                }
            )
        }
        const onPressCancelStatus = () => {
        }
        this.showDialogMessage(customMessages.removeLocation, onPressOkStatus, onPressCancelStatus)
    }
    mapContent = () => {
        const { currentMap, region, points, userPoints } = this.state
        const { userLocation } = this.props
        return (
            <View style={styles.mapContainer}>
                <MapView
                    mapType={currentMap}
                    ref={component => this._map = component}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={region}
                    onLongPress={e => this.onPressLongMap(e)}
                    onRegionChangeComplete={this.onRegionChange}
                    onTouchStart={Keyboard.dismiss}>
                    {points.length > 0 ?
                        <Heatmap
                            points={points}
                            opacity={1}
                            radius={isAndroid ? 20 : 20}
                            gradient={heatMapGradient} />

                        : null}
                    {userLocation != null ?
                        this.userLocationMarker(userLocation)
                        : null}
                    {userPoints.map((point, index) => {
                        return this.userInsertMarker(point, index)
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
                onPress={() => this.showUserLocationHandler()}
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
    userInsertMarker = (point, index) => {
        return (
            <MapView.Marker
                key={index}
                coordinate={point}
                title={`${Math.round(point.latitude * 100) / 100}°N, ${Math.round(point.longitude * 100) / 100}°E`}
                pinColor={'blue'}>
                <MapView.Callout
                    onPress={() => this.onPressMarker(index)}
                    style={{ borderColor: BASE_COLOR.blueGray, borderWidth: 1 }}>
                    <View style={{
                        height: 80,
                        width: 200,
                        backgroundColor: BASE_COLOR.white,
                        flex: 1,
                    }}>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignContent: 'center',
                        }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold'
                            }}>{`${Math.round(point.latitude * 100) / 100}°N, ${Math.round(point.longitude * 100) / 100}°E`}</Text>
                        </View>
                        <View style={{
                            justifyContent: 'center',
                            alignContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                        }}>
                            <View style={{ backgroundColor: '#447385', height: 50, width: '70%', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
                                <Text style={{ fontSize: 15, fontWeight: '600', color: 'white' }}>Izbrisati</Text>
                            </View>
                        </View>
                    </View>
                </MapView.Callout>
            </MapView.Marker>
        )
    }
    changeTypeMapHandler = () => {
        const currentMap = this.state.currentMap == typeOfGoogleMap.standard ? typeOfGoogleMap.satellite : typeOfGoogleMap.standard
        this.setNewStateHandler({
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
                <View style={[{
                    width: 30,
                    height: 30,
                    borderRadius: 30 / 2,
                    backgroundColor: 'rgba(0, 0, 255, 0.3)',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center'
                }]}>
                    <View style={{
                        backgroundColor: 'rgba(0, 0, 255, 1.0)',
                        borderRadius: 7.5,
                        borderColor: BASE_COLOR.white,
                        borderWidth: 2,
                        width: 15,
                        height: 15
                    }}>
                    </View>

                </View>

            </Marker>
        )
    }

    onSelectTagView1 = (answer1, tagListSelect1) => {
        const changeTag1 = this.state.changeTag1 === 0 ? 1 : 0
        this.setState({ answer1, tagListSelect1, changeTag1 })
    }
    onSelectTagView2 = (answer2, tagListSelect2) => {
        const changeTag2 = this.state.changeTag2 === 0 ? 1 : 0
        this.setState({ answer2, tagListSelect2, changeTag2 })
    }
    onPressSubmit = () => {
        const { onPressPoint } = this.state
        this.bottomSheet.snapTo(1)
        this.bottomSheet.snapTo(1)
        LocationNetwork.fetchPostCreateNewPoint(onPressPoint).then(
            res => {
                const { userPoints } = this.state
                userPoints.push(onPressPoint)
                this.setNewStateHandler({ userPoints, onPressPoint: null })
                showDefaultSnackBar(res)
            },
            err => {
                this.setNewStateHandler({ onPressPoint: null })
                this.showAlertMessage(err)
            }
        )

    }
    renderContent = () => (
        <View style={{ backgroundColor: 'white', paddingBottom: 55 }}>
            <Text style={{ fontWeight: '500', margin: 10, marginBottom: 2 }}>Have you tested positive for the Corona Virus?</Text>
            <View style={{ height: 50 }}>
                <TagsView
                    extraData={this.state.changeTag1}
                    arrayAllItems={[{ name: 'Yes', id: 0 }, { name: 'No', id: 1 }, { name: 'Pending', id: 2 }, { name: 'Not Tested', id: 3 }]}
                    selected={this.state.answer1}
                    isExclusive={true}
                    selectedItem={(select) => this.onSelectTagView1(select, true)}
                    isSelectedOther={this.state.tagListSelect1}
                />
            </View>
            <Text style={{ fontWeight: '500', margin: 10, marginBottom: 2 }} >Are you having symptoms?</Text>
            <View style={{ height: 50 }}>
                <TagsView
                    extraData={this.state.changeTag2}
                    arrayAllItems={[{ name: 'Yes', id: 0 }, { name: 'No', id: 1 }]}
                    selected={this.state.answer2}
                    isExclusive={true}
                    selectedItem={(select) => this.onSelectTagView2(select, true)}
                    isSelectedOther={this.state.tagListSelect2}
                />
            </View>
            {isAndroid ?
                <RNGHTouchableOpacity style={{ alignItems: 'center', top: 10 }} onPress={() => this.onPressSubmit()}>
                    <View style={{ backgroundColor: '#447385', height: 50, width: '70%', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: 'white' }}>Report</Text>
                    </View>
                </RNGHTouchableOpacity>
                :
                <TouchableOpacity style={{ alignItems: 'center', top: 10 }} onPress={() => this.onPressSubmit()}>
                    <View style={{ backgroundColor: '#447385', height: 50, width: '70%', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: 'white' }}>Report</Text>
                    </View>
                </TouchableOpacity>
            }
        </View>
    )

    renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
            </View>
        </View>
    )

    render() {
        const { loading } = this.state
        const mainDisplay = loading ? this.activityIndicatorContent(BASE_COLOR.black) : this.mapContent()
        return (
            <View style={styles.mainContainer}>

                {mainDisplay}

                <BottomSheet
                    ref={ref => this.bottomSheet = ref}
                    snapPoints={[270, 0]}
                    renderContent={this.renderContent}
                    renderHeader={this.renderHeader}
                    enabledInnerScrolling={false}
                    initialSnap={1}
                />
            </View>
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
    header: {
        backgroundColor: 'white',
        shadowColor: '#000000',
        paddingTop: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
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
    }
});


export default MapScreen;