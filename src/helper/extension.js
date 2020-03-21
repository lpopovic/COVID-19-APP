import { Platform } from 'react-native';
import { zoomLevel } from './constant';

export const isAndroid = Platform.OS === 'android' ? true : false
export const getZoomRegion = (region) => {
    const zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2)
    return zoom
}
export const getRegionForCoordinates = (points) => {
    // points should be an array of { latitude: X, longitude: Y }
    let minX, maxX, minY, maxY;

    // init first point
    ((point) => {
        minX = point.latitude;
        maxX = point.latitude;
        minY = point.longitude;
        maxY = point.longitude;
    })(points[0]);

    // calculate rect
    points.map((point) => {
        minX = Math.min(minX, point.latitude);
        maxX = Math.max(maxX, point.latitude);
        minY = Math.min(minY, point.longitude);
        maxY = Math.max(maxY, point.longitude);
    });

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const deltaX = (maxX - minX);
    const deltaY = (maxY - minY);

    return {
        latitude: midX,
        longitude: midY,
        latitudeDelta: deltaX,
        longitudeDelta: deltaY
    };
}

export const getRadiusFromRegion = (region) => {

    let { latitude, longitude, latitudeDelta, longitudeDelta } = region

    let minLatitude = 0
    let minLongitude = 0

    let maxLatitude = 0
    let maxLongitude = 0


    minLatitude = latitude - latitudeDelta / 2;
    maxLatitude = latitude + latitudeDelta / 2;

    minLongitude = longitude - longitudeDelta / 2;
    maxLongitude = longitude + longitudeDelta / 2;

    const distane = distance(minLatitude, minLongitude, maxLatitude, maxLongitude).toFixed(5) * 2 
    // const test = zoomLevel[getZoomRegion(region) - 1] / 10000
    return distane
}

function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist / 1.609344;
    }
}