import { WSnackBar } from 'react-native-smart-tip'
import { BASE_COLOR, isAndroid } from '../../helper'
export const showDefaultSnackBar = (text) => {

    const snackBarOpts = {
        data: text,
        position: isAndroid ? WSnackBar.position.BOTTOM : WSnackBar.position.TOP, // 1.TOP 2.CENTER 3.BOTTOM
        duration: 1000, //1.SHORT 2.LONG 3.INDEFINITE
        textColor: BASE_COLOR.black,
        backgroundColor: BASE_COLOR.blueGray,
        height: 55,
    }
    WSnackBar.show(snackBarOpts)
}