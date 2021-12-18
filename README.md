# Web Vitals react hook

> Bring [web vitals](https://github.com/GoogleChrome/web-vitals) quickly into your react project

May thanks to [Stefan Judis](https://www.stefanjudis.com/) for his [web-vitals-element](https://www.npmjs.com/package/web-vitals-element) where i borrowed a few lines and ideas 😁

## Install

```bash
npm i web-vitals-react-hook 
```

**You can use the [hook](#use-the-hook) or use the [component](#use-the-component)**

## Use the hook

```js
import { useWebVitals } from 'web-vitals-react-hook'
```

```js
const metrics = useWebVitals() // uses all metrics: CLS FCP FID LCP TTFB
```

or define your own list

```js
const metrics = useWebVitals(['FCP', 'TTFB'])
```

---

The `metrics` you get will include the values from web-vitals plus the evaluation.

Most valueble props:

```js
{ 
  name,
  explainerURL,
  longName,
  supported,
  rating,
  unit,
  value,
}
```

## Use the component

![WebVitals component example](https://user-images.githubusercontent.com/2837064/124751176-9e266600-df26-11eb-9a77-97fd14a2d42c.png)

The component will give you a list with name, linked short name and value.

```js
import { WebVitals } from 'web-vitals-react-hook'
```

### Basic usage

```js
<WebVitals />
```

### Override vitals list

```js
<WebVitals vitals={['FCP', 'TTFB']} />
```

### Styling

To style the element you can either override the internal components  
for example:

```js
<WebVitals ValueComponent={YourCustomValue} />
```

You can also style the internal components with emotion  

```js
import styled from '@emotion/styled'
import { WebVitals, Value } from 'web-vitals-react-hook'

const CustomValue = styled(Value)`
  font-weight: bold;
`

<WebVitals ValueComponent={CustomValue} />
```

Or add your css to the classes

```css
.WebVitals {
  ...
}

.WebVitals-name {
  ...
}

.WebVitals-shortName {
  ...
}

.WebVitals-link {
  ...
}

.WebVitals-value {
  ...
}
```

## Contributing

If you're having issues using this component or have an idea how to optimize this module, please [open an issue](https://github.com/schoenwaldnils/web-vitals-react-hook/issues/new).

## License

This project is released under [MIT license](./LICENSE).
