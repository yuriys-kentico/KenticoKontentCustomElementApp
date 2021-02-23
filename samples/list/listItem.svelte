<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { translate } from "../../../shared/stores/translate";
  import translations from "./_resources";

  import type { IListItem } from "./index.svelte";

  export let item: IListItem;
  export let disabled: boolean;

  const dispatch = createEventDispatcher();

  const deleteItem = () => {
    dispatch("delete", item);
  };

  const t = translate(translations);
</script>

<div class="group">
  <div class="item">
    <input
      type="text"
      class="input"
      {disabled}
      placeholder={!disabled ? $t`itemIsEmpty` : undefined}
      bind:value={item.value} />
    {#if !disabled}
      <div on:click={deleteItem}>
        <i aria-hidden="true" class="icon delete" />
      </div>
    {/if}
  </div>
</div>

<style>
  .group {
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.2);
    margin: 0.1em;
  }

  .item {
    display: flex;
  }

  .input {
    min-width: 0;
    padding: 0.25em 0.5em;
    color: #4c4d52;
    border: 0.1em solid #d0cfce !important;
    transition: border 0.25s cubic-bezier(0.23, 1, 0.32, 1) 50ms;
    resize: vertical;
    flex: 1;
    margin: 0.2em 0.2em 0.2em 0;
  }
</style>
