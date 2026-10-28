import { useState, useEffect, useCallback } from 'react';

const useCopyToClipboard = (text) => {
  const [copyStatus, setCopyStatus] = useState('inactive');
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(
      () => setCopyStatus('copied'),
      () => setCopyStatus('failed'),
    );
  }, [text]);

  useEffect(() => {
    if (copyStatus === 'inactive') {
      return;
    }

    const timeout = setTimeout(() => setCopyStatus('inactive'), 3000);

    return () => clearTimeout(timeout);
  }, [copyStatus]);

  return [copyStatus, copy];
};

export default useCopyToClipboard;
