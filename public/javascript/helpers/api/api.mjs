const textsRoute = `${window.location.href}/texts/`;

const textsProxy = new Map();

export async function getText(textId) {
  if (textsProxy.has(textId)) {
    return textsProxy.get(textId);
  }

  const text = (
    await fetch(textsRoute + textId).then((response) => response.json())
  ).text;
  textsProxy.set(textId, text);

  return text;
}
