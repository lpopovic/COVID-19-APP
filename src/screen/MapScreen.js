import React, { Component } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    Alert,
} from 'react-native';
import {
    getRegionForCoordinates,
    getZoomRegion,
    isAndroid,
    points,
    BASE_COLOR
} from '../helper'
import { TouchableOpacity as RNGHTouchableOpacity } from "react-native-gesture-handler";
import BottomSheet from 'reanimated-bottom-sheet'
import TagsView from '../components/common/TagsView'
import MapView, { PROVIDER_GOOGLE, Heatmap } from 'react-native-maps';
import BaseScreen from './BaseScreen';
import { TemplateNetwork } from '../service/api';
const pauseTimeOutListener = 2000 //ms
class MapScreen extends BaseScreen {

    constructor(props) {
        super(props)
        this.state = {
            points: [],
            currentCountry: 'Test',
            loading: true,
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0,
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
        this.apiCallHandler()
    }
    componentWillUnmount() {
        super.componentWillUnmount()
    }
    apiCallHandler = () => {
        TemplateNetwork.fetchTestPoints().then(
            res => {
                this.setNewStateHandler({
                    region: getRegionForCoordinates(res.data),
                    points: res.data,
                    loading: false,
                })
            },
            err => {
                alert(err)
                this.showAlertMessage(err)
            }
        )
    }
    apiCallOnChangeRegionHandler = (region) => {

        TemplateNetwork.fetchGetTestPoints(region).then(
            res => {
                this.setNewStateHandler({
                    points: res.data
                })
            },
            err => {
                this.showAlertMessage(err)
            }
        )
    }
    onPressLongMap = (e) => {
        const { region } = this.state
        const zoom = getZoomRegion(region)
        if (zoom >= 14) {
        this.bottomSheet.snapTo(0)
            // alert(zoom)
            // alert(`ON LONG PRESS \n zoom: ${zoom} \n  latitude:${e.nativeEvent.coordinate.latitude} \n  longitude:${e.nativeEvent.coordinate.longitude}`)
            TemplateNetwork.fetchPostTestPoints(e.nativeEvent.coordinate).then(
                res => {
                    this.showAlertMessage(`POSLAT USPESNO`)
                },
                err => {
                    this.showAlertMessage(err)
                }
            )
        } else {
            this.showAlertMessage(`Molimo va da zumirate mapu radi tacnije lokacije, zoom: ${zoom}`)
        }
    }
    onRegionChange = (region) => {

        clearTimeout(this.onRegionChangeTimeOut)
        this.setNewStateHandler({ region, currentRegion: region })

        this.onRegionChangeTimeOut = setTimeout(() => {
            const { currentRegion } = this.state
            this.apiCallOnChangeRegionHandler(currentRegion)

        }, pauseTimeOutListener);

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
                    <Heatmap
                        points={this.state.points}
                        opacity={1}
                        radius={isAndroid ? 20 : 50}
                        gradient={{
                            colorMapSize: 256,
                            colors: ["#79BC6A", "#BBCF4C", "#EEC20B", "#F29305", "#E50000"],
                            startPoints: [0.1, 0.25, 0.50, 0.75, 1.0],
                        }}
                    >
                    </Heatmap>
                </MapView>

            </View>
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
                <RNGHTouchableOpacity style={{ alignItems: 'center', top: 10 }} onPress={() => alert("Submit")}>
                    <View style={{ backgroundColor: '#447385', height: 50, width: '70%', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: 'white' }}>Report</Text>
                    </View>
                </RNGHTouchableOpacity>
                :
                <TouchableOpacity style={{ alignItems: 'center', top: 10 }} onPress={() => alert("Submit")}>
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

    // bs = React.createRef()

    render() {
        const { loading } = this.state
        const mainDisplay = loading ? this.activityIndicatorContent(BASE_COLOR.black) : this.mapContent()
        return (
            <View style={styles.mainContainer}>
                <View style={styles.headerContainer}>
                    <View style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        flex: 1,
                    }}>
                        <TouchableOpacity onPress={() => alert("Press country")}>
                            <View style={{
                                flexDirection: 'row',
                                padding: 4,
                                borderColor: 'black',
                                borderWidth: 1,
                                borderRadius: 4,
                                justifyContent: 'center',
                                alignContent: 'center',
                                backgroundColor: 'ligthgray',
                                width: 170,
                                margin: 8
                            }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Drzava:</Text>
                                <Text style={{ marginLeft: 8, fontWeight: 'bold', fontSize: 18 }}>Poljska</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.lineShadowView} />
                </View>

                {mainDisplay}
                <BottomSheet
                    // ref={this.bs}
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
});


export default MapScreen;