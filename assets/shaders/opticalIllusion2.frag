precision mediump float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.1415926538

void main(){
    vec3 colour=vec3(.5);
    
    vec2 center=u_resolution/vec2(4.,2.);
    vec2 relaPos=mod(gl_FragCoord.xy,center*2.)-center;
    
    float isCenterPoint=sign(length(relaPos)-u_resolution.x/64.);
    colour=(isCenterPoint>0.)?colour:vec3(u_mouse/u_resolution.y,abs(sin(u_time)));
    
    float time=u_time*1.75;
    float PI3 = PI/3.;
    
    vec2 rotation=vec2(sin(time),cos(time));
    vec2 rot90=vec2(cos(-time),sin(-time));
    
    float angleBetween=acos(dot(normalize(rotation),normalize(relaPos)))*sign(dot(relaPos,rot90));
    
    float isGThalf=(mod(angleBetween,PI/3.)/PI3>PI/6.)?1.:0.;
    float closestPIfract=PI3*floor(angleBetween/PI3)+PI3*isGThalf+time;
    
    vec2 closestCircle=vec2(sin(closestPIfract),cos(closestPIfract))*u_resolution.x/8.;
    
    if(length(relaPos-closestCircle)<u_resolution.x/64.){
        colour=vec3(1.*mod(floor(degrees(acos(dot(normalize(vec2(sin(-u_time),cos(u_time))),normalize(relaPos)))/5.)-.5),2.));
    }
    
    gl_FragColor=vec4(colour,1.);
}