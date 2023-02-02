#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform mat4 viewMatrix;

uniform mat4 viewMatrix;

// Camera position
uniform vec3 cameraPosition;

// Point that the camera is looking at
uniform vec3 targetPosition;

// Up direction for the camera
uniform vec3 upDirection;

// Sensitivity of the camera movement (adjust as needed)
const float sensitivity=.01;

// Previous mouse position (used to calculate mouse delta)
vec2 prevMousePos;

// Constants
const int MAX_MARCHING_STEPS=255;
const float MIN_DIST=0.;
const float MAX_DIST=100.;
const float PRECISION=.0001;
const float EPSILON=.0005;
const float PI=3.14159265359;

struct Material
{
  vec3 specular;
  vec3 diffuse;
  vec3 ambient;
  float smoothness;
};

struct Surface{
  float sd;// signed distance value
  Material mat;
};

// Rotate around a circular path
mat2 rotate2d(float theta){
  float s=sin(theta),c=cos(theta);
  return mat2(c,-s,s,c);
}

// Rotation matrix around the X axis.
mat3 rotateX(float theta){
  float c=cos(theta);
  float s=sin(theta);
  return mat3(
    vec3(1.,0.,0.),
    vec3(0.,c,-s),
    vec3(0.,s,c)
  );
}

// Rotation matrix around the Y axis.
mat3 rotateY(float theta){
  float c=cos(theta);
  float s=sin(theta);
  return mat3(
    vec3(c,0.,s),
    vec3(0.,1.,0.),
    vec3(-s,0.,c)
  );
}

// Rotation matrix around the Z axis.
mat3 rotateZ(float theta){
  float c=cos(theta);
  float s=sin(theta);
  return mat3(
    vec3(c,-s,0.),
    vec3(s,c,0.),
    vec3(0.,0.,1.)
  );
}

// Identity matrix.
mat3 identity(){
  return mat3(
    vec3(1,0,0),
    vec3(0,1,0),
    vec3(0,0,1)
  );
}

// === SDFs ===
float sphere(vec3 p,float radius)
{
  return length(p)-radius;
}

float box(vec3 p,vec3 size)
{
  vec3 q=abs(p)-size;
  return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);
}

float torus(vec3 p,vec2 size)
{
  vec2 q=vec2(length(p.xz)-size.x,p.y);
  return length(q)-size.y;
}

float cylinder(vec3 p,float h,float r)
{
  vec2 d=abs(vec2(length(p.xz),p.y))-vec2(r,h);
  return min(max(d.x,d.y),0.)+length(max(d,0.));
}

float line(in vec3 p,in vec3 start,in vec3 end,in float thickness){
  vec3 ba=end-start;
  vec3 pa=p-start;
  float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);
  
  return length(pa-h*ba)-thickness;
}

Surface minWithColor(Surface obj1,Surface obj2){
  if(obj2.sd<obj1.sd)return obj2;
  return obj1;
}

float f(vec3 p)
{
  float x=p.r;
  float y=p.g;
  float z=p.b;
  
  return(x*x+y*y+z*z-12.)/sqrt(4.*x*x+4.*y*y+4.*z*z);
}

Surface map(vec3 p){
  Material mat=Material(vec3(1.),vec3(1.,0.,0.),vec3(.2),10.);
  
  float sphere=f(p);
  
  Surface co=Surface(sphere,mat);
  
  return co;
}

vec3 grad(in vec3 p)
{
  return vec3(
    map(vec3(p.x+EPSILON,p.y,p.z)).sd-map(vec3(p.x-EPSILON,p.y,p.z)).sd,
    map(vec3(p.x,p.y+EPSILON,p.z)).sd-map(vec3(p.x,p.y-EPSILON,p.z)).sd,
    map(vec3(p.x,p.y,p.z+EPSILON)).sd-map(vec3(p.x,p.y,p.z-EPSILON)).sd
  );
}

mat3 camera(vec3 cameraPos,vec3 lookAtPoint){
  vec3 cd=normalize(lookAtPoint-cameraPos);// camera direction
  vec3 cr=normalize(cross(vec3(0.,1.,0.),cd));// camera right
  vec3 cu=normalize(cross(cd,cr));// camera up
  
  return mat3(-cr,cu,-cd);
}

Surface rayMarch(vec3 ro,vec3 rd,float start,float end){
  float depth=start;
  Surface co;// closest object
  
  for(int i=0;i<MAX_MARCHING_STEPS;i++){
    vec3 p=ro+depth*rd;
    co=map(p);
    depth+=co.sd;
    if(co.sd<PRECISION||depth>end)break;
  }
  
  co.sd=depth;
  
  return co;
}

