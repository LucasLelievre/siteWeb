const vert_basic = `
    attribute vec3 coordinates;
    void main (void) {
        gl_Position=vec4(coordinates,1.);
    }`;
const frag_basic = `
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
    }`;
const frag_mandelbrot = `
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
    }`;
const frag_opt1 = `
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
    }`;
const frag_opt2 = `
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
    }`;