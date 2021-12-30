import * as React from 'react';
import styled from 'styled-components';
import { RaspiGallery, RaspiFile, photosPath } from '../../../shared/settings/types';
import { useFetch } from '../common/hooks/useFetch';
import { Icon } from '../common/Icon';
import { Toolbar } from './Toolbar';

const GalleryContainer = styled.div`
  flex: 1;
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  color: ${(p) => p.theme.Foreground};
  background: ${(p) => p.theme.Background};
`;

const GroupContainer = styled.div`
  display: grid;
  margin: 0.5em 0.2em;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  grid-auto-flow: dense;
  grid-gap: 0.2em;
  justify-items: stretch;
  align-items: stretch;

  @media (max-width: 500px) {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  }
`;

const Thumbnail = styled.img`
  max-width: 100%;
  height: auto;
  object-fit: cover;
  flex: 1;
`;

const PreviewContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80px;
  fill: ${(p) => p.theme.Foreground};
  background: ${(p) => p.theme.LayerBackground};
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

const Group = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5em;
`;

const Header = styled.div`
  font-size: ${(p) => p.theme.FontSize.l};
  font-weight: 300;
  position: sticky;
  top: 0px;
  margin: 0 1.5em;
  padding: 0.45em;
`;

const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'full',
} as Intl.DateTimeFormatOptions);

export const Gallery: React.FC = () => {
  const [gallery] = useFetch<RaspiGallery>('/api/gallery', { files: [] });

  const groupedFiles = gallery.data.files
    .sort((a, b) => b.date - a.date)
    .reduce<Record<string, RaspiFile[]>>((result, file) => {
      const date = dateTimeFormat.format(new Date(file.date));
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
          <GroupContainer>
            {files.map((file) => (
              <PreviewLink
                key={file.base}
                target="_blank"
                rel="noreferrer"
                href={`${photosPath}/${file.base}`}
              >
                <PreviewContainer>
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
                </PreviewContainer>
              </PreviewLink>
            ))}
          </GroupContainer>
        </Group>
      ))}
    </GalleryContainer>
  );
};
