document.addEventListener('DOMContentLoaded', function () {
  const HEXToRGB = hex => [parseInt(hex.substr(1, 2), 16), parseInt(hex.substr(3, 2), 16), parseInt(hex.substr(5, 2), 16)];
  const RGBToHSL = ([r, g, b]) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) h = s = 0;
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return [h * 360, s * 100, l * 100];
  };

  function calculateHSL(rgb, isDark) {
    const [r, g, b] = rgb
    const [h, s, l] = RGBToHSL(rgb);

    const lightnessThreshold = isDark ? 0.6 : 0.453;
    const perceivedLightness = ((r * 0.2126) + (g * 0.7152) + (b * 0.0722)) / 255;
    const borderThreshold = 0.96;
    const borderAlpha = isDark ?
    0.3 :
    Math.max(0, Math.min((perceivedLightness - borderThreshold) * 100, 1));

    const lightnessSwitch = Math.max(0, Math.min((1 / (lightnessThreshold - perceivedLightness)), 1));
    const lightenBy = (((lightnessThreshold - perceivedLightness) * 100) * lightnessSwitch);
    const backgroundAlpha = 0.18;

    const color = isDark ?
      `hsl(${h} calc(${s} * 1%) calc((${l} + ${lightenBy}) * 1%))` :
      `hsl(0 0% calc(${lightnessSwitch} * 100%))`;
    const backgroundColor = `rgba(${r} ${g} ${b} / ${isDark ? backgroundAlpha : 1})`;
    const borderColor = `hsla(${h} calc(${s} * 1%) calc((${l} + ${isDark ? lightenBy : -25}) * 1%) / ${borderAlpha})`;

    return {
      color,
      backgroundColor,
      borderColor
    };
  }

  const input = document.querySelector('#color-selector');
  const resultBadgeDark = document.querySelector('#result-dark');
  const resultBadgeLight = document.querySelector('#result-light');

  const applyStyles = (result, element) => {
    for (const key in result) {
      element.style[key] = result[key];
    }
  };

  const rgb = HEXToRGB(input.value);
  applyStyles(calculateHSL(rgb, true), resultBadgeDark);
  applyStyles(calculateHSL(rgb, false), resultBadgeLight);

  input.addEventListener('input', function (event) {
    const rgb = HEXToRGB(event.target.value);
    applyStyles(calculateHSL(rgb, true), resultBadgeDark);
    applyStyles(calculateHSL(rgb, false), resultBadgeLight);
  });

});
