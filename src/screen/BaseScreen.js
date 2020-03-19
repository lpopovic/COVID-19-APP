import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomAlert from '../components/common/CustomAlert'
import CustomActivityIndicator from '../components/common/CustomActivityIndicator'

class BaseScreen extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
    }

    componentDidMount() {
        this._isMounted = true

    }

    componentWillUnmount() {
        this._isMounted = false
    }

    setNewStateHandler = (newStateAtributeValue) => {
        if (this._isMounted) {
            this.setState(newStateAtributeValue)
        }
    }
    showAlertMessage = (message) => {
        CustomAlert.showAlert(String(message))
    }
    showDialogMessage = (message, onPressOk, onPressCancel) => {
        CustomAlert.showDialogAlert(String(message), onPressOk, onPressCancel)
    }
    activityIndicatorContent = (color) => (

        <CustomActivityIndicator size="large" color={color} />

    )
}



export default BaseScreen;