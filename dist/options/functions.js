// RTC Helper (c) 2025, Kundan Singh (theintencity@gmail.com)

const functions = {};

functions.videocapture = {
"No operation - do not generate any frames": function(canvas) {
    /*
    Do not do anything, and do not generate any frames.
    This causes the video to not load the first frame.
    */
},
"Camera - show video from the default webcam": function(canvas, video) {
    /* Show video from the default webcam */
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
},
"Timer - show sub-second digital timer": function(canvas, data) {
    /*
    Show a digital timer count up in fractional seconds.
    Black background with white text in the center is
    used to display the timer.
    */
    const {start} = data;
    const ctx = canvas.getContext("2d");
    const diff = Date.now() - start;
    let text = "" + Math.floor(diff / 1000) + "." + (Math.floor(diff / 100) % 10);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    const min = Math.min(canvas.width, canvas.height);
    ctx.font = (min > 100 ? 24 : (min / 4)) + "px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width/2, canvas.height/2, canvas.width);
},
"Color - show solid black color as video feed": function(canvas, data) {
    /* Show solid black color in place of video image. */
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
},
"Color - show random color as video feed": function(canvas, data) {
    /* Show solid random color in place of video image. */
    const ctx = canvas.getContext("2d");
    if (!data.color) {
        ctx.fillStyle = data.color = "rgb(" + [0,1,2].map(() => "" + Math.floor(Math.random()*256)).join(",") + ")";
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
},
"Color - show changing random color as video feed": function(canvas, data) {
    /* Show solid random color continuously changing. */
    const ctx = canvas.getContext("2d");
    if (!data.color) {
        ctx.fillStyle = data.color = "rgb(" + [0,1,2].map(() => "" + Math.floor(Math.random()*256)).join(",") + ")";
    } else {
        const match = data.color.match(/^rgb\((\d+),(\d+),(\d+)\)$/);
        const rgb = [match[1], match[2], match[3]];
        const index = Math.floor(Math.random()*3);
        const offset = Math.floor(Math.random()*17) - 8;
        let v = parseInt(rgb[index]);
        v = v + offset;
        v = v < 0 ? -v : v >= 256 ? 256*2 - 1 - v : v;
        rgb[index] = "" + ((parseInt(rgb[index]) + offset) % 256);
        rgb[index] = "" + v;
        ctx.fillStyle = data.color = "rgb(" + rgb.join(",") + ")";
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
},
"Timer - show the current time in an analog clock": function(canvas) { 
    /*
    Show an analog clock with the current time. It uses
    code from https://www.w3schools.com/graphics/canvas_clock.asp
    */
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const radius = Math.floor((Math.min(w, h) * 0.9) / 2);

    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);

    const drawFace = function(ctx, radius) {
        var grad;
        
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        grad = ctx.createRadialGradient(0, 0 ,radius * 0.95, 0, 0, radius * 1.05);
        grad.addColorStop(0, '#333');
        grad.addColorStop(0.5, 'white');
        grad.addColorStop(1, '#333');
        ctx.strokeStyle = grad;
        ctx.lineWidth = radius*0.1;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
    };
    
    const drawNumbers = function(ctx, radius) {
        var ang;
        var num;
        ctx.font = radius * 0.15 + "px arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        for(num = 1; num < 13; num++){
            ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.85);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.85);
            ctx.rotate(-ang);
        }
    };

        
    const drawHand = function(ctx, pos, length, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.moveTo(0,0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    };

    const drawTime = function(ctx, radius){
        var now = new Date();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        //hour
        hour = hour%12;
        hour = (hour*Math.PI/6)+(minute*Math.PI/(6*60))+(second*Math.PI/(360*60));
        drawHand(ctx, hour, radius*0.5, radius*0.07);
        //minute
        minute = (minute*Math.PI/30)+(second*Math.PI/(30*60));
        drawHand(ctx, minute, radius*0.8, radius*0.07);
        // second
        second = (second*Math.PI/30);
        drawHand(ctx, second, radius*0.9, radius*0.02);
    };
        
    ctx.translate(w/2, h/2);

    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius);
    ctx.translate(-w/2, -h/2);

},
"Screen - show screen or app shared as video": function(canvas, screen) {
    /* 
    Prompt to select for screen or window share,
    and use that as the video feed.
    */
    canvas.width = screen.videoWidth;
    canvas.height = screen.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(screen, 0, 0, canvas.width, canvas.height);
},
"Screen - show screen share with picture-in-picture of webcam": function(canvas, screen, video) {
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
            const dy = 4, dx = W - dw - 4;
            ctx.drawImage(video, dx, dy, dw, dh);
        }
    } else {
        ctx.drawImage(video, 0, 0, w, h);
    }
},
"Camera - show combined feed from two webcams": function(canvas, videos) {
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
"File - show randomly selected image as video": function(canvas, respath, data) {
    /*
    Use randomly selected pre-configured image as video feed. The image location is assumed
    to be at respath (resource path) and file names are of type (alice|bob)[123].jpg, e.g., bob2.jpg.
    This is useful for capturing screenshots for demonstrations and tutorials.
    */
    if (!data.image) {
        data.image = document.createElement("img");
        // TODO: pass ext url from extension actually.
        data.image.src = respath + "/" + ["alice", "bob"][Math.floor(Math.random()*2)] + Math.floor(1+Math.random() * 3) + ".jpg";
    }
    if (data.image && data.image.naturalWidth && data.image.naturalHeight) {
        const ctx = canvas.getContext("2d");
        canvas.width = data.image.naturalWidth;
        canvas.height = data.image.naturalHeight;
        ctx.drawImage(data.image, 0, 0);
    }
},
"File - upload image files and rotate them as video feed": async function(canvas, data, upload) {
    /*
    Allow click to upload one or more image files, and show them as video feed. The image files
    are rotated every 5 seconds. Only jpeg and png files are allowed. A label to click-to-open
    is shown until the file upload is completed.
    */
    if (!data.files) {
        const ctx = canvas.getContext("2d");
        ctx.font = "24px sans-serif";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 7;
        //ctx.lineWidth=5;
        const text = "Click to Open";
        const metrics = ctx.measureText(text);
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        const files = await upload(data, "image/jpeg, image/png");
        if (files && files.length > 0) {
            data.files = [].slice.apply(files);
            data.index = 0;
            data.last = Date.now();
            const image = data.image = document.createElement("img");
            image.setAttribute("src", URL.createObjectURL(files[0]));
        }
    }
    if (data.image) {
        if (data.image.naturalWidth && data.image.naturalHeight) {
            const ctx = canvas.getContext("2d");
            canvas.width = data.image.naturalWidth;
            canvas.height = data.image.naturalHeight;
            ctx.drawImage(data.image, 0, 0);
        }
        if (Date.now() - data.last > 5000 && data.files.length > 1) {
            data.index = (data.index + 1) % data.files.length;
            data.last = Date.now();
            data.image.setAttribute("src", URL.createObjectURL(data.files[data.index]));
        }
    }
},
"File - show animated gif file as video feed": function(canvas, data) {
    /*
    Load a third-party gif file (Matrix animation) and use that video feed.
    The animation in the gif file is repeated in the video feed. It uses an
    external libgif-js library to parse the gif file format.
    This function does not work in strict mode, as it requires adding a third-party
    library to parse gif files.
    */
    if (!data.libgif_loaded) {
        data.libgif_loaded = true;

        // TODO: this does not work in strict mode.
        console.log("adding libgif.js");
        const script = document.createElement("script");
        script.id = "supergif";
        script.setAttribute("crossorigin", "anonymous");
        script.setAttribute("src", "https://cdn.jsdelivr.net/gh/buzzfeed/libgif-js/libgif.js");
        script.setAttribute("integrity", "sha384-03LZNMd6WgdgY7z2oKQJwAJpO2Vk2IePFIVexukUfhEaoAbm35B2mUUSoTlYpyDy");
        script.onload = () => {
            console.log("loaded libgif.js");
            const div = document.createElement("div");
            const img = data.image = document.createElement("img");
            div.appendChild(img);
            //img.src = "https://i.imgur.com/RY2vTBQ.gif";
            img.src = "https://c.tenor.com/Zco-fadJri4AAAAd/code-matrix.gif";
            img.onload = () => {
                const rub = new SuperGif({ gif: img, progressbar_height: 0 });
                rub.load(() => {
                    data.rub = rub;
                    data.index = 0;
                });
            };
        };
        document.head.appendChild(script);
    }

    if (data.rub && data.rub.get_length() > 0) {
        const ctx = canvas.getContext("2d");
        canvas.width = data.image.naturalWidth;
        canvas.height = data.image.naturalHeight;
        ctx.drawImage(data.rub.get_canvas(), 0, 0);
        const index = data.index = (data.index + 1) % data.rub.get_length();
        data.rub.move_to(index);
    }
},
"File - upload video files and share them as video feed": async function(canvas, data, upload) {
    /*
    Allow click to upload one or more mp4 video files, and show them as video feed. The files
    are shown one after another, and the video feed stops when the last selected video file
    finishes playing. Only mp4 files are allowed. A label to click-to-open
    is shown until the file upload is completed.
    */
    if (!data.files) {
        const ctx = canvas.getContext("2d");
        ctx.font = "24px sans-serif";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 7;
        //ctx.lineWidth=5;
        const text = "Click to Open";
        const metrics = ctx.measureText(text);
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        const files = await upload(data, "video/mp4");
        if (files && files.length > 0) {
            data.files = [].slice.apply(files);
            const video = data.video = document.createElement("video");
            video.setAttribute("muted", "");
            video.setAttribute("autoplay", "");
            video.setAttribute("src", URL.createObjectURL(data.files.shift()));
            video.onended = () => {
                if (data.files.length > 0) {
                    video.setAttribute("src", URL.createObjectURL(data.files.shift()));
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

// "File - upload a file and share it as video feed": function(canvas, data) {
//     if (!data.ready) {
//         const ctx = canvas.getContext("2d");
//         ctx.font = "24px sans-serif";
//         ctx.fillStyle = "white";
//         ctx.textAlign = "center";
//         ctx.textBaseline = "middle";
//         ctx.shadowColor = "black";
//         ctx.shadowBlur = 7;
//         //ctx.lineWidth=5;
//         const text = "Click to Open";
//         const metrics = ctx.measureText(text);
//         ctx.fillText(text, canvas.width / 2, canvas.height / 2);

//         if (!data.listening) {
//             data.listening = true;
//             function onclick(event) {
//                 document.removeEventListener("click", onclick);
//                 data.ready = true;

//                 var load_files = () => {
//                     const input = document.createElement("input");
//                     input.setAttribute("type",  "file");
//                     input.setAttribute("accept", "video/mp4");
//                     input.setAttribute("multiple", "");
//                     input.onchange = () => {
//                         let files = data.files = input.files;
//                         if (files && files.length > 0) {
//                             files = [].slice.apply(files);
//                             const video = data.video = document.createElement("video");
//                             video.setAttribute("muted", "");
//                             video.setAttribute("autoplay", "");
//                             video.setAttribute("src", URL.createObjectURL(files.shift()));
//                             video.onended = () => {
//                                 if (!files.length) {
//                                     load_files();
//                                 } else {
//                                     video.setAttribute("src", URL.createObjectURL(files.shift()));
//                                 }
//                             };
//                         }
//                     };
//                     try {
//                         input.click();
//                     } catch (error) {
//                         console.warn("failed to click on file input");
//                     }
//                 }
//                 load_files();
//             };
//             document.addEventListener("click", onclick);
//         }
//     } else if (data.video) {
//         const ctx = canvas.getContext("2d");
//         canvas.width = data.video.videoWidth;
//         canvas.height = data.video.videoHeight;
//         ctx.drawImage(data.video, 0, 0);
//     }
// },
// data.image_logo_loading = true;
// fetch("https://kundansingh.com/favicon.ico")
//     .then(response => response.blob())
//     .then(blob => {
//         const a = new FileReader();
//         a.onload = event => {
//             const dataurl = event.target.result;
//             const image = document.createElement("img");
//             image.onerror = error => {
//                 console.error("exception loading image", error);
//             };
//             image.onload = () => {
//                 data.image_logo = image;
//             }
//             image.src = dataurl;
//         };
//         a.readAsDataURL(blob);
//     })
//     .catch(error => {
//         console.error("exception loading image", error);
//     });
"Image - show logo and text on top of webcam video": function(canvas, video, data, respath) {
    /*
    Show a tiny logo and text on webcam video on the bottom right corner.
    The logo file and text are pre-configured.
    */
    if (!data.image_logo) {
        const image = data.image_logo = document.createElement("img");
        image.crossOrigin = "anonymous";
        image.src = "https://images.unsplash.com/photo-1626836014893-37663794dca7?fit=crop&w=160&q=80";
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
            const x = canvas.width - w - 10, y = canvas.height - h - 10 - 10;
            ctx.filter = "opacity(80%)";
            ctx.drawImage(data.image_logo, x, y, w, h);
            ctx.filter = "none";
            ctx.font = "8px sans-serif";
            const text = new Date().toLocaleDateString();
            const wt = ctx.measureText(text);
            ctx.fillStyle = "#00000040";
            ctx.fillRect(x+w-wt.width-2, y+h, wt.width+2, 12);
            ctx.fillStyle = "#ffffff";
            ctx.fillText(text, x+w-wt.width-1, y+h+9);
        }
    }
},
};


functions.screencapture = {
"Screen - show logo and text at the bottom right corner of screen video": function(canvas, screen, data) {
    /*
    Show a tiny logo and text on screen share video on the bottom right corner.
    The logo file and text are pre-configured.
    */
    if (!data.image_logo) {
        const image = data.image_logo = document.createElement("img");
        image.crossOrigin = "anonymous";
        image.src = "https://images.unsplash.com/photo-1626836014893-37663794dca7?fit=crop&w=160&q=80";
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
            const s = Math.max(w_ / W, h_ / H);
            const w = W * s, h = H * s;
            const x = canvas.width - w - 10, y = canvas.height - h - 10 - 10;
            ctx.filter = "opacity(80%)";
            ctx.drawImage(data.image_logo, x, y, w, h);
            ctx.filter = "none";
            ctx.font = "8px sans-serif";
            const text = new Date().toLocaleDateString();
            const wt = ctx.measureText(text);
            ctx.fillStyle = "#00000040";
            ctx.fillRect(x+w-wt.width-2, y+h, wt.width+2, 12);
            ctx.fillStyle = "#ffffff";
            ctx.fillText(text, x+w-wt.width-1, y+h+9);
        }
    }
},
"Screen - pixelate screen share for privacy of text": function(canvas, screen, data) {
    /*
    Pixelate captured screen using an intermediate canvas that avoids smoothing.
    Default pixelation size is 4. increase this to make more blocking pixelation.
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
"Screen - show screen share with picture-in-picture of webcam": function(canvas, screen, video, data) {
    /*
    Use the webcam video in picture-in-picture mode at bottom left corner
    of the screen share video. The webcam video is in a circle with diameter
    1/4th the smaller of height or width of the screen video.
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
        ctx.drawImage(data.canvas, 0, 0, d, d, 4, H - d - 4, d, d);
    }
},
"Screen - share two apps in the same stream": function(canvas, screen1, screen2) {
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
};


functions.devicelist = {
"Select only one default per category": function(devices) {
    /*
    Allow only one device per category, e.g., one microphone,
    one speaker and one webcam, in the device list.
    */
    const found = {};
    return devices.filter(device => {
        if (!found[device.kind]) {
            found[device.kind] = true;
            return true;
        } else {
            return false;
        }
    });
},
"Hide all webcam videoinput devices": function(devices) {
    /* Do not include any webcam devices, in device enumeration. */
    return devices.filter(device => {
        return device.kind != "videoinput";
    })
},
"Hide all microphone audioinput devices": function(devices) {
    /* Do not include any microphone devices, in device enumeration. */
    return devices.filter(device => {
        return device.kind != "audioinput";
    })
},
"Add dummy devices in each category": function(devices) {
    /* Add a dummy device in each catogory, e.g., dummy
    camera, microphone and speaker. */
    return devices.concat([
        { deviceId: "dummy-videoinput", kind: "videoinput", label: "Dummy Camera", groundId: "dummy-devices" }, 
        { deviceId: "dummy-audioinput", kind: "audioinput", label: "Dummy Microphone", groundId: "dummy-devices" }, 
        { deviceId: "dummy-audiooutput", kind: "audiooutput", label: "Dummy Speaker", groundId: "dummy-devices" }
    ]);
},

};

functions.mediastream = {
"Remove audioinput track from any captured stream": function(stream, context) {
    /* Remove any microphone/audioinput tracks from getUserMedia or 
    getDisplayMedia streams. */
    if (context == "getUserMedia" || context == "getDisplayMedia") {
        const tracks = stream.getAudioTracks();
        tracks.forEach(track => stream.removeTrack(track));
    }
},
"Replace captured webcam/mic stream with a video file": function(stream, context, respath) {
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
        Object.assign(video, {
            src: respath + "/test.mp4",
            autoplay: true, muted: false, volume: 0.01,
            loop: true, controls: true
        });
        document.body.appendChild(video);

        const stream2 = video.captureStream();
        stream2.addEventListener("inactive", event => {
            document.body.removeChild(video); 
        });

        return stream2;
    }
},
"Replace captured webcam/mic stream, but hide video file": function(stream, context, respath) {
    /* Replace captured webcam/microphone stream with 
    audio/video from an external video file. This is 
    similar to the previous example, but does not loop,
    and avoids displaying the video element. */
    
    if (context == "getUserMedia") {
        [].concat(stream.getAudioTracks(), stream.getVideoTracks()).forEach(track => track.stop());

        const video = document.createElement("video");
        video.setAttribute("style", "position: fixed; top: 0px; left: 0px; visibility: hidden;");
        Object.assign(video, {
            src: respath + "/test.mp4",
            autoplay: true, muted: false, volume: 0.01,
            loop: false,
        });
        document.body.appendChild(video);

        const stream2 = video.captureStream();
        stream2.addEventListener("inactive", event => {
            document.body.removeChild(video); 
        });

        return stream2;
    }
},
"Disable/stop audio track in received media stream": function(stream, track, context) {
    /* Stop the audio track in received ontrack event.
    This will cause no audio on received stream. */

    if (context == "ontrack") {
        if (track.kind == "audio") {
            track.stop();
        }
    }
},
"Replace received media stream with an external video": function(stream, track, context, respath) {
    /* Replace a received stream with a custom stream from
    the externally loaded video source. It uses the video element
    to load an external video file. Then it uses captureStream
    to get the audio/video stream of that video. And finally
    it return this new stream, instead of the original for
    the ontrack event. This causes the received stream
    to change to the external video content. */

    if (context == "ontrack") {
        if (!stream._other) {
            const video = document.createElement("video");
            video.setAttribute("style", "position: fixed; bottom: 0px; right: 0px; z-index: 2147483647;");
            Object.assign(video, {
                src: respath + "/test.mp4",
                autoplay: true, muted: false, volume: 0.01,
                loop: true, controls: true,
            });
            document.body.appendChild(video);
    
            const stream2 = stream._other = video.captureStream();
            stream2.addEventListener("inactive", event => {
                 document.body.removeChild(video); 
            });
        }

        return {stream: stream._other, track};
    }
},
"Disable any captured stream on media or canvas element": function(stream, context) {
    /* It throws an error when captureStream is called on any
    media or canvas element. */

    if (context == "captureStream") {
        throw new Error("not implemented");
    }
},
"Show a warning text when video/canvas stream is captured": function(stream, context, source) {
    /* It uses an internal canvas to draw the text,
    and returns the captureStream of that canvas instead.
    Invoking captureStream in this customization does not
    recursively call this function. Since it checks for
    source node name, apps can bypass this by using a
    derived object from those built-in classes. To
    enforce, ignore the node name check. */

    if (context == "captureStream" && (source.nodeName == "VIDEO" || source.nodeName == "CANVAS")) {
        const canvas = source._canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 240;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, 320, 240);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "30px Arial";
        ctx.fillText("Not allowed", 160, 120);
        return canvas.captureStream(15);
    }
},
"Show a text overlay when video stream is captured": function(stream, context, source) {
    /* It uses an internal canvas to generate a video
    feed including the original video in the stream,
    and an overlay text on top. */

    if (context == "captureStream" && source.nodeName == "VIDEO") {
        const canvas = source._canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 240;

        const handler = () => {
            if (source.videoWidth && source.videoWidth != canvas.width) {
                canvas.width = source.videoWidth;
            }
            if (source.videoHeight && source.videoHeight != canvas.height) {
                canvas.height = source.videoHeight;
            }

            const ctx = canvas.getContext("2d");
            ctx.save();
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (source.videoWidth && source.videoHeight) {
                ctx.drawImage(source, 0, 0);
            }

            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.font = "16px Arial";
            ctx.fillText("Joe Smith", canvas.width/2, 4);
            ctx.restore();
        };

        let interval = setInterval(handler, 1000/15);
        stream.oninactive = event => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        };
        return canvas.captureStream(15);
    }
},
};

