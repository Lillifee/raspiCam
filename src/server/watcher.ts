import fs from 'fs';
import path from 'path';
import { RaspiFile, RaspiFileType, photosPath } from '../shared/settings/types';
import { curDirName } from './common';
import { createLogger } from './logger';
import { SettingsHelper } from './settings';
import { spawnSync } from 'child_process';

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

export const photosAbsPath = path.join(curDirName, photosPath);

export interface FileWatcher {
  getFiles: () => RaspiFile[];
  getLatestFile: () => RaspiFile | undefined;
  getPath: () => string;
  deleteFiles: (fileNames: string[]) => void;
}

export const createFileWatcher = (settingsHelper: SettingsHelper): FileWatcher => {
  let files: RaspiFile[] = [];

  if (!fs.existsSync(photosAbsPath)) {
    fs.mkdirSync(photosAbsPath);
  }

  const getPath = () => photosAbsPath;
  const getFiles = () => files;
  const getLatestFile = () => files[files.length - 1];
  const deleteFiles = (fileNames: string[]) =>
    fileNames.forEach((fileName) => {
      const file = files.find((x) => x.base === fileName);
      if (!file) return;

      try {
        logger.info('delete file', file.base);
        fs.unlinkSync(path.join(photosAbsPath, file.base));
        if (file.thumb) fs.unlinkSync(path.join(photosAbsPath, file.thumb));
        return false;
      } catch (err) {
        logger.error('failed to delete file', err);
        return true;
      }
    });

  const watchFile = (fileName: string | null) => {
    if (!fileName) return;
    const { name, base, ext } = path.parse(fileName);
    const type = fileTypes[ext.substring(1)];
    const file: RaspiFile = { name, base, ext, type, date: 0 };

    // Invalid type or thumbnail
    if (!type || isThumbnail(file)) return;
    const filePath = path.join(photosAbsPath, fileName);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        // File removed
        files = files.filter((x) => x.base !== fileName);
      } else {
        // File already exists
        if (files.findIndex((x) => x.base === file.base) >= 0) return;

        file.date = stats.ctime.getTime();
        if (settingsHelper.control.read().extractThumbnail) {
          extractThumbnail(file);
        }
        files.push(file);
      }
    });
  };

  fs.readdir(photosAbsPath, (err, files) => {
    if (err) logger.error('failed to read photo directory', err.message);
    files.forEach(watchFile);
  });

  fs.watch(photosAbsPath, {}, (_, fileName) => {
    watchFile(fileName);
  });

  return { getFiles, getLatestFile, getPath, deleteFiles };
};

const isThumbnail = (file: RaspiFile): boolean => file.name.includes(thumbnailExt);
const getThumbnailPath = (file: RaspiFile): string => `${file.name}${thumbnailExt}${file.ext}`;

const extractThumbnail = (file: RaspiFile) => {
  if (file.ext !== '.jpg') return;

  const thumbFile = getThumbnailPath(file);
  const thumbPath = path.join(photosAbsPath, thumbFile);
  const filePath = path.join(photosAbsPath, file.base);

  fs.access(thumbPath, (err) => {
    if (!err) {
      file.thumb = thumbFile;
      return;
    }

    const exiv = spawnSync(`exiv2`, ['-ep1', filePath]);

    if (exiv.status === 0) {
      file.thumb = thumbFile;
      logger.success('extracted thumbnail', thumbFile);
    } else {
      logger.warning('failed to extract thumbnail', file.base, exiv.error, exiv.output);
    }
  });
};
