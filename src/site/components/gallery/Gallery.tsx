import * as React from 'react';
import styled from 'styled-components';
import { Gallery, photosPath, RaspiFile } from '../../../shared/settings/types';
import { useFetch } from '../common/hooks/useFetch';
import { Toolbar } from './Toolbar';

const GalleryContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  color: ${(p) => p.theme.Foreground};
  overflow-y: auto;
`;

const ImageContainer = styled.div`
  display: grid;
  margin: 0.2em;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-auto-flow: dense;
  grid-gap: 0.2em;
  justify-items: stretch;
  align-items: stretch;

  @media (max-width: 500px) {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  }
`;

interface ThumbnailProps {
  sizeCol: number;
  sizeRow: number;
}

const Thumbnail = styled.img`
  max-width: 100%;
  height: auto;
  object-fit: cover;
  flex: 1;
`;

const PreviewLink = styled.a<ThumbnailProps>`
  display: flex;
  grid-row-start: span ${(p) => p.sizeRow};
  grid-column-start: span ${(p) => p.sizeCol};
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5em;
`;

const Header = styled.div`
  font-size: ${(p) => p.theme.FontSize.l};
  font-weight: 300;
  margin: 1em 0.5em;
`;

const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'full',
} as Intl.DateTimeFormatOptions);

export const Main: React.FC = () => {
  const [gallery] = useFetch<Gallery>('/api/gallery', { files: [] });

  const groupedFiles = gallery.data.files.reduce<Record<string, RaspiFile[]>>((result, file) => {
    const date = dateTimeFormat.format(new Date(file.date || 0));
    const images = (result[date] = result[date] || []);
    images.push(file);
    return result;
  }, {});

  return (
    <GalleryContainer>
      <Toolbar />

      {Object.entries(groupedFiles).map(([date, files]) => (
        <Group key={date}>
          <Header>{date}</Header>
          <ImageContainer>
            {files.map((file, index) => (
              <PreviewLink
                sizeCol={index % 8 === 0 ? 2 : 1}
                sizeRow={index % 8 === 0 || index % 4 === 0 ? 2 : 1}
                key={file.base}
                target="_blank"
                rel="noreferrer"
                href={`${photosPath}/${file.base}`}
              >
                <Thumbnail src={`${photosPath}/${file.thumb}`} />
              </PreviewLink>
            ))}
          </ImageContainer>
        </Group>
      ))}
    </GalleryContainer>
  );
};
