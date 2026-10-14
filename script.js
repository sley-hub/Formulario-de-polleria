const form = document.querySelector("#formulario");
const mensaje = document.querySelector("#mensaje");
const preciosPollo = {
  "pollo_1-8": 12.00,
  "pollo_1-4": 18.00,
  pollo_monstrito: 15.00,
  salchipapa: 10.00,
};
const preciosExtras = {
  gaseosa: 5.00,
  papas: 5.00,
  cremas: 4.00,
};
function soles(precio) {
  return precio.toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nombre = form.nombre.value.trim();
  const telefono = form.number.value.trim();
  const pollo = form.opciones.value;
  const cantidad = Number(form.cantidad.value);
  const entrega = form.entrega.value;

  const extrasSeleccionados = form.querySelectorAll(
    'input[name="extras"]:checked'
  );

  const extras = Array.from(extrasSeleccionados).map(
    (extra) => extra.value
  );
  let error = "";

  if (nombre.length < 3) {
    error = "Escribe tu nombre (mínimo 3 caracteres).";
  } else if (!/^[0-9+\s()-]{7,15}$/.test(telefono)) {
    error = "Ingresa un teléfono válido.";
  } else if (!Object.hasOwn(preciosPollo, pollo)) {
    error = "Selecciona una opción de pollo.";
  } else if (!Number.isInteger(cantidad) || cantidad < 1) {
    error = "La cantidad debe ser un entero mayor que cero.";
  } else if (!["domicilio", "retiro"].includes(entrega)) {
    error = "Selecciona el tipo de entrega.";
  }

  if (error !== "") {
    mensaje.textContent = error;
    mensaje.className = "msg error";
    return;
  }
  const precioUnitario = preciosPollo[pollo];
  const subtotalPollo = precioUnitario * cantidad;

  const subtotalExtras = extras.reduce((total, extra) => {
    return total + (preciosExtras[extra] || 0) * cantidad;
  }, 0);

  const precioEntrega = entrega === "domicilio" ? 5.00 : 0.00;

  const total = subtotalPollo + subtotalExtras + precioEntrega;
  const nombresPollo = {
    "pollo_1-8": "1/8 de pollo a la brasa",
    "pollo_1-4": "1/4 de pollo a la brasa",
    pollo_monstrito: "Monstrito",
    salchipapa: "Salchipapa",
  };

  const nombresExtras = {
    gaseosa: "Gaseosa",
    papas: "Papas fritas",
    cremas: "Extra de cremas",
  };

  const listaExtras =
    extras.length > 0
      ? extras
          .map((extra) => `${nombresExtras[extra]}: ${soles(preciosExtras[extra] * cantidad)}`)
          .join(" | ")
      : "Sin extras";

  const tipoEntrega =
    entrega === "domicilio"
      ? `Domicilio: ${soles(precioEntrega)}`
      : "Retiro en local: Gratis";


  mensaje.textContent =
    `¡Gracias, ${nombre}!\n` +
    `Pedido: ${cantidad} x ${nombresPollo[pollo]}\n` +
    `Pollo: ${soles(subtotalPollo)}\n` +
    `Extras: ${listaExtras}\n` +
    `${tipoEntrega}\n` +
    `TOTAL A PAGAR: ${soles(total)}`;

  mensaje.className = "msg ok";
});