import * as React from 'react';
import { styled, css } from 'styled-components';
import { RaspiFile, photosPath } from '../../../shared/settings/types.js';
import { Icon } from '../common/Icon.js';
import { ButtonIcon } from '../styled/ButtonIcon.js';

const SelectButton = styled(ButtonIcon)`
  padding: 0.5em;
  border-radius: 1.5em;
  position: absolute;
  top: 0.2em;
  left: 0.2em;
`;

const Thumbnail = styled.img`
  max-width: 100%;
  height: auto;
  object-fit: cover;
  flex: 1;
`;

const Shadow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  box-shadow: inset 0px 2em 2em 0px black;
  opacity: 0;
`;

export const PreviewContainerHover = css`
  ${Shadow} {
    opacity: 0.5;
  }
`;

export const PreviewContainerSelected = css`
  ${Shadow} {
    opacity: 0.5;
  }
  ${SelectButton} {
    opacity: 1;
    color: ${(props) => props.theme.PrimaryBackground};
    fill: ${(props) => props.theme.PrimaryBackground};
  }
  ${Thumbnail} {
    filter: brightness(0.6);
  }
`;

const PreviewContainer = styled.div<{ $selected: boolean }>`
  flex: 1;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80px;
  fill: ${(p) => p.theme.Foreground};
  background: ${(p) => p.theme.LayerBackground};

  &:hover {
    ${PreviewContainerHover}
  }

  ${({ $selected }) => $selected && PreviewContainerSelected}
`;

const FallbackIcon = styled.div`
  margin: 0.2em;
`;

const FallbackText = styled.div`
  margin: 0.2em;
  color: ${({ theme }) => theme.Foreground};
  font-size: ${({ theme }) => theme.FontSize.s};
`;

const PreviewLink = styled.a`
  display: flex;
  text-decoration: none;
`;

export interface GalleryItemProps {
  file: RaspiFile;
  selected: boolean;
  toggleSelection: (fileBase: string) => void;
}

export const GalleryItem: React.FC<GalleryItemProps> = ({ file, selected, toggleSelection }) => (
  <PreviewLink target="_blank" rel="noreferrer" href={`${photosPath}/${file.base}`}>
    <PreviewContainer $selected={selected}>
      {file.thumb ? (
        <Thumbnail src={`${photosPath}/${file.thumb || ''}`} />
      ) : (
        <React.Fragment>
          <FallbackIcon>
            <Icon type={file.type === 'VIDEO' ? 'Video' : 'Photo'} />
          </FallbackIcon>
          <FallbackText>{file.base}</FallbackText>
        </React.Fragment>
      )}

      <Shadow />
      <SelectButton
        type={selected ? 'Checked' : 'Unchecked'}
        onClick={(e) => {
          toggleSelection(file.base);
          e.preventDefault();
        }}
      />
    </PreviewContainer>
  </PreviewLink>
);
