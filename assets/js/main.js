function main() {
    console.log("window loaded.");
    console.log("initializing canvas.");

    // the canvas that will be drawn on
    canvas = document.querySelector("#glCanvas");
    // GL context
    glContext = canvas.getContext("webgl");

    if (!glContext) {
        alert("Unable to initialize WebGL. Your browser maybe too old.");
        //TODO quelque chose pour les navigateurs trop vieux
        return;
    }
    resizeViewport();
    window.addEventListener("resize", resizeViewport);
    canvas.addEventListener("mousemove", (e) => mouseMove(e), false);

    initShader(glContext);
    


    oldTime = 0.0;
    deltaTime = 0.0;
    //requestAnimationFrame(update);
}

function update(newTime) {
    deltaTime = newTime - oldTime;
    oldTime = newTime;
    render();

    requestAnimationFrame(update);
}

function resizeViewport() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    glContext.viewport(0, 0, glContext.canvas.width, glContext.canvas.height);
    //this.renderer.resize();
    console.log("resized");
}

function render() {
    glContext.clearColor(.0, .0, .0, 1.);                 // Clear to black, fully opaque
    glContext.clearDepth(1.0);                                // Clear everything
    glContext.enable(glContext.DEPTH_TEST);         // Enable depth testing
    glContext.depthFunc(glContext.LEQUAL);          // TODO what is this

    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);


}

function mouseMove() {
    console.log("mouse move");
}

function initShader(gl) {

    const vertSource =`
        attribute vec2 coordinates;
        void main(void) {
            gl_Position = vec4(1.0, 1.0, 0.0, 1.0);
        }`;
    const fragSource =
        'void main(void) {' +
           ' gl_FragColor = vec4(0, 0.8, 0, 1);' +
        '}';

    // Creating shader object
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Add source code to shader
    gl.shaderSource(vertShader, vertSource);
    gl.shaderSource(fragShader, fragSource);

    // Compile the shader
    gl.compileShader(vertShader);
    gl.compileShader(fragShader);

    // Alert if compilation failed
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
        alert('An error occured compiling the shaders: ' + gl.getShaderInfoLog(vertShader));
        gl.deleteShader(vertShader);
        return null;
    }
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        alert('An error occured compiling the shaders: ' + gl.getShaderInfoLog(fragShader));
        gl.deleteShader(fragShader);
        return null;
    }

    // Create shader programm
    const shaderProgram = gl.createProgram();

    // Attach shaders to programm
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);

    // TODO what the fuck is this
    gl.linkProgram(shaderProgram);

    // Alert if creation failed
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    gl.useProgram(shaderProgram);
}

window.onload = main;