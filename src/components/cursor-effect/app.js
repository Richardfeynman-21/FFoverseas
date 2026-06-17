import {
  PlaneGeometry,
  Color,
  CanvasTexture,
  LinearFilter,
  SRGBColorSpace,
  Mesh,
} from 'three';
import {
  pass,
  texture,
  uniform,
} from 'three/tsl';
import { RenderPipeline, MeshBasicNodeMaterial } from 'three/webgpu';
import { Canvas } from 'vevet';

import { Flow } from './flow';
import { createGUI } from './gui.js';
import { Pointer } from './pointer.js';
import { Webgl } from './webgl.js';
import { settings, guiSchema, folderLabels } from './config.js';
import { createOutputNode } from './material-nodes.js';

/**
 * Main Application Module.
 * Initializes the WebGL/WebGPU scene, fluid simulation, and UI.
 */
export function initCursorEffect(container) {
  // Check if device is mobile for performance optimization
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

  /**
   * Initialize WebGL Manager
   */
  const webgl = new Webgl(container, {
    near: 0.01,
    far: 5000,
    fov: 75,
    perspective: 10,
    render: false,
  });

  /**
   * GUI Initialization
   */
  const { gui, onChange } = createGUI({ settings, schema: guiSchema, folderLabels });

  webgl.scene.background = new Color(settings.scene.background);
  onChange(() => {
    webgl.scene.background.set(settings.scene.background);
  });

  const renderPipeline = new RenderPipeline(webgl.renderer);

  /**
   * Fluid Flow Simulation Initialization
   */
  const flowInstance = new Flow({
    name: 'Flow',
    resolution: isMobile ? 256 : 512, // Original resolution parameters
    blurDownscale: 2,
    uAspectRatio: webgl.uAspectRatio,
    noiseSrc: '/HDR_LA_0.png', // Vite loaded from public folder
    settings: settings.flow,
  });

  onChange(() => flowInstance.updateUniforms());

  /**
   * Interaction Handling
   */
  const pointer = new Pointer();

  webgl.callbacks.on('render', () => {
    const rect = container.getBoundingClientRect();
    const { width, height } = rect;

    pointer.update(settings.pointer.ease);

    // Remapping coordinates to UV space (0 to 1)
    const { x: pointerX, y: pointerY } = pointer.targetCoords;
    const x = (pointerX - rect.left) / width;
    const y = (pointerY - rect.top) / height;

    flowInstance.setPointer(
      x,
      y,
      pointer.velocity.x / width,
      pointer.velocity.y / height,
    );

    flowInstance.render(webgl.renderer);
    renderPipeline.render();
  });

  /**
   * Shader Uniforms
   */
  const uSceneDistortion = uniform(settings.scene.distortion);
  const uRgbFrequency = uniform(settings.rgb.frequency);
  const uRgbStrength = uniform(settings.rgb.strength);
  const uRgbMix = uniform(settings.rgb.mix);
  const uLiquidColor = uniform(settings.liquid.color);
  const uAaberrationStrength = uniform(settings.aberration.strength);

  onChange(() => {
    uSceneDistortion.value = settings.scene.distortion;
    uRgbFrequency.value = settings.rgb.frequency;
    uRgbStrength.value = settings.rgb.strength;
    uRgbMix.value = settings.rgb.mix;
    uLiquidColor.value = settings.liquid.color;
    uAaberrationStrength.value = settings.aberration.strength;
  });

  /**
   * Post-Processing / Shaders
   */
  const flowTextureNode = texture(flowInstance.texture);
  const scenePass = pass(webgl.scene, webgl.camera).getTextureNode();

  renderPipeline.outputNode = createOutputNode({
    flowTexture: flowTextureNode,
    scenePass,
    uRgbFrequency,
    uRgbStrength,
    uRgbMix,
    uLiquidColor,
    uAaberrationStrength,
    uSceneDistortion,
  });

  /**
   * Text Overlay with Canvas2D
   */
  const font = `'Inter', system-ui, sans-serif`;
  const text = 'FLOW';

  const canvas = new Canvas({
    width: 800,
    height: 400,
    dpr: 2,
    append: false,
    onResize: (_data, { ctx, dpr, width, height }) => {
      ctx.save();
      ctx.clearRect(0, 0, width, height);

      ctx.font = `500 ${64 * dpr}px ${font}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = `${12 * dpr}px`;

      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = `#${settings.text.color.getHexString()}`;
      ctx.fillText(text, cx, cy);

      ctx.restore();
    },
  });

  const map = new CanvasTexture(canvas.canvas);
  map.colorSpace = SRGBColorSpace;
  map.minFilter = LinearFilter;
  map.magFilter = LinearFilter;
  map.needsUpdate = true;

  const planeRatio = canvas.width / canvas.height;
  const planeWidth = 2.2;

  const helloPlane = new Mesh(
    new PlaneGeometry(planeWidth, planeWidth / planeRatio, 1, 1),
    new MeshBasicNodeMaterial({ colorNode: texture(map), transparent: true }),
  );

  helloPlane.position.set(0, 0, 6.2);
  webgl.scene.add(helloPlane);

  onChange(() => {
    canvas.resize();
    map.needsUpdate = true;
  });

  // Initial trigger
  canvas.resize();
  map.needsUpdate = true;

  return {
    destroy: () => {
      pointer.destroy();
      flowInstance.destroy();
      gui.destroy();
      canvas.destroy();
      map.dispose();
      helloPlane.geometry.dispose();
      helloPlane.material.dispose();
      webgl.destroy();
    }
  };
}
