precision mediump float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec3 colour = vec3(0.0);

    if (mod(floor(gl_FragCoord.x*.1), 3.)==0.) {
        colour = vec3(0.7412, 0.7412, 0.7412);
    }
    if (mod(floor(gl_FragCoord.y*.1), 3.)==0.) {
        colour = vec3(0.5529, 0.5529, 0.5529);
    }

    gl_FragColor = vec4(colour, 1.);
}