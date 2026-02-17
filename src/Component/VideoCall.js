import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {
  createAgoraRtcEngine,
  RtcSurfaceView,
  ChannelProfileType,
} from 'react-native-agora';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

let AGORA_APP_ID = '320388a4d755478da2711e308c922f22';

class VideoCall extends Component {
  constructor(props) {
    super(props);

    const { appointmentId, channelName, agoraToken, uid } = this.props.route.params;
    console.log("token videocall screen ", agoraToken);
    console.log("uid videocall screen ", uid);

    this.state = {
      appointmentId,
      channelName,
      token: agoraToken,
      uid: uid, 
      isJoined: false,
      remoteUids: [],
      isMuted: false,
      isVideoEnabled: true,
      isSpeakerEnabled: true,
      isLoading: true,
      error: null,
    };

    this.engine = null;
  }

  /* ================= PERMISSIONS ================= */
  requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const camera = await request(PERMISSIONS.ANDROID.CAMERA);
        const mic = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
        return camera === RESULTS.GRANTED && mic === RESULTS.GRANTED;
      } else {
        const camera = await request(PERMISSIONS.IOS.CAMERA);
        const mic = await request(PERMISSIONS.IOS.MICROPHONE);
        return camera === RESULTS.GRANTED && mic === RESULTS.GRANTED;
      }
    } catch (e) {
      return false;
    }
  };

  /* ================= COMPONENT DID MOUNT ================= */
  async componentDidMount() {
    try {
      const granted = await this.requestPermissions();

      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Camera and microphone permission are required for video call'
        );
        this.props.navigation.goBack();
        return;
      }

      await this.initEngine();
      await this.joinChannel();
      
    } catch (e) {
      console.log('Init error:', e);
      this.setState({ error: 'Failed to start call', isLoading: false });
    }
  }

  componentWillUnmount() {
    // Stop preview first
    this.engine?.stopPreview();
    this.engine?.leaveChannel();
    this.engine?.release();
    this.engine = null;
  }

  /* ================= AGORA INIT ================= */
  initEngine = async () => {
    try {
      this.engine = createAgoraRtcEngine();

      const res = this.engine.initialize({
        appId: AGORA_APP_ID,
        channelProfile: ChannelProfileType.ChannelProfileCommunication,
      });
      console.log('Engine initialized:', res);

      // Enable video module first
      this.engine.enableVideo();
      this.engine.enableAudio();
      
      // Start preview only if video is enabled
      this.engine.startPreview(); 
      this.engine.setEnableSpeakerphone(true);

      this.engine.registerEventHandler({
        onJoinChannelSuccess: (channel, uid, elapsed) => {
          console.log('Join channel success:', channel, 'uid:', uid, 'elapsed:', elapsed);
          this.setState({ isJoined: true, isLoading: false });
        },
        onUserJoined: (channelId, uid, elapsed) => {
          console.log('User joined - Channel:', channelId, 'UID:', uid, 'Elapsed:', elapsed);
          this.setState(prev => ({
            remoteUids: [...prev.remoteUids, uid],
            isLoading: false,
          }));
        },
        onUserOffline: (channelId, uid, reason) => {
          console.log('User offline:', uid, 'Reason:', reason);
          this.setState(prev => ({
            remoteUids: prev.remoteUids.filter(i => i !== uid),
          }));
        },
        onFirstRemoteVideoDecoded: (channelId, uid, width, height, elapsed) => {
          console.log('First remote video decoded:', uid);
          this.setState({ isLoading: false });
        },
        onError: (err, msg) => {
          console.log('Agora error code:', err, 'message:', msg);
          let errorMsg = 'Connection failed';
          
          if (err === 110) errorMsg = 'Invalid token. Please try again.';
          else if (err === 109) errorMsg = 'Token expired. Please reconnect.';
          else if (err === 17) errorMsg = 'Failed to join channel.';
          else if (err === 101) errorMsg = 'Invalid App ID.';
          
          this.setState({ isLoading: false, error: errorMsg });
        },
        onLocalVideoStateChanged: (source, state, error) => {
          console.log('Local video state changed:', state, error);
        },
        onLocalAudioStateChanged: (source, state, error) => {
          console.log('Local audio state changed:', state, error);
        }
      });
    } catch (error) {
      console.log('Init engine error:', error);
      this.setState({ isLoading: false, error: 'Failed to initialize video call' });
    }
  };

  /* ================= JOIN ================= */
  joinChannel = async () => {
    const { channelName, token, uid } = this.state;
    console.log('Joining channel with:', { 
      channelName, 
      uid, 
      tokenLength: token?.length 
    });
    
    try {
      if (!token || !channelName) {
        throw new Error('Missing token or channel name');
      }
      
      const options = {
        channelProfile: ChannelProfileType.ChannelProfileCommunication,
        clientRoleType: 1, // 1 for broadcaster, 2 for audience
      };
      
      const result = await this.engine.joinChannel(token, channelName, uid, options);
      console.log('Join channel result:', result);
    } catch (error) {
      console.log('Join channel error:', error);
      this.setState({ 
        isLoading: false, 
        error: error.message || 'Failed to join channel' 
      });
    }
  };

  /* ================= CONTROLS ================= */
  toggleMute = async () => {
    const { isMuted } = this.state;
    try {
      // Use enableLocalAudio instead of muteLocalAudioStream for better control
      await this.engine.enableLocalAudio(!isMuted);
      this.setState({ isMuted: !isMuted });
    } catch (error) {
      console.log('Toggle mute error:', error);
    }
  };

  toggleVideo = async () => {
    const { isVideoEnabled } = this.state;
    try {
      // First update the state immediately for UI responsiveness
      this.setState({ isVideoEnabled: !isVideoEnabled }, async () => {
        const newVideoState = !isVideoEnabled;
        
        if (newVideoState) {
          // Turning video ON
          await this.engine.enableLocalVideo(true);
          // Restart preview if needed
          await this.engine.startPreview();
        } else {
          // Turning video OFF - stop preview first
          await this.engine.stopPreview();
          await this.engine.enableLocalVideo(false);
        }
      });
    } catch (error) {
      console.log('Toggle video error:', error);
      // Revert state on error
      this.setState({ isVideoEnabled });
    }
  };

  switchCamera = async () => {
    try {
      await this.engine.switchCamera();
    } catch (error) {
      console.log('Switch camera error:', error);
    }
  };

  toggleSpeaker = async () => {
    const { isSpeakerEnabled } = this.state;
    try {
      await this.engine.setEnableSpeakerphone(!isSpeakerEnabled);
      this.setState({ isSpeakerEnabled: !isSpeakerEnabled });
    } catch (error) {
      console.log('Toggle speaker error:', error);
    }
  };

  leaveChannel = async () => {
    try {
      await this.engine.stopPreview();
      await this.engine.leaveChannel();
      await this.engine.release();
      this.engine = null;
    } catch (e) {
      console.log('Leave error:', e);
    }
    this.props.navigation.goBack();
  };

  retryConnection = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      if (this.engine) {
        await this.engine.leaveChannel();
        await this.engine.release();
        this.engine = null;
      }
      
      await this.initEngine();
      await this.joinChannel();
    } catch (error) {
      console.log('Retry error:', error);
      this.setState({ 
        isLoading: false, 
        error: 'Reconnection failed. Please try again.' 
      });
    }
  };

  renderLocalVideo() {
    const { isJoined, isVideoEnabled } = this.state;

    if (!isJoined || !isVideoEnabled) {
      return (
        <View style={styles.videoPlaceholder}>
          <Icon name="video-off" size={40} color="#fff" />
          <Text style={styles.placeholderText}>Camera is off</Text>
        </View>
      );
    }

    return (
      <RtcSurfaceView
        style={styles.localVideo}
        canvas={{ uid: 0 }}
        renderMode={1}
        key="local-video" 
      />
    );
  }

  renderRemoteVideo() {
    const { remoteUids, isJoined } = this.state;

    if (!isJoined || remoteUids.length === 0) {
      return (
        <View style={styles.videoPlaceholder}>
          <ActivityIndicator size="large" color="#248907" />
          <Text style={styles.waitingText}>Connecting...</Text>
        </View>
      );
    }

    return (
      <RtcSurfaceView
        style={styles.remoteVideo}
        canvas={{ uid: remoteUids[0] }}
        renderMode={1}
        key={`remote-${remoteUids[0]}`} // Add key for better re-render
      />
    );
  }

  render() {
    const { isLoading, error, isJoined } = this.state;

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#248907" />
          <Text style={styles.loadingText}>Connecting...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={60} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.retryButton]} 
              onPress={this.retryConnection}
            >
              <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.backButton]} 
              onPress={this.leaveChannel}
            >
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        <View style={styles.remoteContainer}>{this.renderRemoteVideo()}</View>

        <View style={styles.localContainer}>{this.renderLocalVideo()}</View>

        {isJoined && (
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={[styles.controlButton, this.state.isMuted && styles.controlButtonActive]} 
              onPress={this.toggleMute}
            >
              <Icon 
                name={this.state.isMuted ? "microphone-off" : "microphone"} 
                size={26} 
                color="#fff" 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlButton, !this.state.isVideoEnabled && styles.controlButtonActive]} 
              onPress={this.toggleVideo}
            >
              <Icon 
                name={this.state.isVideoEnabled ? "video" : "video-off"} 
                size={26} 
                color="#fff" 
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={this.switchCamera}>
              <Icon name="camera-flip" size={26} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlButton, styles.hangupButton]} 
              onPress={this.leaveChannel}
            >
              <Icon name="phone-hangup" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

