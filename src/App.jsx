import React, { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/name";

// Custom hook
const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

// Custom hook
const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (!name) return;

    axios
      .get(`${baseUrl}/${name}`)
      .then((res) => setCountry(res.data))
      .catch((error) => {
        setCountry({ error: error.response.data.error });
      });
  }, [name]);

  return country;
};

// Country Component
const Country = ({ country }) => {
  if (!country) {
    return null;
  }

  if (country.error) {
    return <div>{country.error}</div>;
  }

  return (
    <div>
      <h3>{country.name.official} </h3>
      <div>capital {country.capital} </div>
      <div>population {country.population}</div>
      <img
        src={country.flags.png}
        height="100"
        alt={`flag of ${country.name.official}`}
      />
    </div>
  );
};

// Main component
const App = () => {
  const nameInput = useField("text");
  const [name, setName] = useState("");
  const country = useCountry(name);

  const fetch = (e) => {
    e.preventDefault();
    // This change in state should cause the useCountry to rerun
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  );
};

export default App;
