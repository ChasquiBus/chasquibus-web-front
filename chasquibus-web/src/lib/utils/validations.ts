// Validaciones reutilizables para formularios de Ecuador

// Validar RUC ecuatoriano (13 dígitos, últimos 3 son 001, reglas para naturales y jurídicas)
export function validarRucEcuador(ruc: string): boolean {
  if (!/^\d{13}$/.test(ruc)) return false;
  const ultimos3 = ruc.substring(10);
  if (ultimos3 !== '001') return false;
  const tercer = ruc[2];
  if (tercer === '6' || tercer === '9') return true; // Jurídicas
  return true; // Naturales
}

// Validar email (formato básico)
export function validarEmail(email: string): boolean {
  if (!email) return false;
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

// Validar número celular ecuatoriano (10 dígitos, empieza con 09)
export function validarCelularEcuador(telefono: string): boolean {
  if (!/^09\d{8}$/.test(telefono)) return false;
  return true;
}

// Validar sitio web (debe empezar con https://www. y tener un dominio válido)
export function validarSitioWeb(url: string): boolean {
  if (!url) return false;
  // Debe empezar con https://www. y luego un dominio válido
  return /^https:\/\/www\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(url);
}

// Validar cédula ecuatoriana
export function validarCedulaEcuador(cedula: string): boolean {
  if (!/^\d{10}$/.test(cedula)) return false;
  const provincia = parseInt(cedula.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) return false;
  const tercer = parseInt(cedula[2], 10);
  if (tercer < 0 || tercer > 6) return false;
  // Algoritmo módulo 10
  let total = 0;
  for (let i = 0; i < 9; i++) {
    let num = parseInt(cedula[i], 10);
    if (i % 2 === 0) {
      num = num * 2;
      if (num > 9) num -= 9;
    }
    total += num;
  }
  const verificador = (10 - (total % 10)) % 10;
  return verificador === parseInt(cedula[9], 10);
}

// Validar placa ecuatoriana (formato AAA-1234)
export function validarPlacaEcuador(placa: string): boolean {
  // Debe tener exactamente 8 caracteres, patrón AAA-1234
  return /^[A-Z]{3}-\d{4}$/.test(placa);
}

// Formatear la placa en tiempo real
export function formatearPlacaEcuador(input: string): string {
  // Eliminar todo lo que no sea letra o número
  const limpio = input.replace(/[^A-Za-z0-9]/g, '');
  // Solo permitir letras en las primeras 3 posiciones, convertir a mayúsculas
  let letras = limpio.slice(0, 3).replace(/[^A-Za-z]/g, '').toUpperCase();
  // Solo permitir números en las siguientes 4 posiciones
  let numeros = limpio.slice(3).replace(/[^0-9]/g, '');
  if (letras.length > 3) letras = letras.slice(0, 3);
  if (numeros.length > 4) numeros = numeros.slice(0, 4);
  let resultado = letras;
  if (letras.length === 3) {
    resultado += '-';
  }
  resultado += numeros;
  return resultado;
}

// Validar total de asientos piso 1 (solo números del 1 al 50)
export function validarTotalAsientosPiso1(valor: string | number): boolean {
  const n = Number(valor);
  return Number.isInteger(n) && n >= 1 && n <= 50;
}

// Validar suma de asientos para bus de dos pisos (máximo 80)
export function validarSumaAsientosPisos(piso1: number, piso2: number): boolean {
  return piso1 + piso2 <= 80;
} 