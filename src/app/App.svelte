<script lang="ts">
  import RemoveColor from "../modules/removePickedColor/RemoveColor.svelte";
  import CinemaScene from "../modules/cinemaScene/CinemaScene.svelte";
  import Tabs from "./Tabs.svelte";

  let activeTab: "cinema" | "remove-color" = "remove-color";
</script>

<main>
  <Tabs {activeTab} onTabChange={(tab) => (activeTab = tab)} />

  <div class="content">
    {#if activeTab === "cinema"}
      <CinemaScene />
    {:else}
      <RemoveColor />
    {/if}
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    padding: 20px;
  }

  .content {
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
