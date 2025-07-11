import { useState } from "preact/hooks";

interface Props {
  initialQuery: string;
}

export default function CharacterSearch({ initialQuery }: Props) {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    
    const url = new URL(globalThis.location.href);
    url.searchParams.delete("page");
    
    if (query.trim()) {
      url.searchParams.set("name", query.trim());
    } else {
      url.searchParams.delete("name");
    }
    
    globalThis.location.href = url.toString();
  };

  return (
    <div class="search-container">
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={query}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          placeholder="Nombre del personaje"
          class="search-input"
        />
        <button type="submit" class="search-button">
          Buscar
        </button>
      </form>
    </div>
  );
}