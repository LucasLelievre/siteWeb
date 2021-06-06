precision mediump float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec3 colour = vec3(0.0);

    vec2 coord = mod(gl_FragCoord.xy, 30.);

    if (coord.x<10.) {
        colour = vec3(0.7412, 0.7412, 0.7412);
    }
    if (coord.y<10.) {
        colour = vec3(0.5529, 0.5529, 0.5529);
    }

    gl_FragColor = vec4(colour, 1.);
}