functions.usermedia = {
"Remove audio constraints to avoid microphone capture": function(constraints) {
    /* Remove microphone capture from the constraints, to avoid sound capture. */
    if (constraints && constraints.audio) {
        delete constraints.audio;
    }
},
"Set minimum capture frame rate of 15": function(constraints) {
    /* Set the minimum frame rate of 15fps, if the video constraints is set,
    and has frame rate configured. */
    if (constraints && constraints.video && constraints.video.frameRate) {
        if (typeof constraints.video.frameRate == "number") {
            if (constraints.video.frameRate < 15) {
                constraints.video.frameRate = 15;
            }
        } else if (typeof constraints.video.frameRate == "object") {
            if (constraints.video.frameRate.exact && constraints.video.frameRate.exact < 15) {
                constraints.video.frameRate.exact = 15;
            }
            if (constraints.video.frameRate.min && constraints.video.frameRate.min < 15) {
                constraints.video.frameRate.min = 15;
            }
            if (constraints.video.frameRate.max && constraints.video.frameRate.max < 15) {
                constraints.video.frameRate.max = 15;
            }
        }
    }
},
"Select a specific webcam to capture": async function(constraints) {
    /* Set the minimum frame rate of 15fps, if the video constraints is set,
    and has frame rate configured. This won't work in strict mode. */
    if (constraints && constraints.video) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const selected = devices.find(device => device.kind == "videoinput" && device.label?.startsWith("CamTwist"));
        if (selected) {
            if (typeof constraints.video == "boolean") {
                constraints.video = {};
            }
            constraints.video.deviceId = {exact: selected.deviceId};
        }
    }
},
};

