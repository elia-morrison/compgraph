struct PointLight {    
    vec3 position;
    float radius;
    vec3 color;
};

struct SpotLight {
    vec3 position;
    vec3 direction;
    float cutOff;
    float outerCutOff;
    float radius;
  
    vec3 color;   
};