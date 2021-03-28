function main() {
    // the canvas that will be drawn on
    canvas = document.querySelector("#glCanvas");
    // GL context
    glContext = canvas.getContext("webgl");
    if (!glContext) {
        alert("Unable to initialize WebGL. Your browser maybe too old.");
        //TODO quelque chose pour les navigateurs trop vieux
        return;
    }
    // set the canvas and viwport size to the window and add an event listener to resizeif needed
    resizeViewport();
    window.addEventListener("resize", resizeViewport);
    // set the mouse position and listen to mouse movements
    mousePos = [window.innerWidth/2, window.innerHeight/2];
    window.addEventListener("mousemove", (e) => mouseMove(e), false);

    shaderProgram = initShader(glContext);
    initBuffer(glContext, shaderProgram);

    //oldTime = 0.0;
    //deltaTime = 0.0;
    requestAnimationFrame(update);
}

function update(now) {
    //deltaTime = now - oldTime;
    //oldTime = now;
    render(now);

    requestAnimationFrame(update);
}

function render(now) {
    glContext.clearColor(.0, .0, .0, .0);                 // Clear to black, fully opaque
    glContext.clearDepth(1.0);                                // Clear everything
    glContext.enable(glContext.DEPTH_TEST);         // Enable depth testing
    glContext.depthFunc(glContext.LEQUAL);          // TODO what is this

    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

    // Fragment shaders input values
    glContext.uniform1f(glContext.getUniformLocation(shaderProgram, "i_time"), now*0.001);
    glContext.uniform2f(glContext.getUniformLocation(shaderProgram, "i_res"), window.innerWidth, window.innerHeight);
    glContext.uniform2f(glContext.getUniformLocation(shaderProgram, "i_mouse"), mousePos[0], mousePos[1]);

    glContext.drawElements(glContext.TRIANGLES, indices.length, glContext.UNSIGNED_SHORT, 0);
}

function resizeViewport() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    glContext.viewport(0, 0, glContext.canvas.width, glContext.canvas.height);
    //this.renderer.resize();
}

function mouseMove(e) {
    mousePos = [e.clientX, e.clientY];
    //glContext.uniform2f(glContext.getUniformLocation(shaderProgram, "i_mouse"), e.clientX, e.clientY);
}

function initShader(glContext) {

    const vertSource = document.getElementById("VERT_SOURCE").textContent;
    const fragSource = document.getElementById("FRAG_SOURCE").textContent;

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
}

window.onload = main;