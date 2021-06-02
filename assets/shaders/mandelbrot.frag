precision mediump float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
    // vec2 mouse=vec2(u_mouse.x,(u_mouse.y)*-1.);
    vec2 mouse = vec2(u_resolution.x, -u_resolution.y/2.);
    vec2 origin=u_resolution.yy+mouse;
    vec2 p=(gl_FragCoord.xy-origin)/u_resolution.y;
    
    // Matrices as complex numbers, mat2(x,-y,y,x) is x + iy
    mat2 C=mat2(p.x,-p.y,p.y,p.x);
    mat2 Z;
    for(int i=0;i<=100;i++){
        if(length(Z[0])<2.&&gl_FragColor.w++<2e2){
            Z=Z*Z+C;
            gl_FragColor+=((sin(u_time)+1.)/2.+.1)*.1;
        }else{
            break;
        }
    }
}