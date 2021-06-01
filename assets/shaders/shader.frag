precision mediump float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform int u_select;

#define PI 3.1415

void defaultShader(){
    gl_FragColor=vec4(vec2(u_mouse/u_resolution.y),abs(sin(u_time)),1.);
}

void mandelbrotV1(){
    vec2 FC=vec2(gl_FragCoord.xy);
    vec2 r=u_resolution;
    float t=u_time;
    vec4 o=gl_FragColor;
    
    //vec2 zoomPos = vec2(-0.7454,-.113);
    //vec2 zoomPos = (vec2(u_mouse.x*-1., u_mouse.y)/u_resolution)*2. + vec2(4., 0.7);
    //vec2 zoomPos = vec2(0, 0);
    
    // Zoom
    //vec2 p = (FC.xy*2.-r) / r.y / exp(5.-cos(t)*6.) + zoomPos;
    vec2 p=(FC.xy*2.-r)/r.y/exp(5.-1.*6.);
    
    // Matrices as complex numbers, mat2(x,-y,y,x) is x + iy
    mat2 C=mat2(p.x,-p.y,p.y,p.x);
    mat2 Z;
    for(int i=0;i<=255;i++){
        if(length(Z[0])<2.&&gl_FragColor.w++<2e2){
            Z=Z*Z+C;
            //gl_FragColor += 0.005 * ((-cos(t)+1.)/2.) * 100.;
            gl_FragColor+=((-cos(t)+1.)/2.+.05)*.1;
        }
    }
    //gl_FragColor = vec4(vec3(u_mouse.x/u_resolution.x), 1.0);
}

void mandelbrotV2(){
    //vec2 m = (u_mouse-u_resolution/2.)/u_resolution.y;
    //m = vec2(m.x, (m.y)*-1.)*0.25;
    // center
    //vec2 p = (gl_FragCoord.xy-u_resolution/2.)/u_resolution.y - m - vec2(1.5, 0.0);
    vec2 mouse=vec2(u_mouse.x,(u_mouse.y)*-1.);
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

void colourMouse(){
    gl_FragColor=vec4(vec2(u_mouse/u_resolution.y),cos(u_time),1.);
}

void opticalCircles1(){
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

void opticalCircles2(){
    
    vec2 center=u_resolution/vec2(4., 2.);
    vec2 pos = mod(gl_FragCoord.xy, center*2.);
    vec2 relaPos = pos-center;
    
    if(length(relaPos)<10.){
        gl_FragColor=vec4(vec2(u_mouse/u_resolution.y),abs(sin(u_time)), 1.);
    } else {
        vec3 colour=vec3(.5);
        float time=u_time*1.75;
        for(float j=0.;j<6.;++j){
            vec2 posCircle=vec2(sin(time+(PI/3.)*j),cos(time+(PI/3.)*j))*100.;
            if(length(relaPos-posCircle)<10.){
                vec2 up=vec2(sin(-u_time),cos(u_time));
                float angleBetween=acos(dot(normalize(up),normalize(relaPos)));
                angleBetween=float(int(degrees(angleBetween/5.)));
                if(mod(angleBetween,2.)==0.){
                    colour=vec3(.0);
                }else{
                    colour=vec3(1.);
                }
            }
        }
        gl_FragColor=vec4(colour,1.);
    }
}

void main(){
    if(u_select==1){
        mandelbrotV2();
    }else if(u_select==2){
        opticalCircles1();
    }else if(u_select==3){
        opticalCircles2();
    }else{
        defaultShader();
    }
}