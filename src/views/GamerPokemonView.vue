<template>
  <div class="container" style="background-color: transparent;">
    <h1 class="text-center">¿Adivina el Pokémon?</h1>
    <div class="row justify-content-center">
      <img v-if="showSilhouette" :src="silhouetteImage" alt="Silhouette" class="img-fluid silhouette-image" />
      <img v-else :src="pokemonImage" alt="Pokémon" class="img-fluid pokemon-image" />
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
      allPokemons: [], // Todos los Pokémon disponibles
      pokemons: [], // Pokémon mostrados en el juego
      selectedPokemon: null,
      showSilhouette: true,
      pokemonImage: "",
      silhouetteImage: "",
      showResult: false,
      resultMessage: "",
    };
  },
  async created() {
    try {
      const pokemons = await PokemonServices.getPokemons();
      this.allPokemons = pokemons; // Almacena todos los Pokémon disponibles
      this.resetGame(); // Inicializa el juego
    } catch (error) {
      console.error("Error fetching pokemons:", error);
    }
  },
  methods: {
    async getRandomPokemon() {
      try {
        const index = Math.floor(Math.random() * this.pokemons.length);
        const pokemon = this.pokemons[index];
        this.selectedPokemon = pokemon;
        const res = await PokemonServices.getPokemonDetail(pokemon.name);
        this.silhouetteImage = res.sprites.other.dream_world.front_default;
        // Inicialmente, no mostramos la imagen completa del Pokémon
        this.pokemonImage = ""; 
      } catch (error) {
        console.error("Error fetching pokemon details:", error);
      }
    },
    async selectPokemon(pokemon) {
      this.showSilhouette = false;
      if (pokemon.name === this.selectedPokemon.name) {
        this.resultMessage = "¡Correcto!";
        try {
          const res = await PokemonServices.getPokemonDetail(this.selectedPokemon.name);
          this.pokemonImage = res.sprites.other.dream_world.front_default;
        } catch (error) {
          console.error("Error fetching pokemon details:", error);
        }
      } else {
        this.resultMessage = `¡INCORRECTO! El correcto es ${this.selectedPokemon.name}.`;
        try {
          const res = await PokemonServices.getPokemonDetail(this.selectedPokemon.name);
          this.pokemonImage = res.sprites.other.dream_world.front_default;
        } catch (error) {
          console.error("Error fetching pokemon details:", error);
        }
      }
      this.showResult = true;
    },
    async revealPokemon() {
      this.showSilhouette = false;
      try {
        const res = await PokemonServices.getPokemonDetail(this.selectedPokemon.name);
        this.pokemonImage = res.sprites.other.dream_world.front_default;
        this.showResult = true;
      } catch (error) {
        console.error("Error fetching pokemon details:", error);
      }
    },
    resetGame() {
      this.showSilhouette = true;
      this.showResult = false;
      this.pokemons = this.getRandomPokemons(4); // Selecciona 4 Pokémon aleatorios para mostrar
      this.getRandomPokemon(); // Selecciona uno de los 4 como el Pokémon a adivinar
    },
    getRandomPokemons(count) {
      const shuffled = [...this.allPokemons].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
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
  border-radius: 10px; /* Añadir bordes redondeados */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Ajustar sombra para un efecto más sutil */
  background-color: #f8f9fa; /* Fondo claro para un mejor contraste */
  text-align: center; /* Centrar contenido */
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #333; /* Color de texto más oscuro para mejor legibilidad */
}

.img-fluid {
  max-width: 80%;
  height: auto;
  margin: 20px auto;
  display: block; /* Asegurar que la imagen esté centrada */
}

.silhouette-image {
  filter: brightness(0); 
  transition: filter 0.3s ease-in-out; /* Transición suave para el filtro */
}

.pokemon-image {
  transition: transform 0.3s ease-in-out; /* Transición suave para la transformación */
}

.btn {
  margin: 10px;
  padding: 10px 20px;
  font-size: 1rem; /* Ajustar tamaño de fuente para mejor legibilidad */
  border: none;
  border-radius: 5px; /* Bordes redondeados para los botones */
  transition: background-color 0.3s ease-in-out; /* Transición suave para el color de fondo */
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}

.btn-primary:hover {
  background-color: #0056b3; /* Cambiar color al pasar el mouse */
}

.btn-secondary {
  background-color: #6c757d;
  color: #fff;
}

.btn-secondary:hover {
  background-color: #5a6268; /* Cambiar color al pasar el mouse */
}

.text-center {
  color: #333;
  margin-top: 20px;
  font-size: 1.2rem; /* Ajustar tamaño de fuente */
}
</style>
