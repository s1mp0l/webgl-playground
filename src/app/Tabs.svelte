<script lang="ts">
  export let activeTab: "cinema" | "remove-color";
  export let onTabChange: (tab: "cinema" | "remove-color") => void;

  const tabs = [
    { id: "cinema" as const, label: "Кинотеатр" },
    { id: "remove-color" as const, label: "Удаление цвета" },
  ];
</script>

<div class="tabs">
  {#each tabs as tab}
    <button
      class:active={activeTab === tab.id}
      on:click={() => onTabChange(tab.id)}
    >
      {tab.label}
    </button>
  {/each}
</div>

<style>
  .tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #e0e0e0;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #d0d0d0;
  }

  button.active {
    background-color: #007bff;
    color: white;
  }
</style>
