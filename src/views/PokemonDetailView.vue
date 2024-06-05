<template>
  <div class="pokemon-detail">
    <div class="row d-flex justify-content-center">
      <div class="col-sm-8">
        <div class="card">
          <div v-if="pokemon">
            <h2 class="pokemon-title">{{ pokemon.name }}</h2>
            <img :src="pokemon?.sprites?.other?.dream_world?.front_default" alt="Front sprite">
          </div>
          <div class="card-body">
            <!-- Mostrar detalles adicionales del pokemon -->
            <p class="pokemon-stats">Altura: {{ pokemon.height }}</p>
            <p class="pokemon-stats">Peso: {{ pokemon.weight }}</p>
            <div v-if="pokemon.types" class="pokemon-types">Tipo(s): {{ pokemon.types.join(', ') }}</div> <!-- Mostrar tipos de cada pokemon -->
            <div v-if="pokemon.abilities" class="pokemon-abilities">Habilidades: {{ abilities.join(', ') }}</div> <!-- Mostrar habilidades de cada pokemon -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PokemonServices from '@/services/PokemonServices'

export default {
  name: 'PokemonDetailView',
  data() {
    return {
      pokemon: {},
      abilities: [],
    }
  },
  async created() {
    try {
      const name = this.$route.params.name;  
      this.pokemon = await PokemonServices.getPokemonDetail(name); 
      await this.getPokemonAbilities(this.pokemon);
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    // Método para obtener las habilidades del pokemon
    async getPokemonAbilities(pokemon) {
      try {
        this.abilities = pokemon.abilities.map(ability => ability.ability.name);  // Extraer nombres de habilidades
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>

<style scoped>
.pokemon-detail {
  text-align: center;
  font-family: Arial, sans-serif;
}

.pokemon-title {
  font-family: 'Arial', sans-serif;
  color: #3B4CCA;
}

.pokemon-stats {
  font-size: 18px;
  color: #333;
}

.pokemon-types, .pokemon-abilities {
  display: block;
  background-color: #f8d030;
  margin: 5px auto;
  padding: 10px;
  border-radius: 5px;
  color: #000;
  max-width: 300px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li.ability {
  display: inline-block;
  background-color: #25a4bb62;
  margin: 5px;
  padding: 10px;
  border-radius: 5px;
  color: #000;
}

.move-list {
  list-style-type: none;
  padding: 0;
}

.move {
  display: inline-block;
  margin-right: 10px;
  background-color: rgb(39, 167, 167);
}

img {
  width: 250px;
  height: 260px;
}

</style>



  