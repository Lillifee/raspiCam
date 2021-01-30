import React from 'react';

/**
 * Returns the fullscreen element
 */
const isDocumentFullscreen = (): boolean => {
  const curDocument = document as any;

  if (typeof curDocument.fullscreenElement !== 'undefined') {
    return curDocument.fullscreenElement != null;
  } else if (typeof curDocument.mozFullScreenElement !== 'undefined') {
    return curDocument.mozFullScreenElement != null;
  } else if (typeof curDocument.msFullscreenElement !== 'undefined') {
    return curDocument.msFullscreenElement != null;
  } else if (typeof curDocument.webkitFullscreenElement !== 'undefined') {
    return curDocument.webkitFullscreenElement != null;
  }

  return false;
};

/**
 * Hook to determine and request full screen
 *
 * @param {React.RefObject<HTMLDivElement>} element fullscreen element
 * @return isFullscreen: boolean, setFullScreen: () => void
 */
export const useFullscreen = (element: React.RefObject<HTMLElement>): [boolean, () => void] => {
  const [isFullscreen, setIsFullscreen] = React.useState(isDocumentFullscreen());

  const setFullscreen = () => {
    if (element.current == null) return;

    element.current
      .requestFullscreen()
      .then(() => setIsFullscreen(isDocumentFullscreen))
      .catch(() => setIsFullscreen(false));
  };

  React.useLayoutEffect(() => {
    document.onfullscreenchange = () => setIsFullscreen(isDocumentFullscreen);

    return () => {
      document.onfullscreenchange = null;
    };
  });

  return [isFullscreen, setFullscreen];
};
