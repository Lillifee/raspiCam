import { booleanSetting } from './helper';
import { Setting } from './types';

/**
 * Preview settings
 * https://www.raspberrypi.org/documentation/raspbian/applications/camera.md
 */
export const previewSettingDesc = {
  /**
   * Do not display a preview window
   * Disables the preview window completely. Note that even though the preview is disabled,
   * the camera will still be producing frames, so will be using power.
   */
  nopreview: booleanSetting('No preview', true),

  /**
   * Fullscreen preview mode
   * Forces the preview window to use the whole screen.
   * Note that the aspect ratio of the incoming image will be retained, so there may be bars on some edges.
   */
  fullscreen: booleanSetting('Fullscreen', false),

  /**
   * Preview window settings <'x,y,w,h'>
   * Allows the user to define the size of the preview window and its location on the screen.
   * Note this will be superimposed over the top of any other windows/graphics.
   */
  //   preview: string;
};

export type PreviewSettingDesc = typeof previewSettingDesc;
export type PreviewSetting = Setting<PreviewSettingDesc>;
