precision highp float;
//uniform vec2 resolution;
//uniform vec2 mouse;
uniform float u_time;
//uniform sampler2D backbuffer;
void main(){
  vec2 r=vec2(200, 200);
  vec2 p=(gl_FragCoord.xy*2.-r)/min(r.x,r.y)-r/100.;
  for(int i=0;i<8;++i){
    p.xy=abs(p)/abs(dot(p,p))-vec2(.9+cos(u_time*.2)*.4);
  }
  gl_FragColor=vec4(p.xyx,1);
}