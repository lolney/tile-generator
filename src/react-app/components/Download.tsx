import React from "react";

type DownloadProps = {
  download: () => void;
  active: boolean;
};

const DownloadButton: React.SFC<DownloadProps> = ({ download, active }) => (
  <button onClick={download} disabled={!active}>
    Download
  </button>
);

export default DownloadButton;
