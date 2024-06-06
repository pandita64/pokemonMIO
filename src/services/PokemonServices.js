import axios from "axios";

export default {
  async getPokemons() {
    try {
      const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=10000"); // Limit incrementado para obtener más Pokémon
      return response.data.results;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  
  async getPokemonDetail(name) {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const types = response.data.types.map((type) => type.type.name); 
      return { ...response.data, types };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  
  async getPokemonAbilities(pokemon) {
    try {
      const abilitiesUrls = pokemon.abilities.map((ability) => ability.ability.url);
      const responses = await Promise.all(abilitiesUrls.map((url) => axios.get(url))); 
      return responses.map((response) => response.data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  
  async getRandomPokemon() {
    try {
      const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=200");  // Limit incrementado para obtener más Pokémon
      const randomIndex = Math.floor(Math.random() * response.data.results.length);
      const randomPokemon = await axios.get(response.data.results[randomIndex].url);
      return randomPokemon.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  
  async getPokemonImage(name) {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      return response.data.sprites.front_default;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  async getPokemonList(start, end) {
    let gottenPokemons = [];
    for (let i = start; i <= end; i++) {
      const itemPokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
      const addedPokemon = {
        id: itemPokemon.data.id,
        name: itemPokemon.data.name,
        image: itemPokemon.data.sprites.other.dream_world.front_default
      };
      gottenPokemons.push(addedPokemon);
    }
    return gottenPokemons;
  }
};