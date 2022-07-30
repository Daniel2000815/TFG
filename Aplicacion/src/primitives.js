export const primitives = () => `
    float sphere( vec3 p, float s )
    {
    return length(p)-s;
    }

    float box( vec3 p, vec3 b )
    {
    vec3 q = abs(p) - b;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
    }
`