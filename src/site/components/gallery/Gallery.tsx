import * as React from 'react';
import { styled } from 'styled-components';
import { RaspiGallery, RaspiFile } from '../../../shared/settings/types.js';
import { useFetch } from '../common/hooks/useFetch.js';
import { GalleryItem } from './GalleryItem.js';
import { Toolbar } from './Toolbar.js';

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
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5em;
`;

const Header = styled.div`
  font-size: ${(p) => p.theme.FontSize.l};
  font-weight: 300;
  /* top: 0px; */
  padding: 0.45em;
`;

const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'full',
} as Intl.DateTimeFormatOptions);

export const Gallery: React.FC = () => {
  const [gallery, , refresh] = useFetch<RaspiGallery>('/api/gallery', { files: [] });
  const [selectedFiles, setSelectFiles] = React.useState<string[]>([]);

  const groupedFiles = gallery.data.files
    .sort((a, b) => b.date - a.date)
    .reduce<Record<string, RaspiFile[]>>((result, file) => {
      const date = dateTimeFormat.format(new Date(file.date));
      const images = (result[date] = result[date] || []);
      images.push(file);
      return result;
    }, {});

  const toggleSelection = (fileBase: string) =>
    setSelectFiles((files) =>
      files.find((x) => x === fileBase)
        ? files.filter((x) => x !== fileBase)
        : [...files, fileBase],
    );

  const clearSelection = () => setSelectFiles([]);

  const deleteFiles = React.useCallback(() => {
    fetch('/api/gallery/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedFiles),
    })
      .finally(refresh)
      .catch((error) => console.error('Delete failed', error));

    clearSelection();
  }, [selectedFiles, refresh]);

  return (
    <GalleryContainer>
      <Toolbar
        showActions={selectedFiles.length > 0}
        deleteFiles={deleteFiles}
        clearSelection={clearSelection}
      />

      {Object.entries(groupedFiles).map(([date, files]) => (
        <Group key={date}>
          <Header>{date}</Header>
          <GroupContainer>
            {files.map((file) => (
              <GalleryItem
                key={file.base}
                file={file}
                selected={selectedFiles.includes(file.base)}
                toggleSelection={toggleSelection}
              />
            ))}
          </GroupContainer>
        </Group>
      ))}
    </GalleryContainer>
  );
};
