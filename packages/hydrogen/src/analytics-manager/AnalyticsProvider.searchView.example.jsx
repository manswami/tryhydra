import {Analytics} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';

export async function loader({request}) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const searchTerm = String(searchParams.get('q') || '');

  return json({
    searchTerm,
  });
}

export default function SearchPage() {
  const {searchTerm} = useLoaderData();
  return (
    <div className="search">
      <h1>Search</h1>
      <Analytics.SearchView data={{searchTerm}} />
    </div>
  );
}
