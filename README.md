# RTC Help

This Chrome browser extension allows you to customize WebRTC APIs on third-party websites.

When the extension is enabled, it intercepts crucial WebRTC Media Stream and Peer Connection APIs at the browser
level, such as `getUserMedia`, `enumerateDevices`, and `RTCPeerConnection`.

Examples of customization are: replacing webcam video track with generated video, force to disable webcam access,
hide certain devices, or change certain parameters in the APIs.

The goal is to allow end-user customization of the WebRTC experience, without depending on the
features provided by the third-party websites
