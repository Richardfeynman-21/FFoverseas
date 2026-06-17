import {
  OrthographicCamera,
  RepeatWrapping,
  TextureLoader,
  NoColorSpace,
  Vector2,
} from 'three';
import { gaussianBlur } from 'three/examples/jsm/tsl/display/GaussianBlurNode.js';
import {
  add,
  distance,
  div,
  texture,
  uniform,
  vec2,
  screenUV,
  exp,
  negate,
  pow,
  vec4,
  mix,
} from 'three/tsl';

import { DoubleFBO } from './DoubleFBO.js';
import { Quad } from './Quad.js';
import { SingleFBO } from './SingleFBO.js';

const TARGET_FPS = 165;
const FLOW_FIXED_MS = 1000 / TARGET_FPS;
const FLOW_MAX_SUBSTEPS = 5;

/**
 * @typedef {Object} FlowProps
 * @property {string} name - Name of the flow instance.
 * @property {number} resolution - FBO resolution.
 * @property {number} blurDownscale - Downscale factor for the blur pass.
 * @property {import('three/tsl').UniformNode} uAspectRatio - Aspect ratio uniform.
 * @property {string} [noiseSrc] - Path to the noise texture.
 * @property {Object} settings - Initial flow settings.
 */

/**
 * Flow simulation class using FBO ping-ponging and TSL.
 */
export class Flow {
  /** @type {OrthographicCamera} */
  #camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  /** @type {Quad} */
  #quad;
  /** @type {DoubleFBO} */
  #velocityPass;
  /** @type {SingleFBO} */
  #blurPass;
  /** @type {Object<string, import('three/tsl').UniformNode>} */
  #uniforms;
  /** @type {import('three').Texture|null} */
  #noiseTexture = null;
  /** @type {number} */
  #accumMs = 0;
  /** @type {number|undefined} */
  #lastTime;

  /**
   * @param {FlowProps} props 
   */
  constructor(props) {
    this._props = props;
    const { resolution, blurDownscale, noiseSrc } = props;

    if (noiseSrc) {
      const noiseTexture = new TextureLoader().load(noiseSrc);
      noiseTexture.colorSpace = NoColorSpace;
      noiseTexture.wrapS = RepeatWrapping;
      noiseTexture.wrapT = RepeatWrapping;
      this.#noiseTexture = noiseTexture;
    }

    // Uniforms
    this.#uniforms = {
      mouse: uniform(new Vector2(0, 0)),
      velocity: uniform(new Vector2(0, 0)),
      deltaTime: uniform(0),
    };

    // Update uniforms
    this.updateUniforms();

    // Create Quad
    this.#quad = new Quad();

    // Create passes
    this.#velocityPass = new DoubleFBO(resolution);
    this.#blurPass = new SingleFBO(resolution / blurDownscale);

