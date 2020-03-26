import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet
} from 'react-native';
import { TouchableOpacity as RNGHTouchableOpacity } from 'react-native-gesture-handler';
import BottomSheet from 'reanimated-bottom-sheet'
import TagsView from '../common/TagsView'
import {
    strings,
    isAndroid,
    BASE_COLOR,
    displayScreen,
    CUSTOM_COLOR
} from '../../helper'
const BottomSheetButton = ({ children, ...otherProps }) => {
    if (isAndroid) {
        return (
            <RNGHTouchableOpacity {...otherProps}>{children}</RNGHTouchableOpacity>
        );
    }
    return <TouchableOpacity {...otherProps}>{children}</TouchableOpacity>;
};
class CustomSheet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            changeTag1: 0,
            tagListSelect1: true,
            answer1: [{ name: strings.yes, id: 0 }],
        }
        this.answerList = [{ name: strings.yes, id: 0 }, { name: strings.no, id: 1 }, { name: strings.notSure, id: 2 }]
    }
    getInnerRef = () => this.bottomSheet;

    onSelectTagView1 = (answer1, tagListSelect1) => {
        const changeTag1 = this.state.changeTag1 === 0 ? 1 : 0
        this.setState({ answer1, tagListSelect1, changeTag1 })
    }

    renderContent = () => (
        <View style={styles.renderContainer}>
            <Text style={styles.questionText}>{strings.theQuestion}</Text>
            <View style={{ height: 50 }}>
                <TagsView
                    extraData={this.state.changeTag1}
                    arrayAllItems={this.answerList}
                    selected={this.state.answer1}
                    isExclusive={true}
                    selectedItem={(select) => this.onSelectTagView1(select, true)}
                    isSelectedOther={this.state.tagListSelect1}
                />
            </View>
            <View style={styles.btnContainer}>
                <BottomSheetButton onPress={() => this.onPressBtn()}
                    style={styles.bottomBtn}>
                    <Text style={styles.bottomBtnTitle}>{strings.report}</Text>
                </BottomSheetButton>
            </View>
        </View >
    )

    renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
            </View>
        </View>
    )
    onPressBtn = () => {
        this.bottomSheet.snapTo(1)
        this.bottomSheet.snapTo(1)
        this.props.onPressSubmit()
    }
    render() {
        return (
            <BottomSheet
                ref={ref => this.bottomSheet = ref}
                snapPoints={[200, 0]}
                renderContent={this.renderContent}
                renderHeader={this.renderHeader}
                enabledInnerScrolling={false}
                initialSnap={1}
            />
        )
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: BASE_COLOR.white,
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
    btnContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    bottomBtn: {
        backgroundColor: CUSTOM_COLOR.btnColor,
        height: 50,
        alignItems: 'center',
        width: displayScreen.width * 0.7,
        justifyContent: 'center',
        borderRadius: 10
    },
    bottomBtnTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: BASE_COLOR.white
    },
    renderContainer: {
        backgroundColor: BASE_COLOR.white,
        paddingBottom: 55
    },
    questionText: {
        fontWeight: '500',
        margin: 10,
        marginBottom: 2
    },
});


export default CustomSheet;