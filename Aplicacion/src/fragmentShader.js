export const fs = (sdf) => {
  return `
  // https://thebookofshaders.com/03/?lan=es
// https://thebookofshaders.com/03/
// http://jamie-wong.com/2016/07/15/ray-marching-signed-distance-functions/#putting-it-all-together
// https://www.shadertoy.com/view/llt3R4

// camera
// https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-to-ray-tracing/how-does-it-work
// http://www.codinglabs.net/article_world_view_projection_matrix.aspx
// https://iopscience.iop.org/article/10.1088/0031-9155/52/12/006/meta
// https://www.ingebook.com/ib/NPcd/IB_BooksVis?cod_primaria=1000187&codigo_libro=6575

#ifdef GL_ES
precision mediump float;
#endif

const int AA = 3;
const int MAX_MARCHING_STEPS = 255;
const float EPSILON = 0.0001;
const float MIN_DIST = 0.0;
const float MAX_DIST = 100.0;


struct Material
{
    vec3 specular;
    vec3 diffuse;
    vec3 ambient;
    float smoothness;
};

float sdfCube(vec3 p, vec3 dim){
    vec3 d = abs(p) - dim;

    float insideDistance = min(max(d.x, max(d.y, d.z)), 0.0);
    float outsideDistance = length(max(d, 0.0));
    
    return insideDistance + outsideDistance;
}

float map( in vec3 pos )
{
    return  sdfCube(pos, vec3(1.0));
}


vec3 rayDirection(vec2 size, vec2 fragCoord) {
    const float fov = 45.0;

    vec2 xy = fragCoord - size / 2.0;
    float z = size.y / tan(radians(fov) / 2.0);

    return normalize(vec3(xy, -z));
}

vec3 normal(vec3 p) {
    return normalize(vec3(
        map(vec3(p.x + EPSILON, p.y, p.z)) - map(vec3(p.x - EPSILON, p.y, p.z)),
        map(vec3(p.x, p.y + EPSILON, p.z)) - map(vec3(p.x, p.y - EPSILON, p.z)),
        map(vec3(p.x, p.y, p.z  + EPSILON)) - map(vec3(p.x, p.y, p.z - EPSILON))
    ));
}

vec3 lighting(vec3 p, vec3 n, vec3 eye, Material mat){
    vec3 ambient = vec3(0.5);

    vec3 lights_pos[2];
    lights_pos[0] = vec3(4.0, 2.0, 2.0);
    lights_pos[1] = vec3(-4.0, -2.0, -2.0);

    vec3 lights_color[2];
    lights_color[0] = vec3(1.0, 1.0, 1.0);
    lights_color[1] = vec3(1.0, 1.0, 1.0);

    vec3 Ip = mat.ambient * ambient;

    for(int i=0; i<2; i++){
        vec3 Lm = normalize(lights_pos[i] - p);
        vec3 Rm = normalize(2.0*(dot(Lm,n))*n - Lm);    // reflect(-Lm, n)
        vec3 V  = normalize(eye - p);

        float LN = dot(Lm, n);
        float RV = dot(Rm, V);

        if (LN < 0.0)   // Light not visible
            Ip += vec3(0.0, 0.0, 0.0);
        else if (RV < 0.0)  // opposite direction as viewer, apply only diffuse
            Ip += lights_color[i] * (mat.diffuse * LN);
        else
            Ip += lights_color[i] * (mat.diffuse*LN + mat.specular*pow(RV, mat.smoothness));
    }

    return Ip;
}

mat4 viewMatrix(vec3 eye, vec3 center, vec3 up) {
    // Based on gluLookAt man page
    vec3 f = normalize(center - eye);
    vec3 s = normalize(cross(f, up));
    vec3 u = cross(s, f);
    return mat4(
        vec4(s, 0.0),
        vec4(u, 0.0),
        vec4(-f, 0.0),
        vec4(0.0, 0.0, 0.0, 1)
    );
}

void main() {
    Material mat_red = Material(
        vec3(1.0, 1.0, 1.0),    // specular
        vec3(color.xyz),        // diffuse
        vec3(0.2),              // ambient
        10.0                    // shiness
    );
    vec3 eye                    = vec3(10.0*cos(iTime), 1.0, 10.0*sin(iTime));
    const vec3 backGroundColor  = vec3(0.7);

    for( int m=0; m<AA; m++ ){
        for( int n=0; n<AA; n++ ){
            float depth = MIN_DIST;

            // create view ray
            vec3 ray = rayDirection(iResolution.xy, gl_FragCoord.xy);
            mat4 viewToWorld = viewMatrix(eye, vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
            vec3 worldDir = (viewToWorld * vec4(ray, 0.0)).xyz;

            // raytracing
            for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
                float dist = map(eye + depth * worldDir);
                if (dist < EPSILON) {
                    vec3 p = eye + depth * worldDir;
                    vec3 n = normal(p);

                    gl_FragColor = vec4(lighting(p, n, eye, mat_red), 1.0);
                    return;
                }

                depth += dist;

                if (depth >= MAX_DIST) {
                    gl_FragColor = vec4(backGroundColor.xyz, 1.0);
                    return;
                }
            }
        }
    }
}

`;
};
