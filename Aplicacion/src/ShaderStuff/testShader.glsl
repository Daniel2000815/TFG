#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;

// Constants
const int MAX_MARCHING_STEPS = 255;
const float MIN_DIST = 0.0;
const float MAX_DIST = 100.0;
const float PRECISION = 0.001;
const float EPSILON = 0.0005;
const float PI = 3.14159265359;

struct Material
{
	vec3 specular;
	vec3 diffuse;
	vec3 ambient;
	float smoothness;
};

struct Surface {
    float sd; // signed distance value
    Material mat;
};

// Rotate around a circular path
mat2 rotate2d(float theta) {
  float s = sin(theta), c = cos(theta);
  return mat2(c, -s, s, c);
}

// Rotation matrix around the X axis.
mat3 rotateX(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(1.0, 0.0, 0.0),
        vec3(0.0, c, -s),
        vec3(0.0, s, c)
    );
}

// Rotation matrix around the Y axis.
mat3 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, 0.0, s),
        vec3(0.0, 1.0, 0.0),
        vec3(-s, 0.0, c)
    );
}

// Rotation matrix around the Z axis.
mat3 rotateZ(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, -s, 0.0),
        vec3(s, c, 0.0),
        vec3(0.0, 0.0, 1.0)
    );
}

// Identity matrix.
mat3 identity() {
    return mat3(
        vec3(1, 0, 0),
        vec3(0, 1, 0),
        vec3(0, 0, 1)
    );
}



Surface sdBox( vec3 p, vec3 b, vec3 offset, Material mat, mat3 transform)
{
  p = (p - offset) * transform; // apply transformation matrix
  vec3 q = abs(p) - b;
  float d = length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
  return Surface(d, mat);
}

Surface sdFloor(vec3 p, Material mat) {
  float d = p.y + 1.0;
  return Surface(d, mat);
}

Surface minWithColor(Surface obj1, Surface obj2) {
  if (obj2.sd < obj1.sd) return obj2;
  return obj1;
}

Surface sdScene(vec3 p) {
  Material floorMat = Material(vec3(0.0), vec3(0.8),         vec3(0.2), 1.0);
  Material b1Mat    = Material(vec3(1.0), vec3(1.0,0.0,0.0), vec3(0.2), 10.0);
  Material b2Mat    = Material(vec3(4.0),   vec3(0.0,1.0,0.0), vec3(0.2), 30.0);
  Material b3Mat    = Material(vec3(10.0),  vec3(0.0,0.0,1.0), vec3(0.2), 50.0);

  vec3 floorColor = vec3(1. + 0.7*mod(floor(p.x) + floor(p.z), 2.0));
  Surface co = sdFloor(p, floorMat);
  co = minWithColor(co, sdBox(p, vec3(1.0), vec3(-4.0, 0.5, -4.0), b1Mat, identity())); // left cube
  co = minWithColor(co, sdBox(p, vec3(1.0), vec3(0.0, 0.5, -4.0), b2Mat, identity())); // center cube
  co = minWithColor(co, sdBox(p, vec3(1.0), vec3(4.0, 0.5, -4.0), b3Mat, identity())); // right cube
  return co;
}

mat3 camera(vec3 cameraPos, vec3 lookAtPoint) {
	vec3 cd = normalize(lookAtPoint - cameraPos); // camera direction
	vec3 cr = normalize(cross(vec3(0.0, 1.0, 0.0), cd)); // camera right
	vec3 cu = normalize(cross(cd, cr)); // camera up
	
	return mat3(-cr, cu, -cd);
}

Surface rayMarch(vec3 ro, vec3 rd, float start, float end) {
  float depth = start;
  Surface co; // closest object

  for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
    vec3 p = ro + depth * rd;
    co = sdScene(p);
    depth += co.sd;
    if (co.sd < PRECISION || depth > end) break;
  }
  
  co.sd = depth;
  
  return co;
}

vec3 lighting(vec3 p,vec3 n,vec3 eye, Material mat){
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

vec3 calcNormal(in vec3 p) {
    return normalize(vec3(
		sdScene(vec3(p.x+EPSILON,p.y,p.z)).sd -sdScene(vec3(p.x-EPSILON,p.y,p.z)).sd,
		sdScene(vec3(p.x,p.y+EPSILON,p.z)).sd-sdScene(vec3(p.x,p.y-EPSILON,p.z)).sd,
		sdScene(vec3(p.x,p.y,p.z+EPSILON)).sd-sdScene(vec3(p.x,p.y,p.z-EPSILON)).sd
	));
}

void main()
{

  vec2 uv = (gl_FragCoord.xy - 0.5*u_resolution.xy)/u_resolution.y;
  vec2 mouseUV = u_mouse.xy/u_resolution.xy; // [0,1]
  vec3 backgroundColor = vec3(0.835, 1, 1);

  vec3 col = vec3(0.0);
  vec3 lookAt = vec3(0, 0.5, -4); // lookat point (aka camera target)
  vec3 eye = vec3(0, 5, 0); // ray origin that represents camera position
  
  float cameraRadius = 2.;
  eye.yz = eye.yz * cameraRadius * rotate2d(mix(PI/2., 0., mouseUV.y));
  eye.xz = eye.xz * rotate2d(mix(-PI, PI, mouseUV.x)) + vec2(lookAt.x, lookAt.z);
  
  vec3 rayDir = camera(eye, lookAt) * normalize(vec3(uv, -1)); // ray direction

  Surface co = rayMarch(eye, rayDir, MIN_DIST, MAX_DIST); // closest object

  if (co.sd > MAX_DIST) {
    col = backgroundColor; // ray didn't hit anything
  } 
  else {
    vec3 p = eye + rayDir * co.sd; // point on cube or floor we discovered from ray marching
    vec3 normal = calcNormal(p);

    col = lighting(p, normal, eye, co.mat);
  }

  gl_FragColor = vec4(col, 1.0);
  return;
}