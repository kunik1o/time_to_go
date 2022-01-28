import React, { useEffect, useState } from 'react';
import './App.css';
import dayjs from 'dayjs';
import relativeTime from '../node_modules/dayjs/plugin/relativeTime.js';

dayjs.extend(relativeTime);

const busTable = {
  home_to_comp: [
    '0627',
    '0652',
    '0717',
    '0738',
    '0753',

    '0813',
    '0833',
    '0853',
    '0913',
    '0932',

    '0952',
    '1022',
    '1052',
    '1122',
    '1152',

    '1227',
    '1302',
    '1337',
    '1412',
    '1447',

    '1522',
    '1557',
    '1623',
    '1648',
    '1713',

    '1738',
    '1803',
    '1828',
    '1852',
    '1917',

    '1942',
    '2002',
  ],
};

const App = () => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [timeStr2, setTimeStr2] = useState<string>('');
  const [today, setToday] = useState<string>('');
  const [isWorkDay, setIsWorkDay] = useState<number>(1);
  setTimeout(() => {
    setTimeStr(() => getNextTime(busTable.home_to_comp));
    setTimeStr2(() => getNextTime(busTable.home_to_comp, 1));
    setToday(() => dayjs().format('YYYYMMDD'));
  }, 1000);
  const getNextTime = (timeTableArr: string[], skip: number = 0) => {
    let res: string = 'All 🚍 have gone';
    let counter = -1;
    for (let index = 0; index < timeTableArr.length; index++) {
      const secToGo = dayjs().diff(today + 'T' + timeTableArr[index], 'second');
      if (secToGo < 0) {
        counter++;
        const numMin = -parseInt((secToGo / 60).toString()).toString();
        const numSec = -Math.round(secToGo % 60);
        const busIndex = index + 1;
        const totalBus = timeTableArr.length;
        const busLeft = totalBus - busIndex -1;
        res = `🚍 ${numMin} min. ${numSec} sek. (${busIndex}/${totalBus}, ${busLeft} restis)`;
        if (counter === skip) {
          // @ts-ignore
          break;
        }
      }
    }
    return res;
  };
  const todayIsHoliday = () => {
    fetch(`https://api.apihubs.cn/holiday/get?date=${today}`, { method: 'GET' })
      .then((res) => res.json())
      .then((json) => json.data.list[0].workday)
      .then((code) => setIsWorkDay(() => code));
  };
  useEffect(todayIsHoliday, [today]);
  return (
    <div className='App'>
      <header className='App-header'>
        {/* <img src={logo} className='App-logo' alt='logo' /> */}
        <p>{timeStr}</p>
        <p>{timeStr2}</p>
        <p>{isWorkDay ? 'Labortaĝo' : 'Ripoztaĝo'}</p>
      </header>
    </div>
  );
};

export default App;