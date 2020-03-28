import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import {
    getZoomRegion,
    isAndroid,
    BASE_COLOR,
    strings,
    getRadiusFromRegion,
    getStorageData,
    STORAGE_KEY,
    distanceLocation,
    zoomMarker,
    latitudeDeltaMarker,
    longitudeDeltaMarker,
    latitudeDeltaInitial,
    longitudeDeltaInitial,
    saveStorageData,
    maxUserPoints,
} from '../helper'
import BottomSheet from '../components/BottomSheet/BottomSheet'
import MapView from '../components/MapView/MapView'
import BaseScreen from './BaseScreen';
import { showDefaultSnackBar } from '../components/common/CustomSnackBar'
import { LocationNetwork } from '../service/api';

const pauseTimeOutListener = 2000 //ms
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
            loading: true,
            region: {
                latitude,
                longitude,
                latitudeDelta,
                longitudeDelta
            },
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
    // * START API CALL FUNC
    // * api initial
    apiCallInitialHandler = async () => {
        const { region } = this.state
        const radius = getRadiusFromRegion(region)
        LocationNetwork.fetchGetPointsForRegion(region, radius).then(
            res => {
                this.setNewStateHandler({
                    points: [...res],
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
        const arrayStorage = await getStorageData(STORAGE_KEY.LOCATIONS_APP)
        const userStoragePoints = arrayStorage !== null ? arrayStorage : []
        if (uuid !== null) {

            LocationNetwork.fetchGetPointsInsertByUser(uuid).then(
                res => {

                    this.setNewStateHandler({
                        userPoints: [...res],
                    })
                    saveStorageData(res, STORAGE_KEY.LOCATIONS_APP)

                },
                err => {
                    this.showAlertMessage(err)
                    if (userStoragePoints.length > 0) {
                        this.setNewStateHandler({
                            userPoints: [...userStoragePoints],
                        })
                    }
                }
            )
        }
    }
    // * get new points by change region
    apiCallOnChangeRegionHandler = (region) => {
        const radius = getRadiusFromRegion(region)
        LocationNetwork.fetchGetPointsForRegion(region, radius).then(
            res => {
                if (res.length > 0) {
                    this.setNewStateHandler({
                        points: [...res],
                    })
                } else {
                    showDefaultSnackBar(strings.noNearbyFound)
                }

            },
            err => {
                this.showAlertMessage(err)

            }
        )
    }
    // * create new point
    apiCallPostNewPoint = (point) => {
        LocationNetwork.fetchPostCreateNewPoint(point).then(
            res => {
                const { userPoints } = this.state
                userPoints.push(point)
                this.setNewStateHandler({ userPoints, onPressPoint: null })
                showDefaultSnackBar(strings.locationSaved)
            },
            err => {
                this.setNewStateHandler({ onPressPoint: null })
                this.showAlertMessage(err)
            }
        )
    }
    // * delete point
    apiCallDeletePoint = (point) => {
        LocationNetwork.fetchDeleteRemovePoint(point).then(
            res => {
                showDefaultSnackBar(strings.locationRemoved)
            },
            err => {
                this.showAlertMessage(err)
            }
        )
    }
    //* END API CALL FUNC

    // * START MapViev COMPONENT
    // * DEFINE MapView ACTION
    disableDetectChangeRegion = () => {
        activeTimerOnChangeLocation = false
        clearTimeout(this._activeTimerOnChangeLocation)
        this._activeTimerOnChangeLocation = setTimeout(() => {
            activeTimerOnChangeLocation = true

        }, pauseTimeOutListener);
    }
    onPressLongMap = (e) => {
        const { region, userPoints } = this.state
        const zoom = getZoomRegion(region)

        if (zoom >= zoomMarker) {
            if (this.props.userLocation !== null) {
                if (userPoints.length < maxUserPoints) {
                    const radius = distanceLocation(this.props.userLocation.latitude, this.props.userLocation.longitude,
                        e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude, 'K')
                    if (radius <= 10) {
                        this.bottomSheet.getInnerRef().snapTo(0)
                        const onPressPoint = e.nativeEvent.coordinate
                        this.setNewStateHandler({
                            onPressPoint
                        })
                    } else {
                        showDefaultSnackBar(strings.inRadius)
                        this.bottomSheet.getInnerRef().snapTo(1)
                        this.bottomSheet.getInnerRef().snapTo(1)
                    }
                } else {
                    showDefaultSnackBar(strings.maxUserPoints)
                }

            } else {
                this.bottomSheet.getInnerRef().snapTo(1)
                this.bottomSheet.getInnerRef().snapTo(1)
                this.props.requestUserLocation()
            }
        } else {
            this.bottomSheet.getInnerRef().snapTo(1)
            this.bottomSheet.getInnerRef().snapTo(1)
            showDefaultSnackBar(strings.cantUseLocation)
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
            this._mapView.getInnerRef().animateToRegion(
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
            saveStorageData(userPoints, STORAGE_KEY.LOCATIONS_APP)
            this.apiCallDeletePoint(point)
        }
        this.showDialogMessage(strings.removeLocation, onPressOkStatus)
    }
    // * DEFINE MapView LAYOUT
    mapContent = () => {
        const { region, points, userPoints } = this.state
        const { userLocation } = this.props
        return (
            <View style={styles.mapContainer}>
                <MapView
                    ref={component => this._mapView = component}
                    userLocation={userLocation}
                    region={region}
                    points={points}
                    userPoints={userPoints}
                    onRegionChange={this.onRegionChange}
                    onPressLongMap={e => this.onPressLongMap(e)}
                    showUserLocationHandler={() => this.showUserLocationHandler()}
                    onPressMarker={(index) => this.onPressMarker(index)}
                />
            </View>
        )
    }
    // * END MapView COMPONENT
    // * START BottomSheet COMPONENT
    // * DEFINE BottomSheet ACTION
    onPressSubmit = () => {
        const { onPressPoint } = this.state
        this.apiCallPostNewPoint(onPressPoint)

    }
    // * DEFINE BottomSheet LAYOUT
    sheetContent = () => {
        return (
            <BottomSheet
                ref={component => this.bottomSheet = component}
                onPressSubmit={() => this.onPressSubmit()}

            />
        )
    }
    // * END BottomSheet COMPONENT
    render() {
        const { loading } = this.state
        const mainDisplay = loading ? this.activityIndicatorContent(BASE_COLOR.black) : this.mapContent()
        return (
            <View style={styles.mainContainer}>

                {mainDisplay}
                {this.sheetContent()}
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
});

export default MapScreen;