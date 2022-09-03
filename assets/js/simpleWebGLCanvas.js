class webGLCanvas {

    constructor() {
        this.play = true;
    }

    init(vertSource, fragSource) {

        this.vertSource = vertSource;
        this.fragSource = fragSource;

        // the canvas that will be drawn on
        this.canvas = document.querySelector("#glCanvas");
        // GL context
        this.glContext = this.canvas.getContext("webgl");
        
        if (!this.glContext) {
            console.error("Unable to initialize WebGL. Your browser maybe too old.");
            return null;
        }
        // set the canvas and viwport size to the window and add an event listener to resize if needed
        this.resizeViewport();
        window.addEventListener("resize", this.resizeViewport.bind(this));

        // set the mouse position and listen to mouse movements
        this.mousePos = [window.innerWidth/2, window.innerHeight/2];
        if (isOnDesktop(navigator.userAgent||navigator.vendor||window.opera)) {
            //todo set mousePos to mouse pos
            window.addEventListener("mousemove", (e) => this.mouseMove(e), false);
        }

        if (!this.initShader()) return null;
        if (!this.initBuffer()) return null;

        
        requestAnimationFrame(this.update.bind(this));
    }

    update(now) {
        if (this.play) this.render(now);
        requestAnimationFrame(this.update.bind(this));
    }

    render(now) {
        this.glContext.clearColor(.0, .0, .0, .0);                 // Clear to black, fully opaque
        this.glContext.clearDepth(1.0);                                // Clear everything
        this.glContext.enable(this.glContext.DEPTH_TEST);         // Enable depth testing
        this.glContext.depthFunc(this.glContext.LEQUAL);          // TODO what is this

        this.glContext.clear(this.glContext.COLOR_BUFFER_BIT | this.glContext.DEPTH_BUFFER_BIT);

        // Fragment shaders input values
        this.glContext.uniform1f(this.glContext.getUniformLocation(this.shaderProgram, "u_time"), now*0.001);
        this.glContext.uniform2f(this.glContext.getUniformLocation(this.shaderProgram, "u_resolution"), window.innerWidth, window.innerHeight);
        this.glContext.uniform2fv(this.glContext.getUniformLocation(this.shaderProgram, "u_mouse"), this.mousePos);

        this.glContext.drawElements(this.glContext.TRIANGLES, this.indices.length, this.glContext.UNSIGNED_SHORT, 0);
    }

    resizeViewport() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.glContext.viewport(0, 0, this.glContext.canvas.width, this.glContext.canvas.height);
        //this.renderer.resize();
    }

    mouseMove(e) {
        this.mousePos = [e.clientX, e.clientY];
        //glContext.uniform2f(glContext.getUniformLocation(shaderProgram, "i_mouse"), e.clientX, e.clientY);
    }

    initShader() {

        //const vertSource = document.getElementById("VERT_SOURCE").textContent;
        //const fragSource = document.getElementById("FRAG_SOURCE").textContent;

        // Creating shader object
        const vertShader = this.glContext.createShader(this.glContext.VERTEX_SHADER);
        const fragShader = this.glContext.createShader(this.glContext.FRAGMENT_SHADER);

        // Add source code to shader
        this.glContext.shaderSource(vertShader, this.vertSource);
        this.glContext.shaderSource(fragShader, this.fragSource);

        // Compile the shader
        this.glContext.compileShader(vertShader);
        this.glContext.compileShader(fragShader);

        // Alert if compilation failed
        if (!this.glContext.getShaderParameter(vertShader, this.glContext.COMPILE_STATUS)) {
            console.error('An error occured compiling the vertex shader: ' + this.glContext.getShaderInfoLog(vertShader));
            this.glContext.deleteShader(vertShader);
            return null;
        }
        if (!this.glContext.getShaderParameter(fragShader, this.glContext.COMPILE_STATUS)) {
            console.error('An error occured compiling the fragment shader: ' + this.glContext.getShaderInfoLog(fragShader));
            this.glContext.deleteShader(fragShader);
            return null;
        }

        // Create shader programm
        this.shaderProgram = this.glContext.createProgram();

        // Attach shaders to programm
        this.glContext.attachShader(this.shaderProgram, vertShader);
        this.glContext.attachShader(this.shaderProgram, fragShader);

        this.glContext.linkProgram(this.shaderProgram);

        // Alert if creation failed
        if (!this.glContext.getProgramParameter(this.shaderProgram, this.glContext.LINK_STATUS)) {
            console.error('Unable to initialize the shader program: ' + this.glContext.getProgramInfoLog(shaderProgram));
            return null;
        }

        this.glContext.useProgram(this.shaderProgram);

        return 1;
    }

    initBuffer() {
        this.vertices = [
            -1., 1., 0.0,
            -1., -1., 0.0,
            1., -1., 0.0,
            1., 1., 0.0
        ];

        this.indices = [3, 2, 1, 3, 1, 0];

        // Create an empty buffer object to store vertex buffer
        var vertex_buffer = this.glContext.createBuffer();
        // Bind appropriate array buffer to it
        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, vertex_buffer);
        // Pass the vertex data to the buffer
        this.glContext.bufferData(this.glContext.ARRAY_BUFFER, new Float32Array(this.vertices), this.glContext.STATIC_DRAW);
        // Unbind the buffer
        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, null);

        // Create an empty buffer object to store Index buffer
        var Index_Buffer = this.glContext.createBuffer();
        // Bind appropriate array buffer to it
        this.glContext.bindBuffer(this.glContext.ELEMENT_ARRAY_BUFFER, Index_Buffer);
        // Pass the vertex data to the buffer
        this.glContext.bufferData(this.glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.glContext.STATIC_DRAW);
        // Unbind the buffer
        this.glContext.bindBuffer(this.glContext.ELEMENT_ARRAY_BUFFER, null);

        // Bind vertex buffer object
        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, vertex_buffer);
        // Bind index buffer object
        this.glContext.bindBuffer(this.glContext.ELEMENT_ARRAY_BUFFER, Index_Buffer);
        // Get the attribute location
        var coord = this.glContext.getAttribLocation(this.shaderProgram, "coordinates");
        // Point an attribute to the currently bound VBO
        this.glContext.vertexAttribPointer(coord, 3, this.glContext.FLOAT, false, 0, 0);
        // Enable the attribute
        this.glContext.enableVertexAttribArray(coord);

        return 1;
    }
}