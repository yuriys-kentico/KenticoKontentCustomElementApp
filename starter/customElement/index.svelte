<script lang="ts">
  import { fade } from 'svelte/transition';

  import CustomElement from '../../../shared/components/customElement/customElement.svelte';
  import Invalid from '../../../shared/components/customElement/invalid.svelte';
  import Loading from '../../../shared/components/loading.svelte';
  import { translate } from '../../../shared/stores/translate';
  import translations from './_resources';

  import type { IContext } from '../../../shared/components/customElement/customElement';
  import { property } from '../../../shared/actions/property';

  let value: any;
  let config: {};
  let context: IContext;
  let disabled: boolean;

  let type: 0 | 1 | 2 | 3 | 4;
  let oldType: 0 | 1 | 2 | 3 | 4;

  let inputs: HTMLDivElement;

  let installedSamples: [string, string][] = [
    ['goToColorSample', 'elements/color'],
    ['goToListSample', 'elements/list'],
  ];

  let textValue = '';
  let numberValue = null;
  let dateValue = '';
  let objectValue = { text: '', number: null, date: '' };

  const ready = async () => {
    const validInstalledSamples = [];

    for (const sample of installedSamples) {
      const [, route] = sample;

      const sampleResponse = await fetch(route);

      if (sampleResponse.ok) {
        validInstalledSamples.push(sample);
      }
    }

    installedSamples = validInstalledSamples;

    if (value?.toString().indexOf('-') > -1 && !isNaN(Date.parse(value))) {
      type = 3;
      dateValue = value;
    } else if (/^[0-9]+$/.test(value)) {
      type = 2;
      numberValue = value;
    } else if (value instanceof Object) {
      type = 4;
      objectValue = value;
    } else {
      type = 1;
      textValue = value;
    }
  };

  const reset = () => {
    textValue = '';
    numberValue = null;
    dateValue = '';
    objectValue = { text: '', number: null, date: '' };
    oldType = type;
  };

  $: {
    switch (type) {
      case 1:
        if (!disabled) value = textValue;
        break;
      case 2:
        if (!disabled) value = numberValue;
        break;
      case 3:
        if (!disabled) value = dateValue;
        break;
      case 4:
        if (!disabled) value = objectValue;
        break;
    }
  }

  const updateInputs = (event: CustomEvent & { currentTarget: HTMLElement }) =>
    (inputs.style.height = `${event.currentTarget.getBoundingClientRect().height}px`);

  $: rawValue = JSON.stringify(value);

  const t = translate(translations);
</script>