functions.mediacodec = {
"Print the session description": function(session, context) {
    /* Print the session description (SDP) data */
    console.log(context, session);
},
"Disable video in session description": function(session, transform) {
    /* Disable any video media type in the session description (SDP) */
    const {parse, write} = transform;
    const sdp = parse(session.sdp);
    sdp.groups = [];
    if (sdp.media) {
        const vbundles = sdp.media.filter(media => media.type == "video").map(o => o.mid);
        sdp.media = sdp.media.filter(media => media.type != "video");
    }
    session.sdp = write(sdp);
},
"Include only H264 in offer session": function(session, context, transform) {
    /* 
    Modify the session description (SDP) to only allow H264 video codec.
    The related RTX formats are also adjusted based on whether the 
    associated codec was included or not in the session. This is done
    only for the createOffer response, typically for the publishing webcam
    stream.
    */
    if (context == "createOfferOnSuccess") {
        const {parse, parsePayloads, write} = transform;
        const sdp = parse(session.sdp);
        sdp.media.filter(media => media.type == "video")
            .forEach(media => {
                const rtp = Object.fromEntries(media.rtp.map(o => [o.payload, o]));
                const fmtp = Object.fromEntries(media.fmtp.map(o => [o.payload, o]));
                let types = parsePayloads(media.payloads);
                // include h264
                const h264types = types.filter(p => {
                    return !rtp[p] || rtp[p].codec.toLowerCase() == 'h264';
                });
                // include rtx for which fmtp config is h264
                const rtxtypes = types.filter(p => {
                    if (rtp[p] && rtp[p].codec.toLowerCase() == "rtx") {
                        const m = fmtp[p] && fmtp[p].config &&
                        fmtp[p].config.match(/^apt=(\d+)/);
                        if (m && m[1]) {
                            return (rtp[parseInt(m[1])].codec.toLowerCase() == 'h264');
                        }
                    }
                    return false;
                });
                types = h264types.concat(rtxtypes);

                media.rtp = media.rtp.filter(o => types.indexOf(o.payload) >= 0);
                media.fmtp = media.fmtp.filter(o => types.indexOf(o.payload) >= 0);
                media.rtcpFb = media.rtcpFb.filter(o => types.indexOf(o.payload) >= 0);
                media.payloads = parsePayloads(media.payloads)
                    .filter(p => types.indexOf(p) >= 0)
                    .map(p => "" + p).join(" ");
            });
        session.sdp = write(sdp);
    }
},
"Prefer G711 and remove G722 and ISAC in audio session": function(session, context, transform) {
    /* 
    Modify the session description (SDP) to prefer G711 (pcma and pcmu),
    and remove G722 and ISAC codecs. This is done
    only for the createOffer and createAnswer responses, and hence,
    applies to both publishing and playing audio stream.
    */
    if (context == "createOfferOnSuccess" || context == "createAnswerOnSuccess") {
        const {parse, parsePayloads, write} = transform;
        const sdp = parse(session.sdp);
        sdp.media.filter(media => media.type == "audio")
            .forEach(media => {
                // remove g711 and isac
                if (media.rtp) {
                    media.rtp = media.rtp.filter(o => {
                        const codec = o.codec.toLowerCase();
                        return !(codec == "g722" || codec == "isac");
                    });
                }
                if (media.rtp) {
                    const types = media.rtp.map(o => o.payload);
                    let payloads = parsePayloads(media.payloads)
                        .filter(p => types.indexOf(p) >= 0);

                    // re-order to prefer 0 and 8
                    if (payloads.indexOf(0) >= 0 && payloads.indexOf(8) >= 0) {
                        let r = payloads.filter(p => p !== 0 && p !== 8);
                        payloads = [0, 8].concat(r);
                    }

                    media.payloads = payloads.map(p => "" + p).join(" ");
                }
            });
        session.sdp = write(sdp);
    }
},
"Limit sender video bandwidth to 75kbps": function(context, connection) {
    /*
    Modify the session senders to limit the maximum video bitrate to 75kb/s.
    This is done only for the local description, and thus applies only to the
    video publishing stream.
    */
    if (context == "setLocalDescription") {
        setTimeout(() => {
            const senders = connection.getSenders();
            senders.filter(sender => sender.track && sender.track.kind == "video").forEach(sender => {
                const parameters = sender.getParameters();
                if (!parameters.encodings) {
                    parameters.encodings = [{}];
                }
                parameters.encodings[0].maxBitrate = 75000;
                sender.setParameters(parameters).catch(e => console.error(e));
            });
        });
    }
},
"Limit receiver bandwidth to 100kbps": function(session, context) {
    /*
    Modify the session description to limit receiving total bandwidth to 100kb/s.
    This is done only for the remote description, and thus applies only to the
    receiver side streams.
    */
    if (context == "setRemoteDescription") {
        let sdp = session.sdp;
        const as = navigator.userAgent.match(/\bfirefox\b/i) ? "TIAS" : "AS";
        const bandwidth = as == "TIAS" ? 100000 : 100;
        if (sdp.indexOf(`b=${as}:`) === -1) {
            sdp = sdp.replace(/c=IN (.*)\r\n/g, `c=IN $1\r\nb=${as}:${bandwidth}\r\n`);
        } else {
            sdp = sdp.replace(new RegExp(`b=${as}:.*\r\n`), `b=${as}:${bandwidth}\r\n`);
        }
        session.sdp = sdp;
    }
},
"Limit sender video framerate to 5 fps": function(context, connection) {
    /*
    Modify the session senders to limit the maximum frame rate to 5fps.
    This is done only for the local description, and thus applies only to the
    video publishing stream.
    */
    if (context == "setLocalDescription") {
        setTimeout(() => {
            const senders = connection.getSenders();
            senders.filter(sender => sender.track && sender.track.kind == "video").forEach(sender => {
                const parameters = sender.getParameters();
                if (!parameters.encodings) {
                    parameters.encodings = [{}];
                }
                parameters.encodings[0].maxFramerate = 1;
                sender.setParameters(parameters).catch(e => console.error(e));
            });
        });
    }
},
};

