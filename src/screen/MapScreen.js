import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {
    getZoomRegion,
    isAndroid,
    BASE_COLOR,
    customMessages,
    getRadiusFromRegion,
    getStorageData,
    STORAGE_KEY,
    distanceLocation,
    zoomMarker,
    latitudeDeltaMarker,
    longitudeDeltaMarker,
    latitudeDeltaInitial,
    longitudeDeltaInitial,
} from '../helper'
import { TouchableOpacity as RNGHTouchableOpacity } from "react-native-gesture-handler";
import BottomSheet from 'reanimated-bottom-sheet'
import TagsView from '../components/common/TagsView'
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
        if (uuid !== null) {
            LocationNetwork.fetchGetPointsInsertByUser(uuid).then(
                res => {

                    this.setNewStateHandler({
                        userPoints: [...res],
                    })

                },
                err => {
                    this.showAlertMessage(err)
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
                    showDefaultSnackBar(customMessages.noNearbyFound)
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
                showDefaultSnackBar(customMessages.locationSaved)
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
                showDefaultSnackBar(customMessages.locationRemoved)
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
        const { region } = this.state
        const zoom = getZoomRegion(region)

        if (zoom >= zoomMarker) {
            if (this.props.userLocation !== null) {
                const radius = distanceLocation(this.props.userLocation.latitude, this.props.userLocation.longitude,
                    e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude, 'K')
                if (radius <= 10) {
                    this.bottomSheet.snapTo(0)
                    const onPressPoint = e.nativeEvent.coordinate
                    this.setNewStateHandler({
                        onPressPoint
                    })
                } else {
                    showDefaultSnackBar(customMessages.inRadius)
                    this.bottomSheet.snapTo(1)
                    this.bottomSheet.snapTo(1)
                }
            } else {
                this.bottomSheet.snapTo(1)
                this.bottomSheet.snapTo(1)
                this.props.requestUserLocation()
            }
        } else {
            this.bottomSheet.snapTo(1)
            this.bottomSheet.snapTo(1)
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
            this.apiCallDeletePoint(point)
        }
        this.showDialogMessage(customMessages.removeLocation, onPressOkStatus)
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
        this.apiCallPostNewPoint(onPressPoint)

    }
    renderContent = () => (
        <View style={{ backgroundColor: 'white', paddingBottom: 55 }}>
            <Text style={{ fontWeight: '500', margin: 10, marginBottom: 2 }}>Da li na ovoj lokaciji ima zaraženih?</Text>
            <View style={{ height: 50 }}>
                <TagsView
                    extraData={this.state.changeTag1}
                    arrayAllItems={[{ name: 'Da', id: 0 }, { name: 'Ne', id: 1 }, { name: 'Nisam siguran/na', id: 2 }]}
                    selected={this.state.answer1}
                    isExclusive={true}
                    selectedItem={(select) => this.onSelectTagView1(select, true)}
                    isSelectedOther={this.state.tagListSelect1}
                />
            </View>
            {isAndroid ?
                <RNGHTouchableOpacity style={{ alignItems: 'center', top: 20 }} onPress={() => this.onPressSubmit()}>
                    <View style={{ backgroundColor: '#447385', height: 50, width: '70%', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: 'white' }}>Prijavi</Text>
                    </View>
                </RNGHTouchableOpacity>
                :
                <TouchableOpacity style={{ alignItems: 'center', top: 20 }} onPress={() => this.onPressSubmit()}>
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
                    snapPoints={[200, 0]}
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
        backgroundColor: BASE_COLOR.white
    },
    mapContainer: {
        flex: 1
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
});


export default MapScreen;