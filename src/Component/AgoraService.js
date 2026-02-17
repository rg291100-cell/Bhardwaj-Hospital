import RtcEngine, {
  ChannelProfile,
  ClientRole,
  VideoRenderMode,
} from 'react-native-agora';

class AgoraService {
  constructor() {
    this.engine = null;
  }

  async init(appId) {
    try {
      this.engine = await RtcEngine.create(appId);
      
      // Enable video
      await this.engine.enableVideo();
      
      // Set channel profile
      await this.engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
      
      // Set client role (Broadcaster or Audience)
      await this.engine.setClientRole(ClientRole.Broadcaster);
      
      console.log('Agora Engine initialized successfully');
      return this.engine;
    } catch (error) {
      console.error('Failed to initialize Agora Engine:', error);
      throw error;
    }
  }

  async joinChannel(token, channelName, uid = 0) {
    try {
      await this.engine.joinChannel(token, channelName, null, uid);
      console.log(`Joined channel: ${channelName}`);
    } catch (error) {
      console.error('Failed to join channel:', error);
      throw error;
    }
  }

  async leaveChannel() {
    try {
      await this.engine.leaveChannel();
      console.log('Left channel');
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
  }

  async destroy() {
    try {
      await RtcEngine.destroy();
      this.engine = null;
      console.log('Agora Engine destroyed');
    } catch (error) {
      console.error('Failed to destroy Agora Engine:', error);
    }
  }

  async enableLocalVideo(enabled) {
    await this.engine.enableLocalVideo(enabled);
  }

  async muteLocalAudioStream(muted) {
    await this.engine.muteLocalAudioStream(muted);
  }

  async switchCamera() {
    await this.engine.switchCamera();
  }

  addListener(eventName, callback) {
    return this.engine.addListener(eventName, callback);
  }

  removeAllListeners() {
    this.engine.removeAllListeners();
  }
}

export default new AgoraService();