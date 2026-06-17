import { Color } from 'three';

/**
 * Global settings for the application.
 */
export const settings = {
  pointer: {
    ease: 0.2,
  },
  flow: {
    radius: 0.02,
    strength: 1,
    decay: 0.00242,
    growScale: 1,
    advectionStrength: 0.007,
    blurStrength: 0.35,
    blurRadius: 1,
    noiseStrength: 0.002,
    noiseScale: 3,
  },
  rgb: {
    frequency: 10,
    strength: 0.5,
    mix: 0.15,
  },
  liquid: {
    color: new Color(0.98, 0.985, 1.0),
  },
  aberration: {
    strength: 0.02,
  },
  scene: {
    distortion: 0.015,
    background: new Color('#f0f1fa'),
  },
  text: {
    color: new Color('#141419'),
  },
};

/**
 * GUI Schema for lil-gui.
 */
export const guiSchema = {
  pointer: {
    ease: { min: 0.05, max: 0.3, step: 0.00001, label: 'Cursor Easing' },
  },
  flow: {
    radius: { min: 0.0075, max: 0.04, step: 0.00001, label: 'Splat Radius' },
    strength: { min: 0.1, max: 2, step: 0.00001, label: 'Flow Strength' },
    decay: { min: 0, max: 0.1, step: 0.00001, label: 'Velocity Decay' },
    advectionStrength: { min: 0, max: 0.01, step: 0.00001, label: 'Advection' },
    blurStrength: { min: 0, max: 1, step: 0.00001, label: 'Blur Intensity' },
    blurRadius: { min: 0, max: 10, step: 0.01, label: 'Blur Radius' },
    noiseStrength: { min: 0, max: 0.01, step: 0.00001, label: 'Turbulence' },
    noiseScale: { min: 0.25, max: 3, step: 0.00001, label: 'Noise Scale' },
  },
  rgb: {
    frequency: { min: 0, max: 30, step: 1, label: 'Color Shift Freq' },
    strength: { min: 0, max: 3, step: 0.00001, label: 'Color Intensity' },
    mix: { min: 0, max: 1, step: 0.00001, label: 'Blend Factor' },
  },
  liquid: {
    color: { label: 'Liquid Tint' },
  },
  scene: {
    distortion: { min: 0, max: 0.05, step: 0.00001, label: 'Refraction' },
    background: { label: 'Background Color' },
  },
};

/**
 * Folder labels for the GUI.
 */
export const folderLabels = {
  pointer: 'Interaction',
  flow: 'Simulation',
  rgb: 'Chromatic Effects',
  liquid: 'Material',
  scene: 'Environment',
};
