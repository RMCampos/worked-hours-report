import React from 'react';
import { DailyReport } from '../../types/dailyReport';
import { Button } from 'react-bootstrap';

interface Props {
  jsonData: DailyReport[];
  filename: string;
}

/**
 * Renders a Download link to export selected month data.
 *
 * @param {Props.jsonData} [props.jsonData] The data to be exported.
 * @param {Props.filename} [props.filename] The filename.
 * @returns {React.ReactNode} The rendered component
 */
function DownloadJsonButton(props: React.PropsWithChildren<Props>): React.ReactNode {
  /**
   * Handle a download file.
   */
  const handleDownload = () => {
    const jsonString = JSON.stringify(props.jsonData, null, 2); // Convert to string with indentation
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = props.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="a"
      onClick={handleDownload}
    >
      Download JSON
    </Button>
  );
}

export default DownloadJsonButton;
