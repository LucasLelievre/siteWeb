precision mediump float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.1415

void main() {
    vec3 colour=vec3(.5);
    
    vec2 center=u_resolution/vec2(4.,4.);
    vec2 FragCoord=mod(gl_FragCoord.xy,center*2.);
    
    float dist=length(FragCoord-center);
    float time=u_time*10.;
    
    float minRes=(center.x>=center.y)?center.y:center.x;
    float minFragCoord=(center.x>=center.y)?FragCoord.y:FragCoord.x;
    
    float innerCircle=minRes/2.46;
    float outerCircle=minRes/1.52;
    
    if(dist<minRes/1.5&&dist>minRes/2.5){
        if(dist<innerCircle||dist>outerCircle){
            if(sign(sin(u_time/2.))>0.){
                // inflate
                time=time+(PI/4.)*sign(sin(u_time));
            }else{
                // move up down
                time=time+PI/4.*sign(minFragCoord-minRes)*sign(sin(u_time));
            }
        }
        
        vec2 point=FragCoord-center;
        float a=dot(point,vec2(sin(time),cos(time)));
        float b=dot(point,vec2(sin(time+PI/2.),cos(time+PI/2.)));
        
        if(sign(a)==sign(b)){
            //colour=vec3(.99,.77,.18);
            colour=vec3(1.);
        }else{
            //colour=vec3(0.,.22,.8);
            colour=vec3(0.);
        }
    }
    
    gl_FragColor=vec4(colour,1.);
}