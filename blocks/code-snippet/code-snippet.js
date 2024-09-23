function setUpSnippet() {
  const copyButtonLabel = "Copy Code";

  // use a class selector if available
  let blocks = document.querySelectorAll("pre");

  blocks.forEach((block) => {
    // only add button if browser supports Clipboard API
    if (navigator.clipboard) {
      let button = document.createElement("button");

      button.innerText = copyButtonLabel;
      block.appendChild(button);

      button.addEventListener("click", async () => {
        await copyCode(block);
      });
    }
  });

  async function copyCode(block) {
    let code = block.querySelector("code");
    let text = code.innerText;

    await navigator.clipboard.writeText(text);
  }
}

export default function decorate(block) {
  // setup dom elements
  const snippetPre = document.createElement('pre');
  const snippetCode = document.createElement('code');
  snippetPre.appendChild(snippetCode);
  // set code content
  snippetCode.textContent = block.textContent;
  // clean up the text content as we do not need to show it as a P tag
  block.textContent = '';
  block.append(snippetPre);
  setUpSnippet();
}
