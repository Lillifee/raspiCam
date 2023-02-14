import * as React from 'react';
import styled from 'styled-components';
import { abbreviateNumber, roundToSignificant } from '../../../shared/helperFunctions.js';

import { PlayerStats } from './stats.js';

// #region styled

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  background-color: ${(p) => p.theme.SubLayerBackground};
  color: ${(p) => p.theme.Foreground};
  font-size: ${(p) => p.theme.FontSize.s};
  margin: 1em;
  padding: 1em;
  border-radius: 0.4em;
  right: 0px;
  bottom: 0px;
`;

const Row = styled.div`
  display: flex;
`;

// #endregion

export interface Props {
  loading: boolean;
  stats: PlayerStats;
}

/**
 * Player to display the live stream
 */
export const PlayerStatistics: React.FC<Props> = ({ loading, stats }) => (
  <Container>
    <Row>average speed: {abbreviateNumber('bit/s')(roundToSignificant(stats.avgSize, 2))}</Row>
    <Row>frames per second: {stats.avgFps}</Row>
    <Row>dropped frames: {stats.totalDroppedFrames}</Row>
    {loading && <Row>loading</Row>}
    {!stats.playerRunning && <Row>player not running</Row>}
    {!stats.streamRunning && <Row>stream not running</Row>}
    {stats.droppingFrames && <Row>dropping frames</Row>}
  </Container>
);
