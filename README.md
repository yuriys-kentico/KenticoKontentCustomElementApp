# Kontent ♥ Svelte ♥ Custom elements

![npm](https://img.shields.io/npm/v/create-kontent-custom-element-app?style=for-the-badge)
![npm](https://img.shields.io/npm/v/kontent-custom-element-app?style=for-the-badge)
[![GitHub issues](https://img.shields.io/github/issues/yuriys-kentico/KenticoKontentCustomElementApp?style=for-the-badge)](https://github.com/yuriys-kentico/KenticoKontentCustomElementApp/issues)
[![GitHub license](https://img.shields.io/github/license/yuriys-kentico/KenticoKontentCustomElementApp?style=for-the-badge)](https://github.com/yuriys-kentico/KenticoKontentCustomElementApp/blob/main/LICENSE.md)
![GitHub last commit](https://img.shields.io/github/last-commit/yuriys-kentico/KenticoKontentCustomElementApp?style=for-the-badge)

## A Svelte/Sapper app template for Kontent Custom elements.

This monorepository contains both the installer and the template files for `kontent-custom-element-app`.

## Installation

In an empty folder for the app:

```
npm init kontent-custom-element-app
```

## Options

| Key         | Alias |   Type    | Required | Description                                                                                  |
| ----------- | :---: | :-------: | :------: | :------------------------------------------------------------------------------------------- |
| `--name`    | `-n`  | `string`  |   Yes    | Name of the app. This is also used as the name and route of the starter element.             |
| `--samples` | `-s`  | `boolean` |   Yes    | Install sample custom elements alongside the starter. Use `--no-samples` to negate.          |
| `--run`     | `-r`  | `boolean` |   Yes    | Run app at https://localhost:3000/ immediately after installation. Use `--no-run` to negate. |
