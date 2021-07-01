const textsRoute = `${window.location.href}/texts/`;

export async function getText(textId) {
  const text = (
    await fetch(textsRoute + textId).then((response) => response.json())
  ).text;
  return text;
}
