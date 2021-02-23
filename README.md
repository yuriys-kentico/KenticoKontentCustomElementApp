# Kontent ♥ Svelte ♥ Custom elements

## A Svelte/Sapper app template for Kontent Custom elements.

This monorepository contains both the installer and the template files for `kontent-custom-element-app`.

## Installation

In an empty folder for the app:

```
npm init kontent-custom-element-app
```

## Options

| Key         | Alias |   Type    | Required | Description                                                                      |
| ----------- | :---: | :-------: | :------: | :------------------------------------------------------------------------------- |
| `--name`    | `-n`  | `string`  |   Yes    | Name of the app. This is also used as the name and route of the starter element. |
| `--samples` | `-s`  | `boolean` |   Yes    | Install sample custom elements alongside the starter.                            |
| `--run`     | `-r`  | `boolean` |   Yes    | Run app at https://localhost:3000/ immediately after installation.               |
