import { getUrlsFromCSV } from '../utils/readCSV';


export default function Home() {
  const urls = getUrlsFromCSV();

  return (
    <div>
      <h1>URL Directory</h1>
      <ul>
        {urls.map((url, index) => (
          <li key={index}>
            <a href={url.url} target="_blank" rel="noopener noreferrer">
              {url.url}, {url.registration_date}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// export async function getServerSideProps() {
//   const { getUrlsFromCSV } = await import('../utils/readCSV');
//   const urls = getUrlsFromCSV();

//   return {
//     props: { urls },
//   };
// }