    // Init materials
    this._initBlurPass();
    this._initVelocityPass();
  }

  /** @returns {import('three').Texture} Final velocity texture */
  get texture() {
    return this.#velocityPass.sampler;
  }

  /**
   * Update uniforms based on current settings.
   */
  updateUniforms() {
    const { settings } = this._props;

    const keys = Object.keys(settings);
    keys.forEach((key) => {
      if (key in this.#uniforms) {
        this.#uniforms[key].value = settings[key];
      } else {
        this.#uniforms[key] = uniform(settings[key]);
      }
    });
  }

  /**
   * Update pointer state for the simulation.
   * @param {number} x - Normalized X coordinate.
   * @param {number} y - Normalized Y coordinate.
   * @param {number} velX - Normalized X velocity.
   * @param {number} velY - Normalized Y velocity.
   */
  setPointer(x, y, velX, velY) {
    this.#uniforms.mouse.value.set(x, y);
    this.#uniforms.velocity.value.set(velX, velY);
  }

  /**
   * Initialize blur pass material using TSL.
   */
  _initBlurPass() {
    const u = this.#uniforms;
    const { uAspectRatio } = this._props;

    const velocity = texture(this.#velocityPass.sampler, screenUV);
    const blurDirection = vec2(u.blurRadius, u.blurRadius.mul(uAspectRatio));
    const blur = gaussianBlur(velocity, blurDirection, 1);

    this.#blurPass.material.fragmentNode = blur;
  }

  /**
   * Initialize velocity pass material using TSL.
   * Handles splatting, advection, and decay.
   */
  _initVelocityPass() {
    const u = this.#uniforms;
    const { uAspectRatio } = this._props;
    const velocitySampler = this.#velocityPass.sampler;
    const blurSampler = this.#blurPass.sampler;
    const ratio = vec2(uAspectRatio, 1);
    const fpsScale = u.deltaTime.mul(60 / 1000);

    const localUV = screenUV.mul(ratio);
    const localMouse = u.mouse.mul(ratio);
    const dist = distance(localUV, localMouse);
    const mask = exp(negate(dist).div(u.radius));
    const color = vec2(u.velocity.x, u.velocity.y);
    const splat = color.mul(u.strength).mul(mask);

    const center = vec2(0.5, 0.5);
    const growScale = pow(u.growScale, fpsScale);
    const scaledUV = div(screenUV.sub(center), growScale).add(center);

    const base = texture(velocitySampler, scaledUV).rg;
    const advectUV = scaledUV.sub(base.mul(u.advectionStrength).mul(fpsScale));

    let textureNoise = vec2(0);

    if (this.#noiseTexture) {
      const noiseUV = scaledUV.mul(ratio).mul(u.noiseScale);
      const noiseSampler = texture(this.#noiseTexture, noiseUV);
      textureNoise = noiseSampler.rg.sub(0.5).mul(u.noiseStrength);
    }

    const deformedUV = advectUV.add(textureNoise);

    const advected = texture(velocitySampler, deformedUV).rg;
    const blurred = texture(blurSampler, deformedUV).rg;

    const decayFactor = exp(negate(u.decay).mul(fpsScale));
    const mixed = mix(advected, blurred, u.blurStrength).mul(decayFactor);

    const outputVelocity = add(mixed, splat);

    this.#velocityPass.material.fragmentNode = vec4(outputVelocity, 0, 1);
  }

  /**
   * Render the flow simulation with substepping for stability.
   * @param {import('three/webgpu').WebGPURenderer} renderer 
   */
  render(renderer) {
    const u = this.#uniforms;
    const now = performance.now();

    if (this.#lastTime === undefined) {
      this.#lastTime = now;
      u.deltaTime.value = FLOW_FIXED_MS;

      return;
    }

    const rawDtMs = now - this.#lastTime;
    this.#lastTime = now;

    const frameDtMs = Number.isFinite(rawDtMs)
      ? Math.min(Math.max(rawDtMs, 0), 100)
      : FLOW_FIXED_MS;

    this.#accumMs += frameDtMs;

    let steps = 0;
    while (this.#accumMs >= FLOW_FIXED_MS && steps < FLOW_MAX_SUBSTEPS) {
      u.deltaTime.value = FLOW_FIXED_MS;
      this._render(renderer);
      this.#accumMs -= FLOW_FIXED_MS;
      steps += 1;
    }

    if (steps === FLOW_MAX_SUBSTEPS) {
      this.#accumMs = 0;
    }
  }

  /**
   * Internal render call for single step.
   * @param {import('three/webgpu').WebGPURenderer} renderer 
   */
  _render(renderer) {
    this.#quad.material = this.#blurPass.material;
    this.#blurPass.render(renderer, this.#quad.scene, this.#camera);

    this.#quad.material = this.#velocityPass.material;
    this.#velocityPass.render(renderer, this.#quad.scene, this.#camera);
  }

  /**
   * Clean up resources.
   */
  destroy() {
    this.#velocityPass.destroy();
    this.#blurPass.destroy();
    this.#noiseTexture?.dispose();
    this.#quad.destroy();
  }
}
