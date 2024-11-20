import { useEffect, useState } from 'react';

const NotebookEmbed = ({src, fallbackUrl}) => {
  const [html, setHtml] = useState('');

  console.log(src);

  useEffect(() => {
    fetch(src)
      .then((response) => response.text())
      .then((data) => setHtml(data));
  }, []);

  return (
    <div className="w-full py-10">
      
        This is a rendered Jupyter notebook.
        If it isn't rendering correctly, visit <a href={fallbackUrl} target='_blank' className='underline' >{fallbackUrl}</a>.
      
      <div className="w-full" dangerouslySetInnerHTML={{ __html: html }}/>
    </div>
  );
};

export default NotebookEmbed;
