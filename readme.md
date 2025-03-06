<div align="center">

  <a href="https://github.com/fivefifteen/kloner">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./assets/kloner-white.png">
      <img src="./assets/kloner.png" alt="Kloner">
    </picture>
  </a>

  # Kloner

  A tiny, dependency-free JavaScript module for cloning/repeating elements.

  [![npm package version](https://img.shields.io/npm/v/kloner.svg?style=flat-square)](https://www.npmjs.com/package/kloner)
  [![npm package downloads](https://img.shields.io/npm/dt/kloner.svg?style=flat-square)](https://www.npmjs.com/package/kloner)
  [![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/fivefifteen/kloner?style=flat-square)](https://github.com/fivefifteen/kloner)
  [![code style](https://img.shields.io/badge/code_style-standard-yellow.svg?style=flat-square)](https://github.com/standard/standard)
  [![license](https://img.shields.io/github/license/fivefifteen/kloner.svg?style=flat-square)](license.md)

  <a href="https://fivefifteen.com" target="_blank"><img src="./assets/fivefifteen.png" /><br /><b>A Five Fifteen Project</b></a>

</div>


## Demo

Visit https://kloner.js.org


## Installation


### Manual Download

Download [dist/kloner.min.js](dist/kloner.min.js) and place the following HTML in your page's head element:

```html
<script type="text/javascript" src="dist/kloner.min.js"></script>
```


### CDN (Courtesy of [jsDelivr](https://jsdelivr.com))

Place the following HTML in your page's head element (check to make sure the version in the URL is the version you want):

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/fivefifteen/kloner@0.1/dist/kloner.min.js"></script>
```


### [NPM](https://npmjs.com)

```
npm install kloner --save
```

```js
// ES6
import kloner from 'kloner'

// CommonJS
const kloner = require('kloner')
```


### [Fetcher](https://github.com/fivefifteen/fetcher)

```
fetcher install fivefifteen/kloner --save
```


### [Bower](https://bower.io)

```
bower install fivefifteen/kloner --save
```


## Usage

### `kloner` Function

`kloner([containerSelector], [childSelector], [options])`

Initializes Kloner.


#### Parameters

 - `containerSelector` (Optional) - 
 
 - `childSelector` (Optional) - 

 - `options` (Optional) - 


#### Examples

```js
window.addEventListener('load', function () {
  kloner()
})
```


#### Options

```js
{
  afterAdd: null,
  afterChildUpdate: null,
  afterRemove: null,
  beforeAdd: null,
  beforeChildUpdate: null,
  beforeRemove: null,
  childSelector: '[data-kloner-template], :scope > *',
  containerSelector: '[data-kloner], .kloner',
  max: null,
  min: 0,
  parameters: null,
  start: 0,
  template: null,
  updateChildren: false
}
```


## Related

 - [ColorTap](https://github.com/fivefifteen/colortap) - A tiny, dependency-free, color input field helper that utilizes the native color picker.

 - [FileBokz](https://github.com/fivefifteen/filebokz) - A tiny, dependency-free, highly customizable and configurable, easy to use file input with some pretty sweet features.

 - [GrowField](https://github.com/fivefifteen/growfield) - A tiny, dependency-free JavaScript module for making textarea elements grow with their content.

 - [HashJump](https://github.com/fivefifteen/hashjump) - A tiny, dependency-free JavaScript module for handling anchor links and scrolling elements into view.


## License

MIT. See the [license file](license.md) for more info.