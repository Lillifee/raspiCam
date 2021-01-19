import * as React from 'react';
import styled from 'styled-components';

const Container = styled.section`
  flex: 1;
  flex-direction: column;
  display: flex;
`;

export const useFetchImage = (url: RequestInfo): [Blob | undefined, () => Promise<void>] => {
  const [image, setImage] = React.useState<Blob>();

  const fetchData = React.useCallback(async () => {
    await fetch(url)
      .then(async (res) => setImage(await res.blob()))
      .catch((error) => {
        console.error(error);
      });
  }, []);

  React.useEffect(() => {
    fetchData();
    // return () => abort.current.abort();
  }, [fetchData]);

  return [image, fetchData];
};

export const Preview: React.FC = () => {
  //   const [image, refresh] = useFetchImage('/api/photo');
  const [time, setTime] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      Preview
      {/* <img src="/api/photo" /> */}
      <img key={Date.now()} src={`/api/live.jpg?${time}`} />
    </Container>
  );
};
