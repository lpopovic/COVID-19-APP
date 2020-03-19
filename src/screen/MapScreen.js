import React, { Component } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
} from 'react-native';
import {
    getRegionForCoordinates,
    getZoomRegion,
    isAndroid,
    points,
    BASE_COLOR
} from '../helper'
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
            }
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
                alert(`Broj tacaka:${res.data.length}`)
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
        if (zoom >= 9) {
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
                    {this.state.points.length > 0 ?
                        < Heatmap
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
    }
});


export default MapScreen;