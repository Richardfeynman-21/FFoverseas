import { PerspectiveCamera, Scene } from 'three';
import { uniform } from 'three/tsl';
import { WebGPURenderer } from 'three/webgpu';
import { Callbacks, onResize, vevet } from 'vevet';

/**
 * @typedef {Object} WebglProps
 * @property {number} [near=1] - Camera near plane.
 * @property {number} [far=10000] - Camera far plane.
 * @property {number} [fov] - Camera field of view.
 * @property {number} [perspective=2000] - Camera perspective (Z position).
 * @property {boolean} [render=true] - Whether to render automatically.
 */

/**
 * WebGL/WebGPU Manager class.
 * Handles renderer, camera, scene, and resize events.
 */
export class Webgl {
  /** @type {WebglProps} */
  #props;
  /** @type {HTMLCanvasElement} */
  #canvas;
  /** @type {PerspectiveCamera} */
  #camera;
  /** @type {WebGPURenderer} */
  #renderer;
  /** @type {Scene} */
  #scene;
  /** @type {Callbacks} */
  #callbacks;
  /** @type {Object} */
  #resizer;
  /** @type {number} */
  #width;
  /** @type {number} */
  #height;
  /** @type {import('three/tsl').UniformNode} */
  #aspectRatio;

  /**
   * @param {HTMLElement} container - The container element to append the canvas to.
   * @param {WebglProps} initProps - Initial properties for the manager.
   */
  constructor(container, initProps) {
    this._container = container;
    const defaultProps = {
      near: 1,
      far: 10000,
      render: true,
    };

    this.#props = { ...defaultProps, ...initProps };

    // Save initial sizes
    this.#width = this._container.offsetWidth;
    this.#height = this._container.offsetHeight;
    this.#aspectRatio = uniform(this.#width / this.#height);

    // Create canvas
    this.#canvas = document.createElement('canvas');
    this._container.appendChild(this.#canvas);

    // Create camera
    this.#camera = new PerspectiveCamera(
      this.fov,
      this.#aspectRatio.value,
      this.#props.near,
      this.#props.far,
    );
    this.#camera.position.set(0, 0, this.perspective);

    // Create renderer
    this.#renderer = new WebGPURenderer({
      ...this.#props,
      canvas: this.#canvas,
      antialias: true,
    });

    this.#renderer
      .init()
      .then(() => {
        this.#resizer = onResize({
          element: container,
          callback: () => this.resize(),
        });
      })
      .catch((err) => {
        console.error('WebGPU/WebGL Initialization failed:', err);
      });

    // Create scene
    this.#scene = new Scene();

    // Create callbacks
    this.#callbacks = new Callbacks();

    // Create an animation frame
    this.#renderer.setAnimationLoop(this.render.bind(this));
  }

  /** @returns {WebglProps} */
  get props() {
    return this.#props;
  }

  /** @returns {HTMLElement} */
  get container() {
    return this._container;
  }

  /** @returns {Callbacks} */
  get callbacks() {
    return this.#callbacks;
  }

  /** @returns {Scene} */
  get scene() {
    return this.#scene;
  }

  /** @returns {WebGPURenderer} */
  get renderer() {
    return this.#renderer;
  }

  /** @returns {PerspectiveCamera} */
  get camera() {
    return this.#camera;
  }

  /**
   * Resize the scene, camera and renderer.
   */
  resize() {
    this.#width = this._container.offsetWidth;
    this.#height = this._container.offsetHeight;
    this.#aspectRatio.value = this.#width / this.#height;

    this.#camera.fov = this.fov;
    this.#camera.aspect = this.#aspectRatio.value;
    this.#camera.position.set(0, 0, this.perspective);
    this.#camera.updateProjectionMatrix();

    this.#renderer.setSize(this.width, this.height);
    this.#renderer.setPixelRatio(Math.min(vevet.dpr, 2));

    this.#callbacks.emit('resize', undefined);

    this.render();
  }

  /** @returns {number} Renderer width */
  get width() {
    return this.#width;
  }

  /** @returns {number} Renderer height */
  get height() {
    return this.#height;
  }

  /** @returns {import('three/tsl').UniformNode} Aspect ratio uniform */
  get uAspectRatio() {
    return this.#aspectRatio;
  }

  /** @returns {number} Camera FOV */
  get fov() {
    const height = this._container.offsetHeight;
    const perspective = this.#props.perspective ?? 2000;

    return (
      this.#props.fov ||
      180 * ((2 * Math.atan(height / 2 / perspective)) / Math.PI)
    );
  }

  /** @returns {number} Camera perspective (Z position) */
  get perspective() {
    return this.#props.perspective ?? 2000;
  }

  /**
   * Render the scene.
   * Emits 'render' callback.
   */
  render() {
    if (!this.#renderer.initialized) {
      return;
    }

    this.#callbacks.emit('render', undefined);

    if (this.width > 0 && this.height > 0 && this.#props.render) {
      this.#renderer.render(this.#scene, this.#camera);
    }
  }

  /**
   * Destroy the manager and clean up resources.
   */
  destroy() {
    this.#renderer.setAnimationLoop(null);

    this.#resizer?.remove();
    this.#canvas.remove();

    this.#renderer.dispose();
    this.#callbacks.destroy();
  }
}
