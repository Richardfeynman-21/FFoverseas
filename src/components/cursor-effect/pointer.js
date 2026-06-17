import { Vector2 } from 'three';
import { addEventListener } from 'vevet';
import { gsap } from 'gsap';

/**
 * Pointer manager for handling mouse and touch interaction.
 * Provides smoothed coordinates and velocity.
 */
export class Pointer {
  /** @type {Vector2} */
  #prev = new Vector2(0, 0);
  /** @type {Vector2} */
  #target = new Vector2(0, 0);
  /** @type {Vector2} */
  #current = new Vector2(0, 0);
  /** @type {Vector2} */
  #velocity = new Vector2(0, 0);

  /** @type {boolean} */
  #isActive = false;
  /** @type {number|undefined} */
  #lastTime;

  /** @type {Function[]} */
  #listeners = [];

  /** @returns {Vector2} Current smoothed coordinates */
  get coords() {
    return this.#current;
  }

  /** @returns {Vector2} Raw target coordinates */
  get targetCoords() {
    return this.#target;
  }

  /** @returns {Vector2} Current velocity */
  get velocity() {
    return this.#velocity;
  }

  constructor() {
    this.#listeners.push(
      addEventListener(window, 'mousemove', this.#handleMove.bind(this)),
    );

    this.#listeners.push(
      addEventListener(window, 'touchmove', this.#handleMove.bind(this)),
    );

    this.#listeners.push(
      addEventListener(window, 'touchend', this.#handleLeave.bind(this)),
    );

    this.#listeners.push(
      addEventListener(
        document.body,
        'mouseleave',
        this.#handleLeave.bind(this),
      ),
    );
  }

  /**
   * Handle mouse or touch move event.
   * @param {MouseEvent|TouchEvent} evt 
   */
  #handleMove(evt) {
    let x = 0;
    let y = 0;

    if (evt instanceof MouseEvent) {
      x = evt.clientX;
      y = evt.clientY;
    } else if (evt instanceof TouchEvent && evt.touches.length > 0) {
      x = evt.touches[0].clientX;
      y = evt.touches[0].clientY;
    }

    this.#target.set(x, y);

    if (!this.#isActive) {
      this.#current.copy(this.#target);
      this.#velocity.set(0, 0);
      this.#isActive = true;
    }
  }

  /**
   * Handle pointer leave event.
   */
  #handleLeave() {
    this.#isActive = false;
  }

  /**
   * Update smoothed coordinates and velocity based on easing.
   * @param {number} ease - The easing factor (0 to 1).
   */
  update(ease) {
    const now = performance.now();

    const current = this.#current;
    const target = this.#target;
    const prev = this.#prev;
    const velocity = this.#velocity;

    prev.copy(current);

    if (!this.#lastTime) {
      current.copy(target);
      velocity.set(0, 0);
    } else {
      const dt = now - this.#lastTime;

      // Use GSAP lerp for smoother movement
      // The lerp factor is adjusted based on delta time for frame-rate independence
      const lerpFactor = 1 - Math.pow(1 - ease, dt / 16.66);
      current.x = gsap.utils.interpolate(current.x, target.x, lerpFactor);
      current.y = gsap.utils.interpolate(current.y, target.y, lerpFactor);

      const vdt = Math.max(dt / 1000, 1e-6);
      const dx = current.x - prev.x;
      const dy = current.y - prev.y;
      velocity.set(dx / vdt, dy / vdt);
    }

    this.#lastTime = now;
  }

  /**
   * Clean up event listeners.
   */
  destroy() {
    this.#listeners.forEach((listener) => listener());
  }
}
