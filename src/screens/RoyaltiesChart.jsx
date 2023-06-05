import React, { useState } from 'react';
import PieChart from '../../components/PieChart';
import { scaleOrdinal } from '@visx/scale';
import { currencyFormatter } from '../../utils/currency';
import { useQuery } from '../../hooks/useQuery.hook';

function RoyaltiesChart() {
  const [selectedElement, setSelectedElement] = useState(null);

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
        flexDirection: 'column',
      }}>
      <>
        <PieChart
          getColor={getColor}
          width={500}
          height={500}
          data={data}
          onItemSelect={(item) => {
            setSelectedElement(item);
            // send message to react native webview
            window.ReactNativeWebView.postMessage(
              JSON.stringify({
                label: item.label,
                percentage: item.value,
                earnings: Number(earnings[item.label]).toFixed(2),
                earningsFormatted: currencyFormatter.format(
                  earnings[item.label]
                ),
                type: 'pieSliceSelected',
              })
            );
          }}
          itemIdentifierKey={itemIdentifierKey}
          itemValueKey={itemValueKey}
        />
        {selectedElement && (
          <h1>{currencyFormatter.format(earnings[selectedElement.label])}</h1>
        )}
      </>
    </main>
  );
}

export default RoyaltiesChart;
