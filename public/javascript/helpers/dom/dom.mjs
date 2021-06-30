export function createBlock(blockName, blockParams) {
  const block = document.createElement(blockName);

  if (blockParams.id !== undefined) {
    block.id = blockAttributes.id;
  }

  if (blockParams.class !== undefined) {
    for (const className of blockParams.class) {
      block.classList.add(className);
    }
  }

  const attributes = blockParams.attributes;
  for (const attribute in attributes) {
    block.setAttribute(attribute, attributes[attribute]);
  }

  if (blockParams.text !== undefined) {
    block.innerText = blockParams.text;
  }

  return block;
}
