#version 330 core

uniform vec2 iResolution;               /* screen resolution, value passed from CPU */
uniform float iTime;                    /* current time, value passed from CPU */
uniform int iFrame;                     /* current frame, value passed from CPU */
in vec2 fragCoord;                      /* fragment shader input: fragment coordinates, valued passed from vertex shader */
out vec4 fragColor;                     /* fragment shader output: fragment color, value passed to pixel processing for screen display */

const float M_PI = 3.1415926535;                        /* const value for PI */
// const vec3 BG_COLOR = vec3(184, 243, 255) / 255.;       /* const value for background color */
const vec3 BG_COLOR = vec3(125,0,0) / 255.; 


//// This function converts from Polar Coordinates to Cartesian coordinates

//// Nathan !!!!!

vec2 polar2cart(float angle, float length)
{
    return vec2(cos(angle) * length, sin(angle) * length);
}

//// This is a sample function showing you how to check if a point is inside a triangle

bool inTriangle(vec2 p, vec2 p1, vec2 p2, vec2 p3)
{
    if(dot(cross(vec3(p2 - p1, 0), vec3(p - p1, 0)), cross(vec3(p2 - p1, 0), vec3(p3 - p1, 0))) >= 0. &&
        dot(cross(vec3(p3 - p2, 0), vec3(p - p2, 0)), cross(vec3(p3 - p2, 0), vec3(p1 - p2, 0))) >= 0. &&
        dot(cross(vec3(p1 - p3, 0), vec3(p - p3, 0)), cross(vec3(p1 - p3, 0), vec3(p2 - p3, 0))) >= 0.){
        return true;
    }
    return false;
}

//// This is a sample function showing you how to draw a rotated triangle 
//// Time is specified with iTime

vec3 drawTriangle(vec2 pos, vec2 center, vec3 color)
{
    vec2 p1 = polar2cart(iTime * 2, 80.) + center;
    vec2 p2 = polar2cart(iTime * 2 + 2. * M_PI / 3., 80.) + center;
    vec2 p3 = polar2cart(iTime * 2 + 4. * M_PI / 3., 80.) + center;
    if(inTriangle(pos, p1, p2, p3)){
        return color;
    }
    return vec3(0);
}


/////////////////////////////////////////////////////
//// Step 1 Function: Inside Circle
//// In this function, you will implement a function to checks if a point is inside a circle
//// The inputs include the point position, the circle's center and radius
//// The output is a bool indicating if the point is inside the circle (true) or not (false)
/////////////////////////////////////////////////////
//// Implementation hint: use dot(v,v) to calculate the squared length of a vector v
/////////////////////////////////////////////////////

bool inCircle(vec2 pos, vec2 center, float radius)
{
    /* your implementation starts */
    
    vec2 dist = pos - center;

    return dot(dist,dist) <= (radius * radius);
    
    /* your implementation ends */
}

//// This function calls the inCircle function you implemented above and returns the color of the circle
//// If the point is outside the circle, it returns a zero vector by default
vec3 drawCircle(vec2 pos, vec2 center, float radius, vec3 color)
{
    if(inCircle(pos, center, radius)){
        return color;
    }
    return vec3(0);
}

/////////////////////////////////////////////////////
//// Step 2 Function: Inside Rectangle
//// In this function, you will implement a function to checks if a point is inside a rectangle
//// The inputs include the point position, the left bottom corner and the right top corner of the rectangle
//// The output is a bool indicating if the point is inside the rectangle (true) or not (false)
/////////////////////////////////////////////////////
//// Implementation hint: use .x and .y to access the x and y components of a vec2 variable
/////////////////////////////////////////////////////

bool inRectangle(vec2 pos, vec2 leftBottom, vec2 rightTop)
{
    /* your implementation starts */
    
    /* check if point.x is >= than left bottom x but 
    <= than right top x. if yes, check if point.y is >= left.x but
    <= right.y */

    if (pos.x >= leftBottom.x && pos.x <= rightTop.x) {
        if (pos.y >= leftBottom.y && pos.y <= rightTop.y) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }

    /* your implementation ends */

}

//// This function calls the inRectangle function you implemented above and returns the color of the rectangle
//// If the point is outside the rectangle, it returns a zero vector by default

vec3 drawRectangle(vec2 pos, vec2 leftBottom, vec2 rightTop, vec3 color)
{
    if(inRectangle(pos,leftBottom,rightTop)){
        return color;
    }
    return vec3(0);
}

//// This function draws objects on the canvas by specifying a fragColor for each fragCoord

