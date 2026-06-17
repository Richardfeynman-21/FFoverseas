import { HalfFloatType, RenderTarget } from 'three';
import { uniformTexture } from 'three/tsl';
import { MeshBasicNodeMaterial } from 'three/webgpu';

/**
 * Single Frame Buffer Object for off-screen rendering.
 */
export class SingleFBO {
  /** @type {RenderTarget} */
  #target;
  /** @type {import('three/tsl').UniformNode} */
  #sampler;
  /** @type {MeshBasicNodeMaterial} */
  #material;

  /**
   * @param {number} resolution - The resolution of the FBO.
   */
  constructor(resolution) {
    this.#material = new MeshBasicNodeMaterial();

    this.#target = new RenderTarget(resolution, resolution, {
      depthBuffer: false,
      stencilBuffer: false,
      type: HalfFloatType,
    });

    this.#sampler = uniformTexture(this.#target.texture);
  }

  /** @returns {import('three').Texture} The underlying texture */
  get texture() {
    return this.#target.texture;
  }

  /** @returns {import('three/tsl').UniformNode} The uniform sampler */
  get sampler() {
    return this.#sampler;
  }

  /** @returns {MeshBasicNodeMaterial} The material used for rendering to this FBO */
  get material() {
    return this.#material;
  }

  /**
   * Renders the scene to the buffer.
   * @param {import('three/webgpu').WebGPURenderer} renderer 
   * @param {import('three').Scene} scene 
   * @param {import('three').Camera} camera 
   */
  render(renderer, scene, camera) {
    this.#sampler.value = this.texture;
    renderer.setRenderTarget(this.#target);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
  }

  /**
   * Clean up resources.
   */
  destroy() {
    this.#target.dispose();
    this.#material.dispose();
  }
}
