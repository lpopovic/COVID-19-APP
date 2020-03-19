import React, { Component } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {
    getRegionForCoordinates,
    getZoomRegion,
    isAndroid,
    points,
    BASE_COLOR
} from '../helper'
import MapView, { PROVIDER_GOOGLE, Heatmap } from 'react-native-maps';

class MapScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            region: getRegionForCoordinates(points),
            currentCountry: 'Poljska',
        }
    }
    onPressLongMap = (e) => {
        const { region } = this.state
        const zoom = getZoomRegion(region)

        alert(`ON LONG PRESS \n zoom: ${zoom} \n  latitude:${e.nativeEvent.coordinate.latitude} \n  longitude:${e.nativeEvent.coordinate.longitude}`)


    }
    render() {
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
                <View style={styles.mapContainer}>
                    <MapView
                        ref={component => this._map = component}
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={this.state.region}
                        onLongPress={e => this.onPressLongMap(e)}
                        onRegionChange={region => {
                            clearTimeout(this.timerForMap)
                            this.timerForMap = setTimeout(() => {
                                this.setState({ region })
                            }, 100)
                        }}
                    >
                        <Heatmap
                            points={points}
                            opacity={1}
                            radius={Platform.OS == 'ios' ? 50 : 20}
                            gradient={{
                                colorMapSize: 256,
                                colors: ["#79BC6A", "#BBCF4C", "#EEC20B", "#F29305", "#E50000"],
                                startPoints: [0.1, 0.25, 0.50, 0.75, 1.0],
                            }}
                        >
                        </Heatmap>
                    </MapView>

                </View>
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