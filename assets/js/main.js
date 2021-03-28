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

    shaderProgram = initShader(glContext);
    initBuffer(glContext, shaderProgram);

    oldTime = 0.0;
    deltaTime = 0.0;
    requestAnimationFrame(update);
}

function update(now) {
    deltaTime = now - oldTime;
    oldTime = now;
    render(now);

    requestAnimationFrame(update);
}

function render(now) {
    glContext.clearColor(.0, .0, .0, .0);                 // Clear to black, fully opaque
    glContext.clearDepth(1.0);                                // Clear everything
    glContext.enable(glContext.DEPTH_TEST);         // Enable depth testing
    glContext.depthFunc(glContext.LEQUAL);          // TODO what is this

    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

    glContext.uniform1f(glContext.getUniformLocation(shaderProgram, "time"), now*0.001);

    glContext.drawElements(glContext.TRIANGLES, indices.length, glContext.UNSIGNED_SHORT, 0);
}

function resizeViewport() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    glContext.viewport(0, 0, glContext.canvas.width, glContext.canvas.height);
    //this.renderer.resize();
    console.log("resized");
}

function mouseMove() {
    console.log("mouse move");
}

function initShader(glContext) {
    // Shader source code
    const vertSource = `
        attribute vec3 coordinates;
        void main(void) {
            gl_Position = vec4(coordinates, 1.0);
        }`;
    const fragSource =
        `precision highp float;
        uniform float time;
        void main(){
          vec2 r=vec2(400, 200);
          vec2 p=(gl_FragCoord.xy*2.-r)/min(r.x,r.y)-r/100.;
          for(int i=0;i<8;++i){
            p.xy=abs(p)/abs(dot(p,p))-vec2(.9+cos(time*.2)*.4);
          }
          gl_FragColor=vec4(p.xxx,1);
        }`;

    // Creating shader object
    const vertShader = glContext.createShader(glContext.VERTEX_SHADER);
    const fragShader = glContext.createShader(glContext.FRAGMENT_SHADER);

    // Add source code to shader
    glContext.shaderSource(vertShader, vertSource);
    glContext.shaderSource(fragShader, fragSource);

    // Compile the shader
    glContext.compileShader(vertShader);
    glContext.compileShader(fragShader);

    // Alert if compilation failed
    if (!glContext.getShaderParameter(vertShader, glContext.COMPILE_STATUS)) {
        alert('An error occured compiling the vertex shader: ' + glContext.getShaderInfoLog(vertShader));
        glContext.deleteShader(vertShader);
        return null;
    }
    if (!glContext.getShaderParameter(fragShader, glContext.COMPILE_STATUS)) {
        alert('An error occured compiling the fragment shader: ' + glContext.getShaderInfoLog(fragShader));
        glContext.deleteShader(fragShader);
        return null;
    }

    // Create shader programm
    const shaderProgram = glContext.createProgram();

    // Attach shaders to programm
    glContext.attachShader(shaderProgram, vertShader);
    glContext.attachShader(shaderProgram, fragShader);

    // TODO what the fuck is this
    glContext.linkProgram(shaderProgram);

    // Alert if creation failed
    if (!glContext.getProgramParameter(shaderProgram, glContext.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + glContext.getProgramInfoLog(shaderProgram));
        return null;
    }

    glContext.useProgram(shaderProgram);
    return shaderProgram
}

function initBuffer(glContext, shaderProgram) {
    var vertices = [
        -1., 1., 0.0,
        -1., -1., 0.0,
        1., -1., 0.0,
        1., 1., 0.0
    ];

    indices = [3, 2, 1, 3, 1, 0];

    // Create an empty buffer object to store vertex buffer
    var vertex_buffer = glContext.createBuffer();
    // Bind appropriate array buffer to it
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(vertices), glContext.STATIC_DRAW);
    // Unbind the buffer
    glContext.bindBuffer(glContext.ARRAY_BUFFER, null);

    // Create an empty buffer object to store Index buffer
    var Index_Buffer = glContext.createBuffer();
    // Bind appropriate array buffer to it
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    // Pass the vertex data to the buffer
    glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), glContext.STATIC_DRAW);
    // Unbind the buffer
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, null);

    // Bind vertex buffer object
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vertex_buffer);
    // Bind index buffer object
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    // Get the attribute location
    var coord = glContext.getAttribLocation(shaderProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    glContext.vertexAttribPointer(coord, 3, glContext.FLOAT, false, 0, 0);
    // Enable the attribute
    glContext.enableVertexAttribArray(coord);

    var time = glContext.getUniformLocation(shaderProgram, "time");

}

window.onload = main;