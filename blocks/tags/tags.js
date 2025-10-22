export default function decorate(block) {
  const rows = [...block.children];
  const tags = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      tags.push({
        text: cells[0].textContent.trim(),
        color: cells[1].textContent.trim().toLowerCase(),
      });
    }
  });

  block.textContent = '';

  tags.forEach((tag) => {
    const span = document.createElement('span');
    span.className = `tag tag-${tag.color}`;
    span.textContent = tag.text;
    block.appendChild(span);
  });
}

