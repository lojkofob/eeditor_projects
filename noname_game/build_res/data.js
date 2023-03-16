

 mergeObj ( globalConfigsData, { 

'shaders/base.f':"varying vec2 vUv;uniform sampler2D map;uniform vec3 color;uniform float opacity;void main(){vec4 c=texture2D(map,vUv);c.rgb*=color;gl_FragColor=c*opacity;}",

'shaders/base.v':"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*matrixWorld*vec4(position,1.0);}",

'shaders/blur.f':"varying vec2 vUv;uniform sampler2D m;uniform vec3 c;uniform float a;uniform float b;uniform vec2 r;uniform vec2 d;float blur13(){float k=0.0;vec2 p=d/r;vec2 off1=vec2(1.412)*p;vec2 off2=vec2(3.294)*p;vec2 off3=vec2(5.176)*p;k+=texture2D(m,vUv).a*0.196;k+=texture2D(m,vUv+off1).a*0.297;k+=texture2D(m,vUv-off1).a*0.297;k+=texture2D(m,vUv+off2).a*0.094;k+=texture2D(m,vUv-off2).a*0.094;k+=texture2D(m,vUv+off3).a*0.01;k+=texture2D(m,vUv-off3).a*0.01;k-=abs(1.0-b*vUv.x*vUv.y*(1.0-vUv.x)* (1.0-vUv.y))/100.0;return k*a;}void main(){gl_FragColor=vec4(c,blur13());}",

'shaders/c.f':"uniform vec3 color;uniform float opacity;void main(){gl_FragColor=vec4(color*opacity,opacity);}",

'shaders/circle.f':"varying vec2 vUv;uniform sampler2D map;void main(){float x=vUv.x-0.5;float y=vUv.y-0.5;vec4 c=texture2D(map,vUv);gl_FragColor=(1.0-smoothstep(0.2,0.25,x*x+y*y))*c;}",

'shaders/color.f':"uniform sampler2D map;uniform vec3 color;uniform float opacity;varying vec2 vUv;void main(){float a=texture2D(map,vUv).a;gl_FragColor=vec4(color*a,a)*opacity;}",

'shaders/colorize.f':"varying vec2 vUv;uniform sampler2D map;uniform vec3 color;uniform float opacity;vec3 rgb2hsv(vec3 c){vec4 K=vec4(0.0,-1.0/3.0,2.0/3.0,-1.0);vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g));vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r));float d=q.x-min(q.w,q.y);float e=1.0e-10;return vec3(abs(q.z+(q.w-q.y)/ (6.0*d+e)),d/(q.x+e),q.x);}vec3 hsv2rgb(vec3 c){vec4 k=vec4(1.0,2.0/3.0,1.0/3.0,3.0);vec3 p=abs(fract(vec3(c.r)+k.xyz)*6.0-k.www);return c.b*mix(k.xxx,clamp(p-k.xxx,0.0,1.0),c.g);}void main(){vec4 col=texture2D(map,vUv);vec3 gray=vec3(dot(col.rgb,color.rgb/1.5));col.rgb=hsv2rgb(rgb2hsv(gray)+color*2.0-1.0);gl_FragColor=col*opacity*col.a;}",

'shaders/gold.f':"varying vec2 vUv;uniform sampler2D map;uniform float opacity;uniform vec3 color;uniform vec3 dor;uniform vec3 dors;void main(){vec4 c=texture2D(map,vUv);c.a*=opacity;c.rgb*=color;float yellow=(c.r+c.g)*c.a/((c.b*2.0)*(c.b*2.0)+0.7);float a=PI*((vUv.x-vUv.y/2.0)*6.0+dor.z/30.0);c*=1.0+abs(dors.z)*clamp(yellow*yellow*sin(a+c.g*2.0-c.r*2.0)*cos(a*3.0)/ (vUv.x*2.0+1.0)+cos(a*13.0)*0.1,0.0,1.0);gl_FragColor=c*c.a;}",

'shaders/gray.f':"varying vec2 vUv;uniform sampler2D map;uniform float opacity;void main(){vec4 color=texture2D(map,vUv);float gray=dot(color.rgb,vec3(0.299,0.587,0.114));gl_FragColor=vec4(gray,gray,gray,1.0)*color.a*opacity;}",

'shaders/gray2.f':"varying vec2 vUv;uniform sampler2D map;uniform float opacity;uniform vec3 color;void main(){vec4 c=texture2D(map,vUv);float g=dot(color*c.rgb,vec3(0.299,0.587,0.114));gl_FragColor=vec4(g,g,g,c.a)*opacity;}",

'shaders/grayer.f':"varying vec2 vUv;uniform sampler2D map;uniform vec3 color;uniform float opacity;void main(){vec4 c=texture2D(map,vUv);float gray=dot(c.rgb,vec3(0.299,0.587,0.114));c.rgb=mix(c.rgb*color*0.8,vec3(gray*0.8),0.8);gl_FragColor=c*opacity;}",

'shaders/hsv.f':"varying vec2 vUv;uniform sampler2D map;uniform vec3 color;uniform float opacity;vec3 rgb2hsv(vec3 c){vec4 K=vec4(0.0,-1.0/3.0,2.0/3.0,-1.0);vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g));vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r));float d=q.x-min(q.w,q.y);float e=1.0e-10;return vec3(abs(q.z+(q.w-q.y)/ (6.0*d+e)),d/(q.x+e),q.x);}vec3 hsv2rgb(vec3 c){vec4 k=vec4(1.0,2.0/3.0,1.0/3.0,3.0);vec3 p=abs(fract(vec3(c.r)+k.xyz)*6.0-k.www);return c.b*mix(k.xxx,clamp(p-k.xxx,0.0,1.0),c.g);}void main(){vec4 col=texture2D(map,vUv);col.rgb=hsv2rgb(rgb2hsv(col.rgb)+color*2.0-1.0);gl_FragColor=col*opacity*col.a;}",

'shaders/mmgrad.f':"varying vec2 vUv;uniform sampler2D map;uniform vec3 color;uniform float w;uniform float h;uniform float fs;uniform float lw;float clampd(float fl,float p){float d=floor(fl)* (fract(fl)-vUv.y*fs/h);return clamp(pow(abs(d),p),0.0,1.0);}void main(){vec4 c=texture2D(map,vUv);vec4 y=vec4(color,c.a);float st=step(1.0,c.a)*smoothstep(0.7,0.8,c.r);c=mix(c,y,st);c.rgb=mix(c.rgb*vec3(0.76,0.56,0.33),c.rgb,clampd(6.22,1.0));c.rgb=mix(c.rgb,vec3(1.0),clamp(st*1.0-texture2D(map,vUv+vec2((lw/1.2+2.0)/w,0.0)).a,0.0,1.0));gl_FragColor=c;}",

'shaders/mmgrad2.f':"varying vec2 vUv;uniform sampler2D map;uniform vec3 color;uniform float w;uniform float h;uniform float fs;uniform float lw;float clampd(float fl,float p){float d=floor(fl)* (fract(fl)-vUv.y/h*fs*1.25);return clamp(pow(abs(d),p),0.0,1.0);}void main(){vec4 c=texture2D(map,vUv);vec4 y=vec4(color,c.a);float st=smoothstep(0.8,1.0,c.a)*smoothstep(0.5,0.9,c.r*c.g);vec4 c2=mix(c,y,st);c2.rgb=mix(c2.rgb*vec3(0.9,0.6,0.4),c2.rgb,st*clampd(5.25,2.0));c2.rgb=mix(c2.rgb,color,clamp(st*1.0-texture2D(map,vUv+vec2((lw/1.6+1.0)/w,0.0)).a,0.0,1.0));c2=mix(c,c2,st);gl_FragColor=c2;}",

'shaders/part.f':"varying vec2 vUv;varying vec4 vColor;uniform sampler2D map;void main(){vec4 c=texture2D(map,vUv);c.rgb*=vColor.rgb;gl_FragColor=c*vColor.a;}",

'shaders/part.v':"varying vec2 vUv;varying vec4 vColor;attribute vec4 c;void main(){vUv=uv;vColor=c;gl_Position=projectionMatrix*vec4(position,1.0);}",

'shaders/partnc.f':"varying vec2 vUv;uniform sampler2D map;void main(){vec4 c=texture2D(map,vUv);gl_FragColor=c;}",

'shaders/partnc.v':"varying vec2 vUv;varying vec4 vColor;attribute vec4 c;void main(){vUv=uv;vColor=c;gl_Position=projectionMatrix*vec4(position,1.0);}",

'shaders/refract.f':"varying vec2 vUv;uniform sampler2D refractmap;uniform sampler2D map;void main(){vec4 c_refract=texture2D(refractmap,vUv);vec2 rfix=(vec2(0.5)-c_refract.br)*c_refract.a*0.05;vec4 c_scene=texture2D(map,vUv+rfix);gl_FragColor=c_scene*c_scene.a;}",

'shaders/sectorCrop.f':"varying vec2 vUv;uniform sampler2D map;uniform vec3 color;uniform float opacity;uniform float a;uniform vec2 c;void main(){vec4 j=texture2D(map,vUv)*vec4(color,opacity);vec2 k=vUv-c;float f=a*0.9999999;float an=tan(1.570796327-f)*k.x;float v=step(k.y,an);v=(1.0-v)*step(0.0,k.x)+v*step(sin(f),0.0);gl_FragColor=j*v*j.a;}",

'shaders/sectorCrop2.f':"varying vec2 vUv;uniform sampler2D map;uniform vec3 color;uniform float opacity;uniform float a;uniform vec2 c;void main(){vec4 j=texture2D(map,vUv)*vec4(color,opacity);float v=distance(vUv,c+vec2(sin(a),cos(a)) *100.0/2048.0)*15.0;v=v*v*v;gl_FragColor=j*min(1.0,v*v+j.r)*j.a;}",

'shaders/simpleblur.f':"varying vec2 vUv;uniform sampler2D map;uniform float x;uniform float y;void main(){vec4 color=texture2D(map,vUv);vec4 color1=texture2D(map,vUv+vec2(x,y)) +texture2D(map,vUv+vec2(-x,y)) +texture2D(map,vUv+vec2(x,-y)) +texture2D(map,vUv+vec2(-x,-y));color1=color1*0.25;color=mix(color,color1,0.7);gl_FragColor=color*color.a;}",

'shaders/tiled.f':"varying vec2 vUv;uniform sampler2D map;uniform vec2 size;uniform vec2 rep;uniform float beta;uniform float gamma;uniform float opacity;uniform vec3 color;void main(){vec2 pix=size/rep;vec2 uv=vUv*pix;float s=sign(sin(uv.x*PI))*sign(sin(uv.y*PI));uv.x=abs(fract(uv.x*s));uv.y=fract(uv.y);vec4 c=texture2D(map,uv);vec4 c2=texture2D(map,uv-10.0*vec2(s*cos(beta*30.0*PI),sin(beta*30.0*PI))/size);float d=min(2.0+50.0*vUv.x*(1.0-vUv.x)*vUv.y*(1.0-vUv.y),4.0);float r=c.r+c.g+c.b-0.4;c=mix(c,c-c2/1.1+vec4(0.05),0.6);c.rgb*=color*d*d;c.rgb+=clamp(r*r*sin((vUv.x-vUv.y/2.0)*10.0+gamma*20.0*PI),0.0,0.3);c.a=opacity;gl_FragColor=c;}",

'shaders/ygrad.f':"varying vec2 vUv;uniform sampler2D map;uniform vec3 color;uniform float w;uniform float h;float clampd(float fl,vec4 c){float d=vUv.y-fl;return clamp(abs(10.0*d*d*d*c.a),0.0,1.0);}void main(){vec4 c=texture2D(map,vUv);vec4 y=vec4(color,c.a);float st=step(1.0,c.a);c=mix(c,y,st);c.gb=mix(c.gb/4.0,c.gb,clampd(0.051,c));c.rgb=mix(c.rgb,vec3(1.0),clampd(0.2,c));c.rgb=mix(c.rgb,vec3(1.0),clamp(st*1.0-texture2D(map,vUv+vec2(1.0/w,2.0/h)).a,0.0,1.0));gl_FragColor=c;}",

'ui/__main.json':{
  "packed": [
    {
      "s": {
        "px": 1,
        "py": 1,
        "y": 1,
        "x": 1
      },
      "_": [
        {
          "s": {
            "px": "o",
            "y": 75,
            "x": 202
          },
          "h": 3,
          "v": 1,
          "H": 1,
          "V": 2,
          "n": "bottom",
          "_": [
            {
              "s": {
                "y": 38,
                "x": 159
              },
              "n": "needTemplate",
              "_": [
                {
                  "s": {
                    "y": 48,
                    "x": 48
                  },
                  "H": 0,
                  "V": 1,
                  "n": "ico"
                },
                {
                  "s": {
                    "y": 30,
                    "x": 102
                  },
                  "h": 0,
                  "v": 1,
                  "H": 2,
                  "V": 1,
                  "n": "txt",
                  "t": {
                    "t": "1/10",
                    "D": 1,
                    "A": 0,
                    "__fontWeight": 1,
                    "sh": {
                      "y": 3,
                      "__blur": 3
                    }
                  }
                }
              ]
            }
          ]
        },
        {
          "i": "optsbut.png",
          "H": 0,
          "V": 0,
          "n": "opts",
          "o": {
            "x": 10,
            "y": 10,
            "z": -270
          }
        },
        {
          "i": "restartbut.png",
          "H": 0,
          "V": 0,
          "n": "restart",
          "o": {
            "x": 10,
            "y": 71,
            "z": -270
          }
        }
      ]
    }
  ]
},

'ui/congrat.json':{
  "packed": [
    {
      "s": {
        "px": 1,
        "py": 1,
        "y": 1,
        "x": 1
      },
      "c": "#0d180b",
      "__alpha": 0.5,
      "n": "congrat",
      "_": [
        {
          "s": {
            "y": 219,
            "x": 426
          },
          "c": "#473e2d",
          "p": 20,
          "h": 3,
          "v": 0,
          "n": "levels",
          "_": [
            {
              "s": {
                "y": 80,
                "x": 80
              },
              "c": "#638e3f",
              "SP": 10,
              "n": "but",
              "t": {
                "t": "1"
              },
              "o": {
                "z": -3
              }
            },
            {
              "s": {
                "y": 80,
                "x": 80
              },
              "c": "#638e3f",
              "SP": 10,
              "n": "but",
              "t": {
                "t": "2"
              },
              "o": {
                "z": -3
              }
            },
            {
              "s": {
                "y": 80,
                "x": 80
              },
              "c": "#638e3f",
              "SP": 10,
              "n": "but",
              "t": {
                "t": "3"
              },
              "o": {
                "z": -3
              }
            },
            {
              "s": {
                "y": 80,
                "x": 80
              },
              "c": "#638e3f",
              "SP": 10,
              "n": "but",
              "t": {
                "t": "4"
              },
              "o": {
                "z": -3
              }
            },
            {
              "s": {
                "y": 80,
                "x": 80
              },
              "c": "#638e3f",
              "SP": 10,
              "n": "but",
              "t": {
                "t": "5"
              },
              "o": {
                "x": -400,
                "y": 95,
                "z": -3
              }
            },
            {
              "s": {
                "y": 80,
                "x": 80
              },
              "c": "#638e3f",
              "SP": 10,
              "n": "but",
              "t": {
                "t": "6"
              },
              "o": {
                "x": -400,
                "y": 95,
                "z": -3
              }
            },
            {
              "s": {
                "y": 80,
                "x": 80
              },
              "c": "#638e3f",
              "SP": 10,
              "n": "but",
              "t": {
                "t": "7"
              },
              "o": {
                "x": -401,
                "y": 96,
                "z": -3
              }
            },
            {
              "s": {
                "y": 80,
                "x": 80
              },
              "c": "#638e3f",
              "SP": 10,
              "n": "but",
              "t": {
                "t": "8"
              },
              "o": {
                "x": -401,
                "y": 96,
                "z": -3
              }
            }
          ]
        },
        {
          "s": {
            "y": 100,
            "x": 532
          },
          "__alpha": 2,
          "t": {
            "c": "#ffd69f",
            "F": 70,
            "l": 2,
            "t": "Select level",
            "B": "mmgrad2",
            "__fontWeight": 1,
            "sh": {
              "y": 7,
              "__blur": 18,
              "c": "#140841",
              "__alpha": 0.8
            }
          },
          "o": {
            "y": -200
          }
        },
        {
          "s": {
            "y": 42,
            "x": 192
          },
          "c": "#7a6f33",
          "n": "cancel",
          "t": {
            "t": "cancel"
          },
          "o": {
            "y": 173
          }
        }
      ]
    }
  ]
},

'ui/gems.json':{
  "packed": [
    {
      "c": "#54547e",
      "i": "gem1",
      "n": "white",
      "ud": {
        "pt": 1,
        "spin": {},
        "asd": true,
        "aot": false,
        "onActivated": "selectDir, spawn white",
        "onTap": "activate"
      },
      "B": "hsv",
      "o": {
        "x": -60,
        "y": -153,
        "z": -1
      }
    },
    {
      "c": "#aed46e",
      "i": "gem1",
      "n": "redr",
      "ud": {
        "aot": false,
        "pt": 2,
        "spin": {},
        "cbm": true,
        "hdf": true,
        "ros": false,
        "onActivated": "spawn white",
        "onTap": "activate",
        "onSpawn": ""
      },
      "B": "hsv",
      "_": [
        {
          "s": {
            "y": 18,
            "x": 18
          },
          "c": 0.926,
          "__alpha": 0.7,
          "i": "prt1",
          "R": 45,
          "bl": 2,
          "o": {
            "x": 14
          }
        }
      ],
      "o": {
        "x": 21,
        "y": -209,
        "z": -1
      }
    },
    {
      "c": "#aed46e",
      "i": "gem1",
      "n": "red",
      "ud": {
        "aot": false,
        "spin": {},
        "asd": true,
        "cbm": true,
        "pt": 2,
        "hdf": true,
        "onActivated": "selectDir, spawn red",
        "onTap": "activate"
      },
      "B": "hsv",
      "o": {
        "x": -61,
        "y": -210,
        "z": -1
      }
    },
    {
      "c": "#a6a969",
      "i": "gem1",
      "n": "pink",
      "ud": {
        "pt": 3,
        "spin": "",
        "cbg": false,
        "asd": true,
        "aot": false,
        "onActivated": "selectDir, spawn pink",
        "onTap": "activate"
      },
      "B": "hsv",
      "o": {
        "x": -58,
        "y": -100,
        "z": -1
      }
    },
    {
      "c": "#a6a969",
      "i": "gem1",
      "n": "pinkr",
      "ud": {
        "pt": 3,
        "spin": "",
        "aot": false,
        "ros": false,
        "roa": false,
        "mfts": true,
        "onActivated": "moveFriends, spawn white, rotate",
        "onTap": "activate",
        "onSpawn": {}
      },
      "B": "hsv",
      "_": [
        {
          "s": {
            "y": 18,
            "x": 18
          },
          "c": 0.926,
          "__alpha": 0.7,
          "i": "prt1",
          "R": 45,
          "bl": 2,
          "o": {
            "x": 14
          }
        }
      ],
      "o": {
        "x": 22,
        "y": -98,
        "z": -1
      }
    },
    {
      "c": "#ffb881",
      "i": "gem1",
      "n": "blue",
      "ud": {
        "aot": false,
        "ai": {},
        "pt": 5,
        "cbg": true,
        "cby": true,
        "cbm": true,
        "accel_factor": false,
        "onActivated": "resetInterval 2",
        "onInterval": "activateFriends",
        "onTap": "activate",
        "onSpawn": "activate"
      },
      "B": "hsv",
      "o": {
        "x": -57,
        "y": 26,
        "z": -1
      }
    },
    {
      "c": "#53cb46",
      "i": "gem1",
      "n": "green",
      "ud": {
        "aot": false,
        "pt": 4,
        "ai": {},
        "cbg": true,
        "cn": {},
        "cnf": {},
        "aos": false,
        "cbd": false,
        "onSpawn": "setInterval 1",
        "onInterval": "convertFriend green",
        "onTap": "activate",
        "onActivated": "convertIn white"
      },
      "B": "hsv",
      "o": {
        "x": -57,
        "y": -42,
        "z": -1
      }
    },
    {
      "c": "#16161d",
      "i": "gem1",
      "n": "black",
      "ud": {
        "cbm": true,
        "cbg": true,
        "cby": true,
        "pt": 7
      },
      "B": "hsv",
      "o": {
        "x": -52,
        "y": 173,
        "z": -1
      }
    },
    {
      "c": "#ffd55f",
      "i": "gem1",
      "n": "bluea",
      "ud": {
        "cby": true,
        "cbg": true,
        "cbm": true,
        "aos": false,
        "ai": {},
        "icba": true,
        "accel_factor": false,
        "onSpawn": "setInterval 0.2",
        "onInterval": "activate",
        "onActivated": "activateFriends",
        "pt": 8
      },
      "B": "hsv",
      "o": {
        "x": -57,
        "y": 101,
        "z": -1
      }
    },
    {
      "s": {
        "y": 40,
        "x": 40
      },
      "c": "#baf292",
      "i": "gem1",
      "R": 45,
      "n": "yellow",
      "ud": {
        "cbg": true,
        "cby": false,
        "aos": false,
        "ai": {},
        "aot": false,
        "df": false,
        "pt": 9,
        "onInterval": "destroyFriends",
        "onTap": "activate",
        "onActivated": "resetInterval 1.1",
        "onSpawn": "activate"
      },
      "B": "hsv",
      "o": {
        "x": -49,
        "y": 257,
        "z": -10
      }
    },
    {
      "c": "#9ca575",
      "i": "gem1",
      "R": 45,
      "n": "pinkblue",
      "ud": {
        "aot": false,
        "ai": {},
        "pt": 6,
        "cbg": false,
        "cby": false,
        "cbm": false,
        "accel_factor": false,
        "onActivated": "rotate",
        "onInterval": "activateFriends, moveFriends, spawn pinkblue",
        "onTap": "activate",
        "onSpawn": "setInterval 0.7"
      },
      "B": "hsv",
      "_": [
        {
          "s": {
            "y": 18,
            "x": 18
          },
          "c": "#b16666",
          "__alpha": 1.9,
          "i": "prt1",
          "R": 45,
          "o": {
            "x": 12,
            "y": 14
          }
        }
      ],
      "o": {
        "x": 30,
        "y": 22,
        "z": -1
      }
    },
    {
      "c": "#e9ff8c",
      "i": "gem1",
      "n": "mover",
      "ud": {
        "aot": false,
        "ai": {},
        "pt": 10,
        "cbg": false,
        "cby": true,
        "cbm": false,
        "accel_factor": false,
        "onActivated": "rotate",
        "onInterval": "moveFriends",
        "onTap": "activate",
        "onSpawn": "setInterval 0.5"
      },
      "B": "hsv",
      "_": [
        {
          "s": {
            "y": 24,
            "x": 34
          },
          "fi": 1,
          "c": 0,
          "__alpha": 0.7,
          "i": "arrow",
          "o": {
            "x": 2
          }
        }
      ],
      "o": {
        "x": 27,
        "y": 98,
        "z": -1
      }
    }
  ]
},

'ui/lev1.json':{
  "packed": [
    {
      "s": {
        "px": 1,
        "py": 1,
        "y": 1,
        "x": 1
      },
      "c": "#6f6573",
      "_": [
        {
          "s": {
            "y": 814,
            "x": 965
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "n": "grid",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "z": -1
          }
        },
        {
          "s": {
            "y": 313,
            "x": 318
          },
          "n": "pole",
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "B": "hsv",
              "o": {
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "y": 92,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 44,
                "y": 92,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 89,
                "y": 90,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -87,
                "y": 88,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -43,
                "y": 93,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -89,
                "y": 45,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -90,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -87,
                "y": -45,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -89,
                "y": -93,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -46,
                "y": -92,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -2,
                "y": -91,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 43,
                "y": -92,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 89,
                "y": -91,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 85,
                "y": -46,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 87,
                "y": 1,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 86,
                "y": 46,
                "z": -1
              }
            }
          ]
        }
      ]
    }
  ]
},