functions.mediaconnect = {
"Inject a specific reflexive and relay server": function(configuration) {
    /* Always use a specific STUN and TURN server. This is in addition to
    any application supplied configuration. */
    if (!configuration) {
        configuration = {};
    }
    if (!configuration.iceServers) {
        configuration.iceServers = [];
    }
    configuration.iceServers.push(
        {url: "stun:stun.l.google.com:19302"},
        {url: "turn:turnserver.example.org", username: "webrtc", credential: "turnpassword"}
    );
    return configuration;
},
"Force a specific media relay, and use relay policy": function(configuration) {
    /* Always use a specific TURN server, and remove all others, if 
    supplied by the application. Also force use the TURN server. */
    if (!configuration) {
        configuration = {};
    }
    configuration.iceServers = [
        {url: "turn:turnserver.example.org", username: "webrtc", credential: "turnpassword"},
    ];
    if (!configuration.iceTransportPolicy) {
        configuration.iceTransportPolicy = "relay";
    }
    return configuration;
},
"Enable proprietary constraints for DSCP": function(config, constraints) {
    /*
    Enable Google's proprietary constraints of using DSCP packet marking.
    For more information see http://www.rtcbits.com/2017/01/using-dscp-for-webrtc-packet-marking.html
    */
    if (!constraints.optional) {
        constraints.optional = [];
    }
    constraints.optional.push({googDscp: true});
},
};

