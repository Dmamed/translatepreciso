const ids = ["apiKey", "model", "primary", "secondary", "glossary"];
const $ = (id) => document.getElementById(id);

chrome.storage.local.get(null, (stored) => {
  const s = { ...DEFAULTS, ...stored };
  ids.forEach((id) => ($(id).value = s[id]));
  $("notes").checked = !!s.notes;
});

$("save").onclick = () => {
  const data = { notes: $("notes").checked };
  ids.forEach((id) => (data[id] = $(id).value.trim()));
  chrome.storage.local.set(data, () => {
    $("status").textContent = "Guardado ✓";
    setTimeout(() => ($("status").textContent = ""), 1800);
  });
};