'ui/lev2.json':{
  "packed": [
    {
      "s": {
        "px": 1,
        "py": 1,
        "y": 1,
        "x": 1
      },
      "c": "#6f6573",
      "_": [
        {
          "s": {
            "y": 814,
            "x": 965
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "n": "grid",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "z": -1
          }
        },
        {
          "s": {
            "y": 313,
            "x": 318
          },
          "n": "pole",
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "B": "hsv",
              "o": {
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "y": 132,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 44,
                "y": 132,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 91,
                "y": 132,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 136,
                "y": 132,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -137,
                "y": 88,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -135,
                "y": 133,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -88,
                "y": 133,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -43,
                "y": 133,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -135,
                "y": 45,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -136,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -133,
                "y": -45,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -134,
                "y": -87,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -132,
                "y": -133,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -89,
                "y": -134,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -46,
                "y": -134,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -2,
                "y": -133,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 43,
                "y": -134,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 89,
                "y": -134,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 135,
                "y": -134,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 135,
                "y": -88,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 135,
                "y": -46,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 137,
                "y": 1,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 135,
                "y": 46,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 137,
                "y": 89,
                "z": -1
              }
            }
          ]
        }
      ]
    }
  ]
},

'ui/lev3.json':{
  "packed": [
    {
      "s": {
        "px": 1,
        "py": 1,
        "y": 1,
        "x": 1
      },
      "c": "#6f6573",
      "_": [
        {
          "s": {
            "y": 814,
            "x": 965
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "n": "grid",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "z": -1
          }
        },
        {
          "s": {
            "y": 313,
            "x": 318
          },
          "n": "pole",
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "B": "hsv",
              "o": {
                "x": -44,
                "y": 2,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "y": 132,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 44,
                "y": 132,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 91,
                "y": 132,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 89,
                "y": 89,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -137,
                "y": 88,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -90,
                "y": 88,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -88,
                "y": 133,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -43,
                "y": 133,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -135,
                "y": 45,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -136,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -133,
                "y": -45,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -134,
                "y": -87,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -90,
                "y": -89,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -89,
                "y": -134,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -46,
                "y": -134,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -2,
                "y": -133,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 43,
                "y": -134,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 89,
                "y": -134,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 89,
                "y": -89,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 135,
                "y": -88,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 135,
                "y": -46,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 137,
                "y": 1,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 135,
                "y": 46,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 137,
                "y": 89,
                "z": -1
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "B": "hsv",
              "o": {
                "x": -2,
                "y": -42,
                "z": -1
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "B": "hsv",
              "o": {
                "x": 44,
                "y": 2,
                "z": -1
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "B": "hsv",
              "o": {
                "x": -1,
                "y": 44,
                "z": -1
              }
            }
          ]
        }
      ]
    }
  ]
},

'ui/lev4.json':{
  "packed": [
    {
      "s": {
        "px": 1,
        "py": 1,
        "y": 1,
        "x": 1
      },
      "c": "#6f6573",
      "_": [
        {
          "s": {
            "y": 814,
            "x": 965
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "n": "grid",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "z": -1
          }
        },
        {
          "s": {
            "y": 437,
            "x": 618
          },
          "n": "pole",
          "_": [
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -173,
                "y": -2,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 52,
                "y": 86,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 261,
                "y": -46,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 91,
                "y": 4,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -41,
                "y": 86,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -40,
                "y": 128,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 222,
                "y": -4,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -91,
                "y": 43,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -129,
                "y": -3,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -84,
                "y": -6,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -216,
                "y": -93,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -170,
                "y": -96,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -40,
                "y": 171,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -42,
                "y": 40,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 136,
                "y": -86,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 181,
                "y": -4,
                "z": -1
              }
            },
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -218,
                "y": -4,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 138,
                "y": -7,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 52,
                "y": 129,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 176,
                "y": -86,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 47,
                "y": -136,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 49,
                "y": 42,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 94,
                "y": -91,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "R": 90,
              "n": "pinkr",
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": 2,
                "y": 171,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "R": 180,
              "n": "pinkr",
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": 216,
                "y": -47,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "R": 270,
              "n": "pinkr",
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": 2,
                "y": -263,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -128,
                "y": -95,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "B": "hsv",
              "o": {
                "x": 39,
                "y": -46,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pinkr",
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": -218,
                "y": -46,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 91,
                "y": -132,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 45,
                "y": -177,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -49,
                "y": -138,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 90,
                "y": 45,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 54,
                "y": 172,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -88,
                "y": -134,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -85,
                "y": -90,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 48,
                "y": -218,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -39,
                "y": -178,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -41,
                "y": -214,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -261,
                "y": -45,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 224,
                "y": -89,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 1,
                "y": 220,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -41,
                "y": -262,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 1,
                "y": -306,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 43,
                "y": -264,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "B": "hsv",
              "o": {
                "x": -44,
                "y": -46,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "B": "hsv",
              "o": {
                "x": -3,
                "y": -87,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "B": "hsv",
              "o": {
                "x": -3,
                "z": -1
              }
            }
          ]
        }
      ]
    }
  ]
},

'ui/lev5.json':{
  "packed": [
    {
      "s": {
        "px": 1,
        "py": 1,
        "y": 1,
        "x": 1
      },
      "c": "#6f6573",
      "_": [
        {
          "s": {
            "y": 814,
            "x": 965
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "n": "grid",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "z": -1
          }
        },
        {
          "s": {
            "y": 561,
            "x": 611
          },
          "n": "pole",
          "_": [
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 84,
                "y": 171,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 130,
                "y": 132,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 177,
                "y": 132,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 258,
                "y": 87,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -218,
                "y": 90,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -180,
                "y": 131,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -11,
                "y": 211,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 43,
                "y": 173,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -259,
                "y": 45,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -260,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -259,
                "y": -47,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -218,
                "y": -87,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -178,
                "y": -129,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -10,
                "y": -221,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 40,
                "y": -174,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 81,
                "y": -174,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 129,
                "y": -134,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 175,
                "y": -134,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 262,
                "y": -88,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 262,
                "y": -46,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 217,
                "y": -2,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 256,
                "y": 42,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -52,
                "y": 2,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "B": "hsv",
              "o": {
                "x": 86,
                "y": 40,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "B": "hsv",
              "o": {
                "x": 130,
                "y": 3,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "B": "hsv",
              "o": {
                "x": 88,
                "y": -44,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "B": "hsv",
              "o": {
                "x": 215,
                "y": -42,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "B": "hsv",
              "o": {
                "x": 171,
                "y": 43,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -51,
                "y": 211,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -94,
                "y": 211,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -50,
                "y": -221,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -94,
                "y": -217,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 221,
                "y": 133,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 216,
                "y": -133,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -137,
                "y": -172,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -138,
                "y": 170,
                "z": -1
              }
            }
          ]
        }
      ]
    }
  ]
},

'ui/lev6.json':{
  "packed": [
    {
      "s": {
        "px": 1,
        "py": 1,
        "y": 1,
        "x": 1
      },
      "c": "#6f6573",
      "_": [
        {
          "s": {
            "y": 814,
            "x": 965
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "n": "grid",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "z": -1
          }
        },
        {
          "s": {
            "y": 437,
            "x": 618
          },
          "n": "pole",
          "_": [
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -173,
                "y": -2,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 52,
                "y": 86,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 138,
                "y": -131,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 139,
                "y": 85,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -41,
                "y": 86,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -40,
                "y": 128,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 92,
                "y": 89,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -42,
                "y": -4,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -129,
                "y": -3,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -84,
                "y": -6,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -216,
                "y": -93,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -170,
                "y": -96,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -40,
                "y": 171,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -42,
                "y": 40,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 136,
                "y": -86,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 181,
                "y": -4,
                "z": -1
              }
            },
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -218,
                "y": -4,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 138,
                "y": -7,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 52,
                "y": 129,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 136,
                "y": -45,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 47,
                "y": -136,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 183,
                "y": 86,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 49,
                "y": -92,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "R": 90,
              "n": "pinkr",
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": 5,
                "y": 129,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "R": 180,
              "n": "pinkr",
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": 180,
                "y": 40,
                "z": -1
              }
            },
            {
              "c": "#0800ff",
              "i": "gem1",
              "n": "bluea",
              "o": {
                "x": 5,
                "y": 171
              }
            },
            {
              "c": "#0800ff",
              "i": "gem1",
              "n": "bluea",
              "o": {
                "x": 223,
                "y": 41
              }
            },
            {
              "c": "#0800ff",
              "i": "gem1",
              "n": "bluea",
              "o": {
                "x": -216,
                "y": -51
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "R": 270,
              "n": "pinkr",
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": 91,
                "y": -132,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -128,
                "y": -95,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "B": "hsv",
              "o": {
                "x": 2,
                "y": -135,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "B": "hsv",
              "o": {
                "x": -85,
                "y": -138,
                "z": -1
              }
            },
            {
              "c": "#0800ff",
              "i": "gem1",
              "n": "bluea",
              "o": {
                "x": 90,
                "y": -181
              }
            },
            {
              "s": {
                "y": 40,
                "x": 40
              },
              "c": "#baf292",
              "i": "gem1",
              "R": 45,
              "n": "yellow",
              "B": "hsv",
              "o": {
                "x": 47,
                "y": -3,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pinkr",
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": -169,
                "y": -48,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 138,
                "y": -177,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 45,
                "y": -177,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 223,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 227,
                "y": 86,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 54,
                "y": 172,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -126,
                "y": -136,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -126,
                "y": -178,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -83,
                "y": -179,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -39,
                "y": -178,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 4,
                "y": -177,
                "z": -1
              }
            }
          ]
        }
      ]
    }
  ]
},

'ui/lev7.json':{
  "packed": [
    {
      "s": {
        "px": 1,
        "py": 1,
        "y": 1,
        "x": 1
      },
      "c": "#6f6573",
      "_": [
        {
          "s": {
            "y": 756,
            "x": 617
          },
          "n": "pole",
          "_": [
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -174,
                "y": -85,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 91,
                "y": 93,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 134,
                "y": -256,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 130,
                "y": 94,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -91,
                "y": 173,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -219,
                "y": 45,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -88,
                "y": 95,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -134,
                "y": 2,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -218,
                "y": -43,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -173,
                "y": 91,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -217,
                "y": 85,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -132,
                "y": -88,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -93,
                "y": 134,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -134,
                "y": 92,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 216,
                "y": -218,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 222,
                "y": -84,
                "z": -1
              }
            },
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -219,
                "y": -2,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 219,
                "y": -132,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 171,
                "y": 91,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 218,
                "y": -175,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -221,
                "y": -86,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 173,
                "y": 50,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 90,
                "y": -253,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -89,
                "y": -86,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -89,
                "y": -175,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 45,
                "y": -257,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 226,
                "y": -44,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 220,
                "y": 48,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 49,
                "y": 95,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -44,
                "y": -87,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -92,
                "y": -220,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -87,
                "y": -130,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -39,
                "y": -258,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 4,
                "y": -257,
                "z": -1
              }
            },
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -44,
                "y": 6,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 1,
                "y": 6,
                "z": -1
              }
            },
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 46,
                "y": 8,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 46,
                "y": 138,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 45,
                "y": 219,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -86,
                "y": 218,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 133,
                "y": 225,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 130,
                "y": 138,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -39,
                "y": 226,
                "z": -1
              }
            },
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "moveFriends, spawn pinkblue, rotate",
                "onInterval": "activateFriends",
                "onTap": {},
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "o": {
                "x": 85,
                "y": 134,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 133,
                "y": 182,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 89,
                "y": 260,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 130,
                "y": 261,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 44,
                "y": 261,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 1,
                "y": 261,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -38,
                "y": 263,
                "z": -1
              }
            },
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 46,
                "y": 52,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 179,
                "y": -257,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -87,
                "y": -259,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -2,
                "y": -86,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 41,
                "y": -87,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 85,
                "y": -87,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 4,
                "y": 136,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 222,
                "y": -2,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 219,
                "y": -260,
                "z": -1
              }
            }
          ]
        },
        {
          "s": {
            "y": 814,
            "x": 965
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "n": "grid",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "z": -1
          }
        }
      ]
    }
  ]
},