functions.medianetwork = {
"Filter out host candidates with private IP addresses": function(candidate, context) {
    /* Remove host candidates with private IP addresses, if any. */
    if (candidate && candidate.type == "host" && 
        // see https://stackoverflow.com/questions/2814002/private-ip-address-identifier-in-regular-expression
        candidate.address.match(/^(10|127|169\.254|172\.1[6-9]|172\.2[0-9]|172\.3[0-1]|192\.168)\./)) {
        return null;
    } else {
        return candidate;
    }
},
"Filter out candidates with IPv6 addresses": function(candidate, context) {
    /* Remove candidates with IP version 6 addresses, if any. */
    // see https://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses
    if (candidate && 
        candidate.address.match(/^([a-f0-9:]+:+)+[a-f0-9]+$/)) {
        return null;
    } else {
        return candidate;
    }
},
"Include only a specific relay candidate and remove others": function(candidate, context) {
    /* Allow a specific TURN server candidate, and ignore all others. 
    This could force the media path to always go through that TURN server,
    but must be done together with the connection function to inject or
    limit the use of TURN servers. */
    if (candidate && candidate.type == "relay" && 
        candidate.address == "52.1.2.3") {
        return candidate;
    } else {
        return null;
    }
},
};


functions.datachannel = {
"Disable any data channel": function(context, args) {
    /* Disallow use of any data channel by throwing an error on 
    outbound data channel, and ignoring inbound data channel event. */
    if (context == "createDataChannel") {
        throw new Error("not implemented")
    } else if (context == "datachannel") {
        args.splice(0, args.length);
    }
},
"Log all messages sent and received on data channel": function(context, args) {
    /* Log all the messages sent and received on any data channel. */
    if (context == "send") {
        console.log("send", args[0]);
    } else if (context == "message") {
        console.log("received", args[0].data);
    }
},
};

