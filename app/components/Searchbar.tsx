"use client";

import { useState, FormEvent } from "react";
import { scrapeAndStoreProduct } from "../lib/actions";

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidTCGPlayerProductURL = (url: string) => {
    try {
      const parsedURL = new URL(url);
      const hostname = parsedURL.hostname;

      if (
        hostname.includes("tcgplayer.com") ||
        hostname.includes("tcgplayer." || hostname.endsWith("tcgplayer"))
      ) {
        return true;
      }
    } catch (err) {
      return false;
    }
    return false;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidTCGPlayerProductURL(searchPrompt);

    if (!isValidLink) return alert("Please provide a valid TCG Player link");

    try {
      setIsLoading(true);

      const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-wrap gap-r mt-12" onSubmit={handleSubmit}>
      <input
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        type="text"
        placeholder="Enter TCG Player link"
        className="searchbar-input mr-4"
      />
      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchPrompt === ""}
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default Searchbar;
