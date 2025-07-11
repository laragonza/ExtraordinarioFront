import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { ApiResponse } from "../types.ts";

interface Data {
  characters: ApiResponse;
  query: string;
  currentPage: number;
}

async function getCharacters(name = "", page = 1): Promise<ApiResponse> {
  const url = new URL("https://rickandmortyapi.com/api/character");
  if (name) url.searchParams.set("name", name);
  url.searchParams.set("page", page.toString());

  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { info: { pages: 0, next: null, prev: null }, results: [] };
  }
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const url         = new URL(req.url);
    const query       = url.searchParams.get("name") ?? "";
    const currentPage = parseInt(url.searchParams.get("page") ?? "1", 10);
    const characters  = await getCharacters(query, currentPage);

    return ctx.render({ characters, query, currentPage });
  },
};

export default function Home({ data }: PageProps<Data>) {
  const { characters, query, currentPage } = data;

  return (
    <>
      <Head>
        <title>Rick and Morty Characters</title>
        <style>{`
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #ffffff;
          }
          .container { max-width: 1280px; margin: 0 auto; }
          h1         { font-size: 2.5rem; margin-bottom: 1.5rem; }

          .btn {
            padding: 10px 20px;
            border: 2px solid #5f677a;
            background: transparent;
            color: #000;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
          }
          .btn:hover        { background: #f0f0f0; }
          .btn.disabled,
          .btn:disabled     { border-color: #bbb; color: #bbb; cursor: default; }

          .search-container { display: flex; gap: 10px; margin-bottom: 2rem; }
          .search-input {
            flex: 1 1 auto;
            padding: 12px 16px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 24px;
          }
          .card {
            text-decoration: none;
            color: inherit;
            background: #fafafa;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            transition: transform .15s ease;
          }
          .card:hover       { transform: translateY(-4px); }
          .card img         { width: 100%; height: 150px; object-fit: cover; }
          .card-info        { padding: 12px; text-align: center; }
          .card-info h3     { margin: 0; font-size: 1rem; }

          .pagination {
            display: flex;
            justify-content: flex-start; /* pegado a la izquierda */
            align-items: center;
            gap: 28px;
            margin: 2rem 0;
          }
          .pagination-info { font-size: 18px; }

          .no-results {
            margin-top: 3rem;
            text-align: center;
            font-size: 1.125rem;
            color: #666;
          }
        `}</style>
      </Head>

      <div class="container">
        <h1>Rick and Morty Characters</h1>

        <form class="search-container" method="GET">
          <input
            class="search-input"
            type="text"
            name="name"
            placeholder="Nombre del personaje"
            value={query}
          />
          <button class="btn" type="submit">Buscar</button>
        </form>

        {characters.results.length ? (
          <>
            <div class="grid">
              {characters.results.map((c) => (
                <a key={c.id} href={`/character/${c.id}`} class="card">
                  <img src={c.image} alt={c.name} loading="lazy" />
                  <div class="card-info">
                    <h3>{c.name}</h3>
                  </div>
                </a>
              ))}
            </div>

            <div class="pagination">
              {characters.info.prev
                ? (
                  <a
                    class="btn"
                    href={`/?page=${currentPage - 1}${query ? `&name=${encodeURIComponent(query)}` : ""}`}
                  >
                    Anterior
                  </a>
                )
                : <span class="btn disabled">Anterior</span>}

              <span class="pagination-info">
                {currentPage} / {characters.info.pages}
              </span>

              {characters.info.next
                ? (
                  <a
                    class="btn"
                    href={`/?page=${currentPage + 1}${query ? `&name=${encodeURIComponent(query)}` : ""}`}
                  >
                    Siguiente
                  </a>
                )
                : <span class="btn disabled">Siguiente</span>}
            </div>
          </>
        ) : (
          <div class="no-results">No se encontraron personajes</div>
        )}
      </div>
    </>
  );
}