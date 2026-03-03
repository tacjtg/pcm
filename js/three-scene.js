/* ============================================
   THREE.JS HERO — Particle Field
   ============================================ */

const HeroScene = (() => {
  let scene, camera, renderer, particles;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let rafId = null;
  let canvas = null;
  const PARTICLE_COUNT = 2000;

  function init() {
    canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Reduce particles on mobile
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 800 : PARTICLE_COUNT;

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 60;

      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Store velocities for animation
    geometry.userData = { velocities };

    // Particle material
    const material = new THREE.PointsMaterial({
      color: 0xc8ff00,
      size: 1.2,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Add connecting lines (sparse mesh effect)
    addConnections(positions, count);

    // Events
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    animate();
  }

  function addConnections(positions, count) {
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    const threshold = 15;

    // Only check a subset for performance
    const checkCount = Math.min(count, 200);

    for (let i = 0; i < checkCount; i++) {
      for (let j = i + 1; j < checkCount; j++) {
        const i3 = i * 3;
        const j3 = j * 3;
        const dx = positions[i3] - positions[j3];
        const dy = positions[i3 + 1] - positions[j3 + 1];
        const dz = positions[i3 + 2] - positions[j3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < threshold) {
          linePositions.push(
            positions[i3], positions[i3 + 1], positions[i3 + 2],
            positions[j3], positions[j3 + 1], positions[j3 + 2]
          );
        }
      }
    }

    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xc8ff00,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);
  }

  function onMouseMove(e) {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  function onResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    if (!particles) return;

    // Smooth mouse follow
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Rotate particles based on mouse
    particles.rotation.y = mouseX * 0.15;
    particles.rotation.x = mouseY * 0.1;

    // Animate particle positions
    const positions = particles.geometry.attributes.position.array;
    const velocities = particles.geometry.userData.velocities;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];

      // Wrap around boundaries
      if (Math.abs(positions[i]) > 50) velocities[i] *= -1;
      if (Math.abs(positions[i + 1]) > 50) velocities[i + 1] *= -1;
      if (Math.abs(positions[i + 2]) > 30) velocities[i + 2] *= -1;
    }

    particles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }

  function destroy() {
    if (rafId) cancelAnimationFrame(rafId);
    if (renderer) renderer.dispose();
    document.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
  }

  return { init, destroy };
})();
