<template>
  <div>
    <div class="row">  
      <div class="col d-flex justify-content-center">
        <h3 class="text-primary">Listado de Pokemons</h3>
      </div>
    </div>
    <div class="row p-3 mt-3 mb-3 d-flex justify-content-center">
      <div v-for="pokemon in pokemons" :key="pokemon.name" class="col-sm-10">
        <router-link :to="{ name: 'Pokemon', params: { name: pokemon.name } }">
          <div class="card d-flex justify-content-center aling-items-center mb-3">
            <div class="card-title">
              <img :src="pokemon.sprites?.front_default" alt="Front sprite" style="width: 180px; height: 180px;">
              <h4>
                {{ pokemon.name }}
              </h4>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <div v-if="selectedPokemon">
      <h2>{{ selectedPokemon.name }}</h2>
      <img :src="selectedPokemon.sprites?.front_default" alt="Front sprite">
      <!-- Otros detalles del Pokémon -->
    </div>
  </div>
</template>

<script>
import PokemonServices from '@/services/PokemonServices'

export default {
  name: 'PokemonsListView',
  data() {
    return {
      pokemons: [],
      selectedPokemonName: null,
      selectedPokemon: null,
    }
  },
  async created() {
    this.pokemons = await PokemonServices.getPokemons()
    this.pokemons.forEach(pokemon => {
      PokemonServices.getPokemonDetail(pokemon.name).then(res => {
        pokemon.sprites = res.sprites
      })
    })
  },

  watch: {
    selectedPokemonName: {
      handler: 'loadPokemonDetail',
      immediate: true,
    },

  },

  methods: {
    async loadPokemonDetail(name) {
      this.selectedPokemon = await PokemonServices.getPokemonDetail(this.selectedPokemonName)
    }

  },

  computed: {
    selectedPokemonNameFromRoute() {
      return this.$route.params.name
    }

  },
  
  watch: {
    selectedPokemonNameFromRoute(newName) {
      this.selectedPokemonName = newName
    }
  }
}
</script>
