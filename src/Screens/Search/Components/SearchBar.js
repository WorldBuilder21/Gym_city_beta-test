import algoliasearch from "algoliasearch";
import { useState } from "react";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { IconButton } from "@mui/material";
import SearchResults from "../SearchResults";
import PopularScreen from "../PopularScreen";
import { InstantSearch, SearchBox } from "react-instantsearch";

import React from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const handleOnChange = (event) => {
    event.preventDefault();
    // It is recommended to debounce this event in prod
    setQuery(event.target.value);
    console.log(process.env.ALGOLIA_APP_ID);
  };
  return (
    <div>
      <TextField
        onChange={handleOnChange}
        value={query}
        placeholder="Search users"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        fullWidth
        label="Search..."
      />
      {query !== "" ? <SearchResults query={query} /> : <PopularScreen />}
    </div>
  );
}