export default VideoCall;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loadingContainer: { 
    flex: 1, 
    backgroundColor: '#000', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    color: '#fff', 
    fontFamily: 'Poppins-SemiBold', 
    marginTop: 20,
    fontSize: 16 
  },
  remoteContainer: { 
    flex: 1, 
    backgroundColor: '#000',
    position: 'relative',
  },
  remoteVideo: { 
    width: '100%', 
    height: '100%',
    position: 'absolute',
  },
  localContainer: {
    position: 'absolute',
    top: 70,
    right: 16,
    width: 120,
    height: 170,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#ffffff50',
    backgroundColor: '#000',
    elevation: 6,
    zIndex: 100,
  },
  localVideo: { 
    width: '100%', 
    height: '100%',
    backgroundColor: '#000',
  },
  videoPlaceholder: { 
    flex: 1, 
    backgroundColor: '#1c1c1c', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  waitingText: { 
    color: '#fff', 
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    marginTop: 10,
  },
  placeholderText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginTop: 5,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 22,
    backgroundColor: 'rgba(0,0,0,0.75)',
    zIndex: 1000,
  },
  controlButton: {
    padding: 15,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  hangupButton: {
    backgroundColor: 'red',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  actionButton: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  retryButton: {
    backgroundColor: '#248907',
  },
  backButton: {
    backgroundColor: '#ff6b6b',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
});