'ui/lev8.json':{
  "packed": [
    {
      "s": {
        "px": 1,
        "py": 1,
        "y": 1,
        "x": 1
      },
      "c": "#6f6573",
      "_": [
        {
          "s": {
            "y": 756,
            "x": 617
          },
          "n": "pole",
          "_": [
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -86,
                "y": 89,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 169,
                "y": 50,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 172,
                "y": -258,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 170,
                "y": 94,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -180,
                "y": -87,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -82,
                "y": 262,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -96,
                "y": -262,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -179,
                "y": -173,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -86,
                "y": -135,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -89,
                "y": -177,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 256,
                "y": -218,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 262,
                "y": -84,
                "z": -1
              }
            },
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -181,
                "y": -260,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 259,
                "y": -132,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 258,
                "y": -175,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -232,
                "y": -349,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 261,
                "y": 135,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -92,
                "y": -352,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 261,
                "y": -349,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 266,
                "y": -44,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 260,
                "y": 48,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -88,
                "y": 44,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 216,
                "y": -348,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -9,
                "y": -352,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 1,
                "y": -258,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 84,
                "y": -258,
                "z": -1
              }
            },
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 130,
                "y": -351,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 257,
                "y": 262,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -49,
                "y": -397,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 83,
                "y": -351,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 170,
                "y": 138,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 173,
                "y": 182,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 129,
                "y": 260,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 170,
                "y": 261,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 84,
                "y": 261,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 1,
                "y": 177,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 45,
                "y": 262,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 174,
                "y": -351,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -47,
                "y": -259,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -189,
                "y": -344,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 170,
                "y": -174,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 172,
                "y": -133,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 38,
                "y": -352,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 262,
                "y": -2,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 259,
                "y": -260,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 169,
                "y": 5,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 257,
                "y": 88,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 168,
                "y": -88,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 168,
                "y": -42,
                "z": -1
              }
            },
            {
              "s": {
                "y": 40,
                "x": 40
              },
              "c": "#baf292",
              "i": "gem1",
              "R": 45,
              "n": "yellow",
              "ud": {
                "cbg": true,
                "cby": false,
                "aos": false,
                "ai": {},
                "aot": false,
                "df": false,
                "pt": 9,
                "onInterval": "destroyFriends",
                "onTap": "activate",
                "onActivated": "resetInterval 1.1",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 124,
                "y": 95,
                "z": -10
              }
            },
            {
              "s": {
                "y": 40,
                "x": 40
              },
              "c": "#baf292",
              "i": "gem1",
              "R": 45,
              "n": "yellow",
              "ud": {
                "cbg": true,
                "cby": false,
                "aos": false,
                "ai": {},
                "aot": false,
                "df": false,
                "pt": 9,
                "onInterval": "destroyFriends",
                "onTap": "activate",
                "onActivated": "resetInterval 1.1",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 214,
                "y": 92,
                "z": -10
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 212,
                "y": 260,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 256,
                "y": 224,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pinkr",
              "ud": {
                "pt": 3,
                "spin": "",
                "aot": false,
                "ros": false,
                "roa": false,
                "mfts": true,
                "onActivated": "moveFriends, spawn white, rotate",
                "onTap": "activate",
                "onSpawn": {}
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": 126,
                "y": 180,
                "z": -1
              }
            },
            {
              "c": "#ffd55f",
              "i": "gem1",
              "n": "bluea",
              "ud": {
                "cby": true,
                "cbg": true,
                "cbm": true,
                "aos": false,
                "ai": {},
                "icba": true,
                "accel_factor": false,
                "onSpawn": "setInterval 0.2",
                "onInterval": "activate",
                "onActivated": "activateFriends",
                "pt": 8
              },
              "B": "hsv",
              "o": {
                "x": 127,
                "y": 219,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pinkr",
              "ud": {
                "pt": 3,
                "spin": "",
                "aot": false,
                "ros": false,
                "roa": false,
                "mfts": true,
                "onActivated": "moveFriends, spawn white, rotate",
                "onTap": "activate",
                "onSpawn": {}
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": 216,
                "y": 180,
                "z": -1
              }
            },
            {
              "c": "#ffd55f",
              "i": "gem1",
              "n": "bluea",
              "ud": {
                "cby": true,
                "cbg": true,
                "cbm": true,
                "aos": false,
                "ai": {},
                "icba": true,
                "accel_factor": false,
                "onSpawn": "setInterval 0.2",
                "onInterval": "activate",
                "onActivated": "activateFriends",
                "pt": 8
              },
              "B": "hsv",
              "o": {
                "x": 217,
                "y": 219,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 171,
                "y": 217,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 85,
                "y": 222,
                "z": -1
              }
            },
            {
              "c": "#e9ff8c",
              "i": "gem1",
              "n": "mover",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 10,
                "cbg": false,
                "cby": true,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "moveFriends",
                "onTap": "activate",
                "onSpawn": "setInterval 0.5"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 24,
                    "x": 34
                  },
                  "fi": 1,
                  "c": 0,
                  "__alpha": 0.7,
                  "i": "arrow",
                  "o": {
                    "x": 2
                  }
                }
              ],
              "o": {
                "x": 166,
                "y": -215,
                "z": -1
              }
            },
            {
              "c": "#e9ff8c",
              "i": "gem1",
              "n": "mover",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 10,
                "cbg": false,
                "cby": true,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "moveFriends",
                "onTap": "activate",
                "onSpawn": "setInterval 0.5"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 24,
                    "x": 34
                  },
                  "fi": 1,
                  "c": 0,
                  "__alpha": 0.7,
                  "i": "arrow",
                  "o": {
                    "x": 2
                  }
                }
              ],
              "o": {
                "x": 257,
                "y": -306,
                "z": -1
              }
            },
            {
              "c": "#ffd55f",
              "i": "gem1",
              "n": "bluea",
              "ud": {
                "cby": true,
                "cbg": true,
                "cbm": true,
                "aos": false,
                "ai": {},
                "icba": true,
                "accel_factor": false,
                "onSpawn": "setInterval 0.2",
                "onInterval": "activate",
                "onActivated": "activateFriends",
                "pt": 8
              },
              "B": "hsv",
              "o": {
                "x": 46,
                "y": 221,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -2,
                "y": -307,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -51,
                "y": -305,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -50,
                "y": -220,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -1,
                "y": -219,
                "z": -1
              }
            },
            {
              "c": "#ffb881",
              "i": "gem1",
              "n": "blue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 5,
                "cbg": true,
                "cby": true,
                "cbm": true,
                "accel_factor": false,
                "onActivated": "resetInterval 2",
                "onInterval": "activateFriends",
                "onTap": "activate",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 126,
                "y": -259,
                "z": -1
              }
            },
            {
              "c": "#ffb881",
              "i": "gem1",
              "n": "blue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 5,
                "cbg": true,
                "cby": true,
                "cbm": true,
                "accel_factor": false,
                "onActivated": "resetInterval 2",
                "onInterval": "activateFriends",
                "onTap": "activate",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 43,
                "y": -259,
                "z": -1
              }
            },
            {
              "c": "#e9ff8c",
              "i": "gem1",
              "n": "mover",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 10,
                "cbg": false,
                "cby": true,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "moveFriends",
                "onTap": "activate",
                "onSpawn": "setInterval 0.5"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 24,
                    "x": 34
                  },
                  "fi": 1,
                  "c": 0,
                  "__alpha": 0.7,
                  "i": "arrow",
                  "o": {
                    "x": 2
                  }
                }
              ],
              "o": {
                "x": -142,
                "y": -351,
                "z": -1
              }
            },
            {
              "s": {
                "y": 44,
                "x": 44
              },
              "c": "#e9ff8c",
              "i": "gem1",
              "n": "mover",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 10,
                "cbg": false,
                "cby": true,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "moveFriends",
                "onTap": "activate",
                "onSpawn": "setInterval 0.5"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 24,
                    "x": 34
                  },
                  "fi": 1,
                  "c": 0,
                  "__alpha": 0.7,
                  "i": "arrow",
                  "o": {
                    "x": 2
                  }
                }
              ],
              "o": {
                "x": -175,
                "y": -42,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -83,
                "y": 218,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -87,
                "y": -91,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -83,
                "y": 176,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 9,
                "y": 263,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -91,
                "y": 6,
                "z": -1
              }
            },
            {
              "s": {
                "y": 44,
                "x": 44
              },
              "c": "#e9ff8c",
              "i": "gem1",
              "n": "mover",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 10,
                "cbg": false,
                "cby": true,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "moveFriends",
                "onTap": "activate",
                "onSpawn": "setInterval 0.5"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 24,
                    "x": 34
                  },
                  "fi": 1,
                  "c": 0,
                  "__alpha": 0.7,
                  "i": "arrow",
                  "o": {
                    "x": 2
                  }
                }
              ],
              "o": {
                "x": -180,
                "y": -215,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -84,
                "y": 134,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -176,
                "y": 5,
                "z": -1
              }
            },
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -269,
                "y": -220,
                "z": -1
              }
            },
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -268,
                "y": -264,
                "z": -1
              }
            },
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -267,
                "y": -89,
                "z": -1
              }
            },
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -226,
                "y": -88,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -274,
                "y": -348,
                "z": -1
              }
            },
            {
              "c": "#e9ff8c",
              "i": "gem1",
              "n": "mover",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 10,
                "cbg": false,
                "cby": true,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "moveFriends",
                "onTap": "activate",
                "onSpawn": "setInterval 0.5"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 24,
                    "x": 34
                  },
                  "fi": 1,
                  "c": 0,
                  "__alpha": 0.7,
                  "i": "arrow",
                  "o": {
                    "x": 2
                  }
                }
              ],
              "o": {
                "x": -270,
                "y": -306,
                "z": -1
              }
            },
            {
              "s": {
                "y": 44,
                "x": 44
              },
              "c": "#e9ff8c",
              "i": "gem1",
              "n": "mover",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 10,
                "cbg": false,
                "cby": true,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "moveFriends",
                "onTap": "activate",
                "onSpawn": "setInterval 0.5"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 24,
                    "x": 34
                  },
                  "fi": 1,
                  "c": 0,
                  "__alpha": 0.7,
                  "i": "arrow",
                  "o": {
                    "x": 2
                  }
                }
              ],
              "o": {
                "x": -50,
                "y": -351,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -176,
                "y": 49,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -173,
                "y": 88,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -174,
                "y": 134,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -174,
                "y": 174,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -218,
                "y": 169,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -174,
                "y": 256,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -133,
                "y": 306,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -44,
                "y": 304,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -143,
                "y": -396,
                "z": -1
              }
            },
            {
              "c": "#ffd55f",
              "i": "gem1",
              "n": "bluea",
              "ud": {
                "cby": true,
                "cbg": true,
                "cbm": true,
                "aos": false,
                "ai": {},
                "icba": true,
                "accel_factor": false,
                "onSpawn": "setInterval 0.2",
                "onInterval": "activate",
                "onActivated": "activateFriends",
                "pt": 8
              },
              "B": "hsv",
              "o": {
                "x": -222,
                "y": -134,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -177,
                "y": -133,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pinkr",
              "ud": {
                "pt": 3,
                "spin": "",
                "aot": false,
                "ros": false,
                "roa": false,
                "mfts": true,
                "onActivated": "moveFriends, spawn white, rotate",
                "onTap": "activate",
                "onSpawn": {}
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": -223,
                "y": -176,
                "z": -1
              }
            },
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -268,
                "y": -135,
                "z": -1
              }
            },
            {
              "c": "#ffd55f",
              "i": "gem1",
              "n": "bluea",
              "ud": {
                "cby": true,
                "cbg": true,
                "cbm": true,
                "aos": false,
                "ai": {},
                "icba": true,
                "accel_factor": false,
                "onSpawn": "setInterval 0.2",
                "onInterval": "activate",
                "onActivated": "activateFriends",
                "pt": 8
              },
              "B": "hsv",
              "o": {
                "x": -218,
                "y": 216,
                "z": -1
              }
            },
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -317,
                "y": -309,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 302,
                "y": -306,
                "z": -1
              }
            },
            {
              "c": "#e9ff8c",
              "i": "gem1",
              "n": "mover",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 10,
                "cbg": false,
                "cby": true,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "moveFriends",
                "onTap": "activate",
                "onSpawn": "setInterval 0.5"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 24,
                    "x": 34
                  },
                  "fi": 1,
                  "c": 0,
                  "__alpha": 0.7,
                  "i": "arrow",
                  "o": {
                    "x": 2
                  }
                }
              ],
              "o": {
                "x": -129,
                "y": 264,
                "z": -1
              }
            },
            {
              "s": {
                "y": 44,
                "x": 44
              },
              "c": "#e9ff8c",
              "i": "gem1",
              "n": "mover",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 10,
                "cbg": false,
                "cby": true,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "moveFriends",
                "onTap": "activate",
                "onSpawn": "setInterval 0.5"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 24,
                    "x": 34
                  },
                  "fi": 1,
                  "c": 0,
                  "__alpha": 0.7,
                  "i": "arrow",
                  "o": {
                    "x": 2
                  }
                }
              ],
              "o": {
                "x": -40,
                "y": 259,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -88,
                "y": -41,
                "z": -1
              }
            },
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -269,
                "y": -176,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pinkr",
              "ud": {
                "pt": 3,
                "spin": "",
                "aot": false,
                "ros": false,
                "roa": false,
                "mfts": true,
                "onActivated": "moveFriends, spawn white, rotate",
                "onTap": "activate",
                "onSpawn": {}
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": -174,
                "y": 215,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": -217,
                "y": 257,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pinkr",
              "ud": {
                "pt": 3,
                "spin": "",
                "aot": false,
                "ros": false,
                "roa": false,
                "mfts": true,
                "onActivated": "moveFriends, spawn white, rotate",
                "onTap": "activate",
                "onSpawn": {}
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": 2,
                "y": 220,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 257,
                "y": 177,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 46,
                "y": 176,
                "z": -1
              }
            },
            {
              "s": {
                "y": 42,
                "x": 42
              },
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "B": "hsv",
              "o": {
                "x": 87,
                "y": 177,
                "z": -1
              }
            }
          ]
        },
        {
          "s": {
            "y": 814,
            "x": 965
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "n": "grid",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1
        }
      ]
    }
  ]
},

