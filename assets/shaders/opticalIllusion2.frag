precision mediump float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.1415

void main(){
    vec3 colour=vec3(.5);
    
    vec2 center=u_resolution/vec2(4., 2.);
    vec2 pos = mod(gl_FragCoord.xy, center*2.);
    vec2 relaPos = pos-center;

    if(length(relaPos)<u_resolution.x/64.){
        colour=vec3(u_mouse/u_resolution.y,abs(sin(u_time)));
    }

        
    float time=u_time*1.75;
    for(float j=0.;j<6.;++j){
        vec2 posCircle=vec2(sin(time+(PI/3.)*j),cos(time+(PI/3.)*j))*u_resolution.x/8.;
        if(length(relaPos-posCircle)<u_resolution.x/64.){
            vec2 up=vec2(sin(-u_time),cos(u_time));
            float angleBetween=acos(dot(normalize(up),normalize(relaPos)));
            angleBetween=floor(degrees(angleBetween/5.)-0.5);
            if(mod(angleBetween,2.)==0.){
                colour=vec3(.0);
            }else{
                colour=vec3(1.);
            }
        }
    }
    
    gl_FragColor=vec4(colour,1.);
}