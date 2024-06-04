<template>
  <div class="container" style="background-color: transparent;">
    <h1 class="text-center">¿Adivina el Pokémon?</h1>
    <div class="row justify-content-center">
      <img v-if="showSilhouette" :src="silhouetteImage" alt="Silhouette" class="img-fluid silhouette-image" @click="revealPokemon" />
      <img v-else :src="pokemonImage" alt="Pokémon" class="img-fluid pokemon-image" @click="nextRound" />
    </div>
    <div class="row justify-content-center">
      <button v-for="(pokemon, index) in pokemons" :key="index" @click="selectPokemon(pokemon)" class="btn btn-primary m-2">
        {{ pokemon.name }}
      </button>
    </div>
    <div class="row justify-content-center">
      <button v-if="showResult" @click="resetGame" class="btn btn-secondary">Reiniciar</button>
    </div>
    <div class="row justify-content-center">
      <p v-if="showResult" class="text-center">{{ resultMessage }}</p>
    </div>
  </div>
</template>

<script>
import PokemonServices from "@/services/PokemonServices.js";

export default {
  data() {
    return {
      pokemons: [],
      selectedPokemon: null,
      showSilhouette: true,
      pokemonImage: "",
      silhouetteImage: "",
      showResult: false,
      resultMessage: "",
    };
  },
  async created() {
    const pokemons = await PokemonServices.getPokemons();
    this.pokemons = pokemons.slice(0, 4); // Solo 4 pokemones como posible elección
    this.getRandomPokemon();
  },
  methods: {
    async getRandomPokemon() {
      const index = Math.floor(Math.random() * this.pokemons.length);
      const pokemon = this.pokemons[index];
      this.selectedPokemon = pokemon;
      PokemonServices.getPokemonDetail(pokemon.name).then((res) => {
        this.silhouetteImage = res.sprites.other.dream_world.front_default;
        this.pokemonImage = this.silhouetteImage;
      });
    },
    selectPokemon(pokemon) {
      this.showSilhouette = false;
      if (pokemon.name === this.selectedPokemon.name) {
        this.resultMessage = "¡Correcto!";
      } else {
        this.resultMessage = `¡INCORRECTO! intentalo de nuevo ${this.selectedPokemon.name}.`;
      }
      PokemonServices.getPokemonDetail(pokemon.name).then((res) => {
        this.pokemonImage = res.sprites.other.dream_world.front_default;
        this.showResult = true;
      });
    },
    revealPokemon() {
      this.showSilhouette = false;
      PokemonServices.getPokemonDetail(this.selectedPokemon.name).then((res) => {
        this.pokemonImage = res.sprites.other.dream_world.front_default;
        this.showResult = true;
      });
    },
    resetGame() {
      this.showSilhouette = true;
      this.showResult = false;
      this.pokemons = this.pokemons.sort(() => Math.random() - 0.5).slice(0, 4); // Cambiar las opciones al reiniciar
      this.getRandomPokemon();
    },
    nextRound() {
      if (this.showResult) {
        this.resetGame();
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.img-fluid {
  max-width: 80%;
  height: auto;
  margin: 20px auto;
}

.silhouette-image {
  filter: brightness(0); 
}

.btn {
  margin: 10px;
}
</style>