functions.websocket = {
"Disable any web socket": function(context) {
    /* Disallow use of any web socket by throwing an error
    during web socket construction. */
    if (context == "preconstruct") {
        throw new Error("not implemented");
    }
},
"Log all messages sent and received on web socket": function(context, args) {
    /* Log all the messages sent and received on any web socket. */
    if (context == "send") {
        console.log("send", args[0]);
    } else if (context == "message") {
        console.log("received", args[0].data);
    }
},
"Change localhost to 127.0.0.1 in URL": function(context, args) {
    /* Change the web socket target URL host. This example changes
    localhost to 127.0.0.1. Similar technique can be used for other
    types of changes, e.g., to add an authentication parameter,
    or to force use of secure websocket URL (wss). */
    if (context == "preconstruct") {
        args[0] = args[0].replace(/\blocalhost\b/, "127.0.0.1");
    }
},
"Force close web socket after 30 seconds": function(type, context, socket, data) {
    /* Impose a 30s disconnection event on web socket. This is useful
    for emulating strict firewall rules of certain enterprises. 
    The function ensures cleanup of timer handler. */
    if (type == "event" && context == "open") {
        data.timer = setTimeout(() => {
            socket.close();
        }, 30000);
    } else if ((type == "event" || type == "method") && context == "close") {
        if (data.timer) {
            clearTimeout(data.timer);
            delete data.timer;
        }
    }
},
"Delay connection by randomized 2-10 seconds": function(type, context, data) {
    /* Delay web socket connection attempt by a random time between
    2 and 10 seconds. This is useful for emulating high connection
    setup latency in testing. */
    // do not use async here.
    if (type == "method" && context == "preconstruct") {
        return new Promise((resolve, reject) => {
            const timeout = Math.round(2000 + Math.random()*8000);
            data.timer = setTimeout(() => {
                if (data.timer) {
                    delete data.timer;
                }
                resolve();
            }, timeout);
        });
    } else if (type == "method" && context == "close") {
        if (data.timer) {
            clearTimeout(data.timer);
            delete data.timer;
        }
    }
},
"Delay send and receive by 200ms": function(type, context, args, data) {
    /* Delay data send and receive on websocket by 200 milliseconds. 
    Similar function can be used for emulating high latency network
    conditions. In case of random and variable delay, it should ensure
    in-order delivery of underlying send and receive method and event. */
    if (type == "method" && context == "preconstruct") {
        data.timers = new Set();
    } else if (type == "method" && context == "send" || type == "event" && context == "message") {
        return new Promise((resolve, reject) => {
            const timeout = 200;
            const timer = setTimeout(() => {
                if (data && data.timers) {
                    data.timers.delete(timer);
                }
                resolve();
            }, timeout);
            if (data.timers) {
                data.timers.add(timer);
            }
        });
    } else if (type == "method" && context == "close") {
        if (data.timers) {
            [...data.timers.values()].forEach(timer => {
                clearTimeout(timer);
            });
            data.timers.clear();
            delete data.timers;
        }
    }
},
};

