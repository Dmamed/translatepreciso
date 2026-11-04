const DEFAULT_GLOSSARY = `Dasein => Dasein (no traducir)
logos => logos (no traducir)
Godhead => Deidad
begotten => engendrado (nunca "creado")
atonement => expiación
propitiation => propiciación
justification => justificación
sanctification => santificación
righteousness => justicia (o "rectitud", según el contexto)
grace => gracia
faith => fe
sin => pecado
Holy Spirit => Espíritu Santo
incarnation => encarnación
hypostasis => hipóstasis
essence => esencia
substance => sustancia
being (sustantivo, en filosofía) => ser
a being => un ente
Dasein => Dasein`;

const DEFAULTS = {
  apiKey: "",
  model: "claude-sonnet-5-5",
  primary: "Español",
  secondary: "Inglés",
  notes: true,
  glossary: DEFAULT_GLOSSARY
};
