import * as React from 'react';
import styled from 'styled-components';
import { GridLineType } from '../../../shared/settings/types';

//#region styled

const GridContainerBase = styled.div`
  display: grid;
  grid-gap: 1px;
  position: absolute;
  margin: -1px;
  width: 100%;
  height: 100%;
`;

const Grid3x3Container = styled(GridContainerBase)`
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);
`;

const Grid4x4Container = styled(GridContainerBase)`
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(4, 1fr);
`;

const GridGoldenRatioContainer = styled(GridContainerBase)`
  grid-template-rows: 1fr 0.618fr 1fr;
  grid-template-columns: 1fr 0.618fr 1fr;
`;

const GridBox = styled.div`
  border: 1px solid ${(p) => p.theme.Border};
  opacity: 0.3;
  width: 100%;
  height: 100%;
`;

//#endregion

export interface Props {
  type?: GridLineType;
}

export const GridLines: React.FC<Props> = ({ type }) => (
  <React.Fragment>
    {type === '3x3' && (
      <Grid3x3Container>
        {Array.from(Array(9)).map((_, i) => (
          <GridBox key={i} />
        ))}
      </Grid3x3Container>
    )}

    {type === '4x4' && (
      <Grid4x4Container>
        {Array.from(Array(16)).map((_, i) => (
          <GridBox key={i} />
        ))}
      </Grid4x4Container>
    )}

    {type === 'golden ratio' && (
      <GridGoldenRatioContainer>
        {Array.from(Array(9)).map((_, i) => (
          <GridBox key={i} />
        ))}
      </GridGoldenRatioContainer>
    )}
  </React.Fragment>
);
