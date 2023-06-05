import React from 'react';
import PieChart from '../../components/PieChart';
import { scaleOrdinal } from '@visx/scale';

function RoyaltiesChart() {
  const earnings = {
    'Apple Music': 1000,
    Youtube: 2000,
    Amazon: 3000,
    Spotify: 4000,
  };

  const percentageOfEarning = (val) => {
    if (!earnings) return;
    const totalEarnings = Object.values(earnings).reduce(
      (acc, curr) => acc + curr,
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
  ];

  const itemIdentifierKey = 'label';
  const itemValueKey = 'value';

  const colors = {
    Spotify: '#00ff00',
    'Apple Music': '#aab',
    Amazon: '#ffff00',
    Youtube: '#ff0000',
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
