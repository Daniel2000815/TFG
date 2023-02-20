export const primitives = () => `
    float sphere( vec3 p, float radius )
    {
    return length(p)-radius;
    }

    float box( vec3 p, vec3 size )
    {
    vec3 q = abs(p) - size;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
    }

    float torus( vec3 p, vec2 size )
    {
    vec2 q = vec2(length(p.xz)-size.x,p.y);
    return length(q)-size.y;
    }

    float cylinder( vec3 p, float h, float r )
    {
    vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r,h);
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
    }

    float line(in vec3 p, in vec3 start, in vec3 end, in float thickness) {
        vec3 ba = end - start;
        vec3 pa = p - start;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
        return length(pa - h * ba) - thickness;
    }

`