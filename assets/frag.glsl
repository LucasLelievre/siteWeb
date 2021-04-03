precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 FC = vec2(gl_FragCoord.xy);
    vec2 r = u_resolution;
    float t = u_time;
    vec4 o = gl_FragColor;

    vec2 zoomPos = vec2(-0.7454,-.113);

    // Zoom
    //vec2 p = (FC.xy*2.-r) / r.y / exp(5.-cos(t)*6.) + zoomPos;
    vec2 p = (FC.xy*2.-r) / r.y / exp(5.-1.*6.) + zoomPos;

    // Matrices as complex numbers, mat2(x,-y,y,x) is x + iy
    mat2 C = mat2(p.x,-p.y,p.y,p.x);
    mat2 Z;
    for(int i = 0; i <= 255; i++) {
        if (length(Z[0]) < 2. && gl_FragColor.w++ < 2e2) {
            Z=Z*Z+C;
            //gl_FragColor += 0.005 * ((-cos(t)+1.)/2.) * 100.;
        }
    }
    gl_FragColor = vec4(u_mouse, 0.0, 1.0);
}