functions.webrequest = {
"Disable any web request": function(context) {
    /* Disallow any Ajax request. Both fetch and XMLHttpRequest are blocked
    by throwing an error. */
    if (context == "fetch" || context == "send") {
        throw new Error("not allowed");
    }
},
"Log with time all web requests sent and responses received": function(context, args, data, xhr) {
    /* Log time for all Ajax requests and responses. Both fetch and
    XMLHttpRequest and their responses, including errors, are logged. */
    if (context == "fetch") {
        const init = args[1] || {};
        data.url = args[0];
        data.start = new Date();
        console.log(`${data.start.toLocaleTimeString()} ${init.method || "GET"} ${data.url}`);
    } else if (context == "fetchresponse") {
        const response = args[0];
        data.end = new Date();
        console.log(`${data.end.toLocaleTimeString()} ${response.status} ${response.statusText} ${data.url}`);
    } else if (context == "fetcherror") {
        const response = args[0];
        data.end = new Date();
        console.log(`${data.end.toLocaleTimeString()} ERROR ${response} ${data.url}`);
    } else if (context == "open") {
        data.url = args[1];
        data.method = args[0];
    } else if (context == "send") {
        data.start = new Date();
        console.log(`${data.start.toLocaleTimeString()} ${data.method} ${data.url}`);
    } else if (context == "readystatechange") {
        data.end = new Date();
        console.log(`${data.end.toLocaleTimeString()} ${xhr.status} ${data.url}`);
    }
},
"Log web request that take more than 2 seconds": function(context, args, data) {
    /* Log web requests that take more than 2 seconds to get a response or error.
    Both fetch and XMLHttpRequest are considered. */
    if (context == "open") {
        data.label = args[0] + " " + args[1];
    } else if (context == "fetch") {
        data.start = Date.now();
        data.label = ((args[1] || {}).method || "GET") + " " + args[0];
    } else if (context == "send") {
        data.start = Date.now();
    } else if (context == "fetchresponse" || context == "fetcherror" || context == "readystatechange") {
        const diff = Date.now() - data.start;
        if (diff > 2000) {
            console.warn(`${Math.round(diff/100)/10} seconds for ${data.label}`);
        }
    }
},
"Log JSON body from response received": async function(context, xhr, args) {
    /* Log the response body assuming JSON. Both fetch and XMLHttpRequest
    are considered. */
    if (context == "fetchresponse") {
        console.log("response json", await args[0].json());
    } else if (context == "readystatechange") {
        console.log("response", JSON.parse(xhr.responseText));
    }
},
"Log original, but return fake response": function(context, xhr, args) {
    /* Return a fake response, but log the original for the Ajax request.
    Both fetch and XMLHttpRequest are considered. Note that the response
    formats are different for the two cases. */
    if (context == "fetchresponse") {
        args[0].json().then(value => {
            console.log("original response", value);
        });
        args[0] = { ok: true, status: 200,
            json: async () => ({name: "value", label: "Mocked!"})
        };
    } else if (context == "readystatechange") {
        console.log("original response", xhr.responseText);
        xhr.response = JSON.stringify({name: "value", label: "Mocked!"});
    }
},
"Fake error on any web request if not completed in 2s": function(context, args, data, reject) {
    /* Return a fake timeout error on Ajax requests that are not 
    completed in 2 seconds. Both fetch and XMLHttpRequest are considered. */
    if (context == "fetch" || context == "send") {
        data.timer = setTimeout(() => {
            delete data.timer;
            console.log("should timeout now");
            reject("timed out");
        }, 2000);
    } else if (context == "fetchresponse" || context == "fetcherror" || context == "readystatechange") {
        if (data.timer) {
            clearTimeout(data.timer);
            delete data.timer;
        } else {
            args.splice(0, args.length); // will suppress
        }
    }
},
"Fake success response if error encountered": function(context, args, data, xhr, resolve) {
    /* Return a fake success response, if an error is received in Ajax. Both
    fetch and XMLHttpRequest are considered. Note that the response formats
    are different for the two cases. */
    if (context == "fetcherror") {
        resolve({ ok: true, status: 200, 
            json: async () => ({type: "error", error: args[0]})
        });
    } else if (context == "readystatechange" && xhr.status != 200) {
        xhr.status = 200;
        xhr.response = xhr.responseText = JSON.stringify({
            type: "error", error: xhr.responseText
        });
        resolve();
    }
},
"Force same-origin cors policy in all requests": function(context, args) {
    /* Set the mode of same-origin in all fetch requests. */
    if (context == "fetch") {
        if (args.length == 1) { 
            args.push({});
        }
        if (args.length > 1) {
            args[1].mode = "same-origin";
        }
    }
},
"Do not send any cookies and ignore in response": function(context, args) {
    /* Set the credentials of omit in all the fetch requests. */
    if (context == "fetch") {
        if (args.length == 1) { 
            args.push({});
        }
        if (args.length > 1) {
            args[1].credentials = "omit";
        }
    }
},
"Do not use browser cache for web requests": function(context, args) {
    /* Set the cache of no-cache in all the fetch requests. */
    if (context == "fetch") {
        if (args.length == 1) { 
            args.push({});
        }
        if (args.length > 1) {
            args[1].cache = "no-cache";
        }
    }
},
};


for (var attr in functions) {
    functions[attr] = Object.freeze(functions[attr]);
}
Object.freeze(functions);
