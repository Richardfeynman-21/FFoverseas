import GUI from 'lil-gui';
import { Color } from 'three';

/**
 * Converts a Three.js Color to a Hex string.
 * @param {Color} color 
 * @returns {string}
 */
function colorToHex(color) {
  return `#${color.getHexString()}`;
}

/**
 * Creates a GUI for controlling application settings.
 * @param {Object} params
 * @param {Object} params.settings - The settings object to bind to.
 * @param {Object} params.schema - The GUI schema defining ranges and labels.
 * @param {Object} [params.folderLabels={}] - Custom labels for folders.
 * @returns {Object} { gui, settings, onChange }
 */
export function createGUI({ settings, schema, folderLabels = {} }) {
  const gui = new GUI({ title: 'Controls' });
  gui.close();

  const onChangeArray = [];

  /**
   * Triggers all registered onChange callbacks.
   */
  const onChange = () => onChangeArray.forEach((fn) => fn());

  // Add settings
  const folderKeys = Object.keys(schema);
  folderKeys.forEach((folderName) => {
    const folderLabel = folderLabels[folderName] || folderName;
    const folder = gui.addFolder(folderLabel);
    const refFolder = settings[folderName];

    const settingsKeys = Object.keys(schema[folderName]);
    settingsKeys.forEach((settingsName) => {
      const guiKey = settingsName;

      const initialValue = settings[folderName][settingsName];
      const settingsFolder = schema[folderName][settingsName];

      if (initialValue instanceof Color) {
        const helper = { color: colorToHex(initialValue) };

        folder
          .addColor(helper, 'color')
          .name(settingsFolder.label || guiKey)
          .onChange((val) => {
            const color = new Color(val);
            settings[folderName][settingsName].copy(color);
            onChange();
          });

        return;
      }

      if (typeof initialValue === 'boolean') {
        folder
          .add(refFolder, guiKey)
          .name(settingsFolder.label || guiKey)
          .onChange(onChange);
      }

      if (typeof initialValue === 'number') {
        folder
          .add(
            refFolder,
            guiKey,
            (settingsFolder.min !== undefined ? settingsFolder.min : 0) ?? 0,
            (settingsFolder.max !== undefined ? settingsFolder.max : 1) ?? 1,
            settingsFolder.step,
          )
          .name(settingsFolder.label || guiKey)
          .onChange(onChange);
      }
    });
  });

  return {
    gui,
    settings,
    /**
     * Registers a callback for when settings change.
     * @param {Function} fn 
     */
    onChange: (fn) => {
      onChangeArray.push(fn);
    },
  };
}
