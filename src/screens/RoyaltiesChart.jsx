import React from 'react';
import PieChart from '../../components/PieChart';
import { scaleOrdinal } from '@visx/scale';

const useQuery = () => new URLSearchParams(window.location.search);

function RoyaltiesChart() {
  const defaultQuery = {
    appleMusic: '2000',
    youtube: '1500',
    amazon: '2000',
    spotify: '4000',
    deezer: '1000',
  };

  const query = useQuery();

  const earnings = {
    'Apple Music': query.get('appleMusic') || defaultQuery.appleMusic,
    Youtube: query.get('youtube') || defaultQuery.youtube,
    Amazon: query.get('amazon') || defaultQuery.amazon,
    Spotify: query.get('spotify') || defaultQuery.spotify,
    Deezer: query.get('deezer') || defaultQuery.deezer,
  };

  const percentageOfEarning = (val) => {
    if (!earnings) return;

    const totalEarnings = Object.values(earnings).reduce(
      (acc, curr) => Number(acc) + Number(curr),
      0
    );

    const percentage = (val / totalEarnings) * 100;

    return percentage;
  };

  const data = [
    {
      label: 'Apple Music',
      value: percentageOfEarning(earnings['Apple Music']),
    },
    { label: 'Youtube', value: percentageOfEarning(earnings['Youtube']) },
    { label: 'Amazon', value: percentageOfEarning(earnings['Amazon']) },
    { label: 'Spotify', value: percentageOfEarning(earnings['Spotify']) },
    { label: 'Deezer', value: percentageOfEarning(earnings['Deezer']) },
  ];

  const itemIdentifierKey = 'label';
  const itemValueKey = 'value';

  const colors = {
    Spotify: '#00BF55',
    'Apple Music': '#2F2F2F',
    Amazon: '#FCBD00',
    Youtube: '#FD0002',
    Deezer: '#7E027E',
  };

  const getMyColor = scaleOrdinal({
    domain: Object.keys(colors),
    range: Object.values(colors),
  });

  const getColor = ({ data }) => {
    const { label } = data;
    return getMyColor(label);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <>
        <PieChart
          getColor={getColor}
          width={500}
          height={500}
          data={data}
          itemIdentifierKey={itemIdentifierKey}
          itemValueKey={itemValueKey}
        />
      </>
    </main>
  );
}

export default RoyaltiesChart;
