// RTC Helper (c) 2025-2026, Kundan Singh (theintencity@gmail.com)

/*
(The MIT License, for this file functions.js, only)

Copyright (c) 2025-2026 Kundan Singh

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject
to the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const functions = {};

functions.videocapture = {
//"Camera - show video from the default webcam": 
"camera-01": function(canvas, video) {
    /* Show video from the default webcam */
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
},
//"Screen - show screen or app shared as video": 
"camera-02": function(canvas, screen) {
    /* 
    Prompt to select for screen or window share,
    and use that as the video feed.
    */
    canvas.width = screen.videoWidth;
    canvas.height = screen.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(screen, 0, 0, canvas.width, canvas.height);
},
//"Screen - show screen share with picture-in-picture of webcam":
"camera-03": function(canvas, screen, video, options) {
    /*
    Prompt to select for screen or window share.
    Use that along with the webcam video in picture-
    in-picture mode. If screen selection is not done,
    then only the webcam video is shown in full size.
    */
    const ctx = canvas.getContext("2d");
    const w = video.videoWidth, h = video.videoHeight;
    const W = screen.videoWidth, H = screen.videoHeight;
    if (W && H) {
        canvas.width = W;
        canvas.height = H;
        ctx.drawImage(screen, 0, 0, W, H);
        if (w && h) {
            const r = w/h;
            const dh = H/4;
            const dw = dh * r;
            let dy = 4, dx = W - dw - 4;
            if (options?.select == "top-left" || options?.select == "bottom-left") {
                dx = 4;
            }
            if (options?.select == "bottom-left" || options?.select == "bottom-right") {
                dy = H - dh - 4;
            }
            ctx.drawImage(video, dx, dy, dw, dh);
        }
    } else {
        ctx.drawImage(video, 0, 0, w, h);
    }
},
//"Camera - show combined feed from two webcams": 
"camera-04": function(canvas, videos) {
    /* 
    Assuming there are more than one webcams, show them
    side by side, with center zoom. This is similar to horizontal
    split effect on TV during some interviews.

    For single webcam scenario, it just displays that webcam video.
    */
    if (!videos || !videos.length) {
        return;
    }

    const ctx = canvas.getContext("2d");
    videos = videos.slice(0, 2);
    videos.forEach((video, index) => {
        const dh = canvas.height, dw = canvas.width / videos.length;
        const dy = 0, dx = index * dw;
        const w = video.videoWidth, h = video.videoHeight;
        const r = w / (h || 1), dr = dw / dh;
        let sx, sy, sw, sh;
        if (r >= dr) {
            sh = h; sy = 0;
            sw = dr * sh; 
            sx = w/2 - sw/2;
        } else {
            sw = w; sx = 0;
            sh = sw / dr;
            sy = h/2 - sh/2;
        }
        ctx.drawImage(video, sx, sy, sw, sh, dx, dy, dw, dh);
    });
},
//"File - upload video files and share them as video feed": 
"camera-05": async function(canvas, data, upload, respath, options) {
    /*
    Allow click to upload one or more mp4 video files, and
    show them as video feed. The files are shown one after
    another, and the video feed stops when the last selected
    video file finishes playing. Only mp4 files are allowed.
    A label to click-to-open is shown until the file upload
    is completed.
    */
    if (!data.files) {
        const files = options?.file ? options?.file.map(f => f.dataurl || f.bloburl) : [respath + "/test.mp4"];
        if (files && files.length > 0) {
            data.files = [].slice.apply(files);
            const video = data.video = document.createElement("video");
            video.setAttribute("muted", "");
            video.setAttribute("autoplay", "");
            video.setAttribute("src", data.files.shift());
            video.onended = () => {
                if (data.files.length > 0) {
                    video.setAttribute("src", data.files.shift());
                } else {
                    delete data.files; // loop
                }
            };
        }
    }
    if (data.video) {
        const ctx = canvas.getContext("2d");
        canvas.width = data.video.videoWidth;
        canvas.height = data.video.videoHeight;
        ctx.drawImage(data.video, 0, 0);
    }
},
//"Mediapipe - blur background on webcam video": 
"camera-06": async function(canvas, video, data, segment) {
    /*
    Using the tensorflow mediapipe library and its body
    segmentation model, blur the background on webcam video.
    A blur filter of 8px is used.
    */
    const W = canvas.width = video.videoWidth;
    const H = canvas.height = video.videoHeight;

    const [mask, image] = await segment(data, video);
    // alternatively, segment(data, video, "local") to avoid CDN.

    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.clearRect(0, 0, W, H);
    
    ctx.drawImage(mask, 0, 0, W, H);
    ctx.filter = "blur(8px)";
    ctx.globalCompositeOperation = 'source-out';
    ctx.drawImage(image, 0, 0, W, H);
    ctx.filter = "none";

    ctx.globalCompositeOperation = 'destination-atop';
    ctx.drawImage(image, 0, 0, W, H);

    ctx.restore();
},
//"Mediapipe - blur and hide background on webcam video": 
"camera-07": async function(canvas, video, data, segment) {
    /*
    Using the tensorflow mediapipe library and its body
    segmentation model, blur and semi-hide the background of
    webcam video. A blur filter of 8px, is used along with
    other filters to reduce the clarity and color of the
    background.
    */
    const W = canvas.width = video.videoWidth;
    const H = canvas.height = video.videoHeight;

    const [mask, image] = await segment(data, video);
    // alternatively, segment(data, video, "local") to avoid CDN.

    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.clearRect(0, 0, W, H);
    
    ctx.drawImage(mask, 0, 0, W, H);
    ctx.filter = "blur(8px) grayscale(80%) brightness(120%)";
    ctx.globalCompositeOperation = 'source-out';
    ctx.drawImage(image, 0, 0, W, H);
    ctx.filter = "none";

    ctx.globalCompositeOperation = 'destination-atop';
    ctx.drawImage(image, 0, 0, W, H);

    ctx.restore();
},
//"Mediapipe - blur and hide foreground on webcam video": 
"camera-08": async function(canvas, video, data, segment) {
    /*
    Using the tensorflow mediapipe library and its body
    segmentation model, blur and semi-hide the foreground
    detected face. The background is shown as is. This is
    useful for anonymity of the person shown in the
    webcam video. A blur filter of 16px is used for the
    foreground, along with removing any colors.

    See motivation in https://www.scribd.com/document/932752927/Real-Time-Face-blurring
    and idea in https://github.com/Jaysheel11/Real-time-face-blurring
    */
    const W = canvas.width = video.videoWidth;
    const H = canvas.height = video.videoHeight;

    const [mask, image] = await segment(data, video);
    // alternatively, segment(data, video, "local") to avoid CDN.

    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.clearRect(0, 0, W, H);
    
    ctx.drawImage(mask, 0, 0, W, H);
    ctx.filter = "blur(16px) grayscale(100%)";
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(image, 0, 0, W, H);
    ctx.filter = "none";

    // // to avoid the non-blur area near the border of the video, 
    // // use the following instead of previous five lines
    // ctx.drawImage(mask, -8, -8, canvas.width+16, canvas.height+20);
    // ctx.filter = "blur(8px) grayscale(100%)";
    // ctx.globalCompositeOperation = 'source-in';
    // ctx.drawImage(image, -8, -8, canvas.width+16, canvas.height+20);
    // ctx.filter = "none";

    ctx.globalCompositeOperation = 'destination-atop';
    ctx.drawImage(image, 0, 0, W, H);

    ctx.restore();
},
//"Mediapipe - remove background on webcam video": 
"camera-09": async function(canvas, video, data, segment) {
    /*
    Using the tensorflow mediapipe library and its body
    segmentation model, remove background on webcam video.
    The background is turned white.
    */
    const W = canvas.width = video.videoWidth;
    const H = canvas.height = video.videoHeight;

    const [mask, image] = await segment(data, video);
    // alternatively, segment(data, video, "local") to avoid CDN.

    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.clearRect(0, 0, W, H);
    
    ctx.drawImage(mask, 0, 0, W, H);
    ctx.globalCompositeOperation = 'source-out';
    ctx.fillStyle = '#FFFFFFFF';
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = 'destination-atop';
    ctx.drawImage(image, 0, 0, W, H);

    ctx.restore();
},
//"Mediapipe - upload and show a virtual background on webcam": 
"camera-10": async function(canvas, video, data, upload, segment, respath, options) {
    /*
    Using the tensorflow mediapipe library and its body
    segmentation model, show a virtual background on webcam
    video. It allows uploading one image or video file to be
    used as the background. Only the jpeg, png and mp4 files
    are allowed. A video background is looped. A label to
    click-to-open is shown until the file upload is completed.
    The background is displayed with object-fit cover style.
    */
    if (!data.loading 
        || data.image?.src.startsWith("data:") && options?.file?.[0]?.dataurl && data.image.src != options.file[0].dataurl
        || data.image?.src.startsWith("blob:") && options?.file?.[0]?.bloburl && data.image.src != options.file[0].bloburl) {

        data.loading = true;
        const src = options?.file?.[0]?.dataurl || options?.file?.[0]?.bloburl || respath + "/landscape1.jpg";
        if (src.startsWith("data:video/")) {
            console.log("load video");
            const vid = document.createElement("video");
            vid.setAttribute("muted", "");
            vid.setAttribute("loop", "");
            vid.setAttribute("autoplay", "");
            vid.onerror = error => {
                console.error("exception loading video", error);
            };
            vid.onloadedmetadata = (event) => {
                data.image = vid;
            };
            vid.src = src;
        } else {
            console.log("load image");
            const img = document.createElement("img");
            img.onerror = error => {
                console.error("exception loading image", error);
            };
            img.onload = () => {
                img.style.width = img.naturalWidth + "px";
                img.style.height = img.naturalHeight + "px";
                data.image = img;
            };
            img.src = src
        }
    }
    if (data.image) {
        const W = canvas.width = video.videoWidth;
        const H = canvas.height = video.videoHeight;

        const [mask, image] = await segment(data, video);
    
        const ctx = canvas.getContext("2d");
        ctx.save();
        ctx.clearRect(0, 0, W, H);
        
        if (data.image) {
            const wi = (data.image.naturalWidth || data.image.videoWidth || W);
            const hi = (data.image.naturalHeight || data.image.videoHeight || H);
            const r0 = wi/hi, r1 = W/H;
            const x = r0 >= r1 ? Math.round((wi - r1*hi)/2) : 0;
            const y = r0 >= r1 ? 0 : Math.round((hi - wi/r1)/2);
            const w = r0 >= r1 ? Math.round(r1*hi) : wi;
            const h = r0 >= r1 ? hi : Math.round(wi/r1);

            ctx.drawImage(mask, 0, 0, W, H);
            ctx.globalCompositeOperation = 'source-out';
            ctx.drawImage(data.image, x, y, w, h, 0, 0, W, H);
            ctx.globalCompositeOperation = 'destination-atop';
        }

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
},
//"Mediapipe - zoom and pan on detected face in webcam video": 
"camera-11": function(canvas, video, data, facedetect) {
    /*
    Using the tensorflow mediapipe library and its face
    detection model, implement zoom and pan on detected
    face similar to Zoom's Auto-Framing Camera, or 
    Apple's Center Stage feature. It uses a filter to
    avoid changing the view too quickly, and
    performs face detection only once per second, for
    improved performance. If no face is detected for some
    time, then the video is blurred, for privacy.

    See https://mediapipe.readthedocs.io/en/latest/solutions/autoflip.html,
    https://support.apple.com/en-us/111102 or
    https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0060352#auto-frame

    */
    if (!video.videoWidth || !video.videoHeight) {
        return;
    }

    const W = canvas.width = video.videoWidth;
    const H = canvas.height = video.videoHeight;

    if (!data.face || !data.pos) {
        const cx = W/2, cy = H/2, r = Math.min(W, H)/2;
        data.pos = {cx, cy, r};
        data.face = {cx, cy, r};
    }
    const now = Date.now();
    if (!data.time || now - data.time >= 1000) {
        // alternatively, facedetect(data, video, "local") to avoid CDN.
        facedetect(data, video).then(([detections, image]) => {
            const now = Date.now();
            if (detections && detections.length == 1) {
                const v = detections[0].boundingBox;
                const x = v.xCenter*W,
                    y = v.yCenter*H,
                    w = v.width*W,
                    h = v.height*H;
                const cx = x, cy = y - h*1/3, r = (w+h)/2;
                data.last = {cx, cy, r};
                const fx = data.face.cx, fy = data.face.cy, fr = data.face.r;
                const d1 = Math.abs(fx-cx) + Math.abs(fy-cy) + 2*Math.abs(fr-r);
                const d2 = Math.abs(fr-r);
                if (d1 >= 80 || d2 > 20) {
                    Object.assign(data.face, {cx, cy, r});
                } // else ignore minor change

                data.dtime = now;
            }

            data.time = now;
        }).catch(error => {
            // ignored
        });
    }

    // use smoothing filter to reduce noise, and restrict to view
    const f = 0.08, dd = 2;
    let x0 = data.pos.cx, y0 = data.pos.cy, r0 = data.pos.r;
    let xt = data.face.cx, yt = data.face.cy, rt = data.face.r;
    let r1 = Math.min(W/2, H/2, Math.max(r0-dd, Math.min(r0+dd, f*rt + (1-f)*r0)));
    let x1 = Math.max(r1, Math.min(W-r1, Math.max(x0-dd, Math.min(x0+dd, f*xt + (1-f)*x0)))),
        y1 = Math.max(r1, Math.min(H-r1, Math.max(y0-dd, Math.min(y0+dd, f*yt + (1-f)*y0))));
    Object.assign(data.pos, {cx: x1, cy: y1, r: r1});

    // from circle to rect
    const w = Math.round(W >= H ? Math.min(W, 2*r1*W/H) : Math.min(W, 2*r1));
    const h = Math.round(W >= H ? Math.min(H, 2*r1) : Math.min(H, 2*r1*H/W));
    const x = Math.round(Math.max(0, Math.min(W-w, x1-w/2)));
    const y = Math.round(Math.max(0, Math.min(H-h, y1-h/2)));

    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.filter = !data.dtime || now - data.dtime >= 10000 ? "blur(8px)" : "none";
    ctx.drawImage(video, x, y, w, h, 0, 0, W, H);
    ctx.restore();
},
//"Mediapipe - show screen share with face zoomed webcam video": 
"camera-12": function(canvas, screen, video, data, facedetect, options) {
    /*
    Prompt to select for screen or window share. Use that
    along with the webcam video in picture-in-picture mode
    in a smaller circle, instead of a rectangle. For the
    webcam video, it uses face zoom, using the tensorflow
    mediapipe library and its face detection model, by doing
    zoom and pan to the detected face. It uses a filter
    to avoid changing the view too quickly, and performs
    face detection only once per second, for improved 
    performance. If no face is detected for some time,
    then the video is blurred, for privacy.

    See https://github.com/cainhill/WebcamCircle,
    https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0060352#auto-frame
    and https://stackoverflow.com/questions/71557879/record-video-and-screen-together-and-overlay-with-javascript
    */
    const VW = video.videoWidth, VH = video.videoHeight;
    const W = screen.videoWidth, H = screen.videoHeight;

    const now = Date.now();

    if (VW && VH && W && H) {
        if (!data.pos) {
            const cx = VW/2, cy = VH/2, r = Math.min(VW, VH)/2;
            data.pos = {cx, cy, r};
            data.face = {cx, cy, r};
        }

        if (!data.time || now - data.time >= 1000) {
            // alternatively, facedetect(data, video, "local") to avoid CDN.
            facedetect(data, video).then(([detections, image]) => {
                const now = Date.now();
                if (detections && detections.length == 1) {
                    const v = detections[0].boundingBox;
                    const x = v.xCenter*VW,
                        y = v.yCenter*VH,
                        w = v.width*VW,
                        h = v.height*VH;
                    const cx = x, cy = y - h*1/3, r = (w+h)/2;
                    data.last = {cx, cy, r};
                    const fx = data.face.cx, fy = data.face.cy, fr = data.face.r;
                    const d1 = Math.abs(fx-cx) + Math.abs(fy-cy) + 2*Math.abs(fr-r);
                    const d2 = Math.abs(data.face.r - r);
                    if (d1 >= 40 || d2 > 10) {
                        Object.assign(data.face, {cx, cy, r});
                    } // else ignore small change

                    data.dtime = now;
                }

                data.time = now;
            }).catch(error => {
                // ignore
            });
        }

        // use smoothing filter to reduce noise, and restrict to view
        const f = 0.1, dd = 5;
        let x0 = data.pos.cx, y0 = data.pos.cy, r0 = data.pos.r;
        let xt = data.face.cx, yt = data.face.cy, rt = data.face.r;
        let r1 = Math.min(VW/2, VH/2, Math.max(r0-dd, Math.min(r0+dd, f*rt + (1-f)*r0)));
        let x1 = Math.max(r1, Math.min(VW-r1, Math.max(x0-dd, Math.min(x0+dd, f*xt + (1-f)*x0)))),
            y1 = Math.max(r1, Math.min(VH-r1, Math.max(y0-dd, Math.min(y0+dd, f*yt + (1-f)*y0))));
        Object.assign(data.pos, {cx: x1, cy: y1, r: r1});
    }

    const ctx = canvas.getContext("2d");
    ctx.save();

    if (W && H) {
        canvas.width = W;
        canvas.height = H;

        ctx.clearRect(0, 0, W, H);

        if (VW && VH) {
            ctx.beginPath();
            ctx.fillStyle = "white";
            const V = Math.min(W, H);
            const VV = Math.min(VW, VH);
            let cx = W - V/8 - 4, cy = H - V/8 - 4;
            if (options?.select == "bottom-left" || options?.select == "top-left") {
                cx = V/8+4;
            }
            if (options?.select == "top-left" || options?.select == "top-right") {
                cy = V/8+4;
            }
            ctx.arc(cx, cy, V/8, 0, 2*Math.PI);
            ctx.fill();

            ctx.globalCompositeOperation = 'source-in';

            ctx.filter = !data.dtime || now - data.dtime >= 10000 ? "blur(8px)" : "none";

            const x1 = data.pos.cx, y1 = data.pos.cy, r1 = data.pos.r;
            const d = Math.round(Math.min(VV, 2*r1));
            const x = Math.round(Math.max(0, Math.min(VW-d, x1 - d/2)));
            const y = Math.round(Math.max(0, Math.min(VH-d, y1 - d/2)));

            let px = W - V/4 - 4, py = H - V/4 - 4;
            if (options?.select == "bottom-left" || options?.select == "top-left") {
                px = 4;
            }
            if (options?.select == "top-left" || options?.select == "top-right") {
                py = 4;
            }

            ctx.drawImage(video, x, y, d, d, px, py, V/4, V/4);
            ctx.filter = "none";

            ctx.globalCompositeOperation = 'destination-atop';
            ctx.drawImage(screen, 0, 0, W, H);
        } else {
            ctx.drawImage(screen, 0, 0, W, H);
        }
    } else {
        canvas.width = VW;
        canvas.height = VH;
        ctx.drawImage(video, 0, 0, VW, VH);
    }
    ctx.restore();
},
//"Mediapipe - show screen share with background removed webcam video": 
"camera-13": async function(canvas, video, screen, data, segment, options) {
    /*
    Prompt to select for screen or window share. Use that
    along with the webcam video to display on top of the
    screen share video. For the webcam video, it uses body
    segmentation using the tensorflow mediapipe library,
    to remove the background, and make it transparent. 
    The webcam video is positioned at the bottom left corner,
    and is constrained to capture at 320x180. If no screen
    share is selected, it just displays the webcam video as is.
    */
    const ctx = canvas.getContext("2d");
    const w = video.videoWidth, h = video.videoHeight;
    const W = screen.videoWidth, H = screen.videoHeight;

    if (!data.canvas) {
        data.canvas = document.createElement("canvas");
    }
    if (!video._applied) {
        if (video.srcObject && video.srcObject.getVideoTracks()[0]) {
            video._applied = true;
            video.srcObject.getVideoTracks()[0].applyConstraints({width: 320, height: 180});
        }
    }

    if (W && H && w && h) {
        canvas.width = W;
        canvas.height = H;

        const [mask, image] = await segment(data, video);
        // alternatively, segment(data, video, "local") to avoid CDN.

        ctx.save();
        ctx.drawImage(screen, 0, 0, W, H);
        
        const s = Math.min(W, H)/4;
        const h0 = s, w0 = w/h*h0;

        if (data.canvas.width !== w || data.canvas.height !== h) {
            data.canvas.width = w;
            data.canvas.height = h;
        }

        const ctx2 = data.canvas.getContext("2d");
        
        ctx2.clearRect(0, 0, w, h);
        ctx2.drawImage(mask, 0, 0, w, h);
        ctx2.globalCompositeOperation = 'source-in';
        ctx2.drawImage(image, 0, 0, w, h);
        ctx2.globalCompositeOperation = 'source-over';

        let px = 4;
        if (options?.select == "bottom-right") {
            px = W-w0-4;
        }
        ctx.drawImage(data.canvas, 0, 0, w, h, px, H-h0-4, w0, h0);
        ctx.restore();
    } else {
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(video, 0, 0, w, h);
    }
},
//"Image - show logo and text on top of webcam video": 
"camera-14": function(canvas, video, data, respath, options) {
    /*
    Show a tiny logo and text on webcam video on the bottom
    right corner. The logo file and text are pre-configured.
    */
    if (!data.image_logo || data.image_logo.src.startsWith("data:") && options?.file?.[0].dataurl && data.image_logo.src !== options?.file?.[0].dataurl) {
        const image = data.image_logo = document.createElement("img");
        image.crossOrigin = "anonymous";
        image.src = options?.file?.[0].dataurl || respath + "/favicon.png";
        image.onerror = error => console.log("cannot load image", error);
    }

    if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);
        const image = data.image_logo;
        if (image && image.naturalWidth && image.naturalHeight) {
            const w_ = canvas.width * 0.1, h_ = canvas.height * 0.1;
            const W = image.naturalWidth, H = image.naturalHeight;
            const s = Math.max(w_ / W, h_ / H);
            const w = W * s, h = H * s;
            let x = canvas.width - w - 10, y = canvas.height - h - 10 - 10;
            if (options?.select == "bottom-left") {
                x = 10;
            } else if (options?.select == "top-left") {
                x = y = 10;
            } else if (options?.select == "top-right") {
                y = 10;
            }
            ctx.filter = "opacity(80%)";
            ctx.drawImage(data.image_logo, x, y, w, h);
            ctx.filter = "none";
            ctx.font = "8px sans-serif";
            const text = options?.input || new Date().toLocaleDateString();
            const wt = ctx.measureText(text);
            ctx.fillStyle = "#00000040";
            let xt = x+w-wt.width-2;
            if (options?.select == "bottom-left" || options?.select == "top-left") {
                xt = x-2;
            }
            ctx.fillRect(xt, y+h, wt.width+2, 12);
            ctx.fillStyle = "#ffffff";
            ctx.fillText(text, xt+1, y+h+9);
        }
    }
},
//"Remote - receive remote video stream and use that as webcam": 
"camera-15": function(canvas, data, respath, options) { 
    /*
    Receive video stream from a separate publisher, and
    deliver that as the local webcam track. It uses the
    external software described in
    https://blog.kundansingh.com/2019/12/named-stream-abstraction-for-webrtc.html
    for named stream, to subscribe to a randomly picked
    stream name, and shows a QR code for the publisher to
    start publishing to that stream using external device
    such as a mobile phone or separate laptop. The 
    subscribed stream is then played as local webcam stream.
    For testing this, copy the streams.html file from that
    project in the test directory of this project, and
    run the streams.py server on default port 8080,
    assuming this server is on default port 8000, to match
    the ports and URLs used in this function.
    */
    
    if (!data.qrcodejs_loaded && !data.qrcodejs_loading) {
        data.qrcodejs_loading = true;

        // TODO: this does not work in strict mode.
        const script = document.createElement("script");
        script.id = "qrcodejs";
        script.setAttribute("crossorigin", "anonymous");
        //script.setAttribute("src", "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js");
        script.setAttribute("src", respath + "/../ext/qrcode.min.js");
        script.setAttribute("integrity", "sha384-3zSEDfvllQohrq0PHL1fOXJuC/jSOO34H46t6UQfobFOmxE5BpjjaIJY5F2/bMnU");

        script.onload = () => {
            const str = data.stream = ("" + Math.random()).substring(2, 10);
            const url = (options?.input1 || "http://localhost:8000/test/streams.html?publish=streams/{{stream}}")
                        .replace(/\{\{stream\}\}/g, str)
            console.log("publish at", url);
            
            const div = document.createElement("div");
            div.setAttribute("style", "position: fixed; left: 0px; top: 0px; bottom: 0px; right: 0px; z-index: 2147483647; background-color: rgba(0,0,0,0.5); display: flex; flex-flow: column nowrap; justify-content: center; align-items: center;");
            const div1 = document.createElement("div");
            div1.setAttribute("style", "position: relative; background-color: white; padding: 40px; cursor: pointer;");
            const span = document.createElement("span");
            span.setAttribute("style", "background-color: white; font-size: 16px; font-family: sans-serif; padding: 4px; cursor: pointer;");
            span.setAttribute("title", "click to open this URL");
            span.innerText = url;
            div.appendChild(div1);
            div.appendChild(span);

            div.onclick = event => {
                document.body.removeChild(div);  
            };
            div1.onclick = span.onclick = event => {
                window.open(url, "_blank");  
            };
            
            document.body.appendChild(div);

            new QRCode(div1, url, {width: 128, height: 128});

            data.qrcodejs_loaded = true;
        };
        document.head.appendChild(script);
    }

    if (data.qrcodejs_loaded && !data.video) {
        const video = data.video = document.createElement("video");
        video.autoplay = true;
        video.muted = false;
        
        const str = data.stream;

        let ws_url = options?.input2 || "ws://localhost:8080/streams/{{stream}}?mode=subscribe"
                    .replace(/\{\{stream\}\}/g, str) 
        console.log("connecting to " + ws_url);

        let myid = null, pc = {};
        let ws = new WebSocket(ws_url);
        ws.onopen = () => console.log("onopen");
        ws.onclose = () => console.log("onclose");
        
        function send(message) {
            ws.send(message);
        }

        function do_peerconnection(index) {
            let p = new RTCPeerConnection();
            pc[index] = p;
            
            p.onicecandidate = function(event) {
                if (event.candidate) {
                    send(JSON.stringify({method: "NOTIFY", to: index, data: event.candidate}));
                }
            };

            p.ontrack = function(event) {
                if (video.srcObject != event.streams[0]) {
                    video.srcObject = event.streams[0];
                }
            };
            p.onremovetrack = function(event) {
                var stream = video.srcObject;
                var tracks = [].concat.call(stream.getAudioTracks(), stream.getVideoTracks());
                if (tracks.length == 0) {
                    video.srcObject = null;
                }
            };
        }
        
        function do_close(index) {
            let p = pc[index];
            delete pc[index];
            if (p) {
                p.close();
            }
        }

        ws.onmessage = (event) => {
            let request = JSON.parse(event.data);
            if (request.method == "EVENT") {
                if (request.data.type == "created") {
                    myid = request.data.id;
                } else if (request.data.type == "published") {
                    do_peerconnection(request.data.id);
                } else if (request.data.type == "unpublished") {
                    do_close(request.data.id);
                }
            } else if (request.method == "NOTIFY") {
                let p = pc[request.from];
                if (p) {
                    var data = request.data;
                    if (data.candidate) {
                        p.addIceCandidate(data && new RTCIceCandidate(data))
                            .catch(function(error) {
                                console.warn("failed to receive candidate: " + error);
                            });
                    } else if (data.type == "offer") {
                        p.setRemoteDescription(new RTCSessionDescription(data))
                            .then(function() {
                                return p.createAnswer();
                            })
                            .then(function(answer) {
                                return p.setLocalDescription(answer);
                            })
                            .then(function() {
                                send(JSON.stringify({method: "NOTIFY", to: request.from, data: p.localDescription}));
                            })
                            .catch(function(error) {
                                console.warn("failed to receive offer: " + error);
                            });
                    } else if (data.type == "answer") {
                        p.setRemoteDescription(new RTCSessionDescription(data))
                            .catch(function(error) {
                                console.warn("failed to receive answer: " + error);
                            });
                    }
                }
            }

        };
    }

    const video = data.video;
    if (video && video.videoWidth && video.videoHeight) {
        const W = video.videoWidth;
        const H = video.videoHeight;
        if (canvas.width != W) {
            canvas.width = W;
        }
        if (canvas.height != H) {
            canvas.height = H;
        }

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);
    } else {
        if (canvas.width != 320) {
            canvas.width = 320;
        }
        if (canvas.height != 240) {
            canvas.height = 240;
        }
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 320, 240);
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "30px Arial";
        ctx.fillText("Waiting...", 160, 120);
    }
},
};


