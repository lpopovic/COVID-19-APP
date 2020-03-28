import { Dimensions } from 'react-native'
export const displayScreen = Dimensions.get('window')
export const maxUserPoints = 3
export const heatMapGradient = {
    colorMapSize: 256,
    colors: ["#79BC6A", "#BBCF4C", "#EEC20B", "#F29305", "#E50000"],
    startPoints: [0.1, 0.25, 0.50, 0.75, 1.0],
}
export const typeOfGoogleMap = {
    standard: 'standard',
    satellite: 'satellite',
    hybrid: 'hybrid',
}
export const zoomLevel = [
    591657550.500000,
    295828775.300000,
    147914387.600000,
    73957193.820000,
    36978596.910000,
    18489298.450000,
    9244649.227000,
    4622324.614000,
    2311162.307000,
    1155581.153000,
    577790.576700,
    288895.288400,
    144447.644200,
    72223.822090,
    36111.911040,
    18055.955520,
    9027.977761,
    4513.988880,
    2256.994440,
    1128.497220,
]

export const zoom = 2
export const zoomMarker = 13
export const latitudeDeltaMarker = Math.exp(Math.log(360) - (zoomMarker * Math.LN2));
export const longitudeDeltaMarker = displayScreen.width / displayScreen.height * latitudeDeltaMarker
export const latitudeDeltaInitial = Math.exp(Math.log(360) - (zoom * Math.LN2));
export const longitudeDeltaInitial = displayScreen.width / displayScreen.height * latitudeDeltaInitial