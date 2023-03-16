

 mergeObj ( globalConfigsData, { 

"shaders/base.f":"varying vec2 vUv;uniform sampler2D map;uniform vec3 color;uniform float opacity;void main(){vec4 c=texture2D(map,vUv);c.rgb*=color;gl_FragColor=c*opacity;}"
,
"shaders/base.v":"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*matrixWorld*vec4(position,1.0);}"
,
"shaders/c.f":"uniform vec3 color;uniform float opacity;void main(){gl_FragColor=vec4(color*opacity,opacity);}"
,
"shaders/part.f":"varying vec2 vUv;varying vec4 vColor;uniform sampler2D map;void main(){vec4 c=texture2D(map,vUv);c.rgb*=vColor.rgb;gl_FragColor=c*vColor.a;}"
,
"shaders/part.v":"varying vec2 vUv;varying vec4 vColor;attribute vec4 c;void main(){vUv=uv;vColor=c;gl_Position=projectionMatrix*vec4(position,1.0);}"
,
"shaders/partnc.f":"varying vec2 vUv;uniform sampler2D map;void main(){vec4 c=texture2D(map,vUv);gl_FragColor=c;}"
,
"shaders/partnc.v":"varying vec2 vUv;varying vec4 vColor;attribute vec4 c;void main(){vUv=uv;vColor=c;gl_Position=projectionMatrix*vec4(position,1.0);}"
,
"shaders/super1.f":"varying vec2 vUv;uniform sampler2D map;void main(){gl_FragColor=texture2D(map,vUv);}"
,
"shaders/super2.f":"varying vec2 vUv;uniform sampler2D map1;uniform sampler2D map2;uniform float sc;uniform float r1;uniform float g1;uniform float b1;void main(){vec4 c1=texture2D(map1,vUv);vec4 c2=texture2D(map2,sc*(vUv-0.5)+0.5);c2.r-=c1.r*r1;c2.g-=c1.g*g1;c2.b-=c1.b*b1;vec4 c=mix(c1,c2,0.5)*0.8;c.a=0.8;gl_FragColor=c*c.a*0.3;}"
,
"layouts/main.json":[
  {
    "__color": 0.163,
    "__size": [
      1,
      1
    ],
    "__childs": {
      "n1": {
        "__img": "prt3",
        "__size": [
          22,
          22
        ],
        "__ofs": [
          -47,
          0,
          -2
        ],
        "__effect": {
          "emitters": [
            {
              "loop": 1,
              "__angleMod": 3,
              "duration": -1,
              "texture": "prt7",
              "lifespan": [
                5,
                2
              ],
              "rate": [
                1000
              ],
              "power": [
                200
              ],
              "origin": {
                "x": [
                  0,
                  500
                ],
                "y": [
                  0,
                  500
                ]
              },
              "__componentsList": [
                {
                  "__componentType": "d",
                  "direction": [
                    0,
                    180
                  ],
                  "velocity": [
                    0,
                    10
                  ],
                  "size": {
                    "width": [
                      15,
                      6
                    ],
                    "height": [
                      5,
                      2
                    ]
                  },
                  "spin": [
                    0
                  ]
                },
                {
                  "__componentType": "c",
                  "color": {
                    "r": 255,
                    "g": [
                      150,
                      100
                    ],
                    "b": [
                      150,
                      100
                    ],
                    "a": [
                      150,
                      100
                    ]
                  },
                  "color_factor": [
                    1
                  ]
                }
              ]
            }
          ]
        }
      },
      "n2": {
        "__img": "prt3",
        "__size": [
          36,
          34
        ],
        "__ofs": [
          54,
          3,
          -2
        ],
        "__effect": {
          "emitters": [
            {
              "loop": 1,
              "__angleMod": 3,
              "duration": -1,
              "texture": "prt7",
              "lifespan": [
                5,
                2
              ],
              "rate": [
                1000
              ],
              "power": [
                200
              ],
              "origin": {
                "x": [
                  0,
                  500
                ],
                "y": [
                  0,
                  500
                ]
              },
              "__componentsList": [
                {
                  "__componentType": "d",
                  "direction": [
                    0,
                    180
                  ],
                  "velocity": [
                    0,
                    20
                  ],
                  "size": {
                    "width": [
                      15,
                      6
                    ],
                    "height": [
                      5,
                      2
                    ]
                  },
                  "spin": [
                    0
                  ]
                },
                {
                  "__componentType": "c",
                  "color": {
                    "r": 255,
                    "g": [
                      150,
                      100
                    ],
                    "b": [
                      150,
                      100
                    ],
                    "a": [
                      150,
                      100
                    ]
                  },
                  "color_factor": [
                    1
                  ]
                }
              ]
            }
          ]
        }
      },
      "text1": {
        "__size": [
          100,
          38
        ],
        "__text": {
          "__text": "drag"
        },
        "__y": 40
      },
      "but": {
        "__color": 0.6006,
        "__img": "prt8",
        "sha": 0,
        "sva": 0,
        "__corner": [
          8,
          9
        ],
        "__size": [
          164,
          44
        ],
        "__text": {
          "__color": "#2e0e0e",
          "__text": "randomize",
          "__colorString": {
            "r": 0.16272189349112431,
            "g": 0.05168813087365125,
            "b": 0.05168813087365125
          }
        },
        "__ofs": [
          4,
          4
        ]
      }
    },
    "__effect": {}
  }
]
,
"build_res/atlas-0.json":[["prt3",1,1,32,32,1],["prt7",1,35,15,15,1],["prt8",1,35,15,15,1]] 
});


 mergeObj ( globalConfigsData.__images, { 

"build_res/atlas-0.png":"data:image/png;base64,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"
});
