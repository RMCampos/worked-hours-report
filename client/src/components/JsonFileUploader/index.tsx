import React, { ChangeEvent, useState } from 'react';
import './styles.css';

interface Props {
  onJsonUploaded: (data: string) => void;
  maxSizeMB?: number;
}

function JsonFileUploader(props: React.PropsWithChildren<Props>): React.ReactNode {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    const file = files[0];
    setFileName(file.name);
    setError('');
    setIsLoading(true);

    // Check if file is too large (optional, adjust as needed)
    if (props.maxSizeMB) {
      const maxSizeBytes = props.maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        setError('File is too large. Please upload a file smaller than 10MB.');
        setIsLoading(false);
        return;
      }
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const content = e.target?.result as string;

        // Call the callback with the parsed JSON
        props.onJsonUploaded(content);

        setIsLoading(false);
      }
      catch (error: unknown) {
        setError('Invalid JSON file. Please upload a valid JSON file: ' + error);
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Error reading file. Please try again.');
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="json-file-uploader">
      <div className="upload-container">
        <label htmlFor="json-file-input" className="upload-button">
          {isLoading ? 'Processing...' : 'Upload JSON File'}
        </label>
        <input
          id="json-file-input"
          type="file"
          accept=".json,application/json"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          disabled={isLoading}
        />
        {fileName && (
          <div className="file-name">
            Selected:
            {' '}
            {fileName}
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default JsonFileUploader;
