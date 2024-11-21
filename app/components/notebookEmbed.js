import { useEffect, useState } from 'react';

const NotebookEmbed = ({src, fallbackUrl}) => {
  const [html, setHtml] = useState('');

  // console.log(src);

  useEffect(() => {
    fetch(src)
      .then((response) => response.text())
      .then((data) => setHtml(data));
  }, [src]);

  return (
    <div className="w-full py-10">
      <p>
        This is a rendered <a href='https://jupyter.org/' target='_blank' className='text-nyc-blue hover:text-nyc-blue hover:underline'>Jupyter</a> notebook.
        If it isn&apos;t rendering correctly, visit <a href={fallbackUrl} target='_blank' className='text-nyc-blue hover:text-nyc-blue hover:underline' >{fallbackUrl}</a>.
      </p>
      <div className="w-full" dangerouslySetInnerHTML={{ __html: html }}/>
    </div>
  );
};

export default NotebookEmbed;
