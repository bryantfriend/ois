// 80 authored physics design challenges. Generated offline; reference designs live only in QA fixtures.
const LAB_PHYSICS_PUZZLES=[
 {
  "id": 1,
  "tier": 0,
  "level": 1,
  "family": 0,
  "title": "Gravity well",
  "task": "Guide a falling ball through the lower build area.",
  "start": [
   120,
   35
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    75,
    200,
    90,
    130
   ]
  ],
  "stars": [
   [
    120,
    116.95
   ]
  ],
  "starRadius": 23,
  "goal": [
   120,
   303.37
  ],
  "goalRadius": 22,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Gravity",
   "question": "Does the ball speed up during an unobstructed fall?",
   "options": [
    "Yes: gravity accelerates it.",
    "No: it falls at constant speed."
   ],
   "correct": 0,
   "explain": "Gravity increases downward velocity by gΔt. In free fall, v² = u² + 2gΔh.",
   "reflect": "What happened to speed while height decreased?"
  },
  "hint": "Gravity increases downward velocity by gΔt. In free fall, v² = u² + 2gΔh.",
  "inkLimit": 160
 },
 {
  "id": 2,
  "tier": 0,
  "level": 2,
  "family": 1,
  "title": "Downhill delivery",
  "task": "Build a smooth downhill route. Compare the speed at different heights.",
  "start": [
   60,
   30
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    8,
    58,
    444,
    204
   ]
  ],
  "stars": [
   [
    61.83,
    80.02
   ],
   [
    133.97,
    108.88
   ]
  ],
  "starRadius": 23,
  "goal": [
   276.47,
   165.88
  ],
  "goalRadius": 22,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Slope and force",
   "question": "Does a steeper smooth downhill ramp usually produce greater acceleration?",
   "options": [
    "No: ramp angle has no effect.",
    "Yes: more gravity acts along the ramp."
   ],
   "correct": 1,
   "explain": "The component of weight along an incline is mg sin θ. A steeper incline gives greater downhill acceleration.",
   "reflect": "How could you change the ramp angle while keeping the start height fixed?"
  },
  "hint": "The component of weight along an incline is mg sin θ. A steeper incline gives greater downhill acceleration.",
  "inkLimit": 893
 },
 {
  "id": 3,
  "tier": 0,
  "level": 3,
  "family": 2,
  "title": "Leftward landing",
  "task": "Deliver the ball leftwards without changing gravity.",
  "start": [
   540,
   30
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    128,
    58,
    464,
    219
   ]
  ],
  "stars": [
   [
    537.43,
    80.79
   ],
   [
    460.76,
    112.74
   ]
  ],
  "starRadius": 23,
  "goal": [
   308.34,
   176.24
  ],
  "goalRadius": 22,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Potential energy",
   "question": "Where does a falling ball get its increasing kinetic energy?",
   "options": [
    "From decreasing gravitational potential energy.",
    "From extra mass created as it falls."
   ],
   "correct": 0,
   "explain": "Gravitational potential energy mgh changes into kinetic energy ½mv². Friction and inelastic impacts transfer some mechanical energy to the surroundings.",
   "reflect": "Compare height lost with the peak speed you measured."
  },
  "hint": "Gravitational potential energy mgh changes into kinetic energy ½mv². Friction and inelastic impacts transfer some mechanical energy to the surroundings.",
  "inkLimit": 934
 },
 {
  "id": 4,
  "tier": 0,
  "level": 4,
  "family": 3,
  "title": "Return through the checkpoint",
  "task": "Travel right, rebound, then take a lower route back left.",
  "start": [
   70,
   30
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [
   {
    "points": [
     [
      460,
      105
     ],
     [
      460,
      250
     ]
    ],
    "e": 0.75
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    25,
    65,
    410,
    100
   ],
   [
    115,
    195,
    340,
    135
   ]
  ],
  "stars": [
   [
    137.06,
    86.76
   ],
   [
    418.61,
    136.03
   ]
  ],
  "starRadius": 23,
  "goal": [
   264.67,
   256.58
  ],
  "goalRadius": 22,
  "materials": [
   "smooth"
  ],
  "minBounces": 1,
  "science": {
   "concept": "Normal force",
   "question": "Can a surface change velocity direction without changing gravity’s direction?",
   "options": [
    "No: gravity must turn sideways.",
    "Yes: contact provides a normal force."
   ],
   "correct": 1,
   "explain": "The surface pushes perpendicular to itself. This normal force redirects the ball; gravity still acts downward.",
   "reflect": "Identify each place where contact changed the direction of motion."
  },
  "hint": "The surface pushes perpendicular to itself. This normal force redirects the ball; gravity still acts downward.",
  "inkLimit": 1440
 },
 {
  "id": 5,
  "tier": 0,
  "level": 5,
  "family": 4,
  "title": "Three-storey switchback",
  "task": "Use three separate build areas and two changes of direction.",
  "start": [
   70,
   25
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [
   {
    "points": [
     [
      440,
      100
     ],
     [
      440,
      240
     ]
    ],
    "e": 0.8
   },
   {
    "points": [
     [
      160,
      235
     ],
     [
      160,
      280
     ]
    ],
    "e": 0.8
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    25,
    55,
    380,
    110
   ],
   [
    185,
    175,
    255,
    100
   ],
   [
    155,
    285,
    315,
    95
   ]
  ],
  "stars": [
   [
    184.05,
    89.19
   ],
   [
    242.58,
    232.7
   ]
  ],
  "starRadius": 23,
  "goal": [
   354.53,
   329.68
  ],
  "goalRadius": 22,
  "materials": [
   "smooth"
  ],
  "minBounces": 2,
  "science": {
   "concept": "Collisions and energy",
   "question": "Do abrupt non-elastic direction changes retain all kinetic energy?",
   "options": [
    "No: some mechanical energy is transferred.",
    "Yes: every impact preserves kinetic energy."
   ],
   "correct": 0,
   "explain": "A sharp impact removes part of the incoming normal velocity. Smooth bends lose less mechanical energy than abrupt non-elastic impacts in this model.",
   "reflect": "Which bend could you smooth to retain more speed?"
  },
  "hint": "A sharp impact removes part of the incoming normal velocity. Smooth bends lose less mechanical energy than abrupt non-elastic impacts in this model.",
  "inkLimit": 1749
 },
 {
  "id": 6,
  "tier": 0,
  "level": 6,
  "family": 5,
  "title": "Horizontal gap",
  "task": "Choose a launch speed and intercept the flight on the far side.",
  "start": [
   35,
   60
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 108,
   "angle": 0,
   "min": 80,
   "max": 220,
   "angleMin": 0,
   "angleMax": 0,
   "direction": 1
  },
  "fixed": [
   {
    "points": [
     [
      20,
      130
     ],
     [
      170,
      130
     ]
    ]
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    260,
    210,
    280,
    90
   ]
  ],
  "stars": [
   [
    149,
    116.96
   ],
   [
    286.4,
    177.58
   ]
  ],
  "starRadius": 23,
  "goal": [
   476.5,
   256.85
  ],
  "goalRadius": 22,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Projectile motion",
   "question": "With no air drag, what accelerates horizontal motion after launch?",
   "options": [
    "Gravity: it continually speeds the ball sideways.",
    "Nothing: horizontal velocity stays constant in flight."
   ],
   "correct": 1,
   "explain": "Horizontal and vertical motion are independent in free flight. Horizontal displacement is uₓt; gravity changes vertical velocity.",
   "reflect": "Use the flight time and horizontal speed to estimate the gap crossed."
  },
  "hint": "Horizontal and vertical motion are independent in free flight. Horizontal displacement is uₓt; gravity changes vertical velocity.",
  "inkLimit": 621
 },
 {
  "id": 7,
  "tier": 0,
  "level": 7,
  "family": 6,
  "title": "Over the tower",
  "task": "Choose a speed and angle that clear the tower.",
  "start": [
   70,
   330
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 216,
   "angle": 53,
   "min": 180,
   "max": 380,
   "angleMin": 15,
   "angleMax": 75,
   "direction": 1
  },
  "fixed": [],
  "blocks": [
   [
    260,
    280,
    30,
    108
   ]
  ],
  "hazards": [],
  "zones": [
   [
    420,
    270,
    140,
    90
   ]
  ],
  "stars": [
   [
    180.31,
    246.42
   ],
   [
    314.38,
    216.26
   ]
  ],
  "starRadius": 23,
  "goal": [
   462.87,
   274.33
  ],
  "goalRadius": 22,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Launch angle",
   "question": "At the same launch speed, which gives a larger initial upward component?",
   "options": [
    "A larger launch angle (up to 90°).",
    "A smaller launch angle."
   ],
   "correct": 0,
   "explain": "The initial components are uₓ = u cos θ and uᵧ = u sin θ. Changing angle trades horizontal motion for upward motion.",
   "reflect": "Why might a higher arc still miss a distant target?"
  },
  "hint": "The initial components are uₓ = u cos θ and uᵧ = u sin θ. Changing angle trades horizontal motion for upward motion.",
  "inkLimit": 160,
  "timeBand": [
   1.02,
   3.05
  ]
 },
 {
  "id": 8,
  "tier": 0,
  "level": 8,
  "family": 7,
  "title": "Bank shot",
  "task": "Use the vertical bouncy wall to return toward a target.",
  "start": [
   85,
   85
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 173,
   "angle": 13,
   "min": 150,
   "max": 300,
   "angleMin": -15,
   "angleMax": 25,
   "direction": 1
  },
  "fixed": [
   {
    "points": [
     [
      450,
      20
     ],
     [
      450,
      365
     ]
    ],
    "e": 0.82
   },
   {
    "points": [
     [
      120,
      370
     ],
     [
      445,
      370
     ]
    ],
    "e": 0.72
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    60,
    260,
    120,
    100
   ]
  ],
  "stars": [
   [
    262.88,
    124.03
   ],
   [
    405.26,
    317.61
   ]
  ],
  "starRadius": 23,
  "goal": [
   208.43,
   227
  ],
  "goalRadius": 22,
  "materials": [
   "smooth"
  ],
  "minBounces": 1,
  "science": {
   "concept": "Impulse and rebound",
   "question": "At a vertical bouncy wall, which velocity component mainly reverses?",
   "options": [
    "The component parallel to the wall.",
    "The component perpendicular to the wall."
   ],
   "correct": 1,
   "explain": "A collision impulse changes velocity normal to the wall. With restitution e, normal speed after impact is e times normal speed before it.",
   "reflect": "Compare the trail before and after the wall collision."
  },
  "hint": "A collision impulse changes velocity normal to the wall. With restitution e, normal speed after impact is e times normal speed before it.",
  "inkLimit": 160
 },
 {
  "id": 9,
  "tier": 0,
  "level": 9,
  "family": 8,
  "title": "Catch the rebound",
  "task": "Choose a bouncy pad and reach a target during the upward rebound.",
  "start": [
   200,
   35
  ],
  "velocity": [
   55,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    145,
    315,
    365,
    35
   ]
  ],
  "stars": [
   [
    240.26,
    87.85
   ],
   [
    288.88,
    291.82
   ]
  ],
  "starRadius": 23,
  "goal": [
   342.99,
   151.86
  ],
  "goalRadius": 22,
  "materials": [
   "smooth",
   "bounce"
  ],
  "minBounces": 1,
  "science": {
   "concept": "Bounce height",
   "question": "Does an e = 0.82 rebound return a ball to its original height?",
   "options": [
    "No: the rebound normal energy is only e² of before.",
    "Yes: any elastic-looking surface restores the height."
   ],
   "correct": 0,
   "explain": "For a vertical drop on a stationary surface, rebound height is approximately e² times drop height. With e < 1, some mechanical energy is transferred.",
   "reflect": "Estimate a rebound-height ratio from the trail."
  },
  "hint": "For a vertical drop on a stationary surface, rebound height is approximately e² times drop height. With e < 1, some mechanical energy is transferred.",
  "inkLimit": 755
 },
 {
  "id": 10,
  "tier": 0,
  "level": 10,
  "family": 9,
  "title": "Two-impact journey",
  "task": "Preserve enough speed to use both the wall and the bouncy floor.",
  "start": [
   80,
   50
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 187,
   "angle": 8,
   "min": 180,
   "max": 340,
   "angleMin": -10,
   "angleMax": 15,
   "direction": 1
  },
  "fixed": [
   {
    "points": [
     [
      435,
      20
     ],
     [
      435,
      340
     ]
    ],
    "e": 0.82
   },
   {
    "points": [
     [
      100,
      350
     ],
     [
      440,
      350
     ]
    ],
    "e": 0.82
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    40,
    220,
    100,
    110
   ]
  ],
  "stars": [
   [
    263.04,
    98.9
   ],
   [
    373.74,
    286.9
   ]
  ],
  "starRadius": 23,
  "goal": [
   171.62,
   182.36
  ],
  "goalRadius": 22,
  "materials": [
   "smooth"
  ],
  "minBounces": 2,
  "science": {
   "concept": "Repeated rebounds",
   "question": "What happens to normal speed after repeated e < 1 rebounds?",
   "options": [
    "It increases without an external energy source.",
    "It decreases with each rebound."
   ],
   "correct": 1,
   "explain": "Each rebound multiplies the incoming normal speed by e. Successive inelastic rebounds leave less mechanical energy for later motion.",
   "reflect": "Where did you need to preserve speed for the next rebound?"
  },
  "hint": "Each rebound multiplies the incoming normal speed by e. Successive inelastic rebounds leave less mechanical energy for later motion.",
  "inkLimit": 160
 },
 {
  "id": 11,
  "tier": 0,
  "level": 11,
  "family": 10,
  "title": "Friction landing",
  "task": "Choose a surface that brings the ball into the target at a safe speed.",
  "start": [
   70,
   180
  ],
  "velocity": [
   180,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    25,
    235,
    525,
    35
   ]
  ],
  "stars": [
   [
    233.61,
    238.2
   ],
   [
    390.68,
    238.2
   ]
  ],
  "starRadius": 23,
  "goal": [
   486.15,
   238.2
  ],
  "goalRadius": 22,
  "materials": [
   "smooth",
   "rough"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Kinetic friction",
   "question": "For a level surface, what happens if μ increases at the same mass?",
   "options": [
    "The opposing friction force increases.",
    "The friction force decreases."
   ],
   "correct": 0,
   "explain": "Kinetic friction is approximately μN. On a level surface N ≈ mg, so the deceleration is approximately μg.",
   "reflect": "Which trial reduced arrival speed most, and what variable changed?"
  },
  "hint": "Kinetic friction is approximately μN. On a level surface N ≈ mg, so the deceleration is approximately μg.",
  "inkLimit": 1027,
  "speedBand": [
   1,
   3.4
  ]
 },
 {
  "id": 12,
  "tier": 0,
  "level": 12,
  "family": 11,
  "title": "Surface experiment",
  "task": "Keep enough speed across a slope and a raised shelf.",
  "start": [
   70,
   35
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    25,
    75,
    165,
    115
   ],
   [
    160,
    180,
    365,
    65
   ]
  ],
  "stars": [
   [
    72.62,
    100.59
   ],
   [
    187.76,
    165.86
   ]
  ],
  "starRadius": 23,
  "goal": [
   379.56,
   204.6
  ],
  "goalRadius": 22,
  "materials": [
   "smooth",
   "rough"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Energy dissipation",
   "question": "What does a rough surface do to mechanical energy?",
   "options": [
    "Creates mechanical energy from nothing.",
    "Transfers more of it to the surroundings."
   ],
   "correct": 1,
   "explain": "Friction does negative work on the ball. Kinetic and potential energy together can decrease even though total energy including the surroundings is conserved.",
   "reflect": "Compare arrival kinetic energies for smooth and rough designs."
  },
  "hint": "Friction does negative work on the ball. Kinetic and potential energy together can decrease even though total energy including the surroundings is conserved.",
  "inkLimit": 1052,
  "speedBand": [
   4.8,
   13.3
  ]
 },
 {
  "id": 13,
  "tier": 0,
  "level": 13,
  "family": 12,
  "title": "Momentum climb",
  "task": "Launch into an uphill ramp and reach a higher target.",
  "start": [
   70,
   318
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 230,
   "angle": 0,
   "min": 200,
   "max": 420,
   "angleMin": 0,
   "angleMax": 0,
   "direction": 1
  },
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    25,
    140,
    485,
    225
   ]
  ],
  "stars": [
   [
    160.46,
    286.66
   ],
   [
    254.75,
    246.54
   ]
  ],
  "starRadius": 23,
  "goal": [
   344.99,
   208.14
  ],
  "goalRadius": 22,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Momentum and climbing",
   "question": "Can a moving ball climb above its release height?",
   "options": [
    "Yes, if its initial kinetic energy is sufficient.",
    "No, motion can never carry it uphill."
   ],
   "correct": 0,
   "explain": "Initial kinetic energy can become gravitational potential energy. With no losses, ½mu² = mgΔh gives the maximum possible rise.",
   "reflect": "Use your initial speed to estimate the greatest friction-free rise."
  },
  "hint": "Initial kinetic energy can become gravitational potential energy. With no losses, ½mu² = mgΔh gives the maximum possible rise.",
  "inkLimit": 1029
 },
 {
  "id": 14,
  "tier": 0,
  "level": 14,
  "family": 13,
  "title": "Valley transfer",
  "task": "Build a valley that carries the ball up the far side.",
  "start": [
   70,
   25
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    25,
    65,
    515,
    280
   ]
  ],
  "stars": [
   [
    70,
    90.64
   ],
   [
    184.04,
    235.96
   ]
  ],
  "starRadius": 23,
  "goal": [
   344.81,
   280.65
  ],
  "goalRadius": 22,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Energy exchange",
   "question": "Where is speed generally greatest on a smooth valley route?",
   "options": [
    "Near its highest point.",
    "Near its lowest point."
   ],
   "correct": 1,
   "explain": "As height decreases, potential energy can become kinetic energy. Climbing converts kinetic energy back to potential energy; friction and impacts reduce the return height.",
   "reflect": "Why was the second hill lower than the first in your design?"
  },
  "hint": "As height decreases, potential energy can become kinetic energy. Climbing converts kinetic energy back to potential energy; friction and impacts reduce the return height.",
  "inkLimit": 1309
 },
 {
  "id": 15,
  "tier": 0,
  "level": 15,
  "family": 14,
  "title": "Island crossing",
  "task": "Bridge neither gap: use flight and a short middle landing.",
  "start": [
   35,
   60
  ],
  "velocity": [
   150,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [
   {
    "points": [
     [
      20,
      130
     ],
     [
      170,
      130
     ]
    ]
   },
   {
    "points": [
     [
      405,
      300
     ],
     [
      555,
      300
     ]
    ]
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    255,
    205,
    90,
    55
   ]
  ],
  "stars": [
   [
    161.6,
    118.2
   ],
   [
    314.6,
    209.74
   ]
  ],
  "starRadius": 23,
  "goal": [
   522.37,
   288.2
  ],
  "goalRadius": 22,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Inertia across gaps",
   "question": "What carries the ball sideways across an unsupported gap?",
   "options": [
    "Its existing horizontal velocity.",
    "A sideways force from empty space."
   ],
   "correct": 0,
   "explain": "After leaving a ramp, the ball continues horizontally because of inertia while gravity accelerates it downward. A landing needs to intercept its curved flight.",
   "reflect": "How did the landing position depend on the launch direction?"
  },
  "hint": "After leaving a ramp, the ball continues horizontally because of inertia while gravity accelerates it downward. A landing needs to intercept its curved flight.",
  "inkLimit": 291
 },
 {
  "id": 16,
  "tier": 0,
  "level": 16,
  "family": 15,
  "title": "Platform cascade",
  "task": "Connect the separate ledges while keeping downward acceleration in mind.",
  "start": [
   70,
   20
  ],
  "velocity": [
   20,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    35,
    65,
    150,
    80
   ],
   [
    200,
    180,
    180,
    85
   ],
   [
    415,
    300,
    140,
    70
   ]
  ],
  "stars": [
   [
    92.75,
    86.95
   ],
   [
    208.89,
    135.53
   ]
  ],
  "starRadius": 23,
  "goal": [
   408.77,
   253.59
  ],
  "goalRadius": 22,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Vectors and gravity",
   "question": "Between platforms, which way does gravity act?",
   "options": [
    "Along whatever direction the ball is moving.",
    "Down, even when the ball travels sideways."
   ],
   "correct": 1,
   "explain": "Velocity gives the direction of motion; acceleration gives the change in velocity. They need not point in the same direction.",
   "reflect": "Find a section where velocity and acceleration pointed in different directions."
  },
  "hint": "Velocity gives the direction of motion; acceleration gives the change in velocity. They need not point in the same direction.",
  "inkLimit": 924
 },
 {
  "id": 17,
  "tier": 0,
  "level": 17,
  "family": 16,
  "title": "Moon gap",
  "task": "Choose a launch for a low-gravity flight. No ramp may span the gap.",
  "start": [
   70,
   130
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 1.62,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 101,
   "angle": 18,
   "min": 80,
   "max": 230,
   "angleMin": -10,
   "angleMax": 40,
   "direction": 1
  },
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    430,
    220,
    140,
    100
   ]
  ],
  "stars": [
   [
    174.78,
    120.93
   ],
   [
    301.08,
    134.87
   ]
  ],
  "starRadius": 23,
  "goal": [
   442.26,
   182.63
  ],
  "goalRadius": 22,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Gravity on the Moon",
   "question": "At the same initial velocity, how does weaker gravity affect time to fall the same distance?",
   "options": [
    "It increases the flight time.",
    "It decreases the flight time."
   ],
   "correct": 0,
   "explain": "The Moon’s surface gravity is about 1.62 m/s². For a horizontal launch through height h, time is √(2h/g), so weaker gravity permits a longer horizontal range.",
   "reflect": "Compare this design with an Earth launch at the same speed."
  },
  "hint": "The Moon’s surface gravity is about 1.62 m/s². For a horizontal launch through height h, time is √(2h/g), so weaker gravity permits a longer horizontal range.",
  "inkLimit": 160,
  "timeBand": [
   1.49,
   4.46
  ]
 },
 {
  "id": 18,
  "tier": 0,
  "level": 18,
  "family": 17,
  "title": "Mass without mystery",
  "task": "Change mass and meet the kinetic-energy requirement at the target.",
  "start": [
   100,
   30
  ],
  "velocity": [
   45,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": true,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    90,
    135,
    420,
    200
   ]
  ],
  "stars": [
   [
    135.46,
    91.22
   ],
   [
    234.15,
    197.27
   ]
  ],
  "starRadius": 23,
  "goal": [
   443.48,
   287.72
  ],
  "goalRadius": 22,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Mass and energy",
   "question": "With air drag ignored, does doubling mass double free-fall acceleration?",
   "options": [
    "Yes: both acceleration and energy double.",
    "No: acceleration stays g, but kinetic energy doubles at the same speed."
   ],
   "correct": 1,
   "explain": "Weight mg doubles, but inertia m also doubles, so acceleration remains g. At a fixed speed, kinetic energy ½mv² is proportional to mass.",
   "reflect": "Change only mass: compare the trajectory and kinetic energy."
  },
  "hint": "Weight mg doubles, but inertia m also doubles, so acceleration remains g. At a fixed speed, kinetic energy ½mv² is proportional to mass.",
  "inkLimit": 911,
  "energyBand": [
   89.2,
   235.3
  ]
 },
 {
  "id": 19,
  "tier": 0,
  "level": 19,
  "family": 18,
  "title": "Climb to brake",
  "task": "Combine a rough surface and an uphill finish to reduce arrival speed.",
  "start": [
   70,
   290
  ],
  "velocity": [
   175,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    25,
    270,
    505,
    90
   ]
  ],
  "stars": [
   [
    193.2,
    338.2
   ],
   [
    308.5,
    320.31
   ]
  ],
  "starRadius": 23,
  "goal": [
   356.31,
   309.6
  ],
  "goalRadius": 22,
  "materials": [
   "smooth",
   "rough"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Braking and work",
   "question": "Can friction and an uphill ramp both reduce speed?",
   "options": [
    "Yes: friction dissipates energy and climbing increases potential energy.",
    "No: only a collision can reduce speed."
   ],
   "correct": 0,
   "explain": "Climbing transfers kinetic energy into potential energy; friction transfers mechanical energy to the surroundings. Both can help meet a low arrival-speed requirement.",
   "reflect": "How much braking came from height gain, and how much from the surface?"
  },
  "hint": "Climbing transfers kinetic energy into potential energy; friction transfers mechanical energy to the surroundings. Both can help meet a low arrival-speed requirement.",
  "inkLimit": 1006,
  "speedBand": [
   0,
   0.6
  ]
 },
 {
  "id": 20,
  "tier": 0,
  "level": 20,
  "family": 19,
  "title": "Return-route engineering",
  "task": "Combine rebounds, separated ramps and a controlled final landing.",
  "start": [
   70,
   25
  ],
  "velocity": [
   35,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [
   {
    "points": [
     [
      460,
      100
     ],
     [
      460,
      260
     ]
    ],
    "e": 0.78
   },
   {
    "points": [
     [
      155,
      250
     ],
     [
      155,
      315
     ]
    ],
    "e": 0.78
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    25,
    65,
    410,
    110
   ],
   [
    180,
    200,
    280,
    110
   ],
   [
    160,
    315,
    330,
    65
   ]
  ],
  "stars": [
   [
    433.16,
    144.71
   ],
   [
    186.91,
    320.5
   ]
  ],
  "starRadius": 23,
  "goal": [
   455.33,
   350.39
  ],
  "goalRadius": 22,
  "materials": [
   "smooth",
   "rough"
  ],
  "minBounces": 2,
  "science": {
   "concept": "Engineering with physics",
   "question": "For a fair comparison, how many design variables should you change at once?",
   "options": [
    "Every variable, so the result is impossible to attribute.",
    "One, while keeping the others fixed."
   ],
   "correct": 1,
   "explain": "Controlled experiments let you connect cause and effect. Use speed, time, energy and the trail to improve one part of the design at a time.",
   "reflect": "Name the constraint that failed and the single change that improved it."
  },
  "hint": "Controlled experiments let you connect cause and effect. Use speed, time, energy and the trail to improve one part of the design at a time.",
  "inkLimit": 1862,
  "speedBand": [
   0.3,
   1.6
  ]
 },
 {
  "id": 21,
  "tier": 1,
  "level": 1,
  "family": 0,
  "title": "Gravity well",
  "task": "Build a shelf that arrests the fall at the target height.",
  "start": [
   127.19999999999999,
   39.949999999999996
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    84,
    200,
    86.39999999999999,
    126.1
   ]
  ],
  "stars": [
   [
    127.2,
    178.87
   ]
  ],
  "starRadius": 19,
  "goal": [
   127.2,
   193.05
  ],
  "goalRadius": 17,
  "materials": [
   "smooth",
   "rough"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Gravity",
   "question": "Does the ball speed up during an unobstructed fall?",
   "options": [
    "No: it falls at constant speed.",
    "Yes: gravity accelerates it."
   ],
   "correct": 1,
   "explain": "Gravity increases downward velocity by gΔt. In free fall, v² = u² + 2gΔh.",
   "reflect": "What happened to speed while height decreased?"
  },
  "hint": "Gravity increases downward velocity by gΔt. In free fall, v² = u² + 2gΔh.",
  "inkLimit": 208,
  "speedBand": [
   0,
   0.2
  ]
 },
 {
  "id": 22,
  "tier": 1,
  "level": 2,
  "family": 1,
  "title": "Downhill delivery",
  "task": "Build a smooth downhill route. Compare the speed at different heights.",
  "start": [
   69.6,
   35.099999999999994
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    23.799999999999997,
    66.6,
    418,
    189.2
   ]
  ],
  "stars": [
   [
    73.12,
    83.94
   ],
   [
    149.22,
    114.69
   ],
   [
    220.23,
    143.39
   ]
  ],
  "starRadius": 19,
  "goal": [
   300.46,
   175.82
  ],
  "goalRadius": 17,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Slope and force",
   "question": "Does a steeper smooth downhill ramp usually produce greater acceleration?",
   "options": [
    "Yes: more gravity acts along the ramp.",
    "No: ramp angle has no effect."
   ],
   "correct": 0,
   "explain": "The component of weight along an incline is mg sin θ. A steeper incline gives greater downhill acceleration.",
   "reflect": "How could you change the ramp angle while keeping the start height fixed?"
  },
  "hint": "The component of weight along an incline is mg sin θ. A steeper incline gives greater downhill acceleration.",
  "inkLimit": 680
 },
 {
  "id": 23,
  "tier": 1,
  "level": 3,
  "family": 2,
  "title": "Leftward landing",
  "task": "Deliver the ball leftwards without changing gravity.",
  "start": [
   530.4,
   35.099999999999994
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    139,
    66.6,
    437.19999999999993,
    203.75
   ]
  ],
  "stars": [
   [
    526.27,
    84.66
   ],
   [
    444.78,
    118.97
   ],
   [
    369.18,
    150.79
   ]
  ],
  "starRadius": 19,
  "goal": [
   283.67,
   186.8
  ],
  "goalRadius": 17,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Potential energy",
   "question": "Where does a falling ball get its increasing kinetic energy?",
   "options": [
    "From extra mass created as it falls.",
    "From decreasing gravitational potential energy."
   ],
   "correct": 1,
   "explain": "Gravitational potential energy mgh changes into kinetic energy ½mv². Friction and inelastic impacts transfer some mechanical energy to the surroundings.",
   "reflect": "Compare height lost with the peak speed you measured."
  },
  "hint": "Gravitational potential energy mgh changes into kinetic energy ½mv². Friction and inelastic impacts transfer some mechanical energy to the surroundings.",
  "inkLimit": 713
 },
 {
  "id": 24,
  "tier": 1,
  "level": 4,
  "family": 3,
  "title": "Return through the checkpoint",
  "task": "Travel right, rebound, then take a lower route back left.",
  "start": [
   79.2,
   35.099999999999994
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [
   {
    "points": [
     [
      453.59999999999997,
      107.85
     ],
     [
      453.59999999999997,
      248.5
     ]
    ],
    "e": 0.75
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    36,
    69.05,
    393.59999999999997,
    97
   ],
   [
    122.39999999999999,
    195.15,
    326.4,
    130.95
   ]
  ],
  "stars": [
   [
    150.8,
    91.07
   ],
   [
    436.48,
    146.22
   ],
   [
    388.78,
    215.06
   ]
  ],
  "starRadius": 19,
  "goal": [
   216.23,
   270.53
  ],
  "goalRadius": 17,
  "materials": [
   "smooth"
  ],
  "minBounces": 1,
  "science": {
   "concept": "Normal force",
   "question": "Can a surface change velocity direction without changing gravity’s direction?",
   "options": [
    "Yes: contact provides a normal force.",
    "No: gravity must turn sideways."
   ],
   "correct": 0,
   "explain": "The surface pushes perpendicular to itself. This normal force redirects the ball; gravity still acts downward.",
   "reflect": "Identify each place where contact changed the direction of motion."
  },
  "hint": "The surface pushes perpendicular to itself. This normal force redirects the ball; gravity still acts downward.",
  "inkLimit": 1112
 },
 {
  "id": 25,
  "tier": 1,
  "level": 5,
  "family": 4,
  "title": "Three-storey switchback",
  "task": "Use three separate build areas and two changes of direction.",
  "start": [
   79.2,
   30.25
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [
   {
    "points": [
     [
      434.4,
      103
     ],
     [
      434.4,
      238.79999999999998
     ]
    ],
    "e": 0.8
   },
   {
    "points": [
     [
      165.6,
      233.95
     ],
     [
      165.6,
      277.59999999999997
     ]
    ],
    "e": 0.8
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    36,
    59.35,
    364.8,
    106.7
   ],
   [
    189.6,
    175.75,
    244.79999999999998,
    97
   ],
   [
    160.79999999999998,
    282.45,
    302.4,
    92.14999999999999
   ]
  ],
  "stars": [
   [
    200.74,
    94.61
   ],
   [
    226.3,
    236.71
   ],
   [
    222.09,
    296.42
   ]
  ],
  "starRadius": 19,
  "goal": [
   379.56,
   331.48
  ],
  "goalRadius": 17,
  "materials": [
   "smooth"
  ],
  "minBounces": 2,
  "science": {
   "concept": "Collisions and energy",
   "question": "Do abrupt non-elastic direction changes retain all kinetic energy?",
   "options": [
    "Yes: every impact preserves kinetic energy.",
    "No: some mechanical energy is transferred."
   ],
   "correct": 1,
   "explain": "A sharp impact removes part of the incoming normal velocity. Smooth bends lose less mechanical energy than abrupt non-elastic impacts in this model.",
   "reflect": "Which bend could you smooth to retain more speed?"
  },
  "hint": "A sharp impact removes part of the incoming normal velocity. Smooth bends lose less mechanical energy than abrupt non-elastic impacts in this model.",
  "inkLimit": 1357
 },
 {
  "id": 26,
  "tier": 1,
  "level": 6,
  "family": 5,
  "title": "Horizontal gap",
  "task": "Choose a launch speed and intercept the flight on the far side.",
  "start": [
   45.6,
   64.19999999999999
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 111,
   "angle": 0,
   "min": 80,
   "max": 220,
   "angleMin": 0,
   "angleMax": 0,
   "direction": 1
  },
  "fixed": [
   {
    "points": [
     [
      31.2,
      132.1
     ],
     [
      175.2,
      132.1
     ]
    ]
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    261.6,
    209.7,
    268.8,
    87.3
   ]
  ],
  "stars": [
   [
    165.1,
    120.3
   ],
   [
    310.48,
    196.61
   ],
   [
    411.89,
    242.7
   ]
  ],
  "starRadius": 19,
  "goal": [
   517.04,
   264.76
  ],
  "goalRadius": 17,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Projectile motion",
   "question": "With no air drag, what accelerates horizontal motion after launch?",
   "options": [
    "Nothing: horizontal velocity stays constant in flight.",
    "Gravity: it continually speeds the ball sideways."
   ],
   "correct": 0,
   "explain": "Horizontal and vertical motion are independent in free flight. Horizontal displacement is uₓt; gravity changes vertical velocity.",
   "reflect": "Use the flight time and horizontal speed to estimate the gap crossed."
  },
  "hint": "Horizontal and vertical motion are independent in free flight. Horizontal displacement is uₓt; gravity changes vertical velocity.",
  "inkLimit": 464
 },
 {
  "id": 27,
  "tier": 1,
  "level": 7,
  "family": 6,
  "title": "Over the tower",
  "task": "Choose a speed and angle that clear the tower.",
  "start": [
   79.2,
   326.09999999999997
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 222,
   "angle": 56,
   "min": 180,
   "max": 380,
   "angleMin": 15,
   "angleMax": 75,
   "direction": 1
  },
  "fixed": [],
  "blocks": [
   [
    261.6,
    277.59999999999997,
    28.799999999999997,
    104.75999999999999
   ]
  ],
  "hazards": [],
  "zones": [
   [
    415.2,
    267.9,
    134.4,
    87.3
   ]
  ],
  "stars": [
   [
    195.93,
    237.76
   ],
   [
    336.19,
    206.17
   ],
   [
    418.95,
    225.7
   ]
  ],
  "starRadius": 19,
  "goal": [
   493,
   267.19
  ],
  "goalRadius": 17,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Launch angle",
   "question": "At the same launch speed, which gives a larger initial upward component?",
   "options": [
    "A smaller launch angle.",
    "A larger launch angle (up to 90°)."
   ],
   "correct": 1,
   "explain": "The initial components are uₓ = u cos θ and uᵧ = u sin θ. Changing angle trades horizontal motion for upward motion.",
   "reflect": "Why might a higher arc still miss a distant target?"
  },
  "hint": "The initial components are uₓ = u cos θ and uᵧ = u sin θ. Changing angle trades horizontal motion for upward motion.",
  "inkLimit": 100,
  "timeBand": [
   1.33,
   2.65
  ]
 },
 {
  "id": 28,
  "tier": 1,
  "level": 8,
  "family": 7,
  "title": "Bank shot",
  "task": "Use the vertical bouncy wall to return toward a target.",
  "start": [
   93.6,
   88.45
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 177,
   "angle": 16,
   "min": 150,
   "max": 300,
   "angleMin": -15,
   "angleMax": 25,
   "direction": 1
  },
  "fixed": [
   {
    "points": [
     [
      444,
      25.4
     ],
     [
      444,
      360.05
     ]
    ],
    "e": 0.82
   },
   {
    "points": [
     [
      127.19999999999999,
      364.9
     ],
     [
      439.2,
      364.9
     ]
    ],
    "e": 0.72
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    69.6,
    258.2,
    115.19999999999999,
    97
   ]
  ],
  "stars": [
   [
    280.83,
    129.63
   ],
   [
    371.11,
    332.44
   ],
   [
    261.79,
    264.79
   ]
  ],
  "starRadius": 19,
  "goal": [
   163.73,
   220.39
  ],
  "goalRadius": 17,
  "materials": [
   "smooth"
  ],
  "minBounces": 1,
  "science": {
   "concept": "Impulse and rebound",
   "question": "At a vertical bouncy wall, which velocity component mainly reverses?",
   "options": [
    "The component perpendicular to the wall.",
    "The component parallel to the wall."
   ],
   "correct": 0,
   "explain": "A collision impulse changes velocity normal to the wall. With restitution e, normal speed after impact is e times normal speed before it.",
   "reflect": "Compare the trail before and after the wall collision."
  },
  "hint": "A collision impulse changes velocity normal to the wall. With restitution e, normal speed after impact is e times normal speed before it.",
  "inkLimit": 100
 },
 {
  "id": 29,
  "tier": 1,
  "level": 9,
  "family": 8,
  "title": "Catch the rebound",
  "task": "Choose a bouncy pad and reach a target during the upward rebound.",
  "start": [
   204,
   39.949999999999996
  ],
  "velocity": [
   55,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    151.2,
    311.55,
    350.4,
    33.949999999999996
   ]
  ],
  "stars": [
   [
    245.14,
    95.13
   ],
   [
    295.08,
    309.62
   ],
   [
    324.33,
    201.82
   ]
  ],
  "starRadius": 19,
  "goal": [
   350.73,
   144.09
  ],
  "goalRadius": 17,
  "materials": [
   "smooth",
   "bounce"
  ],
  "minBounces": 1,
  "science": {
   "concept": "Bounce height",
   "question": "Does an e = 0.82 rebound return a ball to its original height?",
   "options": [
    "Yes: any elastic-looking surface restores the height.",
    "No: the rebound normal energy is only e² of before."
   ],
   "correct": 1,
   "explain": "For a vertical drop on a stationary surface, rebound height is approximately e² times drop height. With e < 1, some mechanical energy is transferred.",
   "reflect": "Estimate a rebound-height ratio from the trail."
  },
  "hint": "For a vertical drop on a stationary surface, rebound height is approximately e² times drop height. With e < 1, some mechanical energy is transferred.",
  "inkLimit": 571
 },
 {
  "id": 30,
  "tier": 1,
  "level": 10,
  "family": 9,
  "title": "Two-impact journey",
  "task": "Preserve enough speed to use both the wall and the bouncy floor.",
  "start": [
   88.8,
   54.5
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 192,
   "angle": 11,
   "min": 180,
   "max": 340,
   "angleMin": -10,
   "angleMax": 15,
   "direction": 1
  },
  "fixed": [
   {
    "points": [
     [
      429.59999999999997,
      25.4
     ],
     [
      429.59999999999997,
      335.8
     ]
    ],
    "e": 0.82
   },
   {
    "points": [
     [
      108,
      345.5
     ],
     [
      434.4,
      345.5
     ]
    ],
    "e": 0.82
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    50.4,
    219.4,
    96,
    106.7
   ]
  ],
  "stars": [
   [
    281.04,
    105.64
   ],
   [
    339.86,
    303.76
   ],
   [
    227.76,
    237.87
   ]
  ],
  "starRadius": 19,
  "goal": [
   127.05,
   171.43
  ],
  "goalRadius": 17,
  "materials": [
   "smooth"
  ],
  "minBounces": 2,
  "science": {
   "concept": "Repeated rebounds",
   "question": "What happens to normal speed after repeated e < 1 rebounds?",
   "options": [
    "It decreases with each rebound.",
    "It increases without an external energy source."
   ],
   "correct": 0,
   "explain": "Each rebound multiplies the incoming normal speed by e. Successive inelastic rebounds leave less mechanical energy for later motion.",
   "reflect": "Where did you need to preserve speed for the next rebound?"
  },
  "hint": "Each rebound multiplies the incoming normal speed by e. Successive inelastic rebounds leave less mechanical energy for later motion.",
  "inkLimit": 100
 },
 {
  "id": 31,
  "tier": 1,
  "level": 11,
  "family": 10,
  "title": "Friction landing",
  "task": "Choose a surface that brings the ball into the target at a safe speed.",
  "start": [
   79.2,
   180.6
  ],
  "velocity": [
   180,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    36,
    233.95,
    504,
    33.949999999999996
   ]
  ],
  "stars": [
   [
    246.77,
    236.7
   ],
   [
    404.01,
    236.7
   ],
   [
    463.78,
    236.7
   ]
  ],
  "starRadius": 19,
  "goal": [
   496.41,
   236.7
  ],
  "goalRadius": 17,
  "materials": [
   "smooth",
   "rough"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Kinetic friction",
   "question": "For a level surface, what happens if μ increases at the same mass?",
   "options": [
    "The friction force decreases.",
    "The opposing friction force increases."
   ],
   "correct": 1,
   "explain": "Kinetic friction is approximately μN. On a level surface N ≈ mg, so the deceleration is approximately μg.",
   "reflect": "Which trial reduced arrival speed most, and what variable changed?"
  },
  "hint": "Kinetic friction is approximately μN. On a level surface N ≈ mg, so the deceleration is approximately μg.",
  "inkLimit": 786,
  "speedBand": [
   1.1,
   2.7
  ]
 },
 {
  "id": 32,
  "tier": 1,
  "level": 12,
  "family": 11,
  "title": "Surface experiment",
  "task": "Keep enough speed across a slope and a raised shelf.",
  "start": [
   79.2,
   39.949999999999996
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    36,
    78.75,
    158.4,
    111.55
   ],
   [
    165.6,
    180.6,
    350.4,
    63.05
   ]
  ],
  "stars": [
   [
    84.3,
    104.61
   ],
   [
    205.12,
    174.73
   ],
   [
    305.88,
    196.98
   ]
  ],
  "starRadius": 19,
  "goal": [
   402.66,
   206.76
  ],
  "goalRadius": 17,
  "materials": [
   "smooth",
   "rough"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Energy dissipation",
   "question": "What does a rough surface do to mechanical energy?",
   "options": [
    "Transfers more of it to the surroundings.",
    "Creates mechanical energy from nothing."
   ],
   "correct": 0,
   "explain": "Friction does negative work on the ball. Kinetic and potential energy together can decrease even though total energy including the surroundings is conserved.",
   "reflect": "Compare arrival kinetic energies for smooth and rough designs."
  },
  "hint": "Friction does negative work on the ball. Kinetic and potential energy together can decrease even though total energy including the surroundings is conserved.",
  "inkLimit": 806,
  "speedBand": [
   5.9,
   12.1
  ]
 },
 {
  "id": 33,
  "tier": 1,
  "level": 13,
  "family": 12,
  "title": "Momentum climb",
  "task": "Launch into an uphill ramp and reach a higher target.",
  "start": [
   79.2,
   314.46
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 236,
   "angle": 0,
   "min": 200,
   "max": 420,
   "angleMin": 0,
   "angleMax": 0,
   "direction": 1
  },
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    36,
    141.79999999999998,
    465.59999999999997,
    218.25
   ]
  ],
  "stars": [
   [
    173.43,
    280.48
   ],
   [
    271.54,
    238.3
   ],
   [
    323.96,
    215.76
   ]
  ],
  "starRadius": 19,
  "goal": [
   366.66,
   197.4
  ],
  "goalRadius": 17,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Momentum and climbing",
   "question": "Can a moving ball climb above its release height?",
   "options": [
    "No, motion can never carry it uphill.",
    "Yes, if its initial kinetic energy is sufficient."
   ],
   "correct": 1,
   "explain": "Initial kinetic energy can become gravitational potential energy. With no losses, ½mu² = mgΔh gives the maximum possible rise.",
   "reflect": "Use your initial speed to estimate the greatest friction-free rise."
  },
  "hint": "Initial kinetic energy can become gravitational potential energy. With no losses, ½mu² = mgΔh gives the maximum possible rise.",
  "inkLimit": 788
 },
 {
  "id": 34,
  "tier": 1,
  "level": 14,
  "family": 13,
  "title": "Valley transfer",
  "task": "Build a valley that carries the ball up the far side.",
  "start": [
   79.2,
   30.25
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    36,
    69.05,
    494.4,
    271.59999999999997
   ]
  ],
  "stars": [
   [
    79.2,
    99.14
   ],
   [
    202.5,
    251.08
   ],
   [
    316.21,
    303.4
   ]
  ],
  "starRadius": 19,
  "goal": [
   347.43,
   273.43
  ],
  "goalRadius": 17,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Energy exchange",
   "question": "Where is speed generally greatest on a smooth valley route?",
   "options": [
    "Near its lowest point.",
    "Near its highest point."
   ],
   "correct": 0,
   "explain": "As height decreases, potential energy can become kinetic energy. Climbing converts kinetic energy back to potential energy; friction and impacts reduce the return height.",
   "reflect": "Why was the second hill lower than the first in your design?"
  },
  "hint": "As height decreases, potential energy can become kinetic energy. Climbing converts kinetic energy back to potential energy; friction and impacts reduce the return height.",
  "inkLimit": 1012
 },
 {
  "id": 35,
  "tier": 1,
  "level": 15,
  "family": 14,
  "title": "Island crossing",
  "task": "Bridge neither gap: use flight and a short middle landing.",
  "start": [
   45.6,
   64.19999999999999
  ],
  "velocity": [
   150,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [
   {
    "points": [
     [
      31.2,
      132.1
     ],
     [
      175.2,
      132.1
     ]
    ]
   },
   {
    "points": [
     [
      400.8,
      297
     ],
     [
      544.8,
      297
     ]
    ]
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    256.79999999999995,
    204.85,
    86.39999999999999,
    53.35
   ]
  ],
  "stars": [
   [
    175.2,
    120.3
   ],
   [
    332.04,
    226.45
   ],
   [
    445.73,
    284.5
   ]
  ],
  "starRadius": 19,
  "goal": [
   547.61,
   285.23
  ],
  "goalRadius": 17,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Inertia across gaps",
   "question": "What carries the ball sideways across an unsupported gap?",
   "options": [
    "A sideways force from empty space.",
    "Its existing horizontal velocity."
   ],
   "correct": 1,
   "explain": "After leaving a ramp, the ball continues horizontally because of inertia while gravity accelerates it downward. A landing needs to intercept its curved flight.",
   "reflect": "How did the landing position depend on the launch direction?"
  },
  "hint": "After leaving a ramp, the ball continues horizontally because of inertia while gravity accelerates it downward. A landing needs to intercept its curved flight.",
  "inkLimit": 203
 },
 {
  "id": 36,
  "tier": 1,
  "level": 16,
  "family": 15,
  "title": "Platform cascade",
  "task": "Connect the separate ledges while keeping downward acceleration in mind.",
  "start": [
   79.2,
   25.4
  ],
  "velocity": [
   20,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    45.6,
    69.05,
    144,
    77.6
   ],
   [
    204,
    180.6,
    172.79999999999998,
    82.45
   ],
   [
    410.4,
    297,
    134.4,
    67.89999999999999
   ]
  ],
  "stars": [
   [
    104.19,
    91.13
   ],
   [
    224.8,
    146.95
   ],
   [
    320.92,
    220.46
   ]
  ],
  "starRadius": 19,
  "goal": [
   436.05,
   269.92
  ],
  "goalRadius": 17,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Vectors and gravity",
   "question": "Between platforms, which way does gravity act?",
   "options": [
    "Down, even when the ball travels sideways.",
    "Along whatever direction the ball is moving."
   ],
   "correct": 0,
   "explain": "Velocity gives the direction of motion; acceleration gives the change in velocity. They need not point in the same direction.",
   "reflect": "Find a section where velocity and acceleration pointed in different directions."
  },
  "hint": "Velocity gives the direction of motion; acceleration gives the change in velocity. They need not point in the same direction.",
  "inkLimit": 705
 },
 {
  "id": 37,
  "tier": 1,
  "level": 17,
  "family": 16,
  "title": "Moon gap",
  "task": "Choose a launch for a low-gravity flight. No ramp may span the gap.",
  "start": [
   79.2,
   132.1
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 1.62,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 104,
   "angle": 21,
   "min": 80,
   "max": 230,
   "angleMin": -10,
   "angleMax": 40,
   "direction": 1
  },
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    424.8,
    219.4,
    134.4,
    97
   ]
  ],
  "stars": [
   [
    189.25,
    122.5
   ],
   [
    323.12,
    137.13
   ],
   [
    401.4,
    159.06
   ]
  ],
  "starRadius": 19,
  "goal": [
   471.74,
   187.19
  ],
  "goalRadius": 17,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Gravity on the Moon",
   "question": "At the same initial velocity, how does weaker gravity affect time to fall the same distance?",
   "options": [
    "It decreases the flight time.",
    "It increases the flight time."
   ],
   "correct": 1,
   "explain": "The Moon’s surface gravity is about 1.62 m/s². For a horizontal launch through height h, time is √(2h/g), so weaker gravity permits a longer horizontal range.",
   "reflect": "Compare this design with an Earth launch at the same speed."
  },
  "hint": "The Moon’s surface gravity is about 1.62 m/s². For a horizontal launch through height h, time is √(2h/g), so weaker gravity permits a longer horizontal range.",
  "inkLimit": 100,
  "timeBand": [
   1.94,
   3.87
  ]
 },
 {
  "id": 38,
  "tier": 1,
  "level": 18,
  "family": 17,
  "title": "Mass without mystery",
  "task": "Change mass and meet the kinetic-energy requirement at the target.",
  "start": [
   108,
   35.099999999999994
  ],
  "velocity": [
   45,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": true,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    98.39999999999999,
    136.95,
    403.2,
    194
   ]
  ],
  "stars": [
   [
    144.36,
    99.46
   ],
   [
    250.93,
    203.13
   ],
   [
    356.51,
    249.22
   ]
  ],
  "starRadius": 19,
  "goal": [
   471.25,
   299.32
  ],
  "goalRadius": 17,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Mass and energy",
   "question": "With air drag ignored, does doubling mass double free-fall acceleration?",
   "options": [
    "No: acceleration stays g, but kinetic energy doubles at the same speed.",
    "Yes: both acceleration and energy double."
   ],
   "correct": 0,
   "explain": "Weight mg doubles, but inertia m also doubles, so acceleration remains g. At a fixed speed, kinetic energy ½mv² is proportional to mass.",
   "reflect": "Change only mass: compare the trajectory and kinetic energy."
  },
  "hint": "Weight mg doubles, but inertia m also doubles, so acceleration remains g. At a fixed speed, kinetic energy ½mv² is proportional to mass.",
  "inkLimit": 694,
  "energyBand": [
   116.7,
   226.6
  ]
 },
 {
  "id": 39,
  "tier": 1,
  "level": 19,
  "family": 18,
  "title": "Climb to brake",
  "task": "Combine a rough surface and an uphill finish to reduce arrival speed.",
  "start": [
   79.2,
   287.3
  ],
  "velocity": [
   175,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    36,
    267.9,
    484.79999999999995,
    87.3
   ]
  ],
  "stars": [
   [
    205.17,
    333.7
   ],
   [
    319.17,
    313.84
   ]
  ],
  "starRadius": 19,
  "goal": [
   360.7,
   304.44
  ],
  "goalRadius": 17,
  "materials": [
   "smooth",
   "rough"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Braking and work",
   "question": "Can friction and an uphill ramp both reduce speed?",
   "options": [
    "No: only a collision can reduce speed.",
    "Yes: friction dissipates energy and climbing increases potential energy."
   ],
   "correct": 1,
   "explain": "Climbing transfers kinetic energy into potential energy; friction transfers mechanical energy to the surroundings. Both can help meet a low arrival-speed requirement.",
   "reflect": "How much braking came from height gain, and how much from the surface?"
  },
  "hint": "Climbing transfers kinetic energy into potential energy; friction transfers mechanical energy to the surroundings. Both can help meet a low arrival-speed requirement.",
  "inkLimit": 769,
  "speedBand": [
   0,
   0.2
  ]
 },
 {
  "id": 40,
  "tier": 1,
  "level": 20,
  "family": 19,
  "title": "Return-route engineering",
  "task": "Combine rebounds, separated ramps and a controlled final landing.",
  "start": [
   79.2,
   30.25
  ],
  "velocity": [
   35,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [
   {
    "points": [
     [
      453.59999999999997,
      103
     ],
     [
      453.59999999999997,
      258.2
     ]
    ],
    "e": 0.78
   },
   {
    "points": [
     [
      160.79999999999998,
      248.5
     ],
     [
      160.79999999999998,
      311.55
     ]
    ],
    "e": 0.78
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    36,
    69.05,
    393.59999999999997,
    106.7
   ],
   [
    184.79999999999998,
    200,
    268.8,
    106.7
   ],
   [
    165.6,
    311.55,
    316.8,
    63.05
   ]
  ],
  "stars": [
   [
    431.87,
    157.17
   ],
   [
    193.59,
    316.76
   ],
   [
    336.65,
    332.39
   ]
  ],
  "starRadius": 19,
  "goal": [
   456.17,
   346.31
  ],
  "goalRadius": 17,
  "materials": [
   "smooth",
   "rough"
  ],
  "minBounces": 2,
  "science": {
   "concept": "Engineering with physics",
   "question": "For a fair comparison, how many design variables should you change at once?",
   "options": [
    "One, while keeping the others fixed.",
    "Every variable, so the result is impossible to attribute."
   ],
   "correct": 0,
   "explain": "Controlled experiments let you connect cause and effect. Use speed, time, energy and the trail to improve one part of the design at a time.",
   "reflect": "Name the constraint that failed and the single change that improved it."
  },
  "hint": "Controlled experiments let you connect cause and effect. Use speed, time, energy and the trail to improve one part of the design at a time.",
  "inkLimit": 1446,
  "speedBand": [
   0.1,
   0.7
  ]
 },
 {
  "id": 41,
  "tier": 2,
  "level": 1,
  "family": 0,
  "title": "Gravity well",
  "task": "Build a shelf that arrests the fall at the target height.",
  "start": [
   483.6,
   32.52500000000003
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    437.7,
    200,
    91.8,
    131.95
   ]
  ],
  "stars": [
   [
    483.6,
    178.06
   ]
  ],
  "starRadius": 15,
  "goal": [
   483.6,
   193.28
  ],
  "goalRadius": 12,
  "materials": [
   "smooth",
   "rough"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Gravity",
   "question": "Does the ball speed up during an unobstructed fall?",
   "options": [
    "Yes: gravity accelerates it.",
    "No: it falls at constant speed."
   ],
   "correct": 0,
   "explain": "Gravity increases downward velocity by gΔt. In free fall, v² = u² + 2gΔh.",
   "reflect": "What happened to speed while height decreased?"
  },
  "hint": "Gravity increases downward velocity by gΔt. In free fall, v² = u² + 2gΔh.",
  "inkLimit": 150,
  "speedBand": [
   0,
   0.2
  ]
 },
 {
  "id": 42,
  "tier": 2,
  "level": 2,
  "family": 1,
  "title": "Downhill delivery",
  "task": "Build a smooth downhill route. Compare the speed at different heights.",
  "start": [
   55.2,
   27.450000000000024
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    12.600000000000001,
    66.20000000000002,
    432,
    186.39999999999998
   ]
  ],
  "stars": [
   [
    58.55,
    79.01
   ],
   [
    137.52,
    110.45
   ],
   [
    210.96,
    139.68
   ]
  ],
  "starRadius": 15,
  "goal": [
   294.13,
   172.78
  ],
  "goalRadius": 12,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Slope and force",
   "question": "Does a steeper smooth downhill ramp usually produce greater acceleration?",
   "options": [
    "No: ramp angle has no effect.",
    "Yes: more gravity acts along the ramp."
   ],
   "correct": 1,
   "explain": "The component of weight along an incline is mg sin θ. A steeper incline gives greater downhill acceleration.",
   "reflect": "How could you change the ramp angle while keeping the start height fixed?"
  },
  "hint": "The component of weight along an incline is mg sin θ. A steeper incline gives greater downhill acceleration.",
  "inkLimit": 586
 },
 {
  "id": 43,
  "tier": 2,
  "level": 3,
  "family": 2,
  "title": "Leftward landing",
  "task": "Deliver the ball leftwards without changing gravity.",
  "start": [
   544.8,
   27.450000000000024
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    135,
    66.20000000000002,
    452.4,
    201.625
   ]
  ],
  "stars": [
   [
    540.63,
    79.84
   ],
   [
    456.33,
    114.79
   ],
   [
    377.55,
    147.46
   ]
  ],
  "starRadius": 15,
  "goal": [
   288.81,
   184.25
  ],
  "goalRadius": 12,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Potential energy",
   "question": "Where does a falling ball get its increasing kinetic energy?",
   "options": [
    "From decreasing gravitational potential energy.",
    "From extra mass created as it falls."
   ],
   "correct": 0,
   "explain": "Gravitational potential energy mgh changes into kinetic energy ½mv². Friction and inelastic impacts transfer some mechanical energy to the surroundings.",
   "reflect": "Compare height lost with the peak speed you measured."
  },
  "hint": "Gravitational potential energy mgh changes into kinetic energy ½mv². Friction and inelastic impacts transfer some mechanical energy to the surroundings.",
  "inkLimit": 616
 },
 {
  "id": 44,
  "tier": 2,
  "level": 4,
  "family": 3,
  "title": "Return through the checkpoint",
  "task": "Travel right, rebound, then take a lower route back left.",
  "start": [
   534.6,
   27.450000000000024
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [
   {
    "points": [
     [
      136.8,
      103.57500000000002
     ],
     [
      136.8,
      250.75
     ]
    ],
    "e": 0.75
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    162.3,
    62.97500000000002,
    418.2,
    101.49999999999999
   ],
   [
    141.89999999999998,
    194.925,
    346.8,
    137.02499999999998
   ]
  ],
  "stars": [
   [
    460.51,
    86.23
   ],
   [
    151.81,
    140.85
   ],
   [
    205.51,
    216.3
   ]
  ],
  "starRadius": 15,
  "goal": [
   384.31,
   272.91
  ],
  "goalRadius": 12,
  "materials": [
   "smooth"
  ],
  "minBounces": 1,
  "science": {
   "concept": "Normal force",
   "question": "Can a surface change velocity direction without changing gravity’s direction?",
   "options": [
    "No: gravity must turn sideways.",
    "Yes: contact provides a normal force."
   ],
   "correct": 1,
   "explain": "The surface pushes perpendicular to itself. This normal force redirects the ball; gravity still acts downward.",
   "reflect": "Identify each place where contact changed the direction of motion."
  },
  "hint": "The surface pushes perpendicular to itself. This normal force redirects the ball; gravity still acts downward.",
  "inkLimit": 986
 },
 {
  "id": 45,
  "tier": 2,
  "level": 5,
  "family": 4,
  "title": "Three-storey switchback",
  "task": "Use three separate build areas and two changes of direction.",
  "start": [
   65.4,
   22.375000000000025
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [
   {
    "points": [
     [
      442.8,
      98.50000000000001
     ],
     [
      442.8,
      240.6
     ]
    ],
    "e": 0.8
   },
   {
    "points": [
     [
      157.2,
      235.525
     ],
     [
      157.2,
      281.20000000000005
     ]
    ],
    "e": 0.8
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    19.5,
    52.825000000000024,
    387.6,
    111.64999999999999
   ],
   [
    182.70000000000002,
    174.625,
    260.1,
    101.49999999999999
   ],
   [
    152.1,
    286.275,
    321.3,
    96.425
   ]
  ],
  "stars": [
   [
    190.94,
    89.56
   ],
   [
    199.52,
    245.3
   ],
   [
    227.79,
    303.78
   ]
  ],
  "starRadius": 15,
  "goal": [
   401.9,
   341.95
  ],
  "goalRadius": 12,
  "materials": [
   "smooth"
  ],
  "minBounces": 2,
  "science": {
   "concept": "Collisions and energy",
   "question": "Do abrupt non-elastic direction changes retain all kinetic energy?",
   "options": [
    "No: some mechanical energy is transferred.",
    "Yes: every impact preserves kinetic energy."
   ],
   "correct": 0,
   "explain": "A sharp impact removes part of the incoming normal velocity. Smooth bends lose less mechanical energy than abrupt non-elastic impacts in this model.",
   "reflect": "Which bend could you smooth to retain more speed?"
  },
  "hint": "A sharp impact removes part of the incoming normal velocity. Smooth bends lose less mechanical energy than abrupt non-elastic impacts in this model.",
  "inkLimit": 1213
 },
 {
  "id": 46,
  "tier": 2,
  "level": 6,
  "family": 5,
  "title": "Horizontal gap",
  "task": "Choose a launch speed and intercept the flight on the far side.",
  "start": [
   29.700000000000003,
   57.90000000000002
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 114,
   "angle": 0,
   "min": 80,
   "max": 220,
   "angleMin": 0,
   "angleMax": 0,
   "direction": 1
  },
  "fixed": [
   {
    "points": [
     [
      14.399999999999999,
      128.95000000000002
     ],
     [
      167.4,
      128.95000000000002
     ]
    ]
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    259.2,
    210.15,
    285.6,
    91.35
   ]
  ],
  "stars": [
   [
    155.47,
    117.15
   ],
   [
    307.78,
    195.55
   ],
   [
    414.33,
    244.31
   ]
  ],
  "starRadius": 15,
  "goal": [
   524.25,
   267.01
  ],
  "goalRadius": 12,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Projectile motion",
   "question": "With no air drag, what accelerates horizontal motion after launch?",
   "options": [
    "Gravity: it continually speeds the ball sideways.",
    "Nothing: horizontal velocity stays constant in flight."
   ],
   "correct": 1,
   "explain": "Horizontal and vertical motion are independent in free flight. Horizontal displacement is uₓt; gravity changes vertical velocity.",
   "reflect": "Use the flight time and horizontal speed to estimate the gap crossed."
  },
  "hint": "Horizontal and vertical motion are independent in free flight. Horizontal displacement is uₓt; gravity changes vertical velocity.",
  "inkLimit": 387
 },
 {
  "id": 47,
  "tier": 2,
  "level": 7,
  "family": 6,
  "title": "Over the tower",
  "task": "Choose a speed and angle that clear the tower.",
  "start": [
   534.6,
   331.95000000000005
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 227,
   "angle": 59,
   "min": 180,
   "max": 380,
   "angleMin": 15,
   "angleMax": 75,
   "direction": -1
  },
  "fixed": [],
  "blocks": [
   [
    310.2,
    281.20000000000005,
    30.6,
    109.61999999999999
   ]
  ],
  "hazards": [],
  "zones": [
   [
    34.799999999999955,
    271.04999999999995,
    142.8,
    91.35
   ]
  ],
  "stars": [
   [
    412.54,
    239.56
   ],
   [
    265.53,
    206.51
   ],
   [
    179.11,
    226.97
   ]
  ],
  "starRadius": 15,
  "goal": [
   101.6,
   270.44
  ],
  "goalRadius": 12,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Launch angle",
   "question": "At the same launch speed, which gives a larger initial upward component?",
   "options": [
    "A larger launch angle (up to 90°).",
    "A smaller launch angle."
   ],
   "correct": 0,
   "explain": "The initial components are uₓ = u cos θ and uᵧ = u sin θ. Changing angle trades horizontal motion for upward motion.",
   "reflect": "Why might a higher arc still miss a distant target?"
  },
  "hint": "The initial components are uₓ = u cos θ and uᵧ = u sin θ. Changing angle trades horizontal motion for upward motion.",
  "inkLimit": 50,
  "timeBand": [
   1.55,
   2.43
  ]
 },
 {
  "id": 48,
  "tier": 2,
  "level": 8,
  "family": 7,
  "title": "Bank shot",
  "task": "Use the vertical bouncy wall to return toward a target.",
  "start": [
   80.7,
   83.27500000000002
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 181,
   "angle": 19,
   "min": 150,
   "max": 300,
   "angleMin": -15,
   "angleMax": 25,
   "direction": 1
  },
  "fixed": [
   {
    "points": [
     [
      453,
      17.300000000000026
     ],
     [
      453,
      367.475
     ]
    ],
    "e": 0.82
   },
   {
    "points": [
     [
      116.4,
      372.54999999999995
     ],
     [
      447.90000000000003,
      372.54999999999995
     ]
    ],
    "e": 0.72
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    55.2,
    260.9,
    122.4,
    101.49999999999999
   ]
  ],
  "stars": [
   [
    276.51,
    126.13
   ],
   [
    381.91,
    338.93
   ],
   [
    267.46,
    268.21
   ]
  ],
  "starRadius": 15,
  "goal": [
   164.53,
   221.86
  ],
  "goalRadius": 12,
  "materials": [
   "smooth"
  ],
  "minBounces": 1,
  "science": {
   "concept": "Impulse and rebound",
   "question": "At a vertical bouncy wall, which velocity component mainly reverses?",
   "options": [
    "The component parallel to the wall.",
    "The component perpendicular to the wall."
   ],
   "correct": 1,
   "explain": "A collision impulse changes velocity normal to the wall. With restitution e, normal speed after impact is e times normal speed before it.",
   "reflect": "Compare the trail before and after the wall collision."
  },
  "hint": "A collision impulse changes velocity normal to the wall. With restitution e, normal speed after impact is e times normal speed before it.",
  "inkLimit": 50
 },
 {
  "id": 49,
  "tier": 2,
  "level": 9,
  "family": 8,
  "title": "Catch the rebound",
  "task": "Choose a bouncy pad and reach a target during the upward rebound.",
  "start": [
   198,
   32.52500000000003
  ],
  "velocity": [
   55,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    141.9,
    316.725,
    372.3,
    35.525
   ]
  ],
  "stars": [
   [
    240.24,
    90.69
   ],
   [
    291.28,
    315.37
   ],
   [
    321.41,
    201.59
   ]
  ],
  "starRadius": 15,
  "goal": [
   348.25,
   141.67
  ],
  "goalRadius": 12,
  "materials": [
   "smooth",
   "bounce"
  ],
  "minBounces": 1,
  "science": {
   "concept": "Bounce height",
   "question": "Does an e = 0.82 rebound return a ball to its original height?",
   "options": [
    "No: the rebound normal energy is only e² of before.",
    "Yes: any elastic-looking surface restores the height."
   ],
   "correct": 0,
   "explain": "For a vertical drop on a stationary surface, rebound height is approximately e² times drop height. With e < 1, some mechanical energy is transferred.",
   "reflect": "Estimate a rebound-height ratio from the trail."
  },
  "hint": "For a vertical drop on a stationary surface, rebound height is approximately e² times drop height. With e < 1, some mechanical energy is transferred.",
  "inkLimit": 486
 },
 {
  "id": 50,
  "tier": 2,
  "level": 10,
  "family": 9,
  "title": "Two-impact journey",
  "task": "Preserve enough speed to use both the wall and the bouncy floor.",
  "start": [
   524.4,
   47.75000000000002
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 197,
   "angle": 14,
   "min": 180,
   "max": 340,
   "angleMin": -10,
   "angleMax": 15,
   "direction": -1
  },
  "fixed": [
   {
    "points": [
     [
      162.3,
      17.300000000000026
     ],
     [
      162.3,
      342.1
     ]
    ],
    "e": 0.82
   },
   {
    "points": [
     [
      504,
      352.25
     ],
     [
      157.2,
      352.25
     ]
    ],
    "e": 0.82
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    463.2,
    220.3,
    102,
    111.64999999999999
   ]
  ],
  "stars": [
   [
    323.47,
    101.18
   ],
   [
    252,
    309.67
   ],
   [
    369.31,
    239.6
   ]
  ],
  "starRadius": 15,
  "goal": [
   474.97,
   170.06
  ],
  "goalRadius": 12,
  "materials": [
   "smooth"
  ],
  "minBounces": 2,
  "science": {
   "concept": "Repeated rebounds",
   "question": "What happens to normal speed after repeated e < 1 rebounds?",
   "options": [
    "It increases without an external energy source.",
    "It decreases with each rebound."
   ],
   "correct": 1,
   "explain": "Each rebound multiplies the incoming normal speed by e. Successive inelastic rebounds leave less mechanical energy for later motion.",
   "reflect": "Where did you need to preserve speed for the next rebound?"
  },
  "hint": "Each rebound multiplies the incoming normal speed by e. Successive inelastic rebounds leave less mechanical energy for later motion.",
  "inkLimit": 50
 },
 {
  "id": 51,
  "tier": 2,
  "level": 11,
  "family": 10,
  "title": "Friction landing",
  "task": "Choose a surface that brings the ball into the target at a safe speed.",
  "start": [
   65.4,
   179.70000000000002
  ],
  "velocity": [
   180,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    19.5,
    235.525,
    535.5,
    35.525
   ]
  ],
  "stars": [
   [
    237.25,
    238.95
   ],
   [
    397.24,
    238.95
   ],
   [
    456.93,
    238.95
   ]
  ],
  "starRadius": 15,
  "goal": [
   488.55,
   238.95
  ],
  "goalRadius": 12,
  "materials": [
   "smooth",
   "rough"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Kinetic friction",
   "question": "For a level surface, what happens if μ increases at the same mass?",
   "options": [
    "The opposing friction force increases.",
    "The friction force decreases."
   ],
   "correct": 0,
   "explain": "Kinetic friction is approximately μN. On a level surface N ≈ mg, so the deceleration is approximately μg.",
   "reflect": "Which trial reduced arrival speed most, and what variable changed?"
  },
  "hint": "Kinetic friction is approximately μN. On a level surface N ≈ mg, so the deceleration is approximately μg.",
  "inkLimit": 685,
  "speedBand": [
   1.2,
   2.3
  ]
 },
 {
  "id": 52,
  "tier": 2,
  "level": 12,
  "family": 11,
  "title": "Surface experiment",
  "task": "Keep enough speed across a slope and a raised shelf.",
  "start": [
   65.4,
   32.52500000000003
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    19.5,
    73.12500000000001,
    168.3,
    116.725
   ],
   [
    157.2,
    179.70000000000002,
    372.3,
    65.975
   ]
  ],
  "stars": [
   [
    70.41,
    100.64
   ],
   [
    196.59,
    172.58
   ],
   [
    301.9,
    196.96
   ]
  ],
  "starRadius": 15,
  "goal": [
   402.66,
   206.98
  ],
  "goalRadius": 12,
  "materials": [
   "smooth",
   "rough"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Energy dissipation",
   "question": "What does a rough surface do to mechanical energy?",
   "options": [
    "Creates mechanical energy from nothing.",
    "Transfers more of it to the surroundings."
   ],
   "correct": 1,
   "explain": "Friction does negative work on the ball. Kinetic and potential energy together can decrease even though total energy including the surroundings is conserved.",
   "reflect": "Compare arrival kinetic energies for smooth and rough designs."
  },
  "hint": "Friction does negative work on the ball. Kinetic and potential energy together can decrease even though total energy including the surroundings is conserved.",
  "inkLimit": 702,
  "speedBand": [
   7,
   11.4
  ]
 },
 {
  "id": 53,
  "tier": 2,
  "level": 13,
  "family": 12,
  "title": "Momentum climb",
  "task": "Launch into an uphill ramp and reach a higher target.",
  "start": [
   534.6,
   319.77
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 242,
   "angle": 0,
   "min": 200,
   "max": 420,
   "angleMin": 0,
   "angleMax": 0,
   "direction": -1
  },
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    85.79999999999995,
    139.10000000000002,
    494.7,
    228.37499999999997
   ]
  ],
  "stars": [
   [
    435.12,
    285.11
   ],
   [
    330.98,
    241.01
   ],
   [
    275.91,
    217.69
   ]
  ],
  "starRadius": 15,
  "goal": [
   230.86,
   198.61
  ],
  "goalRadius": 12,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Momentum and climbing",
   "question": "Can a moving ball climb above its release height?",
   "options": [
    "Yes, if its initial kinetic energy is sufficient.",
    "No, motion can never carry it uphill."
   ],
   "correct": 0,
   "explain": "Initial kinetic energy can become gravitational potential energy. With no losses, ½mu² = mgΔh gives the maximum possible rise.",
   "reflect": "Use your initial speed to estimate the greatest friction-free rise."
  },
  "hint": "Initial kinetic energy can become gravitational potential energy. With no losses, ½mu² = mgΔh gives the maximum possible rise.",
  "inkLimit": 686
 },
 {
  "id": 54,
  "tier": 2,
  "level": 14,
  "family": 13,
  "title": "Valley transfer",
  "task": "Build a valley that carries the ball up the far side.",
  "start": [
   65.4,
   22.375000000000025
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    19.5,
    62.97500000000002,
    525.3,
    284.2
   ]
  ],
  "stars": [
   [
    65.4,
    94.59
   ],
   [
    194.45,
    252.14
   ],
   [
    315.97,
    310.26
   ]
  ],
  "starRadius": 15,
  "goal": [
   351.29,
   276.87
  ],
  "goalRadius": 12,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Energy exchange",
   "question": "Where is speed generally greatest on a smooth valley route?",
   "options": [
    "Near its highest point.",
    "Near its lowest point."
   ],
   "correct": 1,
   "explain": "As height decreases, potential energy can become kinetic energy. Climbing converts kinetic energy back to potential energy; friction and impacts reduce the return height.",
   "reflect": "Why was the second hill lower than the first in your design?"
  },
  "hint": "As height decreases, potential energy can become kinetic energy. Climbing converts kinetic energy back to potential energy; friction and impacts reduce the return height.",
  "inkLimit": 889
 },
 {
  "id": 55,
  "tier": 2,
  "level": 15,
  "family": 14,
  "title": "Island crossing",
  "task": "Bridge neither gap: use flight and a short middle landing.",
  "start": [
   29.700000000000003,
   57.90000000000002
  ],
  "velocity": [
   150,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [
   {
    "points": [
     [
      14.399999999999999,
      128.95000000000002
     ],
     [
      167.4,
      128.95000000000002
     ]
    ]
   },
   {
    "points": [
     [
      407.1,
      301.5
     ],
     [
      560.1,
      301.5
     ]
    ]
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    254.10000000000002,
    205.07500000000002,
    91.8,
    55.824999999999996
   ]
  ],
  "stars": [
   [
    162.3,
    117.15
   ],
   [
    323.1,
    223.66
   ],
   [
    440.18,
    279.47
   ]
  ],
  "starRadius": 15,
  "goal": [
   545.17,
   289.7
  ],
  "goalRadius": 12,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Inertia across gaps",
   "question": "What carries the ball sideways across an unsupported gap?",
   "options": [
    "Its existing horizontal velocity.",
    "A sideways force from empty space."
   ],
   "correct": 0,
   "explain": "After leaving a ramp, the ball continues horizontally because of inertia while gravity accelerates it downward. A landing needs to intercept its curved flight.",
   "reflect": "How did the landing position depend on the launch direction?"
  },
  "hint": "After leaving a ramp, the ball continues horizontally because of inertia while gravity accelerates it downward. A landing needs to intercept its curved flight.",
  "inkLimit": 146
 },
 {
  "id": 56,
  "tier": 2,
  "level": 16,
  "family": 15,
  "title": "Platform cascade",
  "task": "Connect the separate ledges while keeping downward acceleration in mind.",
  "start": [
   534.6,
   17.300000000000026
  ],
  "velocity": [
   -20,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    417.29999999999995,
    62.97500000000002,
    153,
    81.19999999999999
   ],
   [
    218.39999999999998,
    179.70000000000002,
    183.6,
    86.27499999999999
   ],
   [
    39.89999999999998,
    301.5,
    142.8,
    71.05
   ]
  ],
  "stars": [
   [
    508.85,
    86.39
   ],
   [
    383.33,
    142.57
   ],
   [
    284.01,
    219.94
   ]
  ],
  "starRadius": 15,
  "goal": [
   163.67,
   269.04
  ],
  "goalRadius": 12,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Vectors and gravity",
   "question": "Between platforms, which way does gravity act?",
   "options": [
    "Along whatever direction the ball is moving.",
    "Down, even when the ball travels sideways."
   ],
   "correct": 1,
   "explain": "Velocity gives the direction of motion; acceleration gives the change in velocity. They need not point in the same direction.",
   "reflect": "Find a section where velocity and acceleration pointed in different directions."
  },
  "hint": "Velocity gives the direction of motion; acceleration gives the change in velocity. They need not point in the same direction.",
  "inkLimit": 609
 },
 {
  "id": 57,
  "tier": 2,
  "level": 17,
  "family": 16,
  "title": "Moon gap",
  "task": "Choose a launch for a low-gravity flight. No ramp may span the gap.",
  "start": [
   65.4,
   128.95000000000002
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 1.62,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 106,
   "angle": 24,
   "min": 80,
   "max": 230,
   "angleMin": -10,
   "angleMax": 40,
   "direction": 1
  },
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    432.6,
    220.3,
    142.8,
    101.49999999999999
   ]
  ],
  "stars": [
   [
    180.63,
    118.95
   ],
   [
    320.19,
    134.32
   ],
   [
    402.42,
    157.47
   ]
  ],
  "starRadius": 15,
  "goal": [
   475.96,
   187.04
  ],
  "goalRadius": 12,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Gravity on the Moon",
   "question": "At the same initial velocity, how does weaker gravity affect time to fall the same distance?",
   "options": [
    "It increases the flight time.",
    "It decreases the flight time."
   ],
   "correct": 0,
   "explain": "The Moon’s surface gravity is about 1.62 m/s². For a horizontal launch through height h, time is √(2h/g), so weaker gravity permits a longer horizontal range.",
   "reflect": "Compare this design with an Earth launch at the same speed."
  },
  "hint": "The Moon’s surface gravity is about 1.62 m/s². For a horizontal launch through height h, time is √(2h/g), so weaker gravity permits a longer horizontal range.",
  "inkLimit": 50,
  "timeBand": [
   2.27,
   3.54
  ]
 },
 {
  "id": 58,
  "tier": 2,
  "level": 18,
  "family": 17,
  "title": "Mass without mystery",
  "task": "Change mass and meet the kinetic-energy requirement at the target.",
  "start": [
   96,
   27.450000000000024
  ],
  "velocity": [
   45,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": true,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    85.8,
    134.025,
    428.40000000000003,
    202.99999999999997
   ]
  ],
  "stars": [
   [
    133.08,
    94.38
   ],
   [
    243.1,
    201.85
   ],
   [
    352.79,
    249.01
   ]
  ],
  "starRadius": 15,
  "goal": [
   471.54,
   300.07
  ],
  "goalRadius": 12,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Mass and energy",
   "question": "With air drag ignored, does doubling mass double free-fall acceleration?",
   "options": [
    "Yes: both acceleration and energy double.",
    "No: acceleration stays g, but kinetic energy doubles at the same speed."
   ],
   "correct": 1,
   "explain": "Weight mg doubles, but inertia m also doubles, so acceleration remains g. At a fixed speed, kinetic energy ½mv² is proportional to mass.",
   "reflect": "Change only mass: compare the trajectory and kinetic energy."
  },
  "hint": "Weight mg doubles, but inertia m also doubles, so acceleration remains g. At a fixed speed, kinetic energy ½mv² is proportional to mass.",
  "inkLimit": 599,
  "energyBand": [
   136.3,
   213.2
  ]
 },
 {
  "id": 59,
  "tier": 2,
  "level": 19,
  "family": 18,
  "title": "Climb to brake",
  "task": "Combine a rough surface and an uphill finish to reduce arrival speed.",
  "start": [
   534.6,
   291.35
  ],
  "velocity": [
   -175,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    65.39999999999998,
    271.04999999999995,
    515.1,
    91.35
   ]
  ],
  "stars": [
   [
    405.82,
    340.45
   ],
   [
    287.57,
    321.46
   ]
  ],
  "starRadius": 15,
  "goal": [
   245.47,
   312.07
  ],
  "goalRadius": 12,
  "materials": [
   "smooth",
   "rough"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Braking and work",
   "question": "Can friction and an uphill ramp both reduce speed?",
   "options": [
    "Yes: friction dissipates energy and climbing increases potential energy.",
    "No: only a collision can reduce speed."
   ],
   "correct": 0,
   "explain": "Climbing transfers kinetic energy into potential energy; friction transfers mechanical energy to the surroundings. Both can help meet a low arrival-speed requirement.",
   "reflect": "How much braking came from height gain, and how much from the surface?"
  },
  "hint": "Climbing transfers kinetic energy into potential energy; friction transfers mechanical energy to the surroundings. Both can help meet a low arrival-speed requirement.",
  "inkLimit": 669,
  "speedBand": [
   0,
   0.2
  ]
 },
 {
  "id": 60,
  "tier": 2,
  "level": 20,
  "family": 19,
  "title": "Return-route engineering",
  "task": "Combine rebounds, separated ramps and a controlled final landing.",
  "start": [
   65.4,
   22.375000000000025
  ],
  "velocity": [
   35,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [
   {
    "points": [
     [
      463.2,
      98.50000000000001
     ],
     [
      463.2,
      260.9
     ]
    ],
    "e": 0.78
   },
   {
    "points": [
     [
      152.1,
      250.75
     ],
     [
      152.1,
      316.725
     ]
    ],
    "e": 0.78
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    19.5,
    62.97500000000002,
    418.2,
    111.64999999999999
   ],
   [
    177.6,
    200,
    285.6,
    111.64999999999999
   ],
   [
    157.2,
    316.725,
    336.6,
    65.975
   ]
  ],
  "stars": [
   [
    446.88,
    151.12
   ],
   [
    202.46,
    324.4
   ],
   [
    373.36,
    343.41
   ]
  ],
  "starRadius": 15,
  "goal": [
   462.74,
   353.3
  ],
  "goalRadius": 12,
  "materials": [
   "smooth",
   "rough"
  ],
  "minBounces": 2,
  "science": {
   "concept": "Engineering with physics",
   "question": "For a fair comparison, how many design variables should you change at once?",
   "options": [
    "Every variable, so the result is impossible to attribute.",
    "One, while keeping the others fixed."
   ],
   "correct": 1,
   "explain": "Controlled experiments let you connect cause and effect. Use speed, time, energy and the trail to improve one part of the design at a time.",
   "reflect": "Name the constraint that failed and the single change that improved it."
  },
  "hint": "Controlled experiments let you connect cause and effect. Use speed, time, energy and the trail to improve one part of the design at a time.",
  "inkLimit": 1296,
  "speedBand": [
   0,
   0.2
  ]
 },
 {
  "id": 61,
  "tier": 3,
  "level": 1,
  "family": 0,
  "title": "Gravity well",
  "task": "Build a shelf that arrests the fall at the target height.",
  "start": [
   469.2,
   43.25
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    426.9,
    200,
    84.6,
    123.5
   ]
  ],
  "stars": [
   [
    469.2,
    192.95
   ]
  ],
  "starRadius": 12,
  "goal": [
   469.2,
   192.95
  ],
  "goalRadius": 8,
  "materials": [
   "smooth",
   "rough"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Gravity",
   "question": "Does the ball speed up during an unobstructed fall?",
   "options": [
    "No: it falls at constant speed.",
    "Yes: gravity accelerates it."
   ],
   "correct": 1,
   "explain": "Gravity increases downward velocity by gΔt. In free fall, v² = u² + 2gΔh.",
   "reflect": "What happened to speed while height decreased?"
  },
  "hint": "Gravity increases downward velocity by gΔt. In free fall, v² = u² + 2gΔh.",
  "inkLimit": 110,
  "speedBand": [
   0,
   0.2
  ]
 },
 {
  "id": 62,
  "tier": 3,
  "level": 2,
  "family": 1,
  "title": "Downhill delivery",
  "task": "Build a smooth downhill route. Compare the speed at different heights.",
  "start": [
   74.4,
   38.5
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    38.2,
    78,
    392,
    168
   ]
  ],
  "stars": [
   [
    80.26,
    87.04
   ],
   [
    164.14,
    120.95
   ],
   [
    241.86,
    152.37
   ],
   [
    279.02,
    167.39
   ]
  ],
  "starRadius": 12,
  "goal": [
   330.07,
   188.03
  ],
  "goalRadius": 8,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Slope and force",
   "question": "Does a steeper smooth downhill ramp usually produce greater acceleration?",
   "options": [
    "Yes: more gravity acts along the ramp.",
    "No: ramp angle has no effect."
   ],
   "correct": 0,
   "explain": "The component of weight along an incline is mg sin θ. A steeper incline gives greater downhill acceleration.",
   "reflect": "How could you change the ramp angle while keeping the start height fixed?"
  },
  "hint": "The component of weight along an incline is mg sin θ. A steeper incline gives greater downhill acceleration.",
  "inkLimit": 480
 },
 {
  "id": 63,
  "tier": 3,
  "level": 3,
  "family": 2,
  "title": "Leftward landing",
  "task": "Deliver the ball leftwards without changing gravity.",
  "start": [
   525.5999999999999,
   38.5
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    151,
    78,
    410.79999999999995,
    182.25
   ]
  ],
  "stars": [
   [
    518.8,
    87.93
   ],
   [
    429.38,
    125.59
   ],
   [
    346.11,
    160.66
   ],
   [
    306.42,
    177.37
   ]
  ],
  "starRadius": 12,
  "goal": [
   252.09,
   200.24
  ],
  "goalRadius": 8,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Potential energy",
   "question": "Where does a falling ball get its increasing kinetic energy?",
   "options": [
    "From extra mass created as it falls.",
    "From decreasing gravitational potential energy."
   ],
   "correct": 1,
   "explain": "Gravitational potential energy mgh changes into kinetic energy ½mv². Friction and inelastic impacts transfer some mechanical energy to the surroundings.",
   "reflect": "Compare height lost with the peak speed you measured."
  },
  "hint": "Gravitational potential energy mgh changes into kinetic energy ½mv². Friction and inelastic impacts transfer some mechanical energy to the surroundings.",
  "inkLimit": 505
 },
 {
  "id": 64,
  "tier": 3,
  "level": 4,
  "family": 3,
  "title": "Return through the checkpoint",
  "task": "Travel right, rebound, then take a lower route back left.",
  "start": [
   516.2,
   38.5
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [
   {
    "points": [
     [
      149.60000000000002,
      109.75
     ],
     [
      149.60000000000002,
      247.5
     ]
    ],
    "e": 0.75
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    173.10000000000002,
    71.75,
    385.4,
    95
   ],
   [
    154.3,
    195.25,
    319.59999999999997,
    128.25
   ]
  ],
  "stars": [
   [
    436.68,
    94.73
   ],
   [
    165.39,
    154.81
   ],
   [
    233.97,
    221.21
   ],
   [
    307.38,
    244.82
   ]
  ],
  "starRadius": 12,
  "goal": [
   431.89,
   284.86
  ],
  "goalRadius": 8,
  "materials": [
   "smooth"
  ],
  "minBounces": 1,
  "science": {
   "concept": "Normal force",
   "question": "Can a surface change velocity direction without changing gravity’s direction?",
   "options": [
    "Yes: contact provides a normal force.",
    "No: gravity must turn sideways."
   ],
   "correct": 0,
   "explain": "The surface pushes perpendicular to itself. This normal force redirects the ball; gravity still acts downward.",
   "reflect": "Identify each place where contact changed the direction of motion."
  },
  "hint": "The surface pushes perpendicular to itself. This normal force redirects the ball; gravity still acts downward.",
  "inkLimit": 818
 },
 {
  "id": 65,
  "tier": 3,
  "level": 5,
  "family": 4,
  "title": "Three-storey switchback",
  "task": "Use three separate build areas and two changes of direction.",
  "start": [
   83.8,
   33.75
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [
   {
    "points": [
     [
      431.59999999999997,
      105
     ],
     [
      431.59999999999997,
      238
     ]
    ],
    "e": 0.8
   },
   {
    "points": [
     [
      168.39999999999998,
      233.25
     ],
     [
      168.39999999999998,
      276
     ]
    ],
    "e": 0.8
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    41.5,
    62.25,
    357.2,
    104.5
   ],
   [
    191.89999999999998,
    176.25,
    239.7,
    95
   ],
   [
    163.7,
    280.75,
    296.09999999999997,
    90.25
   ]
  ],
  "stars": [
   [
    218.14,
    99.68
   ],
   [
    197.89,
    244.35
   ],
   [
    240.13,
    297.84
   ],
   [
    307.21,
    312.78
   ]
  ],
  "starRadius": 12,
  "goal": [
   425.04,
   339.01
  ],
  "goalRadius": 8,
  "materials": [
   "smooth"
  ],
  "minBounces": 2,
  "science": {
   "concept": "Collisions and energy",
   "question": "Do abrupt non-elastic direction changes retain all kinetic energy?",
   "options": [
    "Yes: every impact preserves kinetic energy.",
    "No: some mechanical energy is transferred."
   ],
   "correct": 1,
   "explain": "A sharp impact removes part of the incoming normal velocity. Smooth bends lose less mechanical energy than abrupt non-elastic impacts in this model.",
   "reflect": "Which bend could you smooth to retain more speed?"
  },
  "hint": "A sharp impact removes part of the incoming normal velocity. Smooth bends lose less mechanical energy than abrupt non-elastic impacts in this model.",
  "inkLimit": 1010
 },
 {
  "id": 66,
  "tier": 3,
  "level": 6,
  "family": 5,
  "title": "Horizontal gap",
  "task": "Choose a launch speed and intercept the flight on the far side.",
  "start": [
   50.9,
   67
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 116,
   "angle": 0,
   "min": 80,
   "max": 220,
   "angleMin": 0,
   "angleMax": 0,
   "direction": 1
  },
  "fixed": [
   {
    "points": [
     [
      36.8,
      133.5
     ],
     [
      177.79999999999998,
      133.5
     ]
    ]
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    262.4,
    209.5,
    263.2,
    85.5
   ]
  ],
  "stars": [
   [
    182.28,
    121.79
   ],
   [
    341.34,
    223.36
   ],
   [
    459.47,
    252.04
   ],
   [
    510.48,
    262.74
   ]
  ],
  "starRadius": 12,
  "goal": [
   575.37,
   282.68
  ],
  "goalRadius": 8,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Projectile motion",
   "question": "With no air drag, what accelerates horizontal motion after launch?",
   "options": [
    "Nothing: horizontal velocity stays constant in flight.",
    "Gravity: it continually speeds the ball sideways."
   ],
   "correct": 0,
   "explain": "Horizontal and vertical motion are independent in free flight. Horizontal displacement is uₓt; gravity changes vertical velocity.",
   "reflect": "Use the flight time and horizontal speed to estimate the gap crossed."
  },
  "hint": "Horizontal and vertical motion are independent in free flight. Horizontal displacement is uₓt; gravity changes vertical velocity.",
  "inkLimit": 311
 },
 {
  "id": 67,
  "tier": 3,
  "level": 7,
  "family": 6,
  "title": "Over the tower",
  "task": "Choose a speed and angle that clear the tower.",
  "start": [
   516.2,
   323.5
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 233,
   "angle": 62,
   "min": 180,
   "max": 380,
   "angleMin": 15,
   "angleMax": 75,
   "direction": -1
  },
  "fixed": [],
  "blocks": [
   [
    309.40000000000003,
    276,
    28.2,
    102.6
   ]
  ],
  "hazards": [],
  "zones": [
   [
    55.60000000000002,
    266.5,
    131.6,
    85.5
   ]
  ],
  "stars": [
   [
    388.3,
    226.58
   ],
   [
    233.9,
    191.56
   ],
   [
    142.54,
    213.05
   ],
   [
    106,
    230.44
   ]
  ],
  "starRadius": 12,
  "goal": [
   61.24,
   258.58
  ],
  "goalRadius": 8,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Launch angle",
   "question": "At the same launch speed, which gives a larger initial upward component?",
   "options": [
    "A smaller launch angle.",
    "A larger launch angle (up to 90°)."
   ],
   "correct": 1,
   "explain": "The initial components are uₓ = u cos θ and uᵧ = u sin θ. Changing angle trades horizontal motion for upward motion.",
   "reflect": "Why might a higher arc still miss a distant target?"
  },
  "hint": "The initial components are uₓ = u cos θ and uᵧ = u sin θ. Changing angle trades horizontal motion for upward motion.",
  "inkLimit": 25,
  "timeBand": [
   1.75,
   2.29
  ]
 },
 {
  "id": 68,
  "tier": 3,
  "level": 8,
  "family": 7,
  "title": "Bank shot",
  "task": "Use the vertical bouncy wall to return toward a target.",
  "start": [
   97.89999999999999,
   90.75
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 186,
   "angle": 22,
   "min": 150,
   "max": 300,
   "angleMin": -15,
   "angleMax": 25,
   "direction": 1
  },
  "fixed": [
   {
    "points": [
     [
      441,
      29
     ],
     [
      441,
      356.75
     ]
    ],
    "e": 0.82
   },
   {
    "points": [
     [
      130.8,
      361.5
     ],
     [
      436.29999999999995,
      361.5
     ]
    ],
    "e": 0.72
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    74.4,
    257,
    112.8,
    95
   ]
  ],
  "stars": [
   [
    303.51,
    135.86
   ],
   [
    328.04,
    343.34
   ],
   [
    208.33,
    247.6
   ],
   [
    160.28,
    226.97
   ]
  ],
  "starRadius": 12,
  "goal": [
   100.42,
   215.54
  ],
  "goalRadius": 8,
  "materials": [
   "smooth"
  ],
  "minBounces": 1,
  "science": {
   "concept": "Impulse and rebound",
   "question": "At a vertical bouncy wall, which velocity component mainly reverses?",
   "options": [
    "The component perpendicular to the wall.",
    "The component parallel to the wall."
   ],
   "correct": 0,
   "explain": "A collision impulse changes velocity normal to the wall. With restitution e, normal speed after impact is e times normal speed before it.",
   "reflect": "Compare the trail before and after the wall collision."
  },
  "hint": "A collision impulse changes velocity normal to the wall. With restitution e, normal speed after impact is e times normal speed before it.",
  "inkLimit": 25
 },
 {
  "id": 69,
  "tier": 3,
  "level": 9,
  "family": 8,
  "title": "Catch the rebound",
  "task": "Choose a bouncy pad and reach a target during the upward rebound.",
  "start": [
   206,
   43.25
  ],
  "velocity": [
   55,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    154.29999999999998,
    309.25,
    343.09999999999997,
    33.25
   ]
  ],
  "stars": [
   [
    249.12,
    103.86
   ],
   [
    301.48,
    291.05
   ],
   [
    332.27,
    181.62
   ]
  ],
  "starRadius": 12,
  "goal": [
   359.77,
   135.91
  ],
  "goalRadius": 8,
  "materials": [
   "smooth",
   "bounce"
  ],
  "minBounces": 1,
  "science": {
   "concept": "Bounce height",
   "question": "Does an e = 0.82 rebound return a ball to its original height?",
   "options": [
    "Yes: any elastic-looking surface restores the height.",
    "No: the rebound normal energy is only e² of before."
   ],
   "correct": 1,
   "explain": "For a vertical drop on a stationary surface, rebound height is approximately e² times drop height. With e < 1, some mechanical energy is transferred.",
   "reflect": "Estimate a rebound-height ratio from the trail."
  },
  "hint": "For a vertical drop on a stationary surface, rebound height is approximately e² times drop height. With e < 1, some mechanical energy is transferred.",
  "inkLimit": 394
 },
 {
  "id": 70,
  "tier": 3,
  "level": 10,
  "family": 9,
  "title": "Two-impact journey",
  "task": "Preserve enough speed to use both the wall and the bouncy floor.",
  "start": [
   506.8,
   57.5
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 202,
   "angle": 15,
   "min": 180,
   "max": 340,
   "angleMin": -10,
   "angleMax": 15,
   "direction": -1
  },
  "fixed": [
   {
    "points": [
     [
      173.10000000000002,
      29
     ],
     [
      173.10000000000002,
      333
     ]
    ],
    "e": 0.82
   },
   {
    "points": [
     [
      488,
      342.5
     ],
     [
      168.40000000000003,
      342.5
     ]
    ],
    "e": 0.82
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    450.4,
    219,
    94,
    104.5
   ]
  ],
  "stars": [
   [
    295.12,
    113.86
   ],
   [
    303.37,
    330.7
   ],
   [
    427.36,
    214.61
   ],
   [
    476.03,
    184.67
   ]
  ],
  "starRadius": 12,
  "goal": [
   537.57,
   159.44
  ],
  "goalRadius": 8,
  "materials": [
   "smooth"
  ],
  "minBounces": 2,
  "science": {
   "concept": "Repeated rebounds",
   "question": "What happens to normal speed after repeated e < 1 rebounds?",
   "options": [
    "It decreases with each rebound.",
    "It increases without an external energy source."
   ],
   "correct": 0,
   "explain": "Each rebound multiplies the incoming normal speed by e. Successive inelastic rebounds leave less mechanical energy for later motion.",
   "reflect": "Where did you need to preserve speed for the next rebound?"
  },
  "hint": "Each rebound multiplies the incoming normal speed by e. Successive inelastic rebounds leave less mechanical energy for later motion.",
  "inkLimit": 25
 },
 {
  "id": 71,
  "tier": 3,
  "level": 11,
  "family": 10,
  "title": "Friction landing",
  "task": "Choose a surface that brings the ball into the target at a safe speed.",
  "start": [
   83.8,
   181
  ],
  "velocity": [
   180,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    41.5,
    233.25,
    493.5,
    33.25
   ]
  ],
  "stars": [
   [
    258.7,
    235.7
   ],
   [
    418.5,
    235.7
   ],
   [
    476.35,
    235.7
   ]
  ],
  "starRadius": 12,
  "goal": [
   505.35,
   235.7
  ],
  "goalRadius": 8,
  "materials": [
   "smooth",
   "rough"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Kinetic friction",
   "question": "For a level surface, what happens if μ increases at the same mass?",
   "options": [
    "The friction force decreases.",
    "The opposing friction force increases."
   ],
   "correct": 1,
   "explain": "Kinetic friction is approximately μN. On a level surface N ≈ mg, so the deceleration is approximately μg.",
   "reflect": "Which trial reduced arrival speed most, and what variable changed?"
  },
  "hint": "Kinetic friction is approximately μN. On a level surface N ≈ mg, so the deceleration is approximately μg.",
  "inkLimit": 562,
  "speedBand": [
   1.1,
   1.8
  ]
 },
 {
  "id": 72,
  "tier": 3,
  "level": 12,
  "family": 11,
  "title": "Surface experiment",
  "task": "Keep enough speed across a slope and a raised shelf.",
  "start": [
   83.8,
   43.25
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    41.5,
    81.25,
    155.1,
    109.25
   ],
   [
    168.39999999999998,
    181,
    343.09999999999997,
    61.75
   ]
  ],
  "stars": [
   [
    92.55,
    108.45
   ],
   [
    224.54,
    188.53
   ],
   [
    331.45,
    199.39
   ],
   [
    376.58,
    203.95
   ]
  ],
  "starRadius": 12,
  "goal": [
   433.68,
   209.72
  ],
  "goalRadius": 8,
  "materials": [
   "smooth",
   "rough"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Energy dissipation",
   "question": "What does a rough surface do to mechanical energy?",
   "options": [
    "Transfers more of it to the surroundings.",
    "Creates mechanical energy from nothing."
   ],
   "correct": 0,
   "explain": "Friction does negative work on the ball. Kinetic and potential energy together can decrease even though total energy including the surroundings is conserved.",
   "reflect": "Compare arrival kinetic energies for smooth and rough designs."
  },
  "hint": "Friction does negative work on the ball. Kinetic and potential energy together can decrease even though total energy including the surroundings is conserved.",
  "inkLimit": 578,
  "speedBand": [
   7.8,
   10.4
  ]
 },
 {
  "id": 73,
  "tier": 3,
  "level": 13,
  "family": 12,
  "title": "Momentum climb",
  "task": "Launch into an uphill ramp and reach a higher target.",
  "start": [
   516.2,
   312.09999999999997
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 248,
   "angle": 0,
   "min": 200,
   "max": 420,
   "angleMin": 0,
   "angleMax": 0,
   "direction": -1
  },
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    102.60000000000002,
    143,
    455.9,
    213.75
   ]
  ],
  "stars": [
   [
    413.2,
    273.94
   ],
   [
    304.42,
    227.16
   ],
   [
    247.69,
    202.76
   ]
  ],
  "starRadius": 12,
  "goal": [
   200.45,
   182.44
  ],
  "goalRadius": 8,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Momentum and climbing",
   "question": "Can a moving ball climb above its release height?",
   "options": [
    "No, motion can never carry it uphill.",
    "Yes, if its initial kinetic energy is sufficient."
   ],
   "correct": 1,
   "explain": "Initial kinetic energy can become gravitational potential energy. With no losses, ½mu² = mgΔh gives the maximum possible rise.",
   "reflect": "Use your initial speed to estimate the greatest friction-free rise."
  },
  "hint": "Initial kinetic energy can become gravitational potential energy. With no losses, ½mu² = mgΔh gives the maximum possible rise.",
  "inkLimit": 564
 },
 {
  "id": 74,
  "tier": 3,
  "level": 14,
  "family": 13,
  "title": "Valley transfer",
  "task": "Build a valley that carries the ball up the far side.",
  "start": [
   83.8,
   33.75
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    41.5,
    71.75,
    484.09999999999997,
    266
   ]
  ],
  "stars": [
   [
    83.96,
    109.23
   ],
   [
    223.29,
    272.55
   ],
   [
    326.74,
    290.49
   ]
  ],
  "starRadius": 12,
  "goal": [
   350.2,
   267.97
  ],
  "goalRadius": 8,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Energy exchange",
   "question": "Where is speed generally greatest on a smooth valley route?",
   "options": [
    "Near its lowest point.",
    "Near its highest point."
   ],
   "correct": 0,
   "explain": "As height decreases, potential energy can become kinetic energy. Climbing converts kinetic energy back to potential energy; friction and impacts reduce the return height.",
   "reflect": "Why was the second hill lower than the first in your design?"
  },
  "hint": "As height decreases, potential energy can become kinetic energy. Climbing converts kinetic energy back to potential energy; friction and impacts reduce the return height.",
  "inkLimit": 740
 },
 {
  "id": 75,
  "tier": 3,
  "level": 15,
  "family": 14,
  "title": "Island crossing",
  "task": "Bridge neither gap: use flight and a short middle landing.",
  "start": [
   50.9,
   67
  ],
  "velocity": [
   150,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [
   {
    "points": [
     [
      36.8,
      133.5
     ],
     [
      177.79999999999998,
      133.5
     ]
    ]
   },
   {
    "points": [
     [
      398.7,
      295
     ],
     [
      539.6999999999999,
      295
     ]
    ]
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    257.7,
    204.75,
    84.6,
    52.25
   ]
  ],
  "stars": [
   [
    186.5,
    122.08
   ],
   [
    355.97,
    231.99
   ],
   [
    474.35,
    283.2
   ],
   [
    522.15,
    283.2
   ]
  ],
  "starRadius": 12,
  "goal": [
   580.97,
   288.39
  ],
  "goalRadius": 8,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Inertia across gaps",
   "question": "What carries the ball sideways across an unsupported gap?",
   "options": [
    "A sideways force from empty space.",
    "Its existing horizontal velocity."
   ],
   "correct": 1,
   "explain": "After leaving a ramp, the ball continues horizontally because of inertia while gravity accelerates it downward. A landing needs to intercept its curved flight.",
   "reflect": "How did the landing position depend on the launch direction?"
  },
  "hint": "After leaving a ramp, the ball continues horizontally because of inertia while gravity accelerates it downward. A landing needs to intercept its curved flight.",
  "inkLimit": 106
 },
 {
  "id": 76,
  "tier": 3,
  "level": 16,
  "family": 15,
  "title": "Platform cascade",
  "task": "Connect the separate ledges while keeping downward acceleration in mind.",
  "start": [
   516.2,
   29
  ],
  "velocity": [
   -20,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    408.1,
    71.75,
    141,
    76
   ],
   [
    224.8,
    181,
    169.2,
    80.75
   ],
   [
    60.30000000000007,
    295,
    131.6,
    66.5
   ]
  ],
  "stars": [
   [
    487.32,
    94.77
   ],
   [
    358.17,
    162.97
   ],
   [
    248.93,
    230.09
   ],
   [
    194.83,
    251.7
   ]
  ],
  "starRadius": 12,
  "goal": [
   127.91,
   297.99
  ],
  "goalRadius": 8,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Vectors and gravity",
   "question": "Between platforms, which way does gravity act?",
   "options": [
    "Down, even when the ball travels sideways.",
    "Along whatever direction the ball is moving."
   ],
   "correct": 0,
   "explain": "Velocity gives the direction of motion; acceleration gives the change in velocity. They need not point in the same direction.",
   "reflect": "Find a section where velocity and acceleration pointed in different directions."
  },
  "hint": "Velocity gives the direction of motion; acceleration gives the change in velocity. They need not point in the same direction.",
  "inkLimit": 499
 },
 {
  "id": 77,
  "tier": 3,
  "level": 17,
  "family": 16,
  "title": "Moon gap",
  "task": "Choose a launch for a low-gravity flight. No ramp may span the gap.",
  "start": [
   83.8,
   133.5
  ],
  "velocity": [
   0,
   0
  ],
  "gravity": 1.62,
  "mass": 1,
  "adjustMass": false,
  "launch": {
   "speed": 109,
   "angle": 27,
   "min": 80,
   "max": 230,
   "angleMin": -10,
   "angleMax": 40,
   "direction": 1
  },
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    422.2,
    219,
    131.6,
    95
   ]
  ],
  "stars": [
   [
    205.14,
    122.94
   ],
   [
    352.07,
    139.04
   ],
   [
    438.32,
    163.22
   ],
   [
    472.81,
    175.94
   ]
  ],
  "starRadius": 12,
  "goal": [
   515.64,
   194.16
  ],
  "goalRadius": 8,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Gravity on the Moon",
   "question": "At the same initial velocity, how does weaker gravity affect time to fall the same distance?",
   "options": [
    "It decreases the flight time.",
    "It increases the flight time."
   ],
   "correct": 1,
   "explain": "The Moon’s surface gravity is about 1.62 m/s². For a horizontal launch through height h, time is √(2h/g), so weaker gravity permits a longer horizontal range.",
   "reflect": "Compare this design with an Earth launch at the same speed."
  },
  "hint": "The Moon’s surface gravity is about 1.62 m/s². For a horizontal launch through height h, time is √(2h/g), so weaker gravity permits a longer horizontal range.",
  "inkLimit": 25,
  "timeBand": [
   2.55,
   3.34
  ]
 },
 {
  "id": 78,
  "tier": 3,
  "level": 18,
  "family": 17,
  "title": "Mass without mystery",
  "task": "Change mass and meet the kinetic-energy requirement at the target.",
  "start": [
   112,
   38.5
  ],
  "velocity": [
   45,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": true,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    102.6,
    138.25,
    394.79999999999995,
    190
   ]
  ],
  "stars": [
   [
    149.98,
    108.71
   ],
   [
    269.9,
    210.63
   ],
   [
    385.57,
    261.14
   ],
   [
    438.57,
    284.29
   ]
  ],
  "starRadius": 12,
  "goal": [
   510.26,
   316.13
  ],
  "goalRadius": 8,
  "materials": [
   "smooth"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Mass and energy",
   "question": "With air drag ignored, does doubling mass double free-fall acceleration?",
   "options": [
    "No: acceleration stays g, but kinetic energy doubles at the same speed.",
    "Yes: both acceleration and energy double."
   ],
   "correct": 0,
   "explain": "Weight mg doubles, but inertia m also doubles, so acceleration remains g. At a fixed speed, kinetic energy ½mv² is proportional to mass.",
   "reflect": "Change only mass: compare the trajectory and kinetic energy."
  },
  "hint": "Weight mg doubles, but inertia m also doubles, so acceleration remains g. At a fixed speed, kinetic energy ½mv² is proportional to mass.",
  "inkLimit": 491,
  "energyBand": [
   164.2,
   208.9
  ]
 },
 {
  "id": 79,
  "tier": 3,
  "level": 19,
  "family": 18,
  "title": "Climb to brake",
  "task": "Combine a rough surface and an uphill finish to reduce arrival speed.",
  "start": [
   516.2,
   285.5
  ],
  "velocity": [
   -175,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    83.79999999999995,
    266.5,
    474.7,
    85.5
   ]
  ],
  "stars": [
   [
    384.07,
    330.7
   ],
   [
    270.88,
    308.9
   ]
  ],
  "starRadius": 12,
  "goal": [
   236.79,
   301.18
  ],
  "goalRadius": 8,
  "materials": [
   "smooth",
   "rough"
  ],
  "minBounces": 0,
  "science": {
   "concept": "Braking and work",
   "question": "Can friction and an uphill ramp both reduce speed?",
   "options": [
    "No: only a collision can reduce speed.",
    "Yes: friction dissipates energy and climbing increases potential energy."
   ],
   "correct": 1,
   "explain": "Climbing transfers kinetic energy into potential energy; friction transfers mechanical energy to the surroundings. Both can help meet a low arrival-speed requirement.",
   "reflect": "How much braking came from height gain, and how much from the surface?"
  },
  "hint": "Climbing transfers kinetic energy into potential energy; friction transfers mechanical energy to the surroundings. Both can help meet a low arrival-speed requirement.",
  "inkLimit": 549,
  "speedBand": [
   0,
   0.2
  ]
 },
 {
  "id": 80,
  "tier": 3,
  "level": 20,
  "family": 19,
  "title": "Return-route engineering",
  "task": "Combine rebounds, separated ramps and a controlled final landing.",
  "start": [
   83.8,
   33.75
  ],
  "velocity": [
   35,
   0
  ],
  "gravity": 9.81,
  "mass": 1,
  "adjustMass": false,
  "launch": null,
  "fixed": [
   {
    "points": [
     [
      450.4,
      105
     ],
     [
      450.4,
      257
     ]
    ],
    "e": 0.78
   },
   {
    "points": [
     [
      163.7,
      247.5
     ],
     [
      163.7,
      309.25
     ]
    ],
    "e": 0.78
   }
  ],
  "blocks": [],
  "hazards": [],
  "zones": [
   [
    41.5,
    71.75,
    385.4,
    104.5
   ],
   [
    187.2,
    200,
    263.2,
    104.5
   ],
   [
    168.39999999999998,
    309.25,
    310.2,
    61.75
   ]
  ],
  "stars": [
   [
    430.8,
    178.74
   ],
   [
    209.21,
    315.58
   ],
   [
    382.4,
    335.13
   ],
   [
    439.84,
    341.58
   ]
  ],
  "starRadius": 12,
  "goal": [
   454.14,
   343.18
  ],
  "goalRadius": 8,
  "materials": [
   "smooth",
   "rough"
  ],
  "minBounces": 2,
  "science": {
   "concept": "Engineering with physics",
   "question": "For a fair comparison, how many design variables should you change at once?",
   "options": [
    "One, while keeping the others fixed.",
    "Every variable, so the result is impossible to attribute."
   ],
   "correct": 0,
   "explain": "Controlled experiments let you connect cause and effect. Use speed, time, energy and the trail to improve one part of the design at a time.",
   "reflect": "Name the constraint that failed and the single change that improved it."
  },
  "hint": "Controlled experiments let you connect cause and effect. Use speed, time, energy and the trail to improve one part of the design at a time.",
  "inkLimit": 1080,
  "speedBand": [
   0,
   0.2
  ]
 }
];
