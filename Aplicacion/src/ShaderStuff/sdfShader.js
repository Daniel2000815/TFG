import { operators } from './operators';

export const fs = (sdf, primitives) => {
  return  `
    #ifdef GL_ES
    precision mediump float;
    #endif

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
        float sd;   // signed distance value
        Material mat;
    };

    // Rotate around a circular path
    mat2 rotate2d(float theta){
        float s = sin(theta),c=cos(theta);
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

    ${operators()}
    ${primitives}

    Surface minWithColor(Surface obj1,Surface obj2){
        if(obj2.sd<obj1.sd) return obj2;
        return obj1;
    }


    Surface map(vec3 p){
        Material mat = Material(u_specular, u_diffuse, u_ambient, u_smoothness);
        float sdf = ${sdf};
        
        Surface co = Surface(sdf, mat);
        
        return co;
    }

    vec3 grad( in vec3 p )
    {
    return vec3(
        map(vec3(p.x+EPSILON,p.y,p.z)).sd - map(vec3(p.x-EPSILON,p.y,p.z)).sd,
        map(vec3(p.x,p.y+EPSILON,p.z)).sd - map(vec3(p.x,p.y-EPSILON,p.z)).sd,
        map(vec3(p.x,p.y,p.z+EPSILON)).sd - map(vec3(p.x,p.y,p.z-EPSILON)).sd
    );
    }

    mat3 camera(vec3 cameraPos,vec3 lookAtPoint){
    vec3 cd = normalize(lookAtPoint-cameraPos);      // camera direction
    vec3 cr = normalize(cross(vec3(0.,1.,0.),cd)); // camera right
    vec3 cu = normalize(cross(cd,cr));               // camera up
    
    return mat3(-cr,cu,-cd);
    }

    Surface rayMarch(vec3 ro,vec3 rd,float start,float end){
    float depth = start;
    Surface co; // closest object
    
    for(int i=0; i<MAX_MARCHING_STEPS; i++){
        vec3 p = ro + depth*rd;
        co = map(p);
        depth += co.sd;
        if(co.sd<PRECISION||depth>end)  break;
    }
    
    co.sd = depth;
    
    return co;
    }

    vec3 lighting(vec3 p,vec3 n,vec3 eye,Material mat){
    vec3 ambient = vec3(.5);
    
    vec3 lights_pos[2];
    lights_pos[0] = vec3(4.,2.,2.);
    lights_pos[1] = vec3(-4.,-2.,-2.);
    
    vec3 lights_color[2];
    lights_color[0] = vec3(1.,1.,1.);
    lights_color[1] = vec3(1.,1.,1.);
    
    vec3 Ip = mat.ambient*ambient;
    
    for(int i=0;i<2;i++){
        vec3 Lm = normalize(lights_pos[i] - p);
        vec3 Rm = normalize(2.0*(dot(Lm,n))*n - Lm); // reflect(-Lm, n)
        vec3 V  = normalize(eye - p);
        
        float LN = dot(Lm,n);
        float RV = dot(Rm,V);
        
        if(LN<0.) // Light not visible
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
        map(vec3(p.x+EPSILON,p.y,p.z)).sd - map(vec3(p.x-EPSILON,p.y,p.z)).sd,
        map(vec3(p.x,p.y+EPSILON,p.z)).sd - map(vec3(p.x,p.y-EPSILON,p.z)).sd,
        map(vec3(p.x,p.y,p.z+EPSILON)).sd - map(vec3(p.x,p.y,p.z-EPSILON)).sd
    ));
    }
    
    void main()
    {
        vec2 uv = (gl_FragCoord.xy - 0.5*iResolution.xy) / iResolution.y;
        
        vec2 mouseUV = iMouse.x>=0.0 ? iMouse.xy/iResolution.xy : vec2(0.5);  // [0,1]

        vec3 backgroundColor = vec3(.835, 1.0, 1.0);
        vec3 col    = vec3(0.0);
        
        vec3 lookAt = vec3(0.0);
        vec3 eye    = vec3(0,5,0);

        float cameraRadius = u_zoom;
        
        eye.yz = eye.yz * cameraRadius * rotate2d( mix(PI, 0.0, mouseUV.y) );
        eye.xz = eye.xz * rotate2d( mix(-PI, PI, mouseUV.x) ) 
                    + vec2(lookAt.x, lookAt.z);
        
        vec3 rayDir = camera(eye, lookAt) * normalize(vec3(uv,-1));// ray direction
        
        Surface co = rayMarch(eye, rayDir, MIN_DIST, MAX_DIST);// closest object
        
        if(co.sd > MAX_DIST){
            col = backgroundColor;  // ray didn't hit anything
        }
        else{
            vec3 p = eye + rayDir*co.sd;  // point from ray marching
            vec3 normal = calcNormal(p);
            
            col = lighting(p, normal, eye, co.mat);
        }
        
        gl_FragColor = vec4(col, 1.0);
        return;
    }
  `;
};
