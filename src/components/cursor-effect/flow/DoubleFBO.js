import { HalfFloatType, RenderTarget } from 'three';
import { uniformTexture } from 'three/tsl';
import { MeshBasicNodeMaterial } from 'three/webgpu';

/**
 * Double Frame Buffer Object for ping-pong rendering.
 * Useful for simulations where the next state depends on the previous state.
 */
export class DoubleFBO {
  /** @type {RenderTarget} */
  #targetA;
  /** @type {RenderTarget} */
  #targetB;
  /** @type {RenderTarget} */
  #read;
  /** @type {RenderTarget} */
  #write;
  /** @type {import('three/tsl').UniformNode} */
  #sampler;
  /** @type {MeshBasicNodeMaterial} */
  #material;

  /**
   * @param {number} resolution - The resolution of the FBO.
   */
  constructor(resolution) {
    const type = HalfFloatType;

    this.#targetA = new RenderTarget(resolution, resolution, {
      depthBuffer: false,
      stencilBuffer: false,
      type,
    });

    this.#targetB = new RenderTarget(resolution, resolution, {
      depthBuffer: false,
      stencilBuffer: false,
      type,
    });

    this.#read = this.#targetA;
    this.#write = this.#targetB;

    this.#sampler = uniformTexture(this.#read.texture);

    this.#material = new MeshBasicNodeMaterial();
  }

  /** @returns {import('three/tsl').UniformNode} The current read sampler */
  get sampler() {
    return this.#sampler;
  }

  /** @returns {MeshBasicNodeMaterial} The material used for rendering to this FBO */
  get material() {
    return this.#material;
  }

  /**
   * Swaps read and write buffers.
   */
  #swap() {
    const save = this.#read;
    this.#read = this.#write;
    this.#write = save;
  }

  /**
   * Renders the scene to the write buffer and swaps.
   * @param {import('three/webgpu').WebGPURenderer} renderer 
   * @param {import('three').Scene} scene 
   * @param {import('three').Camera} camera 
   */
  render(renderer, scene, camera) {
    this.#sampler.value = this.#read.texture;

    renderer.setRenderTarget(this.#write);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);

    this.#swap();
  }

  /**
   * Clean up resources.
   */
  destroy() {
    this.#targetA.dispose();
    this.#targetB.dispose();
    this.#material.dispose();
  }
}
