import {
  clamp,
  length,
  mix,
  negate,
  sin,
  texture,
  uv,
  vec3,
  vec4,
} from 'three/tsl';

/**
 * Creates the TSL output node for the scene.
 * @param {Object} params
 * @param {import('three/tsl').TextureNode} params.flowTexture
 * @param {import('three/tsl').TextureNode} params.scenePass
 * @param {import('three/tsl').UniformNode} params.uRgbFrequency
 * @param {import('three/tsl').UniformNode} params.uRgbStrength
 * @param {import('three/tsl').UniformNode} params.uRgbMix
 * @param {import('three/tsl').UniformNode} params.uLiquidColor
 * @param {import('three/tsl').UniformNode} params.uAaberrationStrength
 * @param {import('three/tsl').UniformNode} params.uSceneDistortion
 * @returns {import('three/tsl').Node} The final output node.
 */
export function createOutputNode({
  flowTexture,
  scenePass,
  uRgbFrequency,
  uRgbStrength,
  uRgbMix,
  uLiquidColor,
  uAaberrationStrength,
  uSceneDistortion,
}) {
  const flowDirection = flowTexture.rg;
  const remapSin = (x) => sin(x).mul(0.5).add(0.5);

  const rgbPhase = length(clamp(flowDirection, -2, 2)).mul(-0.15);
  const phase = rgbPhase.mul(uRgbFrequency.mul(Math.PI));
  const rgb = vec3(
    remapSin(phase.add(0)),
    remapSin(phase.add(2)),
    remapSin(phase.add(4)),
  );
  const rgbStrength = length(flowDirection).mul(uRgbStrength);
  const liquidColor = mix(uLiquidColor, rgb, uRgbMix);

  const caStrength = rgbStrength.mul(uAaberrationStrength).mul(uSceneDistortion);
  const caOffset = flowDirection.mul(caStrength);

  const uvOffset = flowDirection
    .mul(negate(uSceneDistortion))
    .mul(length(liquidColor));
  const sceneUV = uv().add(uvOffset);
  const sceneColor = texture(scenePass, sceneUV);

  const caR = texture(scenePass, sceneUV.add(caOffset)).r;
  const caG = texture(scenePass, sceneUV.sub(caOffset)).g;
  const caB = texture(scenePass, sceneUV.sub(caOffset)).b;
  const caColor = vec4(vec3(caR, caG, caB), sceneColor.a);
  const output = mix(caColor, liquidColor, rgbStrength);

  return vec4(output.rgb, 1);
}
