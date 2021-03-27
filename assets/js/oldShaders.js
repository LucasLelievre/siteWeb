// Vertex shader
const vsSource = `
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 vColor;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
}
`;
// Fragment shader
const fsSource = `
varying lowp vec4 vColor;

void main() {
//gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
gl_FragColor = vColor;
}
`;

const shaderProgram = initShaderProgram(glContext, vsSource, fsSource);

const programInfo = {
    program: shaderProgram,
    attribLocations: {
        vertexPosition: glContext.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexColor: glContext.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocation: {
        projectionMatrix: glContext.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: glContext.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
};

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

//
// Creates a shader of the given type, uploads the source and compile it
//
function loadShader(gl, type, source) {
    // Create the shader object
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source)

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occured compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}