vec3 lighting(vec3 p,vec3 n,vec3 eye,Material mat){
  vec3 ambient=vec3(.5);
  
  vec3 lights_pos[2];
  lights_pos[0]=vec3(4.,2.,2.);
  lights_pos[1]=vec3(-4.,-2.,-2.);
  
  vec3 lights_color[2];
  lights_color[0]=vec3(1.,1.,1.);
  lights_color[1]=vec3(1.,1.,1.);
  
  vec3 Ip=mat.ambient*ambient;
  
  for(int i=0;i<2;i++){
    vec3 Lm=normalize(lights_pos[i]-p);
    vec3 Rm=normalize(2.*(dot(Lm,n))*n-Lm);// reflect(-Lm, n)
    vec3 V=normalize(eye-p);
    
    float LN=dot(Lm,n);
    float RV=dot(Rm,V);
    
    if(LN<0.)// Light not visible
    Ip+=vec3(0.,0.,0.);
    else if(RV<0.)// opposite direction as viewer, apply only diffuse
    Ip+=lights_color[i]*(mat.diffuse*LN);
    else
    Ip+=lights_color[i]*(mat.diffuse*LN+mat.specular*pow(RV,mat.smoothness));
  }
  
  return Ip;
}

vec3 calcNormal(in vec3 p){
  return normalize(vec3(
      map(vec3(p.x+EPSILON,p.y,p.z)).sd-map(vec3(p.x-EPSILON,p.y,p.z)).sd,
      map(vec3(p.x,p.y+EPSILON,p.z)).sd-map(vec3(p.x,p.y-EPSILON,p.z)).sd,
      map(vec3(p.x,p.y,p.z+EPSILON)).sd-map(vec3(p.x,p.y,p.z-EPSILON)).sd
    ));
  }
  
  mat4 lookAt(vec3 cameraPosition,vec3 targetPosition,vec3 upDirection){
    vec3 zAxis=normalize(targetPosition-cameraPosition);
    vec3 xAxis=normalize(cross(upDirection,zAxis));
    vec3 yAxis=cross(zAxis,xAxis);
    
    mat4 viewMatrix=mat4(
      vec4(xAxis,0.),
      vec4(yAxis,0.),
      vec4(zAxis,0.),
      vec4(0.,0.,0.,1.)
    );
    
    viewMatrix[3]=vec4(-dot(xAxis,cameraPosition),-dot(yAxis,cameraPosition),-dot(zAxis,cameraPosition),1.);
    
    return viewMatrix;
  }
  
  void main()
  {
    // nuevo
    // Calculate the mouse delta since the last frame
    vec2 mouseDelta=vec2(u_mouse.xy)-prevMousePos;
    
    // Update the previous mouse position
    prevMousePos=vec2(u_mouse.xy);
    
    // Adjust the camera position based on the mouse delta
    cameraPosition=cameraPosition+mouseDelta*sensitivity;
    
    // Calculate the view matrix based on the camera position, target position, and up direction
    viewMatrix=lookAt(cameraPosition,targetPosition,upDirection);
    
    // Transform the ray direction using the inverse of the view matrix
    vec3 rayDirection=(viewMatrix*vec4(rayDirection,0.)).xyz;
    // ===
    
    vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    vec2 mouseUV=u_mouse.xy/u_resolution.xy;// [0,1]
    
    vec3 backgroundColor=vec3(.835,1.,1.);
    vec3 col=vec3(0.);
    
    vec3 lookAt=vec3(0.);
    vec3 eye=vec3(0,5,0);
    
    float cameraRadius=2.;
    eye.yz=eye.yz*cameraRadius*rotate2d(mix(PI,0.,mouseUV.y));
    eye.xz=eye.xz*rotate2d(mix(-PI,PI,mouseUV.x))
    +vec2(lookAt.x,lookAt.z);
    
    vec3 rayDir=camera(eye,lookAt)*normalize(vec3(uv,-1));// ray direction
    
    Surface co=rayMarch(eye,rayDir,MIN_DIST,MAX_DIST);// closest object
    
    if(co.sd>MAX_DIST){
      col=backgroundColor;// ray didn't hit anything
    }
    else{
      vec3 p=eye+rayDir*co.sd;// point from ray marching
      vec3 normal=calcNormal(p);
      
      col=lighting(p,normal,eye,co.mat);
    }
    
    gl_FragColor=vec4(col,1.);
    return;
  }