<script lang="ts">
  import RemoveColor from "./modules/removePickedColor/RemoveColor.svelte";
  import CinemaScene from "./modules/cinemaScene/CinemaScene.svelte";
</script>

<main>
  <CinemaScene />
  <RemoveColor />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
</style>
