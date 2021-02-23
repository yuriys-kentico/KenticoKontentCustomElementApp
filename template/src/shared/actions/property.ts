import { is_function } from 'svelte/internal';

type ActionType<T = any> = [string, T] | [string, () => T];

const extractValue = (target: ActionType) => {
  let [name, value] = target;

  if (is_function(value)) {
    return [name, value()];
  }

  return [name, value];
};

export const property = (node: HTMLElement, target: ActionType) => {
  let [name, value] = extractValue(target);

  node.style.setProperty(`--${name}`, String(value));

  return {
    update: (target: ActionType) => {
      let [name, value] = extractValue(target);

      node.style.setProperty(`--${name}`, String(value));
    },
  };
};
