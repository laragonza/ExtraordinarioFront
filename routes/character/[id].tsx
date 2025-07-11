import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { Character } from "../../types.ts";

interface Data {
  character: Character | null;
}

async function getCharacterById(id: number): Promise<Character | null> {
  try {
    const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return null;
  }
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const { id } = ctx.params;
    const charId = parseInt(id);
    if (isNaN(charId)) return new Response("Invalid ID", { status: 400 });

    const character = await getCharacterById(charId);
    if (!character) return new Response("Character not found", { status: 404 });

    return ctx.render({ character });
  },
};

export default function CharacterDetail({ data }: PageProps<Data>) {
  if (!data.character) return <div>Personaje no encontrado</div>;

  const c = data.character;

  return (
    <>
      <Head>
        <title>{c.name} - Rick and Morty</title>
        <style>{`
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 40px 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #ffffff;
          }

          a { color: inherit; text-decoration: underline; }

          .detail {
            display: flex;
            align-items: flex-start;
            gap: 32px;
            margin-top: 16px;
          }
          .detail img {
            width: 180px;
            height: 180px;
            object-fit: cover;
            border-radius: 4px;
          }

          h1  { margin: 0 0 16px 0; font-size: 2rem; font-weight: 700; }
          .row { margin-bottom: 8px; font-size: 1rem; }
          .row span:first-child { font-weight: 600; }
          
          @media (max-width: 600px) {
            .detail { flex-direction: column; align-items: flex-start; }
            .detail img { width: 100%; height: auto; }
          }
        `}</style>
      </Head>

      <a href="/">Volver</a>

      <div class="detail">
        <img src={c.image} alt={c.name} />
        <div>
          <h1>{c.name}</h1>
          <div class="row"><span>Status:</span> {c.status}</div>
          <div class="row"><span>Species:</span> {c.species}</div>
          <div class="row"><span>Gender:</span> {c.gender}</div>
          <div class="row"><span>Origin:</span> {c.origin.name}</div>
          <div class="row"><span>Location:</span> {c.location.name}</div>
        </div>
      </div>
    </>
  );
}