void mainImage(in vec2 fragCoord, out vec4 fragColor)
{
    //// Get the window center
    vec2 center = vec2(iResolution / 2.);
    vec3 fragOutput = vec3(0.0);
    //// By default we draw an animated triangle 
    //vec3 fragOutput = drawTriangle(fragCoord, center, vec3(1.0));
    
    //// Step 1: Uncomment this line to draw a circle
    //fragOutput = drawCircle(fragCoord, center, 250, vec3(1.0));

    
    //// Step 2: Uncomment this line to draw a rectangle 
    //fragOutput = drawRectangle(fragCoord, center - vec2(500, 50), center + vec2(500, 50), vec3(1.0));


    //// Step 3: Uncomment this line to draw an animated circle with a temporally varying radius controlled by a sine function
    //fragOutput = drawCircle(fragCoord, center, 150 + 50. * sin(iTime * 10), vec3(1.0));

    //// Step 4: Uncomment this line to draw a union of the rectangle and the animated circle you have drawn previously
    //fragOutput = drawRectangle(fragCoord, center - vec2(500, 50), center + vec2(500, 50), vec3(1.0)) + drawCircle(fragCoord, center, 150 + 50. * sin(iTime * 10), vec3(1.0));


    //// Step 5: Implement your customized scene by modifying the mainImage function
    //// Try to leverage what you have learned from Step 1 to 4 to define the shape and color of a new object in the fragment shader
    //// Notice how we put multiple objects together by adding their color values

    vec2 headphoneTopCenter = vec2(center.x, center.y+150);
    vec3 topRec = drawRectangle(fragCoord, headphoneTopCenter-vec2(300,30), headphoneTopCenter+vec2(300,30), vec3(0,0.2,0.6));
    fragOutput += topRec;

    vec2 headphoneConCenter = vec2(center.x-300, center.y);
    vec3 leftRec = drawRectangle(fragCoord, headphoneConCenter-vec2(50,200), headphoneConCenter+vec2(50,120),  vec3(0,0.2,0.6));
    headphoneConCenter = vec2(center.x+300, center.y);
    vec3 rightRec = drawRectangle(fragCoord, headphoneConCenter-vec2(50,200), headphoneConCenter+vec2(50,120),  vec3(0,0.2,0.6));
    fragOutput += leftRec + rightRec;

    vec2 muffCenter = vec2(center.x-250, center.y - 40);
    vec3 leftMuff = drawCircle(fragCoord, muffCenter, 80 + 10. * sin(iTime * 3),  vec3(0,0.2,0.6));
    muffCenter = vec2(center.x+250, center.y - 40);
    vec3 rightMuff = drawCircle(fragCoord, muffCenter, 80 + 10. * sin(iTime * 3),  vec3(0,0.2,0.6));
    fragOutput += leftMuff + rightMuff;

    
    // chaos circles 
    vec2 circleCenter = center + vec2(500, (sin(iTime * 4) + cos(iTime * 5)) * 500);
    vec3 chaosCircle = drawCircle (fragCoord, circleCenter, 20, vec3(1,0,0));
    fragOutput += chaosCircle;
    circleCenter = center + vec2(600, sin(iTime * 6) * 500);
    chaosCircle = drawCircle (fragCoord, circleCenter, 20, vec3(1,0,0));
    fragOutput += chaosCircle;
    circleCenter = center + vec2(400, tan(iTime * 3) * 500);
    chaosCircle = drawCircle (fragCoord, circleCenter, 20, vec3(1,0,0));
    fragOutput += chaosCircle;

    // chaos triangles
    vec2 triangleCenter = center + vec2(-430, (sin(iTime * 4) + cos(iTime * 5)) * 500);
    vec3 chaosTriangle = drawTriangle(fragCoord, triangleCenter, vec3(1,0,0));
    fragOutput += chaosTriangle;
    triangleCenter = center + vec2(-570, sin(iTime * 6) * 500);
    chaosTriangle = drawTriangle(fragCoord, triangleCenter, vec3(1,0,0));
    fragOutput += chaosTriangle;

    /* My implementation of these graphical shapes showcases a scene with
    headphones playing music in a chaotic background. To me, music acts 
    as a universal remedy for anything in my life. The blue headphones playing music 
    contrasts with the red background showcasing a sign of peace within chaos. This is
    accentuated by the several red shapes in the background moving all over the place. 
    The slower rhythm of the headphones "playing" music with the animated circles also
    aims to create a sense of tranquility, which is how I perceive listening to music. 
    The how for the moving shapes is utilizing sin and tan as well as iTime to 
    keep the shapes constantly in motion. The other shapes are implemented using
    techniques found in steps 1-4. I made sure to divide the "parts" of the image
    into sections so I can easily reference parts of the image. */


    //// Set the fragment color to be the background color if it is zero
    if(fragOutput == vec3(0)){
        fragColor = vec4(BG_COLOR, 1.0);
    }
    //// Otherwise set the fragment color to be the color calculated in fragOutput
    else{
        fragColor = vec4(fragOutput, 1.0);
    }
}

void main()
{
    mainImage(fragCoord, fragColor);
}
