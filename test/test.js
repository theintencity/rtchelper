// RTC Helper (c) 2025, Kundan Singh (theintencity@gmail.com)

let local_stream = null;
let senders = [];
let starting = false;
let constraints = {audio: true, video: true};
if (true) {
    constraints.video = {
        width: 240, height: 240, frameRate: 1
    };
}
document.querySelector("input.text").onkeyup = event => {
    if (event.key == "Enter" && dc1) {
        dc1.send(event.currentTarget.value);
        event.currentTarget.value = "";
    }
}
do_stop = () => {
    const button = document.querySelector("button.start");
    button.innerText = "Capture";
    local_stream.getVideoTracks().forEach(track => {
        track.stop();
    });
    local_stream.getAudioTracks().forEach(track => {
        track.stop();
    });

    if (pc1 && senders.length > 0) {
        senders.forEach(sender => pc1.removeTrack(sender));
        senders.splice(0, senders.length);
    }
    local_stream = null;

    document.querySelector("video.local").srcObject = null;
};
document.querySelector("button.start").onclick = event => {
    const button = event.currentTarget;
    const text = button.innerText;
    if (text == "Stop") {
        if (!starting) {
            do_stop();
        }
    } else {
        button.innerText = "Stop";

        const screen = document.querySelector("input.screen").checked;
        starting = true;
        (screen ? navigator.mediaDevices.getDisplayMedia() : navigator.mediaDevices.getUserMedia(constraints)).then(stream => {
            if (starting) {
                starting = false;
                local_stream = stream;
                document.querySelector("video.local").srcObject = stream;

                if (pc1 && local_stream) {
                    [].concat.call(local_stream.getAudioTracks(), local_stream.getVideoTracks()).forEach(track => {
                        senders.push(pc1.addTrack(track, local_stream));
                    });
                }
            } else {
                do_stop();
            }
        });
    }
};
//document.querySelector("button").click();

let pc1 = null, pc2 = null, dc1 = null, dc2 = null;

document.querySelector("button.data").onclick = event => {
    if (!dc1 && pc1) {
        try {
            dc1 = pc1.createDataChannel("test");
        } catch (e) {
            console.error("Failed to create data channel", e);
        }
        // dc1.onmessage = event => console.log("dc1.onmessage", event.data);
        // dc1.onopen = event => console.log("dc1.onopen");
        // dc1.onclose = event => console.log("dc1.onclose");
        // dc1.onerror = event => console.log("dc1.onerror", event.error);
    }
};

document.querySelector("button.connect").onclick = event => {
    const button = event.currentTarget;
    const text = button.innerText;
    if (text == "Close") {
        button.innerText = "Connect";
        if (dc1) {
            dc1.close();
            dc1 = null;
        }
        if (dc2) {
            dc2.close();
            dc2 = null;
        }
        if (pc1) {
            pc1.close();
            pc1 = null;
        }
        if (pc2) {
            pc2.close();
            pc2 = null;
        }
        if (senders.length > 0) {
            senders.splice(0, senders.length);
        }
        const video = document.querySelector("video.remote");
        video.srcObject = null;
    } else {
        button.innerText = "Close";
        pc1 = new RTCPeerConnection();
        pc2 = new RTCPeerConnection();
        pc1.onicecandidate = event => {
            //console.log("pc1.onicecandidate");
            pc2.addIceCandidate(event.candidate);
        };
        pc2.onicecandidate = event => {
            //console.log("pc2.onicecandidate");
            pc1.addIceCandidate(event.candidate);
        }
        pc2.ontrack = event => {
            //console.log("ontrack", event, event.streams);
            const video = document.querySelector("video.remote");
            const oldSrc = video.srcObject;
            if (event.streams && event.streams[0]) {
                if (video.srcObject != event.streams[0]) {
                    video.srcObject = event.streams[0];
                } // else already assigned correctly
            } else { // streamless track
                if (!video.srcObject) {
                    video.srcObject = new MediaStream();
                }
                if (event.track) { // may be null in mediasteam customization
                    video.srcObject.addTrack(event.track);
                }
            }
            [].slice.call(document.querySelectorAll("video.copy1")).forEach(video1 => {
                video1.srcObject = video.srcObject
            });
            //document.querySelector("video.remote").srcObject = event.streams[0];
        };
        pc2.ondatachannel = event => {
            dc2 = event.channel;
            // dc2.onmessage = event => console.log("dc2.onmessage", event.data);
            // dc2.onopen = event => console.log("dc2.onopen");
            // dc2.onclose = event => console.log("dc2.onclose");
            // dc2.onerror = event => console.log("dc2.onerror", event.error);
        }
        pc1.onnegotiationneeded = event => {
            pc1.createOffer().then(offer => {
                //console.log(offer);
                pc1.setLocalDescription(offer).then(() => {
                    pc2.setRemoteDescription(offer).then(() => {
                        pc2.createAnswer().then(answer => {
                            //console.log(answer);
                            pc2.setLocalDescription(answer).then(() => {
                                pc1.setRemoteDescription(answer).then(() => {
                                    //console.log("negotiation completed");
                                });
                            });
                        })
                    });
                });
            });
        };
        if (local_stream) {
            [].concat.call(local_stream.getAudioTracks(), local_stream.getVideoTracks()).forEach(track => {
                senders.push(pc1.addTrack(track, local_stream));
            });
        }
    }
};
