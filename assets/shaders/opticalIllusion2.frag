precision mediump float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.1415

void main(){
    vec3 colour=vec3(0.5);
    
    vec2 center=u_resolution/vec2(4.,2.);
    vec2 pos=mod(gl_FragCoord.xy,center*2.);
    vec2 relaPos=pos-center;
    
    float isCenterPoint=sign(length(relaPos)-u_resolution.x/64.);
    colour=(isCenterPoint>0.)?colour:vec3(u_mouse/u_resolution.y,abs(sin(u_time)));
    
    // float time=u_time*1.75;
    // time=0.;
    // for(float i=0.;i<6.;++i){
    //     vec2 posCircle=vec2(sin(time+(PI/3.)*i),cos(time+(PI/3.)*i))*u_resolution.x/8.;
    //     if(length(relaPos-posCircle)<u_resolution.x/64.){
    //         colour=vec3(1.*mod(floor(degrees(acos(dot(normalize(vec2(sin(-u_time),cos(u_time))),normalize(relaPos)))/5.)-.5),2.));
    //     }
    // }
    
    if(true){
        float time=u_time*1.75;
        vec2 up=vec2(sin(time),cos(time));
        up = vec2(0.,1.);
        float angleUp = acos(dot(normalize(up), vec2(0.,1.)));
        float angleBetween=acos(dot(normalize(up),normalize(relaPos)));
        float isGThalf = (mod(angleBetween, PI/3.)/(PI/3.) > PI/6.) ? 1.0 : 0.0;
        float closestPIfract = (PI/3.)*floor(angleBetween/(PI/3.)) + (PI/3.)*isGThalf;
        closestPIfract += angleUp*sign(relaPos.x);
        vec2 closestCircle = vec2(sin(closestPIfract)*sign(relaPos.x), cos(closestPIfract));
        closestCircle *=u_resolution.x/8.;

        if(length(relaPos-closestCircle)<u_resolution.x/64.) {
            colour = vec3(1.0);
            colour=vec3(1.*mod(floor(degrees(acos(dot(normalize(vec2(sin(-u_time),cos(u_time))),normalize(relaPos)))/5.)-.5),2.));
        }
        colour = vec3(isGThalf);
    }
    
    gl_FragColor=vec4(colour,1.);
}