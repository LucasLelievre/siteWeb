precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 FC = vec2(gl_FragCoord.xy);
    vec2 r = u_resolution;
    float t = u_time;
    vec4 o = gl_FragColor;

    //vec2 zoomPos = vec2(-0.7454,-.113);
    //vec2 zoomPos = (vec2(u_mouse.x*-1., u_mouse.y)/u_resolution)*2. + vec2(4., 0.7);
    //vec2 zoomPos = vec2(0, 0);

    // Zoom
    //vec2 p = (FC.xy*2.-r) / r.y / exp(5.-cos(t)*6.) + zoomPos;
    vec2 p = (FC.xy*2.-r) / r.y / exp(5.-1.*6.);

    // Matrices as complex numbers, mat2(x,-y,y,x) is x + iy
    mat2 C = mat2(p.x,-p.y,p.y,p.x);
    mat2 Z;
    for(int i = 0; i <= 255; i++) {
        if (length(Z[0]) < 2. && gl_FragColor.w++ < 2e2) {
            Z=Z*Z+C;
            //gl_FragColor += 0.005 * ((-cos(t)+1.)/2.) * 100.;
            gl_FragColor += ((-cos(t)+1.)/2. + 0.05) * 0.1;
        }
    }
    //gl_FragColor = vec4(vec3(u_mouse.x/u_resolution.x), 1.0);
}

precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    //vec2 m = (u_mouse-u_resolution/2.)/u_resolution.y;
    vec2 m = vec2(u_mouse.x, (u_mouse.y)*-1.);
    // center
    //vec2 p = (gl_FragCoord.xy-u_resolution/2.)/u_resolution.y - m - vec2(1.5, 0.0);
    vec2 origin = vec2(u_resolution.x/2., u_resolution.y)/2.;
    vec2 zoom = vec2(1.4,.0);
    vec2 p = (gl_FragCoord.xy - origin)/u_resolution.y/exp((u_time)) - (m/u_resolution.y);

    // Matrices as complex numbers, mat2(x,-y,y,x) is x + iy
    mat2 C = mat2(p.x,-p.y,p.y,p.x);
    mat2 Z;
    for(int i = 0; i <= 100; i++) {
        if (length(Z[0]) < 2. && gl_FragColor.w++ < 2e2) {
            Z = Z * Z + C;
            gl_FragColor += 0.01;
        }
    }
}

precision mediump float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    gl_FragColor = vec4(vec2(u_mouse/u_resolution.y), cos(u_time), 1.0);
}