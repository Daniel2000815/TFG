export const defaultShader = () => `
#define T_MAX 30.0

struct point_light
{
    vec3 p;
    vec3 i;
};

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

vec3 opRep( in vec3 p, in vec3 c)
{
    vec3 q = mod(p,c)-0.5*c;
    return q;
}

float sdf(in vec3 p, out int matid)
{
    float sphere_sdf = length(p - vec3(0, 1, 0)) - 1.0;
    float box_sdf = sdBox(p - vec3(0, 1, 0), vec3(0.8));
    float obj_sdf = max(-sphere_sdf, box_sdf);
    float floor_sdf = abs(p.y);
    
    float sdf = min(obj_sdf, floor_sdf);
    if (sdf == obj_sdf)
    {
        matid = 1;
    }
    else
    {
        matid = 0;
    }
    
    return sdf;
}

vec3 sdf_n(in vec3 p)
{
    vec3 res = vec3(0);
    
    int ignored;
    res.x = sdf(p + vec3(0.001, 0, 0), ignored) - sdf(p, ignored);
    res.y = sdf(p + vec3(0, 0.001, 0), ignored) - sdf(p, ignored);
    res.z = sdf(p + vec3(0, 0, 0.001), ignored) - sdf(p, ignored);
    
    return normalize(res);
}

float intersect(in vec3 ro, in vec3 rd, out int matid)
{
	float t = 0.0;
    matid = -1;
    for (int i = 0; i < 256; ++i)
    {
        if (t > T_MAX)
        {
            break;
        }
        
        int curr_matid = -1;
		float d = sdf(ro + t*rd, curr_matid);
        if (d < 0.0001)
        {
            matid = curr_matid;
            break;
        }
        t += d;
    }
    return t;
}

float dir_shadow(in vec3 p, in vec3 l)
{
    float t = 0.15;
    float t_max = 20.0;
    
    float res = 1.0;
    for (int i = 0; i < 256; ++i)
    {
        if (t > t_max) break;
        
        int ignored;
        float d = sdf(p + t*l, ignored);
        if (d < 0.01)
        {
            return 0.0;
        }
        t += d;
        res = min(res, 8.0 * d / t);
    }
    
    return res;
}

float point_shadow(in vec3 p, in vec3 light_p)
{
    vec3 l = normalize(light_p - p);
        
    float t = 0.15;
    float t_max = distance(light_p, p);
    
    float res = 1.0;
    for (int i = 0; i < 256; ++i)
    {
        if (t > t_max) break;
        
        int ignored;
        float d = sdf(p + t*l, ignored);
        if (d < 0.01)
        {
            return 0.0;
        }
        t += d;
        res = min(res, 64.0 * d / t);
    }
    
    return res;
}

float ao(in vec3 p, in vec3 n)
{
    float e = 0.1;
    float res = 0.0;
    
#define AO_ITER 5
    
    int ignored;
    float weight = 0.5;
    for (int i = 1; i <= AO_ITER; ++i)
    {
        float d = e * float(i);
        res += weight * (1.0 - (d - sdf(p + d * n, ignored)));
        weight *= 0.5;
    }
    
    return res;
}

vec3 render(in vec2 fragCoord)
{
   	vec2 uv = 2.0 * fragCoord / iResolution.xy - 1.0;
    uv.x *= iResolution.x / iResolution.y;
     
    float cam_d = 3.0;
    float time = 0.6;
    vec3 ro = vec3(cam_d*sin(time), 2.5, cam_d*cos(time));
    vec3 at = vec3(0, 1, 0);
    vec3 cam_z = normalize(at - ro);
    vec3 cam_x = normalize(cross(vec3(0,1,0), cam_z));
    vec3 cam_y = cross(cam_z, cam_x);
    vec3 rd = normalize(uv.x * cam_x + uv.y * cam_y + 1.73 * cam_z);
	
    vec3 sky = vec3(0.02);
    vec3 col = vec3(0);
    
    int matid = -1;
    float t = intersect(ro, rd, matid);
    if (matid != -1)
    { 
        vec3 p = ro + t*rd;
        vec3 n = sdf_n(p);
        
#define PLIGHT_COUNT 1 
        point_light plights[PLIGHT_COUNT];
        plights[0] = point_light(vec3(2, 1, 1), vec3(20));

        vec3 direct_light = vec3(0);
        for (int plight_index = 0; plight_index < PLIGHT_COUNT; ++plight_index)
        {
            vec3 light_i = plights[plight_index].i;
            vec3 light_p = plights[plight_index].p;
        	float light_r = dot(light_p - p, light_p - p);
        	vec3 l = normalize(light_p - p);
        
        	direct_light += point_shadow(p, light_p) * max(0.0, dot(n, l)) * light_i / (light_r * light_r);
        }

        vec3 indirect_light = ao(p, n) * sky;
        
        vec3 albedo = vec3(0.9);      
		col = albedo * (0.7 * direct_light + indirect_light);
        
        col = mix(col, vec3(0), clamp(pow(t / T_MAX, 2.0), 0.0, 1.0));
    }
    
    return col;
}

vec3 tonemap(in vec3 col)
{
    return col / (1.0 + col);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
#if 0
    vec3 col = tonemap(render(fragCoord));
#else
    vec3 col = vec3(0);
    col += tonemap(render(fragCoord + vec2(0.25, 0.25)));
    col += tonemap(render(fragCoord + vec2(0.25, -0.25)));
    col += tonemap(render(fragCoord + vec2(-0.25, -0.25)));
    col += tonemap(render(fragCoord + vec2(-0.25, 0.25)));
    col /= 4.0;
#endif
    
    col = sqrt(col);
    fragColor = vec4(col, 1.0);
}
`;
