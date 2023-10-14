import algoliasearch from "algoliasearch";

export async function search({
  indexName,
  query,
  pageParam = 0,
  hitsPerPage = 10,
}) {
  const client = algoliasearch(
    "7SJPBQ7R3K",
    "cc36331fd41df33d55a28ec670054298"
  );
  const index = client.initIndex(indexName);

  console.log(process.env.ALGOLIA_APP_ID);

  console.log("alogolia:search", { indexName, query, pageParam, hitsPerPage });

  const { hits, page, nbPages } = await index.search(query, {
    page: pageParam,
    hitsPerPage,
  });

  const nextPage = page + 1 < nbPages ? page + 1 : undefined;

  return { hits, nextPage };
}
