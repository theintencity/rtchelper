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
    Show a digital timer counting up in fractional seconds.
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
"Timer - show analog clock with time zone offset variable": function(canvas, controls, data) { 
    /*
    Show an analog clock with current time, and timezone
    offset applied from a controls variable tzoffset.
    It also sets the controls variable started_on with
    the date/time when this function is called the first
    time for a canvas. It uses code from 
    https://www.w3schools.com/graphics/canvas_clock.asp
    */
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const radius = Math.floor((Math.min(w, h) * 0.9) / 2);

    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);
    
    if (!data.started_on) {
        data.started_on = new Date(data.start).toLocaleString();
        controls.set("started_on", data.started_on);
    }

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
        var now = new Date(Date.now() + controls.get("tzoffset", 0)*60000);
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
    Use randomly selected pre-configured image as video feed.
    The image location is assumed to be at respath (resource path)
     and file names are of type (alice|bob)[123].jpg, e.g., bob2.jpg.
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
"File - show random image with brightness variable": function(canvas, respath, data, controls) {
    /*
    Use randomly selected pre-configured image as video feed, and set the selected image
    file name in the controls variable filename. The image location is assumed to be at
    respath (resource path) and file names are of the type (alice|bob)[123].jog, e.g., bob2.jpg.
    This is useful for captuing screenshots for demonstrations and tutorials.
    */

    if (!data.image) {
        data.image = document.createElement("img");
        // TODO: pass ext url from extension actually.
        const filename = ["alice", "bob"][Math.floor(Math.random()*2)] + Math.floor(1+Math.random() * 3) + ".jpg"
        data.image.src = respath + "/" + filename;
        controls.set("filename", filename);
    }
    if (data.image && data.image.naturalWidth && data.image.naturalHeight) {
        const ctx = canvas.getContext("2d");
        canvas.width = data.image.naturalWidth;
        canvas.height = data.image.naturalHeight;
        ctx.filter = `brightness(${controls.get("brightness", 100)}%)`;
        ctx.drawImage(data.image, 0, 0);
    }
},
"File - upload image files and rotate them as video feed": async function(canvas, data, upload) {
    /*
    Allow click to upload one or more image files, and show them
    as video feed. The image files are rotated every 5 seconds.
    Only jpeg and png files are allowed. A label to 
    click-to-open is shown until the file upload is completed.
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
    Load a third-party gif file (Matrix animation) and use
    that video feed. The animation in the gif file is repeated
    in the video feed. It uses an external libgif-js library 
    to parse the gif file format. This function does not work
    in strict mode, as it requires adding a third-party
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
"File - show a animated gif overlay on event": function(canvas, video, controls, data) { 
    /*
    Load a third-party gif file (Jim Carrey - Oh Come On! or
    Bob Downey Jr - frustrated) and use that as overlay. It 
    uses an external libgif-js library to parse the gif file
    format. This function does not work in strict mode, as it
    requires adding a third-party library to parse gif files.
    */
    if (!data.libgif_loaded) {
        data.libgif_loaded = true;

        console.log("adding libgif.js");
        const script = document.createElement("script");
        script.id = "supergif";
        script.setAttribute("crossorigin", "anonymous");
        script.setAttribute("src", "https://cdn.jsdelivr.net/gh/buzzfeed/libgif-js/libgif.js");
        script.setAttribute("integrity", "sha384-03LZNMd6WgdgY7z2oKQJwAJpO2Vk2IePFIVexukUfhEaoAbm35B2mUUSoTlYpyDy");
        script.onload = () => {
            console.log("loaded libgif.js");
            
            controls.on("giphy", value => {
                console.log(event);
                const div = data.div = document.createElement("div");
                const img = data.image = document.createElement("img");
                div.appendChild(img);
                
                img.src = value == "jim"
                   ? "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDV5eW11Yjl2N2Fub2Z3YmpyMzFiMnd6a29scDRlZHc3dm5oZnhkdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ilkfz8Mn5Yz7O/giphy.gif" // Jim Carrey, frustrated
                   : "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2thdmU2aHl6Nnc4MjVoYnFzMDQza3VtbDdneXZrNmZsbzZ1Mm94cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/116a8zosxwA0SI/giphy.gif"; // Bob Downey Jr, frustrated

                img.onload = () => {
                    const rub = new SuperGif({ gif: img, progressbar_height: 0 });
                    rub.load(() => {
                        data.rub = rub;
                        data.index = 0;
                    });
                };
            });

        };
        document.head.appendChild(script);
    }

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (data.rub && data.rub.get_length() > 0) {
        // scale image to bottom-right
        let size = Math.min(canvas.width, canvas.height) / 2;
        
        ctx.drawImage(data.rub.get_canvas(), 0, 0, data.image.naturalWidth, data.image.naturalHeight, video.videoWidth-size, video.videoHeight-size, size, size);
        data.index += 1;
        if (data.index >= data.rub.get_length()) {
            // cleanup
            data.rub = null;
            data.div = null;
        }
    }
},
"File - upload video files and share them as video feed": async function(canvas, data, upload) {
    /*
    Allow click to upload one or more mp4 video files, and
    show them as video feed. The files are shown one after
    another, and the video feed stops when the last selected
    video file finishes playing. Only mp4 files are allowed.
    A label to click-to-open is shown until the file upload
    is completed.
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
"Mediapipe - blur background on webcam video": async function(canvas, video, data, segment) {
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
"Mediapipe - blur and hide background on webcam video": async function(canvas, video, data, segment) {
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
"Mediapipe - blur and hide foreground on webcam video": async function(canvas, video, data, segment) {
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
"Mediapipe - remove background on webcam video": async function(canvas, video, data, segment) {
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
"Mediapipe - show mask of foreground detection on webcam": async function(canvas, video, data, segment) {
    /*
    Using the tensorflow mediapipe library and its body
    segmentation model, show mask of the foreground. The mask
    is colored black, and background is colored white.
    */
    const W = canvas.width = video.videoWidth;
    const H = canvas.height = video.videoHeight;

    const [mask, image] = await segment(data, video);
    // alternatively, segment(data, video, "local") to avoid CDN.

    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.clearRect(0, 0, W, H);
    
    ctx.drawImage(mask, 0, 0, W, H);
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = '#000000FF';
    ctx.fillRect(0, 0, W, H);

    ctx.restore();
},
"Mediapipe - upload and show a virtual background on webcam": async function(canvas, video, data, upload, segment) {
    /*
    Using the tensorflow mediapipe library and its body
    segmentation model, show a virtual background on webcam
    video. It allows uploading one image or video file to be
    used as the background. Only the jpeg, png and mp4 files
    are allowed. A video background is looped. A label to
    click-to-open is shown until the file upload is completed.
    The background is displayed with object-fit cover style.
    */
    if (!data.files) {
        const ctx = canvas.getContext("2d");
        ctx.font = "24px sans-serif";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 7;
        const text = "Click to Open";
        const metrics = ctx.measureText(text);
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        const files = await upload(data, "image/jpeg, image/png, video/mp4");
        if (files && files.length > 0) {
            data.files = files;
            if ((files[0].type || "").startsWith("image/")) {
                const img = document.createElement("img");
                img.onerror = error => {
                    console.error("exception loading image", error);
                };
                img.onload = () => {
                    img.style.width = img.naturalWidth + "px";
                    img.style.height = img.naturalHeight + "px";
                    data.image = img;
                };
                img.src = URL.createObjectURL(files[0]);
            } else {
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
                vid.src = URL.createObjectURL(files[0]);
            }
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
"Mediapipe - show randomly changing virtual background on webcam": function(canvas, video, data, segment) {
    /*
    Using the tensorflow mediapipe library and its body
    segmentation model, show a virtual background on webcam
    video. It uses a third-party website to load the background
    image using the landscape search term. The background
    images are randomly picked and changed every 10 seconds.
    The background is displayed with object-fit cover style.
    */
    // change background every 10s
    const now = Date.now();
    if (!data.last || now - data.last > 10000) {
        data.last = now;
        // TODO: allow uploading from extension.
        // does not work anymore: fetch("https://source.unsplash.com/random/640x480/?landscape")
        fetch("https://picsum.photos/640/480")
            .then(response => response.blob())
            .then(blob => {
                const a = new FileReader();
                a.onload = event => {
                    const dataurl = event.target.result;
                    const img = document.createElement("img");
                    img.onerror = error => {
                        console.error("exception loading image", error);
                    };
                    img.onload = () => {
                        img.style.width = img.naturalWidth + "px";
                        img.style.height = img.naturalHeight + "px";
                        data.image = img;
                    }
                    img.src = dataurl;
                };
                a.readAsDataURL(blob);
            })
            .catch(error => {
                console.error("exception loading image", error);
            });
    }

    segment(data, video).then(([mask, image]) => {
        const W = canvas.width = video.videoWidth;
        const H = canvas.height = video.videoHeight;
    
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

        ctx.drawImage(image, 0, 0, W, H);
        ctx.restore();
    });
},
"Mediapipe - highlight detected faces in webcam video": async function(canvas, video, data, facedetect) {
    /*
    Using the tensorflow mediapipe library and its face
    detection model, highlight the detected faces on webcam
    video. It uses a yellow circle with line width of 4px
    centered at the detected face.

    See https://ai.google.dev/edge/mediapipe/solutions/vision/face_detector
    */
    if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    }

    const W = canvas.width, H = canvas.height;
    const ctx = canvas.getContext("2d");
    ctx.save();
    
    try {
        const [detections, image] = await facedetect(data, video);
        // alternatively, facedetect(data, video, "local") to avoid CDN.
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(image, 0, 0, W, H);
        detections.forEach(detection => {
            const v = detection.boundingBox;
            const x = Math.round(v.xCenter*W),
                y = Math.round(v.yCenter*H),
                w = Math.round(v.width*W),
                h = Math.round(v.height*H);
            const cx = x, cy = Math.round(y - h*1/3),
                r = Math.round(Math.max(w, h)*7/8);
            ctx.beginPath();
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = "4";
            ctx.arc(cx, cy, r, 0, 2*Math.PI);
            ctx.stroke();
        });
    } catch (error) {
        ctx.drawImage(video, 0, 0, W, H);
    }

    ctx.restore();
},
"Mediapipe - zoom and pan on detected face in webcam video": function(canvas, video, data, facedetect) {
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
"Mediapipe - show screen share with face zoomed webcam video": function(canvas, screen, video, data, facedetect) {
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
            ctx.arc(W - V/8 - 4, H - V/8 - 4, V/8, 0, 2*Math.PI);
            ctx.fill();

            ctx.globalCompositeOperation = 'source-in';

            ctx.filter = !data.dtime || now - data.dtime >= 10000 ? "blur(8px)" : "none";

            const x1 = data.pos.cx, y1 = data.pos.cy, r1 = data.pos.r;
            const d = Math.round(Math.min(VV, 2*r1));
            const x = Math.round(Math.max(0, Math.min(VW-d, x1 - d/2)));
            const y = Math.round(Math.max(0, Math.min(VH-d, y1 - d/2)));

            ctx.drawImage(video, x, y, d, d, W - V/4 - 4, H - V/4 - 4, V/4, V/4);
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
"Mediapipe - show screen share with background removed webcam video": async function(canvas, video, screen, data, segment) {
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

        ctx.drawImage(data.canvas, 0, 0, w, h, 4, H-h0-4, w0, h0);
        ctx.restore();
    } else {
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(video, 0, 0, w, h);
    }
},
"Image - show logo and text on top of webcam video": function(canvas, video, data, respath) {
    /*
    Show a tiny logo and text on webcam video on the bottom
    right corner. The logo file and text are pre-configured.
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
"Remote - receive remote video stream and use that as webcam": function(canvas, data) { 
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
        script.setAttribute("src", "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js");
        script.setAttribute("integrity", "sha384-3zSEDfvllQohrq0PHL1fOXJuC/jSOO34H46t6UQfobFOmxE5BpjjaIJY5F2/bMnU");

        script.onload = () => {
            const str = data.stream = ("" + Math.random()).substring(2, 10);
            const url = "http://localhost:8000/test/streams.html?publish=streams/" + str;
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

        let ws_url = "ws://localhost:8080/streams/" + str + "?mode=subscribe";
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
"Screen - show overlay text on top of screen video": function(canvas, screen, controls) {
    /* Show a text overlay using controls variable. */
    if (screen.videoWidth && screen.videoHeight) {
        const W = canvas.width = screen.videoWidth;
        const H = canvas.height = screen.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.save();
        ctx.drawImage(screen, 0, 0);
        const text = controls.get("overlay") || "\u00A9 Kundan Singh";
        Object.assign(ctx, {font: "24px sans-serif", fillStyle: "#ffffff80", shadowColor: "#00000080", shadowBlur: 7, lineWidth: 1, textAlign: "right", textBaseline: "top"});
        ctx.strokeText(text, W-10, 10);
        Object.assign(ctx, {fillStyle: "white"});
        ctx.fillText(text, W-10, 10);
        ctx.restore();
    }
},
"Screen - show logo and text at the bottom right corner of screen video": function(canvas, screen, data) {
    /*
    Show a tiny logo and text on screen share video on the
    bottom right corner. The logo file and text are
    pre-configured.
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
"Screen - log if there are significant change": function(canvas, screen, data) {
    /*
    Log if the shared screen or window has changed,
    e.g., indicating a slide change. This is done by capturing
    pixels every second, and comparing the diff.
    */
    const W = screen.videoWidth, H = screen.videoHeight;
    const ctx = canvas.getContext("2d");

    if (W && H) {
        canvas.width = W; canvas.height = H;
        ctx.drawImage(screen, 0, 0);
    }
    
    const now = Date.now();
    if (W && H && (!data.last || now >= data.last + 1000)) {
        data.last = now;
        const image = ctx.getImageData(0, 0, W, H);
        if (data.image) {
            const oldp = data.image.data, newp = image.data;
            if (oldp.length != newp.length ||
                oldp.map((o,i) => Math.abs(o - newp[i])).reduce((s,a) => s+a, 0) > W*H*4*0.0001) {
                console.log("changed");
            }
        }
        data.image = image;
    }
},
"Screen - pixelate screen share for privacy of text": function(canvas, screen, data) {
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
"Screen - show screen share with picture-in-picture of webcam": function(canvas, screen, video, data) {
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
"Screen - subset rectangle selection for screen share": function(canvas, screen, data) {
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
"Screen - show text overlay with auto-generated caption from mic": function(canvas, screen, data, cleanup) {
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

            data.captions.forEach((item, i) => {
                const {text, ts} = item;
                const tw = ctx.measureText(text).width;

                ctx.fillStyle = "rgba(0,0,0,0.5)";
                ctx.fillRect(tx - tw/2 - p, ty - fs - p, tw + 2*p, 2*p + fs);

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


functions.mediarecord = {
"Record all playing videos side-by-side": function(canvas, videos, states) {
    /* 
    Combine all playing videos side-by-side zooming at 
    the center in a wide video.
    */
    const W = canvas.width = 640;
    const H = canvas.height = 360;

    videos = videos.filter((video, index) => {
        return video.offsetWidth && video.offsetHeight && video.videoWidth && video.videoHeight && states[index] == "playing";
    });

    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.clearRect(0, 0, W, H);

    if (videos.length > 0) {
        const dw = Math.round(W / videos.length), dh = H;
        videos.forEach((video, index) => {
            const sh = video.videoHeight, vw = video.videoWidth;
            const sw = Math.round(sh*dw/dh);
            const dx = index * dw, dy = 0;
            const sx = Math.round(vw/2 - sw/2), sy = 0;
            
            ctx.drawImage(video, sx, sy, sw, sh, dx, dy, dw, dh); 
        });
    }

    ctx.restore();
},
"Record all videos even if empty in an NxN layout": function(canvas, videos) {
    /*
    Include all the videos in an NxN layout. Even if the video
    is not showing, it is included in the layout. The layout
    size is determined by the next NxN that can fit the
    number of videos. For example, if there are 10 videos,
    then N is 4, in a 4x4=16 layout. Other slots remain empty. 

    The recording layout is scaled to fit in 640x480 size.
    The videos are scaled to fit in 4:3 aspect ratio, without
    maintaining their original aspect ratio.
    */
    const ctx = canvas.getContext("2d");
    const W = canvas.width = 640;
    const H = canvas.height = 480;
    ctx.clearRect(0, 0, W, H);
    if (videos.length > 0) {
        const N = Math.ceil(Math.sqrt(videos.length));
        const w = W / N, h = H / N;
        let x = 0, y = 0;
        const P = videos.map((video, index) => {
            const p = {x, y, w, h};
            if ((index + 1) % N === 0) {
                y += h;
                x = 0;
            } else {
                x += w;
            }
            return p;
        });
        const L = P[videos.length-1];
        const y0 = H/2 - (L.y+L.h)/2
        const xn = W/2 - (videos.length % N) * w/2;
        P.forEach((p, index) => {
            p.y += y0;
            if (index >= videos.length - (videos.length % N)) {
                p.x += xn;
            }
        });

        P.forEach((p, index) => {
            const video = videos[index];
            ctx.drawImage(video, p.x, p.y, p.w, p.h);
        });
    }
},
"Record all videos in their original layout, enabling mp4 download": function(canvas, videos, data, getstyle) {
    /*
    Include all the videos in their original relative position
    on the web page. The layout of the videos in recording
    is calculated based on the relative positions and sizes
    of videos as they appear on the page. When their positions
    and sizes change, the recording layout is also updated.
    The recording layout is scaled to fit in 640x480 size.

    Each video element's object-fit style of cover or contain
    is honored in the layout. A background color of gray and
    dark gray is used for empty space and non-playing videos. 

    Additionally, the content type is configured to allow
    conversion to and download in mp4 format.
    */
    if (!data.mimeType) {
        // this is needed for conversion to mp4 in the browser
        data.mimeType = 'video/webm; codecs="h264,pcm"';
    }

    videos = videos.filter(video => {
        return video.offsetWidth && video.offsetHeight && video.offsetParent !== null;
    });

    //element.getBoundingClientRect().top + document.documentElement.scrollTop
    const ctx = canvas.getContext("2d");
    const W = canvas.width = 640;
    const H = canvas.height = 480;
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, W, H);

    if (videos.length > 0) {
        const P = videos.map(video => {
            const rect = video.getBoundingClientRect();
            // add document.documentElement.scrollLeft,scrollTop of actual position.
            return { x: rect.left, y: rect.top, w: rect.width, h: rect.height };
        });
        const x0 = P.reduce((s, o) => Math.min(s, o.x), Infinity);
        const x1 = P.reduce((s, o) => Math.max(s, o.x+o.w), -Infinity);
        const y0 = P.reduce((s, o) => Math.min(s, o.y), Infinity);
        const y1 = P.reduce((s, o) => Math.max(s, o.y+o.h), -Infinity);
        const w = x1 - x0, h = y1 - y0;
        const r = w / h;
        const R = W / H;
        const s = r >= R ? W / w : H / h;
        const x_ = r >= R ? 0 : W/2 - H*r/2;
        const y_ = r >= R ? H/2 - W/(2*r) : 0;

        const Q = P.map((p, index) => {
            const x = (p.x - x0) * s + x_, y = (p.y - y0) * s + y_;
            const w = p.w * s, h = p.h * s;
            const video = videos[index];
            const style = getstyle(video);

            let sx = 0, sy = 0, sw = video.videoWidth, sh = video.videoHeight;
            if (sw && sh) {
                const r0 = sw / sh;
                const r1 = w/h;
                if (style.getPropertyValue("object-fit") == "cover" && r0 >= r1 
                    || style.getPropertyValue("object-fit") != "cover" && r0 <= r1) {
                    sx = sw/2-r1*sh/2;
                    sw = r1*sh;
                } else {
                    sy = sh/2-sw/(2*r1);
                    sh = sw/r1;
                }
            }
            
            return {x, y, w, h, sx, sy, sw, sh};
        });
        
        // order based on size, largest to smallest
        const sizes = Q.map(p => p.w * p.h);
        const order = [...Array(sizes.length).keys()].sort((i, j) => {
            return sizes[j] - sizes[i];
        });

        order.forEach(index => {
            const video = videos[index];
            const {x, y, w, h, sx, sy, sw, sh} = Q[index];
            if (sw && sh) {
                ctx.drawImage(video, Math.round(sx), Math.round(sy), Math.round(sw), Math.round(sh), Math.round(x), Math.round(y), Math.round(w), Math.round(h));
            } else {
                ctx.fillStyle = "#404040";
                ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
            }
        });
    }
},
"Record all playing videos in a smarter layout": function(canvas, videos, states) {
    /*
    Include only the playing videos in a layout that attempts
    to reduce the empty space. This layout idea is borrowed
    from an earlier videocity project.
    https://github.com/theintencity/videocity

    The recording layout is scaled to fit in 640x480 size.
    Each video is assumed to have object-fit of cover.
    */
    videos = videos.filter((video, index) => {
        return video.offsetWidth && video.offsetHeight && video.videoWidth && video.videoHeight && states[index] == "playing";
    });

    const ctx = canvas.getContext("2d");
    const W = canvas.width = 640;
    const H = canvas.height = 480;

    ctx.clearRect(0, 0, W, H);
    if (videos.length > 0) {
        const N = Math.ceil(Math.sqrt(videos.length));
        const w = W / N, h = H / N;
        let x = 0, y = 0;
        const P = videos.map((video, index) => {
            const p = {x, y, w, h};
            if ((index + 1) % N === 0) {
                y += h;
                x = 0;
            } else {
                x += w;
            }
            return p;
        });
        const L = P[videos.length-1];
        const y0 = H/2 - (L.y+L.h)/2
        const xn = W/2 - (videos.length % N) * w/2;
        P.forEach((p, index) => {
            p.y += y0;
            if (index >= videos.length - (videos.length % N)) {
                p.x += xn;
            }
            const video = videos[index];
            const r0 = video.videoWidth/video.videoHeight;
            const r1 = p.w/p.h;
            const q = {sx: 0, sy: 0, sw: video.videoWidth, sh: video.videoHeight};
            if (r0 >= r1) {
                q.sx = q.sw/2-r1*q.sh/2;
                q.sw = r1*q.sh;
            } else {
                q.sy = q.sh/2-q.sw/(2*r1);
                q.sh = q.sw/r1;
            }
            Object.assign(p, q);
        });

        P.map((p, index) => {
            const q = {
                x: Math.round(p.x), y: Math.round(p.y), w: Math.round(p.w), h: Math.round(p.h),
                sx: Math.round(p.sx), sy: Math.round(p.sy), sw: Math.round(p.sw), sh: Math.round(p.sh),
            };
            return q;
        }).forEach((p, index) => {
            const video = videos[index];
            ctx.drawImage(video, p.sx, p.sy, p.sw, p.sh, p.x, p.y, p.w, p.h);
        });
    }
},
"Record one video at a time, but allow selecting": function(canvas, videos, data, cleanup) {
    /* Open a popup window to allow selecting the video
    element to record. The window is closed automatically
    when recording is stopped. It uses cleanup parameter
    to close the popup window. The window appears on right
    side of the screen. It also puts a text label overlay
    on the video to indicate which video is selected, or
    a text of "Not Available" if the video content is not
    available. */

    if (cleanup) {
        if (data.win) {
            data.win.close();
            data.win = null;
        }
        return;
    }

    if (!data.win) {
        data.count = 0;
        data.selected = null;
        data.win = window.open("about:blank", "_blank", "width=100,height=320,left=" + (screen.width - 100) + ",top=10");
        data.list = [];
        data.win.onclose = () => {
            delete data.win;
        };
    }

    let change = false;
    (videos || []).forEach(v => {
        if (data.list.indexOf(v) < 0) {
            if (!v._listed) {
                v._listed = "" + (++data.count);
            }
            data.list.push(v);
            change = true;
        }
    });
    if (data.selected && videos.findIndex(v => v._listed == data.selected) < 0) {
        data.selected = null;
    }
    if (!data.selected && data.list.length > 0) {
        data.selected = data.list[0]._listed;
        change = true;
    }
    if (change) {
        const doc = data.win.document;
        const str = data.list.map(v => {
            const item = v._listed;
            return `<div><input id="video-${item}" type="radio" name="video" value="${item}" ${item == data.selected ? "checked" : ""}><label for="video-${item}">video-${item}</label>`; 
        });
        doc.body.innerHTML = `<form>${str.join("")}</form>`;
        setTimeout(() => {
            [].slice.call(doc.querySelectorAll("input")).forEach(input => {
                console.log("input", input);
                input.onclick = event => {
                    data.selected = event.currentTarget.value;
                    console.log("selected=" + data.selected);
                };
            });
        }, 200);
    }
    if (data.selected) {
        const video = videos.find(v => v._listed == data.selected);
        let W = 320, H = 240, text = "Not Available";
        if (video && video.videoWidth && video.videoHeight) {
            W = video.videoWidth;
            H = video.videoHeight;
        }
        if (canvas.width != W) {
            canvas.width = W;
        }
        if (canvas.height != H) {
            canvas.height = H;
        }
        const ctx = canvas.getContext("2d");
        ctx.save();
        if (video && video.videoWidth && video.videoHeight) {
            ctx.drawImage(video, 0, 0);
            text = "video-" + video._listed;
        } else {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, W, H);
        }
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(text, 10, 30);
        ctx.restore();
    }
},
};

functions.mediadisplay = {
"Disable controls on all media elements and set a background": function(video, data) {
    /*
    Disable built-in controls on all the audio and video
    elements, and set a gray background color.
    */
    const {state} = data;
    if (state == "added" || state == "found") {
        video.controls = false;
        video.style.setProperty("background", "grey");
    }
},
"Disable fullscreen, download, and picture-in-picture in controls": function(video, data) {
    /* 
    Disable built-in buttons for fullscreen, download and 
    picture-in-picture.
    */
    const {state} = data;
    if (state == "added" || state == "found") {
        video.setAttribute("controlsList", "nofullscreen nodownload");
        video.setAttribute("disablePictureInPicture", "");
    }
},
"Make video display in a circle shape": function(video, data) {
    /* make all videos in a circle shape with fixed size
    and black background, using CSS. */
    const {state} = data;
    if (state == "added" || state == "found") {
        video.controls = false;
        video.style.width = video.style.height = "240px";
        video.style.borderRadius = "120px";
        video.style.backgroundColor = "black";
    }
},
"Make video display transparent, if not on mouse hover": function(video, data) {
    /*  fade away video display, unless mouse hover,
    using opacity, and transition styles. */
    const {state} = data;
    if (state == "added" || state == "found") {
        video.style.opacity = 0.5;
        video.style.transition = "opacity 0.3s";
        video.onmouseover = event => { video.style.opacity = 1; };
        video.onmouseout = event => { video.style.opacity = 0.5; };
    }
},
"Assign a random image as poster": function(video, data) {
    /* Set a random image as poster on each video. */
    const {state} = data;
    if (video.nodeName == "VIDEO" && state == "added" || state == "found") {
        const w = video.offsetWidth, h = video.offsetHeight
        video.setAttribute("poster", `https://picsum.photos/${w}/${h}?r=${Math.random()}`);
    }
},
"Add a button to pause or play all videos": function(video, data, global) {
    /* 
    Show a button to pause and play all videos on the page.
    */
    const {state} = data;
    if (!global.videos) {
        global.videos = new Set();
        const button = document.createElement("button");
        button.innerText = "Pause";
        button.setAttribute("style", "position: fixed; bottom: 0px; left: 0px;");
        document.body.appendChild(button);
        button.onclick = event => {
            global.videos.forEach(video => {
                button.innerText == "Pause" ? video.pause() : video.play(); 
            });
            button.innerText = button.innerText == "Pause" ? "Play" : "Pause";
        };
    }
    if (state == "added" || state == "found") {
        global.videos.add(video);
    } else if (state == "removed" || state == "ignored") {
        global.videos.delete(video);        
    }
},
"Click to expand video to full window size": function(video, data) {
    /* Click on a video element to make it occupy full window size. */
    const {state} = data;
    if (state == "added" || state == "found") {
        const handler = data.click_handler = event => {
            event.preventDefault(); event.stopImmediatePropagation();
            if (video._full) {
                delete video._full;
                video.removeAttribute("style");
            } else {
                video._full = true;
                video.setAttribute("style", "position: fixed; left: 0px; top: 0px; right: 0px; bottom: 0px; width: 100%; height: 100%; max-width: unset; max-height: unset; background: black; z-index: 2147483647;");
            }
        };
        video.addEventListener("click", handler);
    } else if (state == "removed" || state == "ignored") {
        if (data.click_handler) {
            const handler = data.click_handler;
            delete data.click_handler;
            video.removeEventListener("click", handler);
            video.removeAttribute("style");
        }
    }
},
"Click on a video to open it in a separate window": function(video, data, open) {
    /*
    Allow click on any video element to open it in a separate
    window. The original video element on the web page is
    paused while it is playing in the separate window. When
    the separate window is closed, the one on the web page
    starts playing again. 
    
    The video element's srcObject property is used to clone
    the video stream to the separate window.
    */
    const {state} = data;
    if (state == "added" || state == "found") {
        const handler = data.click_handler = event => {
            if (!data.popup) {
                const html = `<!doctype html>
<html><head><style type="text/css">
html, body { position: absolute; width: 100%; height: 100%; padding: 0; margin: 0}
video { position: absolute; width: 100%; height: 100%; }
</style></head>
<body><video autoplay controls muted></video></body></html>
`
                const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
                const win = data.popup = open(url, "_blank", "width=640,height=480");
                win.onload = event => {
                    if (video.srcObject && video.videoWidth && video.videoHeight) {
                        win.document.querySelector("video").srcObject = video.srcObject;
                        video.pause();
                    }
                    win.onbeforeunload = event => {
                        if (data.popup) {
                            delete data.popup;
                            video.play();
                        }
                    }
                };
            }
        };
        video.addEventListener("click", handler);
    } else if (state == "removed" || state == "ignored") {
        if (data.click_handler) {
            const handler = data.click_handler;
            delete data.click_handler;
            video.removeEventListener("click", handler);
        }
        if (data.popup) {
            data.popup.close();
            delete data.popup;
        }
    } else if (state == "playing" && video.srcObject && data.popup) {
        video.pause();
        data.popup.document.querySelector("video").srcObject = video.srcObject;
    } else if ((state == "ended" || state == "emptied" || state == "suspend") && data.popup) {
        data.popup.document.querySelector("video").srcObject = null;
        if (video.srcObject) {
            video.play();
        }
    }
},
"Click to copy and open all playing videos in a separate window": function(video, data, global, open) {
    /*
    Allow click on any video element to open all the playing
    videos in a separate window. The original video elements
    on the web page are paused while they are playing in
    the separate window. When the separate window is closed,
    all the video elements on the web page are restored.
    
    The video element's srcObject property is used to clone
    the video stream to the separate window. If the video
    element is not playing, it is not included on the
    separate window.
    */
    const {state} = data;
    if (!global.videos) {
        global.videos = [];
    }

    const open_video = (video, data) => {
        if (global.popup && video.srcObject && video.videoWidth && video.videoHeight) {
            data.saved = { 
                controls: video.controls, 
                "pointer-events": video.style.getPropertyValue("pointer-events"),
                filter: video.style.getPropertyValue("filter"),
            };
            video.controls = false;
            video.style.setProperty("pointer-events", "none");
            video.style.setProperty("filter", "brightness(0.08)");
            video.pause();
            const document1 = global.popup.document;
            const video1 = data.video = document1.createElement("video");
            video1.autoplay = video1.controls = video1.disablePictureInPicture = true;
            video1.srcObject = video.srcObject;
            document1.body.appendChild(video1);
        }
    };
    const close_video = (video, data) => {
        if (data.video) {
            const document1 = global.popup.document;
            const video1 = data.video;
            document1.body.removeChild(video1);
            delete data.video;
        }
        if (data.saved) {
            video.controls = data.saved.controls;
            video.style.setProperty("pointer-events", data.saved["pointer-events"]);
            video.style.setProperty("filter", data.saved.filter);
            delete data.saved;
        }
        if (video.srcObject) {
            video.play();
        }
    };

    let handler = global.video_click_handler;
    if (!handler) {
        handler = global.video_click_handler = event => {
            if (!global.popup) {
                const html = `<!doctype html>
<html><head><style type="text/css">
html, body { position: absolute; width: 100%; height: 100%; padding: 0; margin: 0; }
body { display: flex; flex-flow: row wrap; justify-content: center; align-items: center; align-content: center; }
video { position: relative; max-height: 240px; max-width: 320px; margin: 1px; background: black; }
video::-webkit-media-controls-volume-slider, video::-webkit-media-controls-mute-button,
video::-webkit-media-controls-timeline, video::-webkit-media-controls-fullscreen-button  { display: none; }
</style></head>
<body></body></html>
`;
                const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
                const win = global.popup = open(url, "_blank", `width=320,height=${screen.height},left=${screen.width-320},top=0`);
                win.onload = event => {
                    global.videos.forEach(item => {
                        open_video(item.video, item.data);
                    });
                    win.onbeforeunload = event => {
                        if (global.popup) {
                            global.videos.forEach(item => {
                                close_video(item.video, item.data);
                            });
                            delete global.popup;
                        }
                    };
                };
            }
        };
    }
    if (state == "added" || state == "found") {
        video.addEventListener("click", handler);
    } else if (state == "removed" || state == "ignored") {
        video.removeEventListener("click", handler);
    } else if (state == "playing") {
        if (global.videos.findIndex(item => item.video === video) < 0) {
            global.videos.push({video, data});
            if (global.popup) {
                open_video(video, data);
            }
        }
    } else if (state == "ended" || state == "emptied" || state == "suspend") {
        const index = global.videos.findIndex(item => item.video === video);
        if (index >= 0) {
            global.videos.splice(index, 1);
            if (!global.videos.length) {
                delete global.videos;
            }
            if (global.popup) {
                close_video(video, data);
            }
        }
    }
},
"Click to move and open all videos in a separate window": function(video, data, global, open) {
    /*
    Allow click on any video element to open all the videos
    in a separate window. The original video elements on the
    web page are hidden and paused while they are playing
    in the separate window. When the separate window is
    closed, all the video elements on the web page are
    restored.
    
    The video element's srcObject property is used to clone
    the video stream to the separate window. Even if a video
    element is not playing, it is included in the separate
    window.
    */
    const {state} = data;

    if (!global.videos) {
        global.videos = [];
    }

    const open_video = (video, data) => {
        if (global.popup) {
            data.saved = {
                visibility: video.style.getPropertyValue("visibility"),
            }
            video.style.setProperty("visibility", "hidden");
            video.pause();
            const document1 = global.popup.document;
            const video1 = data.video = document1.createElement("video");
            video1.autoplay = video1.controls = video1.disablePictureInPicture = true;
            video1.srcObject = video.srcObject || null;
            document1.body.appendChild(video1);
        }
    };
    const close_video = (video, data) => {
        if (data.video) {
            const document1 = global.popup.document;
            const video1 = data.video;
            document1.body.removeChild(video1);
            delete data.video;
        }
        if (data.saved) {
            video.style.setProperty("visibility", data.saved.visibility);
            delete data.saved;
        }
        video.play();
    };

    let handler = global.video_click_handler;
    if (!handler) {
        handler = global.video_click_handler = event => {
            if (!global.popup) {
                const width = 160;
                const html = `<!doctype html>
<html><head><style type="text/css">
html, body { position: absolute; width: 100%; height: 100%; padding: 0; margin: 0; }
body { display: flex; flex-flow: row wrap; justify-content: center; align-items: center; align-content: flex-start; }
video { position: relative; max-height: ${width}px; max-width: ${width}px; margin: 1px; background: black; }
video::-webkit-media-controls-volume-slider, video::-webkit-media-controls-mute-button,
video::-webkit-media-controls-timeline, video::-webkit-media-controls-fullscreen-button  { display: none; }
</style></head>
<body></body></html>
`;
                const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
                const win = global.popup = open(url, "_blank", `width=${width},height=${screen.height},left=${screen.width-width},top=0`);
                win.onload = event => {
                    global.videos.forEach(item => {
                        open_video(item.video, item.data);
                    });

                    win.onbeforeunload = event => {
                        if (global.popup) {
                            global.videos.forEach(item => {
                                close_video(item.video, item.data);
                            });
                            delete global.popup;
                        }
                    };
                };
            }
        };
    }
    if (state == "added" || state == "found") {
        video.addEventListener("click", handler);
        if (global.videos.findIndex(item => item.video === video) < 0) {
            global.videos.push({video, data});
            if (global.popup) {
                open_video(video, data);
            }
        }
    } else if (state == "removed" || state == "ignored") {
        video.removeEventListener("click", handler);
        const index = global.videos.findIndex(item => item.video ===video);
        if (index >= 0) {
            global.videos.splice(index, 1);
            if (!global.videos.length) {
                delete global.videos;
            }
            if (global.popup) {
                close_video(video, data);
            }
        }
    } else if (state == "playing" || state == "ended" || state == "emptied" || state == "suspend") {
        const video1 = data.video;
        if (video1) {
            video1.srcObject = video.srcObject || null;
        }
    }
},
"Click to show picture-in-picture popout with all the videos": function(video, data, global, getstyle) {
    /*
    Allow click on any video element to open all the playing
    videos in a picture-in-picture popout. It uses the
    built-in picture-in-picture feature, and internally
    creates a canvas backed media stream to attach to the
    picture-in-picture popout. 
    
    The layout of the videos are preserved to their
    relative positions and sizes on the web page.
    If the positions and sizes of the video changes, so
    does the layout of the picture-in-picture popout content. 

    Each video element's object-fit style of cover or contain
    is honored in the layout. A background color of gray
    and dark gray is used for empty space and non-playing
    videos.
    */
    const {state} = data;

    let handler = global.video_click_handler;
    if (!handler) {
        handler = global.video_click_handler = event => {
            event.stopImmediatePropagation();
            event.preventDefault();
            if (!global.canvas) {
                if (global.videos && global.videos.length > 0) {
                    const canvas = global.canvas = document.createElement("canvas");
                    const video = global.video = document.createElement("video");
                    video.autoplay = true;
                    video.onloadedmetadata = () => {
                        if (global.video && document.pictureInPictureEnabled) {
                            video.requestPictureInPicture();
                        }
                    };
                    video.srcObject = canvas.captureStream();

                    global.timer = setInterval(() => {
                        const handler = global.pip_handler;
                        if (handler) {
                            handler();
                        }
                    }, 1000/15);
                }
            } else {
                if (global.timer) {
                    clearInterval(global.timer);
                    delete global.timer;
                }
                if (document.pictureInPictureElement) {
                    document.exitPictureInPicture();
                }
                const video = global.video;
                video.srcObject = null;
                delete global.canvas, global.video;
            }
        };
    }

    if (state == "added" || state == "found") {
        video.addEventListener("click", handler);
    } else if (state == "removed" || state == "ignored") {
        video.removeEventListener("click", handler);
    } else if (state == "playing") {
        if (!global.videos) {
            global.videos = [];
        }
        if (global.videos.indexOf(video) < 0) {
            global.videos.push(video);
        }
    } else if (state == "ended" || state == "emptied" || state == "suspend") {
        const index = global.videos.indexOf(video);
        if (index >= 0) {
            global.videos.splice(index, 1);
            if (!global.videos.length) {
                delete global.videos;
            }
        }
    }
    
    if (!global.pip_handler) {
        global.pip_handler = () => {
            const canvas = global.canvas;
            const videos = (global.videos || []).filter(video => {
                return video.offsetWidth && video.offsetHeight && video.offsetParent !== null;
            });
        
            //element.getBoundingClientRect().top + document.documentElement.scrollTop
            const ctx = canvas.getContext("2d");
            const W = canvas.width = 640;
            const H = canvas.height = 480;
            ctx.fillStyle = "#808080";
            ctx.fillRect(0, 0, W, H);
        
            if (videos.length > 0) {
                const P = videos.map(video => {
                    const rect = video.getBoundingClientRect();
                    // add document.documentElement.scrollLeft,scrollTop of actual position.
                    return { x: rect.left, y: rect.top, w: rect.width, h: rect.height };
                });
                const x0 = P.reduce((s, o) => Math.min(s, o.x), Infinity);
                const x1 = P.reduce((s, o) => Math.max(s, o.x+o.w), -Infinity);
                const y0 = P.reduce((s, o) => Math.min(s, o.y), Infinity);
                const y1 = P.reduce((s, o) => Math.max(s, o.y+o.h), -Infinity);
                const w = x1 - x0, h = y1 - y0;
                const r = w / h;
                const R = W / H;
                const s = r >= R ? W / w : H / h;
                const x_ = r >= R ? 0 : W/2 - H*r/2;
                const y_ = r >= R ? H/2 - W/(2*r) : 0;
        
                const Q = P.map((p, index) => {
                    const x = (p.x - x0) * s + x_, y = (p.y - y0) * s + y_;
                    const w = p.w * s, h = p.h * s;
                    const video = videos[index];
                    const style = getstyle(video);
        
                    let sx = 0, sy = 0, sw = video.videoWidth, sh = video.videoHeight;
                    if (sw && sh) {
                        const r0 = sw / sh;
                        const r1 = w/h;
                        if (style.getPropertyValue("object-fit") == "cover" && r0 >= r1 
                            || style.getPropertyValue("object-fit") != "cover" && r0 <= r1) {
                            sx = sw/2-r1*sh/2;
                            sw = r1*sh;
                        } else {
                            sy = sh/2-sw/(2*r1);
                            sh = sw/r1;
                        }
                    }
                    
                    return {x, y, w, h, sx, sy, sw, sh};
                });
                
                // order based on size, largest to smallest
                const sizes = Q.map(p => p.w * p.h);
                const order = [...Array(sizes.length).keys()].sort((i, j) => {
                    return sizes[j] - sizes[i];
                });
        
                order.forEach(index => {
                    const video = videos[index];
                    const {x, y, w, h, sx, sy, sw, sh} = Q[index];
                    if (sw && sh) {
                        ctx.drawImage(video, Math.round(sx), Math.round(sy), Math.round(sw), Math.round(sh), Math.round(x), Math.round(y), Math.round(w), Math.round(h));
                    } else {
                        ctx.fillStyle = "#404040";
                        ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
                    }
                });
            }
        };
    }
},
};

functions.mediastream = {
"Remove audioinput track from any captured stream": function(stream, context) {
    /* Remove any microphone/audioinput tracks from
    getUserMedia or getDisplayMedia streams. */
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
    to change to the external video content. Double click
    on the external video  to close it, and switch the 
    received stream back to the original. */

    if (context == "ontrack") {
        if (!stream._other) {
            const video = document.createElement("video");
            video.setAttribute("style", "position: fixed; bottom: 0px; right: 0px; z-index: 2147483647;");
            video.setAttribute("controlsList", "nofullscreen");
            Object.assign(video, {
                src: respath + "/test.mp4",
                autoplay: true, muted: false, volume: 0.01,
                loop: true, controls: true,
            });
            document.body.appendChild(video);
    
            const stream2 = stream._other = video.captureStream();
            stream2.addEventListener("inactive", event => {
                if (video.parentNode == document.body) {
                    document.body.removeChild(video);
                }
                [].concat(stream2.getVideoTracks(), stream2.getAudioTracks()).forEach(track => stream2.removeTrack(track));
                [].concat(stream.getAudioTracks(), stream.getVideoTracks()).forEach(track => stream2.addTrack(track));
            });
            
            video.ondblclick = event => {
                event.preventDefault();
                [].concat(stream2.getVideoTracks(), stream2.getAudioTracks()).forEach(track => track.stop());
            };
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
"Receive remote video stream and use that as webcam and mic": function(stream, context, respath) {
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
            let ws_url = "ws://localhost:8080/streams/" + str + "?mode=subscribe";
            console.log("connecting to " + ws_url);
            console.log("publish at http://localhost:8000/test/streams.html?publish=streams/" + str)

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

functions.usermedia = {
"Remove audio constraints to avoid microphone capture": function(constraints) {
    /* Remove microphone capture from the constraints, 
    to avoid sound capture. */
    if (constraints && constraints.audio) {
        delete constraints.audio;
    }
},
"Set minimum capture frame rate of 15": function(constraints) {
    /* Set the minimum frame rate of 15fps, if the video
    constraints is set, and has frame rate configured. */
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
    /* Set the minimum frame rate of 15fps, if the video
    constraints is set, and has frame rate configured.
    This won't work in strict mode since it accesses 
    the global navigator object. */
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
    /* Disable any video media type in the session
    description (SDP) */
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
    Modify the session description (SDP) to only allow
    H264 video codec. The related RTX formats are also
    adjusted based on whether the associated codec was
    included or not in the session. This is done only
    for the createOffer response, typically for the 
    publishing webcam stream.
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
    Modify the session description (SDP) to prefer G711
    (pcma and pcmu), and remove G722 and ISAC codecs.
    This is done only for the createOffer and createAnswer
    responses, and hence, applies to both publishing and
    playing audio stream.
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
    Modify the session senders to limit the maximum video
    bitrate to 75kb/s. This is done only for the local
    description, and thus applies only to the video 
    publishing stream.
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
    Modify the session description to limit receiving total
    bandwidth to 100kb/s. This is done only for the remote
    description, and thus applies only to the receiver side
    streams.
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
    Modify the session senders to limit the maximum frame
    rate to 5fps. This is done only for the local description,
    and thus applies only to the video publishing stream.
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
    /* Always use a specific STUN and TURN server. This is
    in addition to any application supplied configuration. */
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
    /* Always use a specific TURN server, and remove all
    others, if  supplied by the application. Also force use
    the TURN server. */
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
    Enable Google's proprietary constraints of using DSCP
    packet marking. For more information see
    http://www.rtcbits.com/2017/01/using-dscp-for-webrtc-packet-marking.html
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
    /* Allow a specific TURN server candidate, and ignore
    all others. This could force the media path to always
    go through that TURN server, but must be done together
    with the connection function to inject or limit the use
    of TURN servers. */
    if (candidate && candidate.type == "relay" && 
        candidate.address == "52.1.2.3") {
        return candidate;
    } else {
        return null;
    }
},
};

functions.mediastats = {
"Log all connection methods and events": function(id, type, name, args) {
    /* Log all connection methods and events */
    console.log(id + (type == "event" ? ".on" : ".") + name);
},
"Save events and connection statistics to default server": function(id, type, name, args, compress, send) {
    /* Save connection events and statistics to the
    default storage server.
    
    Internally, compress uses delta compression inspired by
    https://github.com/fippo/rtcstats/blob/master/rtcstats.js
    */
    if (name == "getStats") {
        args[0] = compress(args[0]);
    }
    send({id, type, name, data: args});
},
"Save connection statistics with different interval": function(data, id, type, name, args, compress, send) {
    /* Save connection statistics with 1 second interval to the
    default storage server. */
    if (name == "construct") {
        send({id, type, name, data: args});
    } else if (name == "getStats") {
        if (!data.interval) {
            data.interval = 1000;
        }
        args[0] = compress(args[0]);
        send({id, type, name, data: args});
    }
},
"Save connection statistics with customization": function(data, id, type, name, args, compress, send) {
    /* Save customized statistics to the default storage
    server. It includes only candidate-pair, local/remote-
    candidate, outbound/inbount-rtp from the statistics,
    and adds extra metric about difference between 
    estimated and actual bitrate in send and receive. 
    A positive value indicates the client is within
    the estimated bitrate, and a negative value or close
    to 0 indicates that the  client is attempting to send
    or receive more than estimated bitrate, and could cause 
    a problem. */
    if (name == "getStats") {
        const last = data.reports;
        data.reports = args[0];
        const reports = new Map();
        args[0].forEach((value, key) => {
            if (["candidate-pair", "local-candidate", "remote-candidate", "outbound-rtp", "inbound-rtp"].indexOf(value.type) >= 0) {
                if (value.codecId) {
                    delete value.codecId;
                }
                reports.set(key, value);
            }
        });

        const values = Array.from(reports.values());

        if (last) {
            let timestamp = 0;
            const bweSent = values
                .filter(r => r.type === "candidate-pair" && r.availableOutgoingBitrate)
                .map(r => {
                    const prev = last.get(r.id);
                    if (!timestamp) {
                        timestamp = r.timestamp;
                    }
                    return Math.round(r.availableOutgoingBitrate - (r.bytesSent - (prev.bytesSent || 0)) * 8 * 1000 / (r.timestamp - prev.timestamp));
                }).reduce((s, r) => s + r, 0);
    
            const bweReceived = values
                .filter(r => r.type === "candidate-pair" && r.availableIncomingBitrate)
                .map(r => {
                    const prev = last.get(r.id);
                    if (!timestamp) {
                        timestamp = r.timestamp;
                    }
                    return Math.round(r.availableIncomingBitrate - (r.bytesReceived - (prev.bytesReceived || 0)) * 8 * 1000 / (r.timestamp - prev.timestamp));
                }).reduce((s, r) => s + r, 0);

            const qid = "Summary_0"
            reports.set(qid, {
                id: qid, type: "summary", timestamp: timestamp,
                "extraBitrateSent (BWE - actual)": bweSent,
                "extraBitrateReceived (BWE - actual)": bweReceived,
            });
        }

        args[0] = compress(reports);
        send({id, type, name, data: args});
    }
},
"Display bitrate, delay, jitter, packets lost and available bitrate locally": function(data, id, name, args, parsequery, query, plot) {
    /* Display certain quality metrics locally for 
    audio (a) and video (v) in send (s) and receive (r)
    direction. */
    if (name == "getStats") {
        if (!data.interval) {
            data.interval = 1000;
        }
        if (!data.query) {
            data.query = parsequery({
                as_bytes: "select sum bytesSent since previous and interval from outbound-rtp where kind is audio and bytesSent valid",
                ar_bytes: "select sum bytesReceived since previous and interval from inbound-rtp where kind is audio and bytesReceived valid",
                vs_bytes: "select sum bytesSent since previous and interval from outbound-rtp where kind is video and bytesSent valid",
                vr_bytes: "select sum bytesReceived since previous and interval from inbound-rtp where kind is video and bytesReceived valid",

                s_bytes: "select sum bytesSent since previous and interval from candidate-pair where bytesSent valid",
                r_bytes: "select sum bytesReceived since previous and interval from candidate-pair where bytesReceived valid",

                as_delay: "select max roundTripTime if present from remote-inbound-rtp where kind is audio",
                vs_delay: "select max roundTripTime if present from remote-inbound-rtp where kind is video",
                s_delay: "select max currentRoundTripTime from candidate-pair where bytesSent valid and state is succeeded and currentRoundTripTime present",
                r_delay: "select max currentRoundTripTime from candidate-pair where bytesReceived valid and state is succeeded and currentRoundTripTime present",

                as_jitter: "select max jitter if present from remote-inbound-rtp where kind is audio",
                vs_jitter: "select max jitter if present from remote-inbound-rtp where kind is video",
                ar_jitter: "select max jitter if present from inbound-rtp where kind is audio",
                vr_jitter: "select max jitter if present from inbound-rtp where kind is video",

                as_lost: "select sum packetsLost if present since previous from remote-inbound-rtp where kind is audio",
                vs_lost: "select sum packetsLost if present since previous from remote-inbound-rtp where kind is video",
                ar_lost: "select sum packetsLost if present since previous from inbound-rtp where kind is audio",
                vr_lost: "select sum packetsLost if present since previous from inbound-rtp where kind is video",
    
                s_bwe: "select max availableOutgoingBitrate from candidate-pair where bytesSent valid and state is succeeded and availableOutgoingBitrate present",
                r_bwe: "select max availableIncomingBitrate from candidate-pair where bytesReceived valid and state is succeeded and availableIncomingBitrate present",
    
            });
        }

        const reports = args[0];
        // // alternatively the following converted arrays can be used instead of the RTCStatsReport object.
        // const reports = Array.from(args[0].values());

        const last = data.reports;
        data.reports = reports;

        const r = query(data.query, reports, last);
        const now = Math.round(Date.now() / 1000);
        ["as", "ar", "vs", "vr", "s", "r"].forEach(type => {
            const delay = r[type + "_delay"];
            if (delay !== undefined) {
                plot("delay-" + id, type, now, Math.round(1000 * delay));
            }

            const row = r[type + "_bytes"];
            if (row?.length === 2) {
                const [bytes, interval] = row;
                const bitrate = interval && bytes !== undefined ? Math.round(bytes * 8 / Math.round(interval)) : undefined;
                if (bitrate !== undefined) {
                    plot("bitrate-" + id, type, now, bitrate);

                    const bwe = r[type + "_bwe"];
                    if (bwe !== undefined) {
                        const delta = bwe - bitrate;
                        plot("bwe-bw", id + "-" + type, now, delta);
                    }
                }
            }
        });
        ["as", "ar", "vs", "vr"].forEach(type => {
            const jitter = r[type + "_jitter"];
            if (jitter) {
                plot("jitter-" + id, type, now, Math.round(1000 * jitter));
            }
            const lost = r[type + "_lost"];
            if (lost !== undefined) {
                plot("lost-" + id, type, now, lost);
            }
        });
    }
},
"Display total bitrate inbound and outbound locally": function(data, id, name, args, plot) {
    /* Display calculated total bitrate locally */
    if (name == "getStats") {
        if (!data.interval) {
            data.interval = 1000;
        }
        const reports = Array.from(args[0].values());
        const last = data.reports;
        data.reports = reports;

        if (last) {
            const bitrate = (attr) => {
                return reports
                    .filter(r => r.type === "candidate-pair" && r[attr])
                    .map(r => {
                        const prev = last.find(p => p.id === r.id);
                        if (!prev) {
                            return 0;
                        }
                        const dur = (r.timestamp - prev.timestamp);
                        return Math.round(
                            (r[attr] - (prev && prev[attr] || 0)) * 8 * 1000 / dur);
                    })
                    .reduce((s, r) => s + r, 0);
            };
            s = bitrate('bytesSent');
            r = bitrate('bytesReceived');

            const now = Math.round(Date.now() / 1000);
            plot("bitrate-" + id, "send", now, s);
            plot("bitrate-" + id, "receive", now, r);
        } else {
            console.log("missing last");
        }
    }
},
"Capture video frame rate from outbound-rtp and set a variable": function(name, args, controls) {
    /* Get the current frame rate used in the outbound-rtp
    video reports, and set the controls variable frameRate
    with that value in fps. The value is updated whenever
    a change is detected during the stats collection
    interval. */
    if (name == "getStats") {
        const reports = [];
        args[0].forEach(report => reports.push(report));
        const fps = reports.filter(report => {
            return report.type == "outbound-rtp" && report.mediaType == "video" && report.framesPerSecond !== undefined;
        }).map(report => {
            return report.framesPerSecond;
        });
        if (fps.length > 0){
            const f = fps.reduce((a,s) => a+s, 0);
            controls.set("frameRate", f)
        }
    }
},
"Change sender frame rate from controls tab event trigger": function(connection, type, name, controls) {
    /* Intercept change in controls variable change_fps,
    and use that to trigger a change in the session senders
    frame rate. This only applies to the video publishing
    stream. The function ensures proper cleanup of the
    change handler. */
    if (type == "method" && name == "construct") {
        const handler = connection._handler = (value, old) => {
            setTimeout(() => {
                const senders = connection.getSenders();
                senders.filter(sender => sender.track && sender.track.kind == "video").forEach(sender => {
                    const parameters = sender.getParameters();
                    if (!parameters.encodings) {
                        parameters.encodings = [{}];
                    }

                    parameters.encodings[0].maxFramerate = parseFloat(value) || 15;
                    sender.setParameters(parameters).catch(e => console.error(e));
                });
            });
        };
        controls.on("change_fps", handler);
    } else if (type == "method" && name == "close") {
        if (connection._handler) {
            const handler = connection._handler;
            delete connection._handler;
            controls.off("change_fps", handler);
        }
    }
},
};

functions.datachannel = {
"Disable any data channel": function(context, args) {
    /* Disallow use of any data channel by throwing an
    error on outbound data channel, and ignoring inbound
    data channel event. */
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
"Add prefix to text data sent and received": function(context, args) {
    /* Prefix sent text with "> " and received text with "< ".
    Ignore if it is not text string. */
    if (context == "send" && typeof args[0] == "string") {
        args[0] = "> " + args[0];
        console.log("send", args[0]);
    } else if (context == "message" && typeof args[0].data == "string") {
        let data = args[0].data;
        if (data.startsWith("> ")) {
            data = data.substring(2);
        }
        args[0] = {type: "message", data: "< " + data};
        console.log("received", args[0].data);
    }
},
"Add sha1-hmac integrity protection in text data": function(context, args, global) {
    /* include hmac-sha1 in sent data, and verify on receive.
    
    See https://gist.github.com/noonat/4014105
    */

    if (!global.sha1_loaded && !global.sha1_loading) {
        global.key = "some secret";
        global.sha1_loading = true;

        console.log("adding sha1.js");
        const script = document.createElement("script");
        script.id = "sha1";
        script.setAttribute("crossorigin", "anonymous");
        script.setAttribute("src", "https://gist.githack.com/noonat/4014105/raw/65e0282ecadb8728e3d9a72fbc4739bd833f8051/sha1.js");
        script.setAttribute("integrity", "sha384-V6d4EVrKUoWF3XEt9p0T54TUhQKF0UNxp+OLyr5N3jQEpRUVZfRVQt0IIv0c6YiE");
        script.onload = () => {
            console.log("loaded sha1.js");
            global.sha1_loaded = true;
        };
        document.head.appendChild(script);
    }

    if (context == "send" && typeof args[0] == "string") {
        if (global.sha1_loaded) {
            const hex = sha1.hmac(global.key, args[0]);
            args[0] = hex + " " + args[0];
            console.log("send", args[0]);
        } else {
            console.log("ignore send, waiting for sha1");
        }
    } else if (context == "message" && typeof args[0].data == "string") {
        if (global.sha1_loaded) {
            let data = args[0].data;
            let index = data.indexOf(" ");
            if (index !== 40 || sha1.hmac(global.key, data.substring(41)) !== data.substring(0, 40)) {
                console.warn("invalid hmac, dropping", data.substring(0, 40));
                args.splice(0, 1);
            } else {
                console.log("received", args[0].data);
                args[0] = {data: args[0].data.substring(41)};
            }
        } else {
            console.log("ignore eceiver, waiting for sha1");
            args.splice(0, 1); // remove event
        }
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
"Encrypt and decrypt all text messages sent and received": function(context, args) {
    /* use simple RC4 cipher to encrypt sent message and 
    decrypt received message for basic obfuscation against
    reverse engineering using browser devtools.
    
    See https://gist.github.com/salipro4ever/e234addf92eb80f1858f */
    function rc4(key, str) {
        var s = [], j = 0, x, res = '';
        for (var i = 0; i < 256; i++) {
            s[i] = i;
        }
        for (i = 0; i < 256; i++) {
            j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
            x = s[i]; s[i] = s[j]; s[j] = x;
        }
        i = 0; j = 0;
        for (var y = 0; y < str.length; y++) {
            i = (i + 1) % 256;
            j = (j + s[i]) % 256;
            x = s[i]; s[i] = s[j]; s[j] = x;
            res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
        }
        return res;
    }
    const key = "some secret";
    const str2hex = str => str.split("").map(a => a.charCodeAt(0).toString(16)).join("");

    if (context == "send") {
        let enc = rc4(key, args[0]);
        console.log(`send text="${args[0]}" encoded=0x${str2hex(enc)}`);
        args[0] = enc;
    } else if (context == "message") {
        let dec = rc4(key, args[0].data);
        console.log(`received encoded=0x${str2hex(args[0].data)} text=${dec}`);
        args[0].data = dec;
    }
},
"Change localhost to 127.0.0.1 in URL": function(context, args) {
    /* Change the web socket target URL host. This example
    changes localhost to 127.0.0.1. Similar technique can
    be used for other types of changes, e.g., to add an
    authentication parameter, or to force use of secure
    websocket URL (wss). */
    if (context == "preconstruct") {
        args[0] = args[0].replace(/\blocalhost\b/, "127.0.0.1");
    }
},
"Force close web socket after 30 seconds": function(type, context, socket, data) {
    /* Impose a 30s disconnection event on web socket. This
    is useful for emulating strict firewall rules of
    certain enterprises. The function ensures cleanup of
    timer handler. */
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
    /* Delay web socket connection attempt by a random
    time between 2 and 10 seconds. This is useful for
    emulating high connection setup latency in testing. */
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
    /* Delay data send and receive on websocket by 200
    milliseconds.  Similar function can be used for
    emulating high latency network conditions. In case
    of random and variable delay, it should ensure in-order
    delivery of underlying send and receive method and event. */
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
    /* Disallow any Ajax request. Both fetch and XMLHttpRequest
    are blocked by throwing an error. */
    if (context == "fetch" || context == "send") {
        throw new Error("not allowed");
    }
},
"Log with time all web requests sent and responses received": function(context, args, data, xhr) {
    /* Log time for all Ajax requests and responses. Both
    fetch and XMLHttpRequest and their responses, including
    errors, are logged. */
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
    /* Log web requests that take more than 2 seconds to get
    a response or error. Both fetch and XMLHttpRequest are
    considered. */
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
    /* Log the response body assuming JSON. 
    Both fetch and XMLHttpRequest are considered. */
    if (context == "fetchresponse") {
        console.log("response json", await args[0].json());
    } else if (context == "readystatechange") {
        console.log("response", JSON.parse(xhr.responseText));
    }
},
"Log original, but return fake response": function(context, xhr, args) {
    /* Return a fake response, but log the original for
    the Ajax request. Both fetch and XMLHttpRequest are
    considered. Note that the response formats are different
    for the two cases. */
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
    /* Return a fake timeout error on Ajax requests that
    are not completed in 2 seconds. 
    Both fetch and XMLHttpRequest are considered. */
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
    /* Return a fake success response, if an error is received
    in Ajax. Both fetch and XMLHttpRequest are considered.
    Note that the response formats are different for the
    two cases. */
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

functions.pagesecurity = {
"Add jsdelivr CDN in content security policy": function(details) {
    /* Include https://cdn.jsdelivr.net as script-src in 
    content-security-policy and other related headers in 
    response to any web request. This is useful if the
    tool is used as a browser extension, and the customization
    functions in other tabs, require use of third-party libraries
    hosted on jsdelivr. */
    const headers = details.responseHeaders;
    let found = false;
    headers.forEach(header => {
        if (["content-security-policy", "content-security-policy-report-only", "x-webkit-csp"].indexOf(header.name.toLowerCase()) >= 0) {
            found = true;
            header.value = header.value.replace(/\bscript-src\b/, "script-src https://cdn.jsdelivr.net");
        }
    });
    return {responseHeaders: headers};
},
};

functions.cpuperformance = {
"Set a controls variable with average and maximum CPU percent": function(details, controls) {
    /* Calculate the average CPU percent, and set controls
    variable cpuusage with that value. Also include maximum
    on any core in the variable value. */
    let cpuusage = details.filter(item => !!item).map(item => (1-item.idle/item.total));
    if (cpuusage.length) {
        let average = cpuusage.reduce((s,a) => s+a, 0)/cpuusage.length;
        average = Math.round(1000*average)/10;
        let max = Math.max(...cpuusage);
        max = Math.round(1000*max)/10;
        controls.set("cpuusage", `${average}%, ${max}%`);
    }
},
};

for (var attr in functions) {
    functions[attr] = Object.freeze(functions[attr]);
}
Object.freeze(functions);
