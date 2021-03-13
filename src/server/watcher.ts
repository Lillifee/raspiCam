import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { photosPath, RaspiFile, RaspiFileType } from '../shared/settings/types';
import { createLogger } from './logger';

const logger = createLogger('watcher');

const thumbnailExt = '-preview1';

const fileTypes: { [ext: string]: RaspiFileType } = {
  jpg: 'IMAGE',
  bmp: 'IMAGE',
  gif: 'IMAGE',
  png: 'IMAGE',
  h264: 'VIDEO',
  mjpeg: 'VIDEO',
};

export const photosAbsPath = path.join(__dirname, photosPath);

export interface FileWatcher {
  getFiles: () => RaspiFile[];
  getLatestFile: () => RaspiFile | undefined;
  getPath: () => string;
}

export const fileWatcher = (): FileWatcher => {
  let files: RaspiFile[] = [];

  if (!fs.existsSync(photosAbsPath)) {
    fs.mkdirSync(photosAbsPath);
  }

  const getPath = () => photosAbsPath;
  const getFiles = () => files;
  const getLatestFile = () => files[files.length - 1];

  fs.watch(photosAbsPath, {}, (_, fileName) => {
    const { name, base, ext } = path.parse(fileName);
    const type = fileTypes[ext.substring(1)];
    const file: RaspiFile = { name, base, ext, type };
    if (!type || isThumbnail(file)) return;

    const filePath = path.join(photosAbsPath, fileName);
    fs.access(filePath, (err) => {
      if (err) {
        logger.warning('remove file', fileName);
        files = files.filter((x) => x.base === fileName);
      } else {
        extractThumbnail(file);
        files.push(file);
      }
    });
  });

  return { getFiles, getLatestFile, getPath };
};

const isThumbnail = (file: RaspiFile): boolean => file.name.includes(thumbnailExt);

const extractThumbnail = (file: RaspiFile) => {
  if (file.ext === '.jpg') {
    const thumbFile = `${file.name}${thumbnailExt}${file.ext}`;
    const thumbPath = path.join(photosAbsPath, thumbFile);
    const filePath = path.join(photosAbsPath, file.base);

    fs.access(thumbPath, (err) => {
      if (!err) return;

      exec(`exiv2 -ep1 ${filePath}`, (err) => {
        if (err) {
          logger.warning('failed to extract thumbnail', file.base);
        } else {
          file.thumb = thumbFile;
          logger.success('extracted thumbnail', thumbFile);
        }
      });
    });
  }
};