functions.screencapture = {
//"Screen - show overlay text on top of screen video": 
"screen-01": function(canvas, screen, controls, options) {
    /* Show a text overlay using controls variable. */
    if (screen.videoWidth && screen.videoHeight) {
        const W = canvas.width = screen.videoWidth;
        const H = canvas.height = screen.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.save();
        ctx.drawImage(screen, 0, 0);
        const text = controls?.get("overlay") || options?.input || "\u00A9 Kundan Singh";
        Object.assign(ctx, {font: "24px sans-serif", fillStyle: "#ffffff80", shadowColor: "#00000080", shadowBlur: 7, lineWidth: 1, textAlign: "right", textBaseline: "top"});
        let x = W-10, y = 10;
        if (options?.select == "bottom-left" || options?.select == "bottom-right") {
            y = H-10;
            ctx.textBaseline = "bottom";
        }
        if (options?.select == "top-left" || options?.select == "bottom-left") {
            x = 10;
            ctx.textAlign = "left";
        }
        ctx.strokeText(text, x, y);
        Object.assign(ctx, {fillStyle: "white"});
        ctx.fillText(text, x, y);
        ctx.restore();
    }
},
//"Screen - show logo and text at the bottom right corner of screen video": 
"screen-02": function(canvas, screen, data, respath, options) {
    /*
    Show a tiny logo and text on screen share video on the
    bottom right corner. The logo file and text are
    pre-configured.
    */
    if (!data.image_logo || data.image_logo.src.startsWith("data:") && options?.file?.[0].dataurl && data.image_logo.src !== options?.file?.[0].dataurl) {
        const image = data.image_logo = document.createElement("img");
        image.crossOrigin = "anonymous";
        image.src = options?.file?.[0].dataurl || respath + "/favicon.png";
        image.onerror = error => console.log("cannot load image", error);
    }

    if (screen.videoWidth && screen.videoHeight) {
        canvas.width = screen.videoWidth;
        canvas.height = screen.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(screen, 0, 0);
        const image = data.image_logo;
        if (image && image.naturalWidth && image.naturalHeight) {
            const w_ = canvas.width * 0.1, h_ = canvas.height * 0.1;
            const W = image.naturalWidth, H = image.naturalHeight;
            const s = Math.min(2, Math.max(w_ / W, h_ / H));
            const w = W * s, h = H * s;
            let x = canvas.width - w - 10, y = canvas.height - h - 10 - 10;
            if (options?.select == "bottom-left") {
                x = 10;
            } else if (options?.select == "top-left") {
                x = y = 10;
            } else if (options?.select == "top-right") {
                y = 10;
            }
            ctx.filter = "opacity(80%)";
            ctx.drawImage(data.image_logo, x, y, w, h);
            ctx.filter = "none";
            ctx.font = "8px sans-serif";
            const text = new Date().toLocaleDateString();
            const wt = ctx.measureText(text);
            ctx.fillStyle = "#00000040";
            let xt = x+w-wt.width-2;
            if (options?.select == "bottom-left" || options?.select == "top-left") {
                xt = x-2;
            }
            ctx.fillRect(xt, y+h, wt.width+2, 12);
            ctx.fillStyle = "#ffffff";
            ctx.fillText(text, xt+1, y+h+9);
        }
    }
},
//"Screen - pixelate screen share for privacy of text": 
"screen-03": function(canvas, screen, data) {
    /*
    Pixelate captured screen using an intermediate canvas
    that avoids smoothing. Default pixelation size is 4.
    increase this to make more blocking pixelation.
    */
    if (!data.canvas) {
        data.canvas = document.createElement("canvas");
    }

    if (screen.videoWidth && screen.videoHeight) {
        const W = canvas.width = screen.videoWidth;
        const H = canvas.height = screen.videoHeight;
        let pixels = 4;
        const w = data.canvas.width = Math.floor(W/pixels);
        const h = data.canvas.height = Math.floor(H/pixels);

        const ctx2 = data.canvas.getContext("2d");
        ctx2.drawImage(screen, 0, 0, W, H, 0, 0, w, h);

        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(data.canvas, 0, 0, w, h, 0, 0, W, H);
    }
},
//"Screen - show screen share with picture-in-picture of webcam": 
"screen-04": function(canvas, screen, video, data, options) {
    /*
    Use the webcam video in picture-in-picture mode at
    bottom left corner of the screen share video. The webcam
    video is in a circle with diameter 1/4th the smaller of
    height or width of the screen video.
    */
    const ctx = canvas.getContext("2d");
    let W = screen.videoWidth, H = screen.videoHeight;
    if (W && H) {
        canvas.width = W;
        canvas.height = H;
        ctx.drawImage(screen, 0, 0, W, H);
    } else { // assume some size
        W = canvas.width = 1280;
        H = canvas.height = 720;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "64px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText("Loading...", W/2, H/2);
    }

    if (!data.canvas) {
        data.canvas = document.createElement("canvas");
    }

    if (data.width != W || data.height != H) {
        const d = data.diameter = Math.round(Math.min(W, H) / 4);
        data.canvas.width = data.width = d;
        data.canvas.height = data.height = d;
    }

    const w = video.videoWidth, h = video.videoHeight;
    if (w && h) {
        const d = data.diameter;
        //console.log(r, W, H);
        const ctx2 = data.canvas.getContext("2d");
        ctx2.clearRect(0, 0, d, d);
        ctx2.beginPath();
        ctx2.arc(d/2, d/2, d/2, 0, Math.PI*2);
        ctx2.closePath();
        ctx2.clip();
        
        const r = w/h;
        const s = Math.min(w, h);
        const dx = Math.max(Math.round(w/2 - h/2), 0);
        const dy = Math.max(0, Math.round(h/2 - w/2));

        ctx2.drawImage(video, dx, dy, s, s, 0, 0, d, d);
        let px = 4, py = H - d - 4;
        if (options?.select == "bottom-right" || options?.select == "top-right") {
            px = W - d - 4;
        }
        if (options?.select == "top-left" || options?.select == "top-right") {
            py = 4;
        }
        ctx.drawImage(data.canvas, 0, 0, d, d, px, py, d, d);
    }
},
//"Screen - share two apps in the same stream": 
"screen-05": function(canvas, screen1, screen2) {
    /*
    Capture two apps to share, and create a combined
    video containing both the apps video. The videos
    may be arranged horizontally or vertically depending
    on the sizes of those app windows.
    */
    
    const ctx = canvas.getContext("2d");

    const W1 = screen1.videoWidth, H1 = screen1.videoHeight;
    const W2 = screen2.videoWidth, H2 = screen2.videoHeight;

    ctx.save();
    if (W1 && H1 && W2 && H2) {
        const r1 = (W1 + W2 + 3)/Math.max(H1+2, H2+2);
        const r2 = Math.max(W1+2, W2+2)/(H1 + H2 + 3);
        const r = 4/3; // ideal
        let W, H;
        if (r1/r <= r/r2) {
            W = W1 + W2 + 3;
            H = Math.max(H1+2, H2+2);
        } else {
            W = Math.max(W1+2, W2+2);
            H = H1 + H2 + 3;
        }
        if (canvas.width != W) {
            canvas.width = W;
        }
        if (canvas.height != H) {
            canvas.height = H;
        }
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, W, H);
        if (r1/r <= r/r2) {
            ctx.drawImage(screen1, 1,  H/2-H1/2);
            ctx.drawImage(screen2, W1+2, H/2-H2/2);
        } else {
            ctx.drawImage(screen1, W/2-W1/2, 1);
            ctx.drawImage(screen2, W/2-W2/2, H1+2);
        }
    } else if (W1 && H1) {
        canvas.width = W1;
        canvas.height = H1;
        ctx.drawImage(screen1, 0, 0);
    } else if (W2 && H2) {
        canvas.width = W2;
        canvas.height = H2;
        ctx.drawImage(screen2, 0, 0);
    }
    ctx.restore();
},
//"Screen - subset rectangle selection for screen share": 
"screen-06": function(canvas, screen, data) {
    /* 
    Prompt to select for screen or window share, and then
    allow drag-select a subset rectangle from the captured
    video to actually share. The position and size of the
    subset rectangle remains fixed, so apps or windows can
    be moved in or out of that area.
    */
    
    const W = screen.videoWidth, H = screen.videoHeight;
    if (!data.canvas && W && H) {
        data.state = "idle";
        const div = document.createElement("div");
        div.setAttribute("style", "position: fixed; z-index: 2147483647; top: 0px; bottom: 0px; left: 0px; right: 0px;");

        const f = 0.75;
        const w0 = innerWidth*f, h0 = innerHeight*f;
        const r0 = w0/h0, r = W/H;
        const b = 4, g=40;
        const scale = r >= r0 ? w0/W : h0/H;
        const w = Math.round(r >= r0 ? w0 : h0*r);
        const h = Math.round(r >= r0 ? w0/r : h0);
        const x = Math.round(innerWidth/2-w/2); 
        const y = Math.round(innerHeight/2-h/2);
        
        const c = data.canvas = document.createElement("canvas");
        c.width = W;
        c.height = H;
        c.setAttribute("style", `position: absolute; top: ${y}px; left: ${x}px; width: ${w}px; height: ${h}px; pointer-events: none;`);
        
        div.appendChild(c);
        
        const sel = document.createElement("div");
        sel.setAttribute("style", `position: absolute; top: ${y-b+g}px; left: ${x-b+g}px; width: ${w-2*g}px; height: ${h-2*g}px; border: solid 4px red; background-color: rgba(255,255,255,0.1); box-shadow: 0 0 0 ${Math.max(innerWidth, innerHeight)}px rgba(0,0,0,0.5); box-sizing: content-box; resize: both; overflow: auto; cursor: grab;`);

        sel.onclick = event => {
            event.preventDefault();
            event.stopImmediatePropagation();
        };
        
        div.appendChild(sel);
        
        let timer = null;
        const ro = new ResizeObserver(entries => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                timer = setTimeout(() => {
                    timer = null;
                    if (sel.offsetLeft + sel.offsetWidth + b > w + x) {
                        sel.style.width = (w + x - sel.offsetLeft - b) + "px";
                    }
                    if (sel.offsetTop + sel.offsetHeight + b > h + y) {
                        sel.style.height = (h + y - sel.offsetTop - b) + "px";
                    }
                }, 200);
            }
        });
        ro.observe(sel);

        sel.onmousedown = event => { // drag
            if (event.offsetX > sel.offsetWidth - 20 && event.offsetY > sel.offsetHeight - 20) {
                return;
            }
            const start = {
                x0: event.clientX, y0: event.clientY,
                x1: sel.offsetLeft, y1: sel.offsetTop,
            };
            event.preventDefault();
            event.stopImmediatePropagation();
            div.onmousemove = ev => {
                const dx = ev.clientX - start.x0;
                const dy = ev.clientY - start.y0;
                let x2 = start.x1 + dx;
                let y2 = start.y1 + dy;

                if (y2 < y-b) {
                    y2 = y-b;
                }
                if (x2 < x-b) {
                    x2 = x-b;
                }
                if (x2+sel.offsetWidth-b > x+w) {
                    x2 = x+w-sel.offsetWidth+b;
                }
                if (y2+sel.offsetHeight-b > y+h) {
                    y2 = y+h-sel.offsetHeight+b;
                }
                sel.style.left = x2 + "px";
                sel.style.top = y2 + "px";
            };
            div.onmouseup = ev => {
                div.onmousemove = div.onmouseup = null;
                event.preventDefault();
                event.stopImmediatePropagation();
            };
        };

        const t = document.createElement("span");
        t.setAttribute("style", "position: absolute; top: 0px; left: 0px; right: 0px; pointer-events: none; color: red; font-size: 24px; text-align: center; background-color: rgba(255,255,255,0.7); font-family: sans-serif;");
        t.innerText = "Resize or drag-move selection, then click outside when done";
        div.appendChild(t);

        document.body.appendChild(div);

        div.onclick = event => { // remove selection
            ro.disconnect();
            
            const c = data.canvas;
            const left = (sel.offsetLeft + b - x)/scale;
            const top = (sel.offsetTop + b - y)/scale; 
            const width = (sel.offsetWidth-2*b)/scale;
            const height = (sel.offsetHeight-2*b)/scale;
            data.select = {left, top, width, height};
            
            div.removeChild(data.canvas);
            document.body.removeChild(div);
            data.state = "active";
            
            c.removeAttribute("style");
            c.width = W;
            c.height = H;
        };
    }

    const ctx = canvas.getContext("2d");

    if (data.canvas && W && H) {
        const ctx2 = data.canvas.getContext("2d");
        if (data.state == "idle" || data.state == "selecting") {
            ctx2.drawImage(screen, 0, 0, W, H);
            if (data.state == "idle") {
                data.state = "selecting";
            }
        } else if (data.state == "selecting") {
            if (canvas.width != 1280) {
                canvas.width = 1280;
            }
            if (canvas.height != 720) {
                canvas.height = 720;
            }
            ctx.clearRect(0, 0, 1280, 720);
            ctx.font = "40px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Selecting...", canvas.width/2, canvas.height/2);
        } else if (data.state == "active") {
            ctx2.drawImage(screen, 0, 0, W, H);
            const {left, top, width, height} = data.select;
            if (canvas.width != width) {
                canvas.width = width;
            }
            if (canvas.height != height) {
                canvas.height = height;
            }
            ctx.drawImage(data.canvas, left, top, width, height, 0, 0, width, height);
        }
    }   
},
//"Screen - show text overlay with auto-generated caption from mic": 
"screen-07": function(canvas, screen, data, cleanup, options) {
    /*
    Use browser's SpeechRecognition feature to show caption
    in real-time using microphone captured audio,
    on top of the screen share video. Since only one 
    speech recognition object should be active, it uses the 
    cleanup parameter to cleanup the object when canvas
    stream is cleaned up. Note that the quality of the
    built-in speech recognition is not the best. 
    */
    if (cleanup && data.rec) {
        const rec = data.rec;
        rec.onerror = rec.onend = rec.onstart = rec.onresult = null;
        rec.abort();
        data.rec = null;
        return;
    }

    if (!data.rec) {
        data.captions = [];

        const rec = data.rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        Object.assign(rec, {processLocally: true, continuous: true, lang: "en-US", interimResults: false, maxAlternatives: 1});

        let start = Date.now();

        rec.onstart = () => { error = null; start = Date.now(); };
        rec.onerror = event => { error = event.error; };
        rec.onend = event => {
            if (data.rec && error == "no-speech" || Date.now() > start + 5000) {
                rec.start();
            } else {
                data.rec = null;
            }
        };
        rec.onresult = event => {
            for (let i=event.resultIndex; i<event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    const text = event.results[i][0].transcript.trim();
                    console.log("text:", text);
                    data.captions.push({text, ts: Date.now()});
                }
            }
        }

        rec.start();
    }

    const W = screen.videoWidth, H = screen.videoHeight;
    if (W && H) {
        if (canvas.width != W) { canvas.width = W; }
        if (canvas.height != H) { canvas.height = H; }

        const ctx = canvas.getContext("2d");
        ctx.save();
        ctx.drawImage(screen, 0, 0);
        
        if (data.captions.length > 0) {
            let tx = W/2, ty, fs = 24, p = 4;
            ctx.font = `${fs}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";

            const n = data.captions.length;
            ty = H - (n-1)*(fs+2*p) - p;
            if (options?.select == "top-center") {
                ctx.textBaseline = "top";
                ty = p;
            }

            data.captions.forEach((item, i) => {
                const {text, ts} = item;
                const tw = ctx.measureText(text).width;

                ctx.fillStyle = "rgba(0,0,0,0.5)";
                if (options?.select == "top-center") {
                    ctx.fillRect(tx - tw/2 - p, ty - p, tw + 2*p, 2*p + fs);
                } else {
                    ctx.fillRect(tx - tw/2 - p, ty - fs - p, tw + 2*p, 2*p + fs);
                }

                ctx.fillStyle = "white";
                ctx.fillText(text, tx, ty);
                
                ty += (fs+2*p);
            });

            const now = Date.now();
            data.captions = data.captions.filter(({ts}) => now < ts + 5000);
        }

        ctx.restore();
    }
},
};


// functions.devicelist = {
// "Select only one default per category": function(devices) {
//     /*
//     Allow only one device per category, e.g., one microphone,
//     one speaker and one webcam, in the device list.
//     */
//     const found = {};
//     return devices.filter(device => {
//         if (!found[device.kind]) {
//             found[device.kind] = true;
//             return true;
//         } else {
//             return false;
//         }
//     });
// },
// "Hide all webcam videoinput devices": function(devices) {
//     /* Do not include any webcam devices, in device enumeration. */
//     return devices.filter(device => {
//         return device.kind != "videoinput";
//     })
// },
// "Hide all microphone audioinput devices": function(devices) {
//     /* Do not include any microphone devices, in device enumeration. */
//     return devices.filter(device => {
//         return device.kind != "audioinput";
//     })
// },
// "Add dummy devices in each category": function(devices) {
//     /* Add a dummy device in each catogory, e.g., dummy
//     camera, microphone and speaker. */
//     return devices.concat([
//         { deviceId: "dummy-videoinput", kind: "videoinput", label: "Dummy Camera", groundId: "dummy-devices" }, 
//         { deviceId: "dummy-audioinput", kind: "audioinput", label: "Dummy Microphone", groundId: "dummy-devices" }, 
//         { deviceId: "dummy-audiooutput", kind: "audiooutput", label: "Dummy Speaker", groundId: "dummy-devices" }
//     ]);
// },

// };



functions.mediastream = {
//"Replace captured webcam/mic stream with a video file": 
"camera-16": function(stream, context, respath, options) {
    /* Replace captured webcam/microphone stream with 
    audio/video from an external video file. It loads the
    video file in a video element from a URL, and uses
    the captureStream to return the stream of that video
    element. To ensure that the audio is not muted, 
    the video element's muted property is false, but the
    volume is set to very low, to avoid local audio
    playback. The video element is displayed in the bottom
    right corner, and played in a loop. To avoid displaying
    the video element, you can use visibility: hidden 
    style. If the video element is not present in the
    foreground, then the browser may not play the video.
    The controls on the video element can be used to seek
    forward or reverse in the timeline. */
    
    if (context == "getUserMedia") {
        [].concat(stream.getAudioTracks(), stream.getVideoTracks()).forEach(track => track.stop());

        const video = document.createElement("video");
        video.setAttribute("style", "position: fixed; bottom: 0px; right: 0px; z-index: 2147483647;");
        const src = options?.file?.length > 0 && options.file.map(f => f.dataurl || f.bloburl)[0] || (respath + "/test.mp4");
        console.log(src, options);
        Object.assign(video, {
            src: src,
            autoplay: true, muted: false, volume: 0.01,
            loop: true, controls: true
        });
        video.style.visibility = "hidden";
        document.body.appendChild(video);

        const stream2 = video.captureStream();
        stream2.addEventListener("inactive", event => {
            document.body.removeChild(video); 
        });

        return stream2;
    }
},
//"Receive remote video stream and use that as webcam and mic": 
"camera-17": function(stream, context, respath, options) {
    /* Replace captured webcam/microphone stream with 
    audio/video from third-party video feed. It uses the
    external software described in
    https://blog.kundansingh.com/2019/12/named-stream-abstraction-for-webrtc.html
    for named stream, to subscribe to a fixed stream name,
    which can be published by external device such as 
    mobile phone or separate laptop. 
    For testing this, copy the streams.html file from that
    project in the test directory of this project, and
    run the streams.py server on default port 8080,
    assuming this server is on default port 8000, to match
    the ports and URLs used in this function.
    */
    
    if (context == "getUserMedia") {
        [].concat(stream.getAudioTracks(), stream.getVideoTracks()).forEach(track => track.stop());

        return new Promise((resolve, reject) => {
            const str = "12345";
            let ws_url = (options?.input || "ws://localhost:8080/streams/{{stream}}?mode=subscribe")
                        .replace(/\{\{stream\}\}/g, str);
            console.log("connecting to " + ws_url);
            if (!options?.input) {
                console.log("publish at http://localhost:8000/test/streams.html?publish=streams/" + str)
            }

            let answer = null; // resolve or reject
            let myid = null, pc = {};
            let ws = new WebSocket(ws_url);
            ws.onopen = () => console.log("onopen");
            ws.onerror = error => console.error("ws error", error);
            ws.onclose = () => {
                console.log("onclose");
                if (!answer) {
                    answer = "reject";
                    reject("failed to connect");
                }
            };
            
            let timer = setTimeout(() => {
                if (timer) {
                    timer = null;
                    if (!answer) {
                        answer = "reject";
                        reject("timeout waiting");
                    }
                    if (ws) {
                        ws.close();
                        ws = null;
                    }
                }
            }, 30000);

            function send(message) {
                ws.send(message);
            }

            function do_peerconnection(index) {
                let p = new RTCPeerConnection();
                pc[index] = p;

                p.onicecandidate = function(event) {
                    if (event.candidate) {
                        send(JSON.stringify({method: "NOTIFY", to: index, data: event.candidate}));
                    }
                };

                p.ontrack = function(event) {
                    // should it check for two tracks?
                    answer = "resolve";
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }
                    resolve(event.streams[0]);
                };
                p.onremovetrack = function(event) {
                    var stream = video.srcObject;
                    var tracks = [].concat.call(stream.getAudioTracks(), stream.getVideoTracks());
                    if (tracks.length == 0) {
                        console.log("closing ws");
                        ws.close();
                        ws = null;
                    }
                };
            }

            function do_close(index) {
                let p = pc[index];
                delete pc[index];
                if (p) {
                    p.close();
                }
                if (ws) {
                    ws.close();
                    ws = null;
                }
            }

            ws.onmessage = (event) => {
                let request = JSON.parse(event.data);
                if (request.method == "EVENT") {
                    if (request.data.type == "created") {
                        myid = request.data.id;
                    } else if (request.data.type == "published") {
                        do_peerconnection(request.data.id);
                    } else if (request.data.type == "unpublished") {
                        do_close(request.data.id);
                    }
                } else if (request.method == "NOTIFY") {
                    let p = pc[request.from];
                    if (p) {
                        var data = request.data;
                        if (data.candidate) {
                            p.addIceCandidate(data && new RTCIceCandidate(data))
                                .catch(error => console.warn("failed to receive candidate: " + error));
                        } else if (data.type == "offer") {
                            p.setRemoteDescription(new RTCSessionDescription(data))
                                .then(() => p.createAnswer())
                                .then((answer) =>p.setLocalDescription(answer))
                                .then(() => send(JSON.stringify({method: "NOTIFY", to: request.from, data: p    .localDescription})))
                                .catch((error) => console.warn("failed to receive offer: " + error));
                        } else if (data.type == "answer") {
                            p.setRemoteDescription(new RTCSessionDescription(data))
                                .catch((error) => console.warn("failed to receive answer: " + error));
                        }
                    }
                }

            };
        });
    }
},
};

// functions.usermedia = {
// "Remove audio constraints to avoid microphone capture": function(constraints) {
//     /* Remove microphone capture from the constraints, 
//     to avoid sound capture. */
//     if (constraints && constraints.audio) {
//         delete constraints.audio;
//     }
// },
// "Set minimum capture frame rate of 15": function(constraints) {
//     /* Set the minimum frame rate of 15fps, if the video
//     constraints is set, and has frame rate configured. */
//     if (constraints && constraints.video && constraints.video.frameRate) {
//         if (typeof constraints.video.frameRate == "number") {
//             if (constraints.video.frameRate < 15) {
//                 constraints.video.frameRate = 15;
//             }
//         } else if (typeof constraints.video.frameRate == "object") {
//             if (constraints.video.frameRate.exact && constraints.video.frameRate.exact < 15) {
//                 constraints.video.frameRate.exact = 15;
//             }
//             if (constraints.video.frameRate.min && constraints.video.frameRate.min < 15) {
//                 constraints.video.frameRate.min = 15;
//             }
//             if (constraints.video.frameRate.max && constraints.video.frameRate.max < 15) {
//                 constraints.video.frameRate.max = 15;
//             }
//         }
//     }
// },
// "Select a specific webcam to capture": async function(constraints) {
//     /* Set the minimum frame rate of 15fps, if the video
//     constraints is set, and has frame rate configured.
//     This won't work in strict mode since it accesses 
//     the global navigator object. */
//     if (constraints && constraints.video) {
//         const devices = await navigator.mediaDevices.enumerateDevices();
//         const selected = devices.find(device => device.kind == "videoinput" && device.label?.startsWith("CamTwist"));
//         if (selected) {
//             if (typeof constraints.video == "boolean") {
//                 constraints.video = {};
//             }
//             constraints.video.deviceId = {exact: selected.deviceId};
//         }
//     }
// },
// };

for (var attr in functions) {
    functions[attr] = Object.freeze(functions[attr]);
}
Object.freeze(functions);
