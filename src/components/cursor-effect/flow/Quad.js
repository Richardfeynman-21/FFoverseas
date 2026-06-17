import { Mesh, PlaneGeometry, Scene } from 'three';
import { MeshBasicNodeMaterial } from 'three/webgpu';

/**
 * A simple full-screen quad for rendering effects and simulations.
 */
export class Quad {
  /** @type {PlaneGeometry} */
  #geometry = new PlaneGeometry(2, 2);
  /** @type {Mesh} */
  #mesh;
  /** @type {Scene} */
  #scene;
  /** @type {MeshBasicNodeMaterial} */
  #baseMaterial;

  constructor() {
    this.#baseMaterial = new MeshBasicNodeMaterial();

    this.#mesh = new Mesh(this.#geometry, this.#baseMaterial);
    this.#scene = new Scene();
    this.#scene.add(this.#mesh);
  }

  /** @returns {Mesh} The underlying mesh */
  get mesh() {
    return this.#mesh;
  }

  /** @param {import('three').Material} value - Set a new material for the quad */
  set material(value) {
    this.#mesh.material = value;
  }

  /** @returns {Scene} The scene containing only the quad */
  get scene() {
    return this.#scene;
  }

  /**
   * Clean up resources.
   */
  destroy() {
    this.#scene.remove(this.#mesh);
    this.#geometry.dispose();
    this.#baseMaterial.dispose();
  }
}