'ui/patterns.json':{
  "packed": [
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv"
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 45
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "y": 44
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -44,
                "y": -1
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "y": -44
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "y": -1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": -11,
        "y": -281
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv"
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 45
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "y": 44
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 44,
                "y": 45
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#ffb881",
              "i": "gem1",
              "n": "blue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 5,
                "cbg": true,
                "cby": true,
                "cbm": true,
                "accel_factor": false,
                "onActivated": "resetInterval 2",
                "onInterval": "activateFriends",
                "onTap": "activate",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "y": 1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": -12,
        "y": -17
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 47
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 91,
                "y": 1
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 135,
                "y": 2
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 2,
                "y": 1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -190,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "redr",
              "ud": {
                "aot": false,
                "pt": 2,
                "spin": {},
                "cbm": true,
                "hdf": true,
                "ros": false,
                "onActivated": "spawn white",
                "onTap": "activate",
                "onSpawn": "autodir"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": -2,
                "y": -1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": -871,
        "y": 270
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "y": 48
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "y": 138
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 1,
                "y": 94
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -1,
                "y": 2,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -146,
            "y": -50,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#aed46e",
              "i": "gem1",
              "R": 270,
              "n": "redr",
              "ud": {
                "aot": false,
                "pt": 2,
                "spin": {},
                "cbm": true,
                "hdf": true,
                "ros": false,
                "onActivated": "spawn white",
                "onTap": "activate",
                "onSpawn": "autodir"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": -1,
                "y": -1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": -298,
        "y": 265,
        "z": -4
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -41,
                "y": -1
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -130,
                "y": 2
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -86
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -102,
            "y": -8,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#aed46e",
              "i": "gem1",
              "R": 180,
              "n": "redr",
              "ud": {
                "aot": false,
                "pt": 2,
                "spin": {},
                "cbm": true,
                "hdf": true,
                "ros": false,
                "onActivated": "spawn white",
                "onTap": "activate",
                "onSpawn": "autodir"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": 1,
                "y": -2,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": 276,
        "y": 265,
        "z": -4
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 1,
                "y": -49
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "y": -138
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "y": -93
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "y": -3,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -145,
            "y": 40,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#aed46e",
              "i": "gem1",
              "R": 90,
              "n": "redr",
              "ud": {
                "aot": false,
                "pt": 2,
                "spin": {},
                "cbm": true,
                "hdf": true,
                "ros": false,
                "onActivated": "spawn white",
                "onTap": "activate",
                "onSpawn": "autodir"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "y": 4,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": 852,
        "y": 260,
        "z": -4
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -44,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 43,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#53cb46",
              "i": "gem1",
              "n": "green",
              "ud": {
                "aot": false,
                "pt": 4,
                "ai": {},
                "cbg": true,
                "cn": {},
                "cnf": {},
                "aos": false,
                "cbd": false,
                "onSpawn": "setInterval 1",
                "onInterval": "convertFriend green",
                "onTap": "activate",
                "onActivated": "convertIn white"
              },
              "B": "hsv",
              "o": {
                "x": 1,
                "y": 1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": -874,
        "y": 532
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -2,
                "y": -45,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 1,
                "y": 46,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#53cb46",
              "i": "gem1",
              "n": "green",
              "ud": {
                "aot": false,
                "pt": 4,
                "ai": {},
                "cbg": true,
                "cn": {},
                "cnf": {},
                "aos": false,
                "cbd": false,
                "onSpawn": "setInterval 1",
                "onInterval": "convertFriend green",
                "onTap": "activate",
                "onActivated": "convertIn white"
              },
              "B": "hsv",
              "o": {
                "x": 1,
                "y": 1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": -299,
        "y": 533
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "z": -1
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 43,
                "y": -44
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -46,
                "y": -41
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -1,
                "y": -43
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 45,
                "y": 45
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -44,
                "y": 48
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 1,
                "y": 46
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -45,
                "y": 4
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 45
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pink",
              "ud": {
                "pt": 3,
                "spin": "",
                "cbg": false,
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn pink",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": 276,
        "y": 531
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -45,
                "y": -43,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 46,
                "y": 42,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 45,
                "y": -43,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "red",
              "ud": {
                "aot": false,
                "spin": {},
                "asd": true,
                "cbm": true,
                "pt": 2,
                "hdf": true,
                "onActivated": "selectDir, spawn red",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -44,
                "y": 42,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "s": {
                "y": 40,
                "x": 40
              },
              "c": "#baf292",
              "i": "gem1",
              "R": 45,
              "n": "yellow",
              "ud": {
                "cbg": true,
                "cby": false,
                "aos": false,
                "ai": {},
                "aot": false,
                "df": false,
                "pt": 9,
                "onInterval": "destroyFriends",
                "onTap": "activate",
                "onActivated": "resetInterval 1.1",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -1,
                "y": 1,
                "z": -10
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": 851,
        "y": 531
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#53cb46",
              "i": "gem1",
              "n": "green",
              "ud": {
                "aot": false,
                "pt": 4,
                "ai": {},
                "cbg": true,
                "cn": {},
                "cnf": {},
                "aos": false,
                "cbd": false,
                "onSpawn": "setInterval 1",
                "onInterval": "convertFriend green",
                "onTap": "activate",
                "onActivated": "convertIn white"
              },
              "B": "hsv",
              "o": {
                "y": 2,
                "z": -1
              }
            },
            {
              "c": "#53cb46",
              "i": "gem1",
              "n": "green",
              "ud": {
                "aot": false,
                "pt": 4,
                "ai": {},
                "cbg": true,
                "cn": {},
                "cnf": {},
                "aos": false,
                "cbd": false,
                "onSpawn": "setInterval 1",
                "onInterval": "convertFriend green",
                "onTap": "activate",
                "onActivated": "convertIn white"
              },
              "B": "hsv",
              "o": {
                "y": -42,
                "z": -1
              }
            },
            {
              "c": "#53cb46",
              "i": "gem1",
              "n": "green",
              "ud": {
                "aot": false,
                "pt": 4,
                "ai": {},
                "cbg": true,
                "cn": {},
                "cnf": {},
                "aos": false,
                "cbd": false,
                "onSpawn": "setInterval 1",
                "onInterval": "convertFriend green",
                "onTap": "activate",
                "onActivated": "convertIn white"
              },
              "B": "hsv",
              "o": {
                "x": 46,
                "y": 1,
                "z": -1
              }
            },
            {
              "c": "#53cb46",
              "i": "gem1",
              "n": "green",
              "ud": {
                "aot": false,
                "pt": 4,
                "ai": {},
                "cbg": true,
                "cn": {},
                "cnf": {},
                "aos": false,
                "cbd": false,
                "onSpawn": "setInterval 1",
                "onInterval": "convertFriend green",
                "onTap": "activate",
                "onActivated": "convertIn white"
              },
              "B": "hsv",
              "o": {
                "x": 1,
                "y": 45,
                "z": -1
              }
            },
            {
              "c": "#53cb46",
              "i": "gem1",
              "n": "green",
              "ud": {
                "aot": false,
                "pt": 4,
                "ai": {},
                "cbg": true,
                "cn": {},
                "cnf": {},
                "aos": false,
                "cbd": false,
                "onSpawn": "setInterval 1",
                "onInterval": "convertFriend green",
                "onTap": "activate",
                "onActivated": "convertIn white"
              },
              "B": "hsv",
              "o": {
                "x": -45,
                "y": 2,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 3,
                "y": 1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": -20,
        "y": 1646
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 47
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 91,
                "y": 1
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 135,
                "y": 2
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pink",
              "ud": {
                "pt": 3,
                "spin": "",
                "cbg": false,
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn pink",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "z": -1
              }
            }
          ],
          "o": {
            "x": -190,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pinkr",
              "ud": {
                "pt": 3,
                "spin": "",
                "aot": false,
                "ros": false,
                "roa": false,
                "mfts": true,
                "onActivated": "moveFriends, spawn white, rotate",
                "onTap": "activate",
                "onSpawn": "autodir"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "y": 1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": -868,
        "y": 1080
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "y": 48
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "y": 138
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 1,
                "y": 94
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pink",
              "ud": {
                "pt": 3,
                "spin": "",
                "cbg": false,
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn pink",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "z": -1
              }
            }
          ],
          "o": {
            "x": -146,
            "y": -50,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#a6a969",
              "i": "gem1",
              "R": 270,
              "n": "pinkr",
              "ud": {
                "pt": 3,
                "spin": "",
                "aot": false,
                "ros": false,
                "roa": false,
                "mfts": true,
                "onActivated": "moveFriends, spawn white, rotate",
                "onTap": "activate",
                "onSpawn": "autodir"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "y": 1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": -296,
        "y": 1083,
        "z": -4
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -41,
                "y": -1
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -130,
                "y": 2
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -86
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pink",
              "ud": {
                "pt": 3,
                "spin": "",
                "cbg": false,
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn pink",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "z": -1
              }
            }
          ],
          "o": {
            "x": -102,
            "y": -8,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#a6a969",
              "i": "gem1",
              "R": 180,
              "n": "pinkr",
              "ud": {
                "pt": 3,
                "spin": "",
                "aot": false,
                "ros": false,
                "roa": false,
                "mfts": true,
                "onActivated": "moveFriends, spawn white, rotate",
                "onTap": "activate",
                "onSpawn": "autodir"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "y": 1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": 276,
        "y": 1082,
        "z": -4
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 1,
                "y": -49
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "y": -138
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "y": -93
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pink",
              "ud": {
                "pt": 3,
                "spin": "",
                "cbg": false,
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn pink",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "z": -1
              }
            }
          ],
          "o": {
            "x": -145,
            "y": 40,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#a6a969",
              "i": "gem1",
              "R": 90,
              "n": "pinkr",
              "ud": {
                "pt": 3,
                "spin": "",
                "aot": false,
                "ros": false,
                "roa": false,
                "mfts": true,
                "onActivated": "moveFriends, spawn white, rotate",
                "onTap": "activate",
                "onSpawn": "autodir"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "y": 1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": 850,
        "y": 1080,
        "z": -4
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pink",
              "ud": {
                "pt": 3,
                "spin": "",
                "cbg": false,
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn pink",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 1,
                "y": -3,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pink",
              "ud": {
                "pt": 3,
                "spin": "",
                "cbg": false,
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn pink",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 47,
                "y": -2,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pink",
              "ud": {
                "pt": 3,
                "spin": "",
                "cbg": false,
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn pink",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 47,
                "y": -47,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pink",
              "ud": {
                "pt": 3,
                "spin": "",
                "cbg": false,
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn pink",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 1,
                "y": -47,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pink",
              "ud": {
                "pt": 3,
                "spin": "",
                "cbg": false,
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn pink",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -42,
                "y": -47,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pink",
              "ud": {
                "pt": 3,
                "spin": "",
                "cbg": false,
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn pink",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -42,
                "y": -3,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pink",
              "ud": {
                "pt": 3,
                "spin": "",
                "cbg": false,
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn pink",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -43,
                "y": 40,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pink",
              "ud": {
                "pt": 3,
                "spin": "",
                "cbg": false,
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn pink",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 1,
                "y": 40,
                "z": -1
              }
            },
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pink",
              "ud": {
                "pt": 3,
                "spin": "",
                "cbg": false,
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn pink",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 46,
                "y": 41,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -150,
            "y": -1,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#53cb46",
              "i": "gem1",
              "n": "green",
              "ud": {
                "aot": false,
                "pt": 4,
                "ai": {},
                "cbg": true,
                "cn": {},
                "cnf": {},
                "aos": false,
                "cbd": false,
                "onSpawn": "setInterval 1",
                "onInterval": "convertFriend green",
                "onTap": "activate",
                "onActivated": "convertIn white"
              },
              "B": "hsv",
              "o": {
                "x": 1,
                "y": 1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": -22,
        "y": 1361,
        "z": -4
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#aed46e",
              "i": "gem1",
              "R": 90,
              "n": "redr",
              "ud": {
                "aot": false,
                "pt": 2,
                "spin": {},
                "cbm": true,
                "hdf": true,
                "ros": false,
                "onActivated": "spawn white",
                "onTap": "activate",
                "onSpawn": "autodir"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "y": 4,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "R": 90,
              "n": "redr",
              "ud": {
                "aot": false,
                "pt": 2,
                "spin": {},
                "cbm": true,
                "hdf": true,
                "ros": false,
                "onActivated": "spawn white",
                "onTap": "activate",
                "onSpawn": "autodir"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": 46,
                "y": -41,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "R": 90,
              "n": "redr",
              "ud": {
                "aot": false,
                "pt": 2,
                "spin": {},
                "cbm": true,
                "hdf": true,
                "ros": false,
                "onActivated": "spawn white",
                "onTap": "activate",
                "onSpawn": "autodir"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": 44,
                "y": 44,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "R": 90,
              "n": "redr",
              "ud": {
                "aot": false,
                "pt": 2,
                "spin": {},
                "cbm": true,
                "hdf": true,
                "ros": false,
                "onActivated": "spawn white",
                "onTap": "activate",
                "onSpawn": "autodir"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": -46,
                "y": 45,
                "z": -1
              }
            },
            {
              "c": "#aed46e",
              "i": "gem1",
              "R": 90,
              "n": "redr",
              "ud": {
                "aot": false,
                "pt": 2,
                "spin": {},
                "cbm": true,
                "hdf": true,
                "ros": false,
                "onActivated": "spawn white",
                "onTap": "activate",
                "onSpawn": "autodir"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "x": -45,
                "y": -39,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "s": {
                "y": 40,
                "x": 40
              },
              "c": "#baf292",
              "i": "gem1",
              "R": 45,
              "n": "yellow",
              "ud": {
                "cbg": true,
                "cby": false,
                "aos": false,
                "ai": {},
                "aot": false,
                "df": false,
                "pt": 9,
                "onInterval": "destroyFriends",
                "onTap": "activate",
                "onActivated": "resetInterval 1.1",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -1,
                "y": 1,
                "z": -10
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": 851,
        "y": 799
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#aed46e",
              "i": "gem1",
              "n": "redr",
              "ud": {
                "aot": false,
                "pt": 2,
                "spin": {},
                "cbm": true,
                "hdf": true,
                "ros": false,
                "onActivated": "spawn white",
                "onTap": "activate",
                "onSpawn": "autodir"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "y": 4,
                "z": -1
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 43,
                "y": -44
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -46,
                "y": -41
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -1,
                "y": -43
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 45,
                "y": 45
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -44,
                "y": 48
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 1,
                "y": 46
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -45,
                "y": 4
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 45
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pinkr",
              "ud": {
                "pt": 3,
                "spin": "",
                "aot": false,
                "ros": false,
                "roa": false,
                "mfts": true,
                "onActivated": "moveFriends, spawn white, rotate",
                "onTap": "activate",
                "onSpawn": "autodir"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": 0.926,
                  "__alpha": 0.7,
                  "i": "prt1",
                  "R": 45,
                  "bl": 2,
                  "o": {
                    "x": 14
                  }
                }
              ],
              "o": {
                "y": 1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": 277,
        "y": 799
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#ffb881",
              "i": "gem1",
              "n": "blue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 5,
                "cbg": true,
                "cby": true,
                "cbm": true,
                "accel_factor": false,
                "onActivated": "resetInterval 2",
                "onInterval": "activateFriends",
                "onTap": "activate",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "y": 1,
                "z": -1
              }
            },
            {
              "c": "#ffb881",
              "i": "gem1",
              "n": "blue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 5,
                "cbg": true,
                "cby": true,
                "cbm": true,
                "accel_factor": false,
                "onActivated": "resetInterval 2",
                "onInterval": "activateFriends",
                "onTap": "activate",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 46,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -2,
                "y": 1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": -865,
        "y": 1938
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#ffb881",
              "i": "gem1",
              "n": "blue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 5,
                "cbg": true,
                "cby": true,
                "cbm": true,
                "accel_factor": false,
                "onActivated": "resetInterval 2",
                "onInterval": "activateFriends",
                "onTap": "activate",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "y": 1,
                "z": -1
              }
            },
            {
              "c": "#ffb881",
              "i": "gem1",
              "n": "blue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 5,
                "cbg": true,
                "cby": true,
                "cbm": true,
                "accel_factor": false,
                "onActivated": "resetInterval 2",
                "onInterval": "activateFriends",
                "onTap": "activate",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 2,
                "y": 46,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -2,
                "y": 1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": -293,
        "y": 1941
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#ffb881",
              "i": "gem1",
              "n": "blue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 5,
                "cbg": true,
                "cby": true,
                "cbm": true,
                "accel_factor": false,
                "onActivated": "resetInterval 2",
                "onInterval": "activateFriends",
                "onTap": "activate",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "y": 1,
                "z": -1
              }
            },
            {
              "c": "#ffb881",
              "i": "gem1",
              "n": "blue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 5,
                "cbg": true,
                "cby": true,
                "cbm": true,
                "accel_factor": false,
                "onActivated": "resetInterval 2",
                "onInterval": "activateFriends",
                "onTap": "activate",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -48,
                "y": 2,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -2,
                "y": 1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": 285,
        "y": 1941
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#ffb881",
              "i": "gem1",
              "n": "blue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 5,
                "cbg": true,
                "cby": true,
                "cbm": true,
                "accel_factor": false,
                "onActivated": "resetInterval 2",
                "onInterval": "activateFriends",
                "onTap": "activate",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "y": 1,
                "z": -1
              }
            },
            {
              "c": "#ffb881",
              "i": "gem1",
              "n": "blue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 5,
                "cbg": true,
                "cby": true,
                "cbm": true,
                "accel_factor": false,
                "onActivated": "resetInterval 2",
                "onInterval": "activateFriends",
                "onTap": "activate",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 1,
                "y": -46,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -2,
                "y": 1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": 862,
        "y": 1942
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#ffb881",
              "i": "gem1",
              "n": "blue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 5,
                "cbg": true,
                "cby": true,
                "cbm": true,
                "accel_factor": false,
                "onActivated": "resetInterval 2",
                "onInterval": "activateFriends",
                "onTap": "activate",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "y": 1,
                "z": -1
              }
            },
            {
              "c": "#53cb46",
              "i": "gem1",
              "n": "green",
              "ud": {
                "aot": false,
                "pt": 4,
                "ai": {},
                "cbg": true,
                "cn": {},
                "cnf": {},
                "aos": false,
                "cbd": false,
                "onSpawn": "setInterval 1",
                "onInterval": "convertFriend green",
                "onTap": "activate",
                "onActivated": "convertIn white"
              },
              "B": "hsv",
              "o": {
                "y": -42,
                "z": -1
              }
            },
            {
              "c": "#53cb46",
              "i": "gem1",
              "n": "green",
              "ud": {
                "aot": false,
                "pt": 4,
                "ai": {},
                "cbg": true,
                "cn": {},
                "cnf": {},
                "aos": false,
                "cbd": false,
                "onSpawn": "setInterval 1",
                "onInterval": "convertFriend green",
                "onTap": "activate",
                "onActivated": "convertIn white"
              },
              "B": "hsv",
              "o": {
                "x": 46,
                "y": 1,
                "z": -1
              }
            },
            {
              "c": "#53cb46",
              "i": "gem1",
              "n": "green",
              "ud": {
                "aot": false,
                "pt": 4,
                "ai": {},
                "cbg": true,
                "cn": {},
                "cnf": {},
                "aos": false,
                "cbd": false,
                "onSpawn": "setInterval 1",
                "onInterval": "convertFriend green",
                "onTap": "activate",
                "onActivated": "convertIn white"
              },
              "B": "hsv",
              "o": {
                "x": 1,
                "y": 45,
                "z": -1
              }
            },
            {
              "c": "#53cb46",
              "i": "gem1",
              "n": "green",
              "ud": {
                "aot": false,
                "pt": 4,
                "ai": {},
                "cbg": true,
                "cn": {},
                "cnf": {},
                "aos": false,
                "cbd": false,
                "onSpawn": "setInterval 1",
                "onInterval": "convertFriend green",
                "onTap": "activate",
                "onActivated": "convertIn white"
              },
              "B": "hsv",
              "o": {
                "x": -45,
                "y": 2,
                "z": -1
              }
            },
            {
              "c": "#53cb46",
              "i": "gem1",
              "n": "green",
              "ud": {
                "aot": false,
                "pt": 4,
                "ai": {},
                "cbg": true,
                "cn": {},
                "cnf": {},
                "aos": false,
                "cbd": false,
                "onSpawn": "setInterval 1",
                "onInterval": "convertFriend green",
                "onTap": "activate",
                "onActivated": "convertIn white"
              },
              "B": "hsv",
              "o": {
                "x": 44,
                "y": -42,
                "z": -1
              }
            },
            {
              "c": "#53cb46",
              "i": "gem1",
              "n": "green",
              "ud": {
                "aot": false,
                "pt": 4,
                "ai": {},
                "cbg": true,
                "cn": {},
                "cnf": {},
                "aos": false,
                "cbd": false,
                "onSpawn": "setInterval 1",
                "onInterval": "convertFriend green",
                "onTap": "activate",
                "onActivated": "convertIn white"
              },
              "B": "hsv",
              "o": {
                "x": 45,
                "y": 42,
                "z": -1
              }
            },
            {
              "c": "#53cb46",
              "i": "gem1",
              "n": "green",
              "ud": {
                "aot": false,
                "pt": 4,
                "ai": {},
                "cbg": true,
                "cn": {},
                "cnf": {},
                "aos": false,
                "cbd": false,
                "onSpawn": "setInterval 1",
                "onInterval": "convertFriend green",
                "onTap": "activate",
                "onActivated": "convertIn white"
              },
              "B": "hsv",
              "o": {
                "x": -46,
                "y": -42,
                "z": -1
              }
            },
            {
              "c": "#53cb46",
              "i": "gem1",
              "n": "green",
              "ud": {
                "aot": false,
                "pt": 4,
                "ai": {},
                "cbg": true,
                "cn": {},
                "cnf": {},
                "aos": false,
                "cbd": false,
                "onSpawn": "setInterval 1",
                "onInterval": "convertFriend green",
                "onTap": "activate",
                "onActivated": "convertIn white"
              },
              "B": "hsv",
              "o": {
                "x": -45,
                "y": 42,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -2,
                "y": 1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": 864,
        "y": 1669
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": -2,
                "z": -1
              }
            },
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": 1,
                "y": -42,
                "z": -1
              }
            },
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": 44,
                "y": -44,
                "z": -1
              }
            },
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": 43,
                "y": 3,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#53cb46",
              "i": "gem1",
              "n": "green",
              "ud": {
                "aot": false,
                "pt": 4,
                "ai": {},
                "cbg": true,
                "cn": {},
                "cnf": {},
                "aos": false,
                "cbd": false,
                "onSpawn": "setInterval 1",
                "onInterval": "convertFriend green",
                "onTap": "activate",
                "onActivated": "convertIn white"
              },
              "B": "hsv",
              "o": {
                "x": 1,
                "y": 1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": -845,
        "y": 2280
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": -2,
                "z": -1
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 46,
                "y": 1
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -46,
                "y": 1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pink",
              "ud": {
                "pt": 3,
                "spin": "",
                "cbg": false,
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn pink",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": 309,
        "y": 2545
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": -2,
                "z": -1
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -1,
                "y": -43
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -3,
                "y": 42
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#a6a969",
              "i": "gem1",
              "n": "pink",
              "ud": {
                "pt": 3,
                "spin": "",
                "cbg": false,
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn pink",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": 309,
        "y": 2270
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": -2,
                "z": -1
              }
            },
            {
              "c": "#ffb881",
              "i": "gem1",
              "n": "blue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 5,
                "cbg": true,
                "cby": true,
                "cbm": true,
                "accel_factor": false,
                "onActivated": "resetInterval 2",
                "onInterval": "activateFriends",
                "onTap": "activate",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 1,
                "y": -46,
                "z": -1
              }
            },
            {
              "c": "#ffb881",
              "i": "gem1",
              "n": "blue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 5,
                "cbg": true,
                "cby": true,
                "cbm": true,
                "accel_factor": false,
                "onActivated": "resetInterval 2",
                "onInterval": "activateFriends",
                "onTap": "activate",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "y": 43,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#ffd55f",
              "i": "gem1",
              "n": "bluea",
              "ud": {
                "cby": true,
                "cbg": true,
                "cbm": true,
                "aos": false,
                "ai": {},
                "icba": true,
                "accel_factor": false,
                "onSpawn": "setInterval 0.2",
                "onInterval": "activate",
                "onActivated": "activateFriends",
                "pt": 8
              },
              "B": "hsv",
              "o": {
                "x": -1,
                "y": 1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": 889,
        "y": 2271
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": -2,
                "z": -1
              }
            },
            {
              "s": {
                "y": 44,
                "x": 44
              },
              "c": "#ffb881",
              "i": "gem1",
              "n": "blue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 5,
                "cbg": true,
                "cby": true,
                "cbm": true,
                "accel_factor": false,
                "onActivated": "resetInterval 2",
                "onInterval": "activateFriends",
                "onTap": "activate",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 47,
                "z": -1
              }
            },
            {
              "c": "#ffb881",
              "i": "gem1",
              "n": "blue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 5,
                "cbg": true,
                "cby": true,
                "cbm": true,
                "accel_factor": false,
                "onActivated": "resetInterval 2",
                "onInterval": "activateFriends",
                "onTap": "activate",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -46,
                "y": 1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#ffd55f",
              "i": "gem1",
              "n": "bluea",
              "ud": {
                "cby": true,
                "cbg": true,
                "cbm": true,
                "aos": false,
                "ai": {},
                "icba": true,
                "accel_factor": false,
                "onSpawn": "setInterval 0.2",
                "onInterval": "activate",
                "onActivated": "activateFriends",
                "pt": 8
              },
              "B": "hsv",
              "o": {
                "x": -1,
                "y": 1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": 895,
        "y": 2543
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": -2,
                "z": -1
              }
            },
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": -50,
                "y": -1,
                "z": -1
              }
            },
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": 93,
                "y": 2,
                "z": -1
              }
            },
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": 43,
                "y": 3,
                "z": -1
              }
            },
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": -94,
                "y": -2,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "ud": {
                "cbm": true,
                "cbg": true,
                "cby": true,
                "pt": 7
              },
              "B": "hsv",
              "o": {
                "y": -3,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": -273,
        "y": 2270
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": -2,
                "z": -1
              }
            },
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": -2,
                "y": -43,
                "z": -1
              }
            },
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "y": 92,
                "z": -1
              }
            },
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": 2,
                "y": 45,
                "z": -1
              }
            },
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": -3,
                "y": -89,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "ud": {
                "cbm": true,
                "cbg": true,
                "cby": true,
                "pt": 7
              },
              "B": "hsv",
              "o": {
                "y": -3,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": -269,
        "y": 2544
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": 45,
                "y": -1,
                "z": -1
              }
            },
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": -2,
                "y": -43,
                "z": -1
              }
            },
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": 2,
                "y": 45,
                "z": -1
              }
            },
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": -47,
                "z": -1
              }
            },
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "ud": {
                "cbm": true,
                "cbg": true,
                "cby": true,
                "pt": 7
              },
              "B": "hsv",
              "o": {
                "y": -3,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "y": -41
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -45
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -1,
                "y": 45
              }
            },
            {
              "c": "#54547e",
              "i": "gem1",
              "n": "white",
              "ud": {
                "pt": 1,
                "spin": {},
                "asd": true,
                "aot": false,
                "onActivated": "selectDir, spawn white",
                "onTap": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 45
              }
            },
            {
              "s": {
                "y": 40,
                "x": 40
              },
              "c": "#baf292",
              "i": "gem1",
              "R": 45,
              "n": "yellow",
              "ud": {
                "cbg": true,
                "cby": false,
                "aos": false,
                "ai": {},
                "aot": false,
                "df": false,
                "pt": 9,
                "onInterval": "destroyFriends",
                "onTap": "activate",
                "onActivated": "resetInterval 1.1",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -1,
                "y": 1,
                "z": -10
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": -843,
        "y": 2545
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": 1,
                "y": 48,
                "z": -1
              }
            },
            {
              "c": "#ffb881",
              "i": "gem1",
              "n": "blue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 5,
                "cbg": true,
                "cby": true,
                "cbm": true,
                "accel_factor": false,
                "onActivated": "resetInterval 2",
                "onInterval": "activateFriends",
                "onTap": "activate",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "y": -1,
                "z": -1
              }
            },
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": 3,
                "y": -45,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#ffd55f",
              "i": "gem1",
              "n": "bluea",
              "ud": {
                "cby": true,
                "cbg": true,
                "cbm": true,
                "aos": false,
                "ai": {},
                "icba": true,
                "accel_factor": false,
                "onSpawn": "setInterval 0.2",
                "onInterval": "activate",
                "onActivated": "activateFriends",
                "pt": 8
              },
              "B": "hsv",
              "o": {
                "x": -1,
                "y": 1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": 889,
        "y": 2816
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": -46,
                "y": 5,
                "z": -1
              }
            },
            {
              "c": "#ffb881",
              "i": "gem1",
              "n": "blue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 5,
                "cbg": true,
                "cby": true,
                "cbm": true,
                "accel_factor": false,
                "onActivated": "resetInterval 2",
                "onInterval": "activateFriends",
                "onTap": "activate",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "y": -1,
                "z": -1
              }
            },
            {
              "c": "#9ca575",
              "i": "gem1",
              "R": 45,
              "n": "pinkblue",
              "ud": {
                "aot": false,
                "ai": {},
                "pt": 6,
                "cbg": false,
                "cby": false,
                "cbm": false,
                "accel_factor": false,
                "onActivated": "rotate",
                "onInterval": "activateFriends, moveFriends, spawn pinkblue",
                "onTap": "activate",
                "onSpawn": "setInterval 0.7"
              },
              "B": "hsv",
              "_": [
                {
                  "s": {
                    "y": 18,
                    "x": 18
                  },
                  "c": "#b16666",
                  "__alpha": 1.9,
                  "i": "prt1",
                  "R": 45,
                  "o": {
                    "x": 12,
                    "y": 14
                  }
                }
              ],
              "o": {
                "x": 46,
                "y": 1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "c": "#ffd55f",
              "i": "gem1",
              "n": "bluea",
              "ud": {
                "cby": true,
                "cbg": true,
                "cbm": true,
                "aos": false,
                "ai": {},
                "icba": true,
                "accel_factor": false,
                "onSpawn": "setInterval 0.2",
                "onInterval": "activate",
                "onActivated": "activateFriends",
                "pt": 8
              },
              "B": "hsv",
              "o": {
                "x": -1,
                "y": 1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": 895,
        "y": 3093
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "s": {
                "y": 40,
                "x": 40
              },
              "c": "#baf292",
              "i": "gem1",
              "R": 45,
              "n": "yellow",
              "ud": {
                "cbg": true,
                "cby": false,
                "aos": false,
                "ai": {},
                "aot": false,
                "df": false,
                "pt": 9,
                "onInterval": "destroyFriends",
                "onTap": "activate",
                "onActivated": "resetInterval 1.1",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 2,
                "y": -44,
                "z": -10
              }
            },
            {
              "s": {
                "y": 40,
                "x": 40
              },
              "c": "#baf292",
              "i": "gem1",
              "R": 45,
              "n": "yellow",
              "ud": {
                "cbg": true,
                "cby": false,
                "aos": false,
                "ai": {},
                "aot": false,
                "df": false,
                "pt": 9,
                "onInterval": "destroyFriends",
                "onTap": "activate",
                "onActivated": "resetInterval 1.1",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 2,
                "y": 46,
                "z": -10
              }
            },
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "ud": {
                "cbm": true,
                "cbg": true,
                "cby": true,
                "pt": 7
              },
              "B": "hsv",
              "o": {
                "x": 2,
                "y": -1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "s": {
                "y": 40,
                "x": 40
              },
              "c": "#baf292",
              "i": "gem1",
              "R": 45,
              "n": "yellow",
              "ud": {
                "cbg": true,
                "cby": false,
                "aos": false,
                "ai": {},
                "aot": false,
                "df": false,
                "pt": 9,
                "onInterval": "destroyFriends",
                "onTap": "activate",
                "onActivated": "resetInterval 1.1",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 2,
                "y": 46,
                "z": -10
              }
            },
            {
              "s": {
                "y": 40,
                "x": 40
              },
              "c": "#baf292",
              "i": "gem1",
              "R": 45,
              "n": "yellow",
              "ud": {
                "cbg": true,
                "cby": false,
                "aos": false,
                "ai": {},
                "aot": false,
                "df": false,
                "pt": 9,
                "onInterval": "destroyFriends",
                "onTap": "activate",
                "onActivated": "resetInterval 1.1",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 2,
                "y": -41,
                "z": -10
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": -278,
        "y": 2836
      }
    },
    {
      "s": {
        "y": 257,
        "x": 562
      },
      "c": 0.121,
      "_": [
        {
          "s": {
            "y": 172,
            "x": 170
          },
          "_S": {
            "x": 1.4,
            "y": 1.375
          },
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": -147,
            "y": -6
          }
        },
        {
          "i": "arrow",
          "o": {
            "y": -6
          }
        },
        {
          "s": {
            "y": 164,
            "x": 166
          },
          "S": 1.375,
          "__alpha": 0.1,
          "i": "res/grid.png?",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "o": {
            "x": 155,
            "y": -4
          }
        },
        {
          "s": {
            "y": 236,
            "x": 229
          },
          "n": "src",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "s": {
                "y": 40,
                "x": 40
              },
              "c": "#baf292",
              "i": "gem1",
              "R": 45,
              "n": "yellow",
              "ud": {
                "cbg": true,
                "cby": false,
                "aos": false,
                "ai": {},
                "aot": false,
                "df": false,
                "pt": 9,
                "onInterval": "destroyFriends",
                "onTap": "activate",
                "onActivated": "resetInterval 1.1",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 50,
                "y": 1,
                "z": -10
              }
            },
            {
              "s": {
                "y": 40,
                "x": 40
              },
              "c": "#baf292",
              "i": "gem1",
              "R": 45,
              "n": "yellow",
              "ud": {
                "cbg": true,
                "cby": false,
                "aos": false,
                "ai": {},
                "aot": false,
                "df": false,
                "pt": 9,
                "onInterval": "destroyFriends",
                "onTap": "activate",
                "onActivated": "resetInterval 1.1",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -43,
                "y": 4,
                "z": -10
              }
            },
            {
              "c": "#16161d",
              "i": "gem1",
              "n": "black",
              "ud": {
                "cbm": true,
                "cbg": true,
                "cby": true,
                "pt": 7
              },
              "B": "hsv",
              "o": {
                "x": 2,
                "y": -1,
                "z": -1
              }
            }
          ],
          "o": {
            "x": -147,
            "y": -6,
            "z": -1
          }
        },
        {
          "s": {
            "y": 228,
            "x": 230
          },
          "n": "dst",
          "ia": [
            1,
            1
          ],
          "rx": 1,
          "ry": 1,
          "_": [
            {
              "s": {
                "y": 40,
                "x": 40
              },
              "c": "#baf292",
              "i": "gem1",
              "R": 45,
              "n": "yellow",
              "ud": {
                "cbg": true,
                "cby": false,
                "aos": false,
                "ai": {},
                "aot": false,
                "df": false,
                "pt": 9,
                "onInterval": "destroyFriends",
                "onTap": "activate",
                "onActivated": "resetInterval 1.1",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": 50,
                "y": 1,
                "z": -10
              }
            },
            {
              "s": {
                "y": 40,
                "x": 40
              },
              "c": "#baf292",
              "i": "gem1",
              "R": 45,
              "n": "yellow",
              "ud": {
                "cbg": true,
                "cby": false,
                "aos": false,
                "ai": {},
                "aot": false,
                "df": false,
                "pt": 9,
                "onInterval": "destroyFriends",
                "onTap": "activate",
                "onActivated": "resetInterval 1.1",
                "onSpawn": "activate"
              },
              "B": "hsv",
              "o": {
                "x": -50,
                "y": 1,
                "z": -10
              }
            }
          ],
          "o": {
            "x": 155,
            "y": -4,
            "z": -1
          }
        }
      ],
      "o": {
        "x": -278,
        "y": 3101
      }
    }
  ]
},

'build_atlas-0.json':{"frames":{"prt8":[66,715,15,15,1],"prt7":[66,715,15,15,1],"prt12":[49,715,15,15,1],"prt1":[49,683,30,30,1],"prt3":[28,779,32,32,1],"prt0":[1,831,32,32,1],"arrow":[1,779,50,25,1],"gem1":[1,733,44,44,1],"prt15":[1,263,64,64,1],"prt6":[1,131,64,64,1],"prt10":[1,329,64,64,1],"prt13":[1,395,64,64,1],"prt2":[53,527,30,30,1],"prt11":[1,1,128,128,1],"prt9":[1,579,50,50,1],"optsbut":[1,631,50,50,1],"prt4":[47,733,32,32,1],"prt5":[1,683,48,46,1],"prt14":[1,461,64,58,1],"prt16":[1,197,64,64,1],"restartbut":[1,527,50,50,1]}},

'build_sounds.json':{
  "src": [
    "sounds.mp3"
  ],
  "sprite": {
    "click1": [
      0,
      198.82086167800452
    ],
    "click2": [
      448.8208616780045,
      178.50340136054422
    ],
    "click3": [
      877.3242630385487,
      129.16099773242632
    ]
  }
},
 k:1

});
