#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
const int AA=1;
const int MAX_MARCHING_STEPS=255;
const float EPSILON=.0001;
const float MIN_DIST=0.;
const float MAX_DIST=100.;

const float iTime=1.;

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

struct Material
{
    vec3 specular;
    vec3 diffuse;
    vec3 ambient;
    float smoothness;
};

float map(in vec3 p)
{
    return sphere(p,1.);
}

vec3 rayDirection(vec2 size,vec2 fragCoord){
    const float fov=45.;
    
    vec2 xy=fragCoord-size/2.;
    float z=size.y/tan(radians(fov)/2.);
    
    return normalize(vec3(xy,-z));
}

vec3 normal(vec3 p){
    return normalize(vec3(
            map(vec3(p.x+EPSILON,p.y,p.z))-map(vec3(p.x-EPSILON,p.y,p.z)),
            map(vec3(p.x,p.y+EPSILON,p.z))-map(vec3(p.x,p.y-EPSILON,p.z)),
            map(vec3(p.x,p.y,p.z+EPSILON))-map(vec3(p.x,p.y,p.z-EPSILON))
        ));
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
    
    mat4 viewMatrix(vec3 eye,vec3 center,vec3 up){
        // Based on gluLookAt man page
        vec3 f=normalize(center-eye);
        vec3 s=normalize(cross(f,up));
        vec3 u=cross(s,f);
        return mat4(
            vec4(s,0.),
            vec4(u,0.),
            vec4(-f,0.),
            vec4(0.,0.,0.,1)
        );
    }
    
    float clamp(float val){
        if(val<0.)return 0.;
        if(val>1.)return 1.;
        
        return val;
    }
    
    void main(){
        vec3 total=vec3(0.);
        
        Material mat_red=Material(
            vec3(1.,1.,1.),// specular
            vec3(1.,1.,0.),// diffuse
            vec3(.2),// ambient
            10.0// shiness
        );
        vec3 eye=vec3(10.*cos(iTime),1.,10.*sin(iTime));
        const vec3 backGroundColor=vec3(.7);
        
        for(int m=0;m<AA;m++){
            for(int n=0;n<AA;n++){
                float depth=MIN_DIST;
                
                // create view ray
                vec3 ray=rayDirection(u_resolution.xy,gl_FragCoord.xy);
                mat4 viewToWorld=viewMatrix(eye,vec3(0.,0.,0.),vec3(0.,1.,0.));
                vec3 worldDir=(viewToWorld*vec4(ray,0.)).xyz;
                
                // raytracing
                for(int i=0;i<MAX_MARCHING_STEPS;i++){
                    float dist=map(eye+depth*worldDir);
                    if(dist<EPSILON){
                        vec3 p=eye+depth*worldDir;
                        vec3 n=normal(p);
                        
                        total=total+lighting(p,n,eye,mat_red);
                        
                        break;
                    }
                    
                    depth+=dist;
                    
                    if(depth>=MAX_DIST){
                        total=total+backGroundColor;
                        break;
                    }
                }
            }
        }
        
        total/=float(AA*AA);
        gl_FragColor=vec4(total,1.);
    }