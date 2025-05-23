import React from 'react';

interface ExtendedDocument extends Document {
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitFullscreenElement?: Element;
}

/**
 * Returns the fullscreen element
 */
const isDocumentFullscreen = (): boolean => {
  const curDocument = document as ExtendedDocument;

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
export const useFullscreen = (
  element: React.RefObject<HTMLElement | null>,
): [boolean, () => void] => {
  const [isFullscreen, setIsFullscreen] = React.useState(isDocumentFullscreen());

  const setFullscreen = () => {
    if (!element.current) return;

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
