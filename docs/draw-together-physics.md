# Oxford Draw Together: physics design lab

There are 80 puzzles: Easy (IDs 1–20), Medium (21–40), Hard (41–60), and Expert (61–80). Each tier explores 20 route and experiment families. Higher tiers tighten target tolerances, ink budgets and measured arrival constraints, and add ordered checkpoints. Students can choose a tier and any puzzle; solved puzzles remain marked during the session.

## A classroom experiment

1. Predict the outcome before releasing the ball.
2. Design inside the teal build areas. Gaps between areas must be crossed in flight.
3. Test and read time, speed, height and kinetic energy. Inspect the trail.
4. Change one variable and compare trials. Reset ball keeps the design; Clear design removes it.
5. Explain the evidence using the completion question.

Ask students to record their prediction, the variable changed, two trials, and a causal explanation. A successful route alone is not the whole learning objective. Puzzles cover downhill acceleration, projectile motion, changes of direction, one and two rebounds, smooth versus rough surfaces, energy transfer in a valley, uphill braking, Moon gravity, and the effect of mass on energy.

## Model and formulas

The simulation treats the ball as an ideal sliding point mass with a finite collision radius. It has no air resistance, spin, rolling inertia or surface deformation. Board coordinates use 20 units per metre. Earth gravity is 9.81 m/s²; Moon puzzles use 1.62 m/s². Measurements are simulated, rather than readings from a physical experiment.

- Weight: **F = mg**. Without drag, mass changes weight and inertia together, so free-fall acceleration remains g.
- Kinetic energy: **KE = ½mv²**. Doubling mass doubles KE at the same speed; doubling speed quadruples it.
- Gravitational potential energy: **PE = mgh**. Height uses the board floor as the reference. Climbing can exchange KE for PE.
- Projectile motion: horizontal velocity is constant in free flight; gravity changes vertical velocity. Launch angle and speed determine whether a gap or tower can be cleared.
- Sliding friction: **f = μN**. Rough lines use μ = 0.28 and smooth lines μ = 0.015. Friction transfers mechanical energy to the surroundings.
- Rebound: **e = outgoing normal speed / incoming normal speed**. Bouncy lines use e = 0.82. In a vertical drop, the approximate rebound-height ratio is e². Energy also changes through friction and other impacts.

At sharp joins, inelastic collisions can remove energy. Smooth bends generally preserve more speed. This ideal model supports comparisons and causal reasoning; it is not a numerical model of a real rolling ball.

## Teacher customization

The lesson editor supports up to 80 items for this game. Puzzle IDs determine the challenge: reorder or remove them to tailor a class lesson. Older IDs 81–99 wrap to the first 19 puzzles. Archived Ink Physics and Ramp Lab links and saved lessons remain compatible, but only Draw Together appears in the prepared library.

## References

- [OpenStax Physics: Projectile Motion](https://openstax.org/books/physics/pages/5-3-projectile-motion)
- [OpenStax University Physics: Projectile Motion](https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion)
- [OpenStax College Physics: Inelastic Collisions](https://openstax.org/books/college-physics-2e/pages/8-5-inelastic-collisions-in-one-dimension)
- [OpenStax University Physics: Impulse and Collisions](https://openstax.org/books/university-physics-volume-1/pages/9-2-impulse-and-collisions)
