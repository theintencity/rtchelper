# RTC Helper

This Chrome browser extension allows you to customize WebRTC APIs on third-party websites.

When the extension is enabled, it intercepts crucial WebRTC Media Stream and Peer Connection APIs at the browser
level, such as `getUserMedia`, `enumerateDevices`, and `RTCPeerConnection`.

Examples of customization are: replacing webcam video track with generated video, force to disable webcam access,
hide certain devices, or change certain parameters in the APIs.

The goal is to allow end-user customization of the WebRTC experience, without depending on the
features provided by the third-party websites

# License, copyright and contributions

The software is released under dual license: AGPL (GNU Affero General Public License) as well as
Alternative commercial license. See [LICENSE](LICENSE) for details. This is similar in spirit to
MySQL's dual license, except that we use AGPL.

Although, I would like to promote open source, I have witnessed gross misuse of the open source
intent in the industry, especially in software-as-a-service offerings. Therefore, I decided to use
AGPL as the baseline license. This is quite restrictive for most commercial offerings. Therefore
I decided to also offer an alternative low cost commercial license for such use.

In summary, if you keep this software to yourself, or make your whole product or service open-source,
then AGPL is fine; if you want to sell your own software with pieces of this project inside, even
if you are offering software-as-a-service or cloud hosted product, you'll likely need to buy the
alternative commercial license. 

The alternative license is available for commercial and non-personal use at a small price, typically
USD 5-10k, independent of any usage pattern, by contacting the software owner mentioned below. This
alternative license allows you to sell the software pieces of this project to your customers bundled
with your own closed source product, or use these software pieces with your cloud hosted service
offering to your customers without much restrictions, with the main exception that no reselling of
those sofware pieces of this project is allowed, without a new paid commercial license.

Software owner is **Kundan Singh ([theintencity@gmail.com](mailto:theintencity@gmail.com))**.
All pieces of this software including source code, documentation, and binaries are copyright
protected as *&copy; 2025, Kundan Singh &lt;theintencity@gmail.com&gt;*. Please see LICENSE about
transfer of ownership of contributions, if you would like to contribute to this project.
