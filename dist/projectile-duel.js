
        // --- Fullscreen API ---
        function toggleFullScreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log(`Error: ${err.message}`);
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        }

        // --- Game Logic ---
        
        // DOM Elements
        const p1AngleIn = document.getElementById('p1-angle');
        const p1PowerIn = document.getElementById('p1-power');
        const p2AngleIn = document.getElementById('p2-angle');
        const p2PowerIn = document.getElementById('p2-power');
        
        const p1Barrel = document.getElementById('p1-barrel');
        const p2Barrel = document.getElementById('p2-barrel');
        
        const projLayer = document.getElementById('projectile-layer');
        const msgOverlay = document.getElementById('message-overlay');

        // State Variables
        let p1Score = 0;
        let p2Score = 0;
        let activeProjectiles = [];
        let cooldowns = [0, 0], nextLevel = 0, messageTime = 0;

        // SLOWER GRAVITY for visible arcs
        const GRAVITY = 0.15; 
        
        // Collision Bounds
        const floorY = 450;
        // Mountain hit polygon (x, y coords) - updated dynamically
        let mountainBounds = [
            {x: 350, y: 450}, {x: 500, y: 200}, {x: 650, y: 450}
        ];
        
        let p1Hitbox = { x: 100, y: 420, r: 40 }; 
        let p2Hitbox = { x: 900, y: 420, r: 40 };

        // --- Dynamic Level Generation ---
        function generateNewLevel() {
            // Randomize Cannon Positions
            let p1NewX = Math.floor(Math.random() * 200) + 50; // 50 to 250
            let p2NewX = 1000 - (Math.floor(Math.random() * 200) + 50); // 750 to 950
            
            // Randomize Elevations (between 250 and 420, floor is at 450)
            let p1NewY = Math.floor(Math.random() * 170) + 250;
            let p2NewY = Math.floor(Math.random() * 170) + 250;

            p1Hitbox.x = p1NewX;
            p1Hitbox.y = p1NewY;
            p2Hitbox.x = p2NewX;
            p2Hitbox.y = p2NewY;

            document.getElementById('p1-cannon-group').setAttribute('transform', `translate(${p1NewX}, ${p1NewY})`);
            document.getElementById('p2-cannon-group').setAttribute('transform', `translate(${p2NewX}, ${p2NewY})`);

            // Update Support Platforms
            document.getElementById('p1-platform').setAttribute('x', p1NewX - 40);
            document.getElementById('p1-platform').setAttribute('y', p1NewY);
            document.getElementById('p1-platform').setAttribute('height', 450 - p1NewY);

            document.getElementById('p2-platform').setAttribute('x', p2NewX - 40);
            document.getElementById('p2-platform').setAttribute('y', p2NewY);
            document.getElementById('p2-platform').setAttribute('height', 450 - p2NewY);

            // Randomize Mountain Obstacle
            let peakX = Math.floor(Math.random() * 200) + 400; // 400 to 600
            let peakY = Math.floor(Math.random() * 200) + 100; // 100 to 300
            let baseWidth = Math.floor(Math.random() * 200) + 100; // 100 to 300

            mountainBounds = [
                {x: peakX - baseWidth/2, y: 450},
                {x: peakX, y: peakY},
                {x: peakX + baseWidth/2, y: 450}
            ];

            let mountainEl = document.getElementById('mountain-polygon');
            mountainEl.setAttribute('points', `${mountainBounds[0].x},${mountainBounds[0].y} ${mountainBounds[1].x},${mountainBounds[1].y} ${mountainBounds[2].x},${mountainBounds[2].y}`);

            updatePreviews();
        }

        // --- Helper for Smartboard +/- buttons ---
        function adjustInput(inputId, amount) {
            const input = document.getElementById(inputId);
            let val = parseInt(input.value) + amount;
            
            // clamp
            if(val < parseInt(input.min)) val = parseInt(input.min);
            if(val > parseInt(input.max)) val = parseInt(input.max);
            
            input.value = val;
            updatePreviews();
        }

        function updatePreviews() {
            // Update Text values
            document.getElementById('p1-angle-val').innerText = p1AngleIn.value;
            document.getElementById('p1-power-val').innerText = p1PowerIn.value;
            document.getElementById('p2-angle-val').innerText = p2AngleIn.value;
            document.getElementById('p2-power-val').innerText = p2PowerIn.value;

            // Rotate Barrels
            // P1 rotates normally (0 is right, negative is up in SVG space)
            p1Barrel.setAttribute('transform', `rotate(${-p1AngleIn.value})`);
            
            // P2 rotates from the right side. 
            // In our SVG, barrel is drawn to the left (-70 to 0).
            // A rotation of 0 means pointing straight left.
            // Rotating +angle aims it UP.
            p2Barrel.setAttribute('transform', `rotate(${p2AngleIn.value})`);

            // Generate Previews based on exact cannon positions
            drawPreviewLine('p1-preview', p1Hitbox.x, p1Hitbox.y, parseInt(p1AngleIn.value), parseInt(p1PowerIn.value), 1);
            drawPreviewLine('p2-preview', p2Hitbox.x, p2Hitbox.y, parseInt(p2AngleIn.value), parseInt(p2PowerIn.value), -1);
        }

        function drawPreviewLine(elementId, startX, startY, angleDeg, power, direction) {
            let pathD = `M ${startX} ${startY}`;
            let rad = angleDeg * (Math.PI / 180);
            
            // Scaled down velocity components for slower, observable flight
            let vx = (power * 0.12) * Math.cos(rad) * direction;
            let vy = -(power * 0.12) * Math.sin(rad); 
            
            let px = startX;
            let py = startY;

            // Draw just enough to guide
            for(let i=0; i<15; i++) {
                px += vx * 2;
                vy += GRAVITY * 2;
                py += vy * 2;
                pathD += ` L ${px} ${py}`;
            }
            document.getElementById(elementId).setAttribute('d', pathD);
        }

        function showMessage(text, color) {
            msgOverlay.innerText = text;
            msgOverlay.style.color = color;
            
            // Add text stroke for visibility
            msgOverlay.style.webkitTextStroke = "2px black";
            
            msgOverlay.style.opacity = 1;
            msgOverlay.style.transform = "translate(-50%, -50%) scale(1.2)";
            
            messageTime = 2500;
        }

        function fireCannon(playerNum) {
            const btn = document.getElementById(`p${playerNum}-fire-btn`);
            if (btn.disabled || nextLevel > 0) return;
            cooldowns[playerNum - 1] = 5000;
            updateCooldowns();

            let startX, startY, angle, power, direction, color;
            
            if(playerNum === 1) {
                startX = p1Hitbox.x; startY = p1Hitbox.y;
                angle = parseInt(p1AngleIn.value);
                power = parseInt(p1PowerIn.value);
                direction = 1;
                color = "#3b82f6"; // blue
            } else {
                startX = p2Hitbox.x; startY = p2Hitbox.y;
                angle = parseInt(p2AngleIn.value);
                power = parseInt(p2PowerIn.value);
                direction = -1;
                color = "#ef4444"; // red
            }

            const rad = angle * (Math.PI / 180);
            
            // Spawn point at end of barrel
            const spawnX = startX + (60 * Math.cos(rad) * direction);
            const spawnY = startY - (60 * Math.sin(rad));

            // Create SVG Circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', spawnX);
            circle.setAttribute('cy', spawnY);
            circle.setAttribute('r', '10');
            circle.setAttribute('fill', color);
            circle.setAttribute('stroke', '#0f172a');
            circle.setAttribute('stroke-width', '2');
            projLayer.appendChild(circle);

            // Add to physics array
            activeProjectiles.push({
                el: circle,
                x: spawnX,
                y: spawnY,
                vx: (power * 0.12) * Math.cos(rad) * direction,
                vy: -(power * 0.12) * Math.sin(rad),
                owner: playerNum,
                active: true
            });
        }

        // Helper function: Point in Polygon (for mountain collision)
        function isPointInMountain(px, py) {
            // Bounding box quick check first based on dynamic bounds
            let minX = Math.min(mountainBounds[0].x, mountainBounds[2].x);
            let maxX = Math.max(mountainBounds[0].x, mountainBounds[2].x);
            let minY = mountainBounds[1].y;
            
            if(px < minX || px > maxX || py > 450 || py < minY) return false;

            // Barycentric coordinates for triangle collision
            const p0 = mountainBounds[0], p1 = mountainBounds[1], p2 = mountainBounds[2];
            const area = 0.5 *(-p1.y*p2.x + p0.y*(-p1.x + p2.x) + p0.x*(p1.y - p2.y) + p1.x*p2.y);
            const s = 1/(2*area)*(p0.y*p2.x - p0.x*p2.y + (p2.y - p0.y)*px + (p0.x - p2.x)*py);
            const t = 1/(2*area)*(p0.x*p1.y - p0.y*p1.x + (p0.y - p1.y)*px + (p1.x - p0.x)*py);
            
            return s > 0 && t > 0 && (1-s-t) > 0;
        }

        // Main animation loop
        function physicsStep() {
            if(nextLevel > 0) return;

            // Loop backwards so we can splice removed projectiles safely
            for(let i = activeProjectiles.length - 1; i >= 0; i--) {
                let p = activeProjectiles[i];
                if(!p.active) continue;

                // Physics step
                p.x += p.vx;
                p.vy += GRAVITY;
                p.y += p.vy;

                p.el.setAttribute('cx', p.x);
                p.el.setAttribute('cy', p.y);

                let destroyed = false;

                // 1. Check Floor Bounds
                if (p.y > floorY || p.x < -100 || p.x > 1100) {
                    destroyed = true;
                }

                // 2. Check Mountain Collision
                if (!destroyed && isPointInMountain(p.x, p.y)) {
                    destroyed = true;
                    // Optional: Spawn explosion particles here
                }

                // 3. Check Hitbox P1 (Blue)
                if (!destroyed && p.owner === 2) {
                    const dist = Math.hypot(p.x - p1Hitbox.x, p.y - p1Hitbox.y);
                    if(dist < p1Hitbox.r) {
                        p2Score += 1;
                        document.getElementById('p2-score').innerText = p2Score;
                        showMessage("Red Team Scores! 🔥", "#ef4444");
                        destroyed = true;
                        nextLevel = 2000; // Change map after score
                    }
                }

                // 4. Check Hitbox P2 (Red)
                if (!destroyed && p.owner === 1) {
                    const dist = Math.hypot(p.x - p2Hitbox.x, p.y - p2Hitbox.y);
                    if(dist < p2Hitbox.r) {
                        p1Score += 1;
                        document.getElementById('p1-score').innerText = p1Score;
                        showMessage("Blue Team Scores! 💥", "#3b82f6");
                        destroyed = true;
                        nextLevel = 2000; // Change map after score
                    }
                }

                if (destroyed) {
                    p.el.remove(); // remove from SVG DOM
                    activeProjectiles.splice(i, 1); // remove from array
                }
            }


        }

        function updateCooldowns() {
            [1,2].forEach(n => {
                const button = document.getElementById('p'+n+'-fire-btn');
                button.disabled = cooldowns[n-1] > 0 || nextLevel > 0;
                button.textContent = nextLevel > 0 ? 'NEW TERRAIN…' : cooldowns[n-1] > 0 ? 'RELOADING… '+Math.ceil(cooldowns[n-1]/1000) : n===1 ? 'FIRE BLUE 💥' : 'FIRE RED 💥';
            });
        }
        function step(ms) {
            cooldowns = cooldowns.map(t=>Math.max(0,t-ms));
            if (nextLevel > 0) {
                nextLevel = Math.max(0,nextLevel-ms);
                if (!nextLevel) { activeProjectiles=[]; projLayer.replaceChildren(); generateNewLevel(); }
            } else physicsStep();
            messageTime=Math.max(0,messageTime-ms);
            if (!messageTime) msgOverlay.style.opacity=0;
            updateCooldowns();
        }
        let accumulator=0, previousTime=0, manualTime=false;
        function advance(ms) {
            accumulator+=ms;
            while(accumulator>=1000/60) { step(1000/60); accumulator-=1000/60; }
        }
        function frame(time) {
            if(!manualTime && previousTime) advance(Math.min(100,time-previousTime));
            previousTime=time;
            requestAnimationFrame(frame);
        }
        window.advanceTime=ms=>{ manualTime=true; advance(ms); };
        window.render_game_to_text=()=>JSON.stringify({mode:'DUEL',phase:nextLevel?'new-terrain':'playing',scores:[p1Score,p2Score],cooldowns,
            players:[{...p1Hitbox,angle:+p1AngleIn.value,power:+p1PowerIn.value},{...p2Hitbox,angle:+p2AngleIn.value,power:+p2PowerIn.value}],
            mountain:mountainBounds,projectiles:activeProjectiles.map(({x,y,vx,vy,owner})=>({x,y,vx,vy,owner})),
            coordinateSystem:'SVG 1000 x 500; origin top left, x right, y down; ground y=450.'});
        function restartGame() {
            p1Score=p2Score=0; cooldowns=[0,0]; nextLevel=messageTime=0;
            activeProjectiles=[]; projLayer.replaceChildren(); msgOverlay.style.opacity=0;
            document.getElementById('p1-score').textContent=document.getElementById('p2-score').textContent='0';
            p1AngleIn.value=p2AngleIn.value=45; p1PowerIn.value=p2PowerIn.value=60;
            generateNewLevel(); updateCooldowns();
        }
        document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='f'&&!e.repeat)toggleFullScreen();});
        updatePreviews();
        requestAnimationFrame(frame);
