import React from 'react';
import { useTheme } from '../../context/themeContext';

interface Props {
  text: string;
}

function TodayTrackerResultText(props: Props): React.ReactNode {
  const { theme } = useTheme();

  return (
    <h4 className={`${theme === 'light' ? 'text-dark' : 'text-light'}`}>
      {props.text}
    </h4>
  );
}

export default TodayTrackerResultText;
