
import React, { Component } from 'react';
import {
  View,
  Modal,
  ActivityIndicator
} from 'react-native';

import styles from "../theme/engstyle/styles";


const Loader = props => {
  const {
    loading,
    ...attributes
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {console.log('close modal')}}>
      <View style={styles.loaderBackground}>
        <View style={styles.loaderIndicatorWrapper}>
          <ActivityIndicator
            animating={loading} />
        </View>
      </View>
    </Modal>
  )
}


export default Loader;