async function loadModule(path) {
  const html = await fetch(path).then((r) => r.text());
  document.getElementById("moduleWindow").innerHTML = html;
}