<CustomElement bind:value bind:config bind:context bind:disabled on:ready={ready}>
  <div class="group column root" transition:fade>
    <div class="group item">
      <h1>{$t`helloWorld`}</h1>
      {#if !disabled && installedSamples.length > 0}
        <div class="item links">
          {#each installedSamples as [translation, route]}
            <a class="button" href={route} on:click={() => (value = undefined)}
              >{$t(translation)}
              <i aria-hidden="true" class="icon arrow-right-top-square" />
            </a>
          {/each}
        </div>
      {/if}
    </div>
    <div class="item radios">
      <div class="item group">
        <label class="item">
          <input type="radio" class="radio" name="type" bind:group={type} on:input={reset} value={1} />
          <span>
            <i aria-hidden="true" class="icon rectangle-a" />
            {$t`text`}</span
          >
        </label>
        <label class="item">
          <input type="radio" class="radio" name="type" bind:group={type} on:input={reset} value={2} />
          <span>
            <i aria-hidden="true" class="icon octothorpe" />
            {$t`number`}</span
          >
        </label>
        <label class="item">
          <input type="radio" class="radio" name="type" bind:group={type} on:input={reset} value={3} />
          <span>
            <i aria-hidden="true" class="icon calendar" />
            {$t`date`}</span
          >
        </label>
        <label class="item">
          <input type="radio" class="radio" name="type" bind:group={type} on:input={reset} value={4} />
          <span>
            <i aria-hidden="true" class="icon braces" />
            {$t`object`}</span
          >
        </label>
      </div>
      <div class="group selection" use:property={['left', type - 1]} use:property={['right', 4 - type]}>
        <div class="item left box" class:fast={type < oldType} class:slow={type > oldType} />
        <div class="item selected box" />
        <div class="item right box" class:fast={type > oldType} class:slow={type < oldType} />
      </div>
    </div>
    {#if !disabled}
      <br />
      <h3 class="item">{$t`editableValue`}</h3>
      <div class=" inputs" bind:this={inputs}>
        {#if type === 1}
          <input
            class="input"
            type="text"
            placeholder={$t`placeholder`}
            on:introstart={updateInputs}
            on:introend={updateInputs}
            transition:fade={{ duration: 200 }}
            bind:value={textValue}
          />
        {:else if type === 2}
          <input
            class="input narrow"
            type="number"
            placeholder={$t`placeholder`}
            on:introstart={updateInputs}
            on:introend={updateInputs}
            transition:fade={{ duration: 200 }}
            bind:value={numberValue}
          />
        {:else if type === 3}
          <input
            class="input narrow"
            type="date"
            on:introstart={updateInputs}
            on:introend={updateInputs}
            transition:fade={{ duration: 200 }}
            bind:value={dateValue}
          />
        {:else if type === 4}
          <pre
            on:introstart={updateInputs}
            on:introend={updateInputs}
            transition:fade={{
              duration: 200,
            }}>
<span>{`{`}</span>
  <span>{`${$t`text`}:`}<input
  class="input narrow"
  type="text"
  placeholder={$t`placeholder`}
  bind:value={objectValue.text} /></span>
  <span>{`${$t`number`}:`}<input class="input narrow" type="number" bind:value={objectValue.number} /></span>
  <span>{`${$t`date`}:`}<input class="input narrow" type="date" bind:value={objectValue.date} /></span>
<span>{`}`}</span>
          </pre>
        {/if}
      </div>
    {/if}
    <br />
    <h3 class="item">{$t`rawValue`}</h3>
    <div class="raws">
      <span class="rawSpacer">
        {rawValue}
      </span>
      {#key type}
        <span class="raw" transition:fade={{ duration: 200 }}>
          {rawValue}
        </span>
      {/key}
    </div>
    <div />
  </div>
  <div slot="loading">
    <Loading />
  </div>
  <div slot="invalid">
    <Invalid />
  </div>
</CustomElement>

<style>
  .root {
    padding: 1em;
    background-image: linear-gradient(135deg, hsl(111, 10%, 98%), hsl(111, 35%, 90%));
    border-radius: 0.5em;
  }

  h1 {
    margin: 0.25em 0;
  }

  .links {
    text-align: right;
  }

  .links .button {
    text-decoration: none;
    padding: 0 0 0 0.8em;
  }

  .radios {
    position: relative;
    z-index: 0;
  }

  .radios > .item {
    margin: 0;
  }

  .radios label {
    font-weight: 600;
    text-align: center;
    cursor: pointer;
    text-transform: uppercase;
  }

  .radios label:hover {
    color: #81d272;
  }

  .radios input.radio {
    display: none;
  }

  input[type='radio'] + span {
    transition: 0.2s;
    transition-delay: 0.1s;
  }

  input[type='radio']:hover + span {
    transition: 0.1s;
    transition-delay: 0s;
  }

  input[type='radio']:checked + span {
    transition-delay: 0.2s !important;
    color: white;
  }

  .selection {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
  }

  .selection .box.fast {
    transition: 0.2s ease-in-out;
  }

  .selection .box.slow {
    transition: 0.3s ease-in-out;
    transition-delay: 0.2s;
  }

  .selection .box.left {
    flex: 0;
    flex: var(--left);
  }

  .selection .box.selected {
    background: #81d272;
    border-radius: 2em;
    flex: 1;
    box-shadow: 0 0 1.5em hsl(111, 52%, 64%), inset 0.3em -0.7em 1.5em hsl(111deg 82% 74%),
      inset 0.1em -0.1em 0.7em hsl(111deg 42% 44%);
  }

  .selection .box.fast + .selected {
    animation: fast 0.5s ease-in-out;
  }

  @keyframes fast {
    50% {
      border-radius: 2em 14em 14em 2em/ 2em 2em;
    }
    100% {
      border-radius: 2em;
    }
  }

  .selection .box.slow + .selected {
    animation: slow 0.5s ease-in-out;
  }

  @keyframes slow {
    50% {
      border-radius: 14em 2em 2em 14em/ 2em 2em;
    }
    100% {
      border-radius: 2em;
    }
  }

  .selection .box.right {
    flex: 3;
    flex: var(--right);
  }

  span i {
    color: inherit;
    padding: 0.3em;
  }

  .inputs {
    position: relative;
    transition: 0.2s;
  }

  .input {
    position: absolute;
    background: transparent;
  }

  .input.narrow {
    width: auto;
  }

  pre {
    margin: 0;
    position: absolute;
  }

  .raws {
    position: relative;
  }

  .rawSpacer {
    visibility: hidden;
    margin: 0.5em;
    display: block;
  }

  .raw {
    position: absolute;
    top: 0;
    left: 0;
    transition: 0.2s;
    background: #daf5c4;
    border-radius: 0.5em;
    padding: 0.5em;
    pointer-events: none;
    box-shadow: 0 0 1.5em hsl(93, 71%, 86%), inset 0.3em -0.7em 1.5em hsl(93, 91%, 96%),
      inset 0.1em -0.1em 0.7em hsl(93, 71%, 66%);
  }
</style>
