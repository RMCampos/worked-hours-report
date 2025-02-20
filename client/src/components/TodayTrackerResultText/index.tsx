import React from 'react';
import { useTheme } from '../../context/themeContext';

interface Props {
  readonly label: string;
  readonly value: string;
}

function TodayTrackerResultText(props: React.PropsWithChildren<Props>): React.ReactNode {
  const { theme } = useTheme();

  return (
    <p className={`${theme === 'light' ? 'text-dark' : 'text-light'}`}>
      {props.label}
      :
      <b>{props.value}</b>
    </p>
  );
}

export default TodayTrackerResultText;
