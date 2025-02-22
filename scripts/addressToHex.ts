import { Address } from '@stellar/stellar-sdk';
import { poolsList } from './poolsList';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Convierte una dirección Stellar (C... o G...) a su representación hexadecimal
 * @param address - Dirección Stellar en formato strkey (C... o G...)
 * @returns La representación hexadecimal de la dirección
 */
function addressToHex(address: string): string {
  try {
    // Crear objeto Address desde el string
    const addr = new Address(address);
    
    // Obtener los bytes raw de la dirección
    const buffer = addr.toBuffer();
    
    // Convertir a hexadecimal y remover el '0x' del inicio si existe
    return buffer.toString('hex').toLowerCase();
  } catch (error) {
    throw new Error(`Error al convertir la dirección: ${error}`);
  }
}

/**
 * Convierte la lista de pools a formato hexadecimal y genera un nuevo archivo
 */
function generatePoolsHexFile(): void {
  try {
    const hexAddresses = poolsList.map(address => addressToHex(address));
    
    const fileContent = `// Archivo generado automáticamente - No editar manualmente
export const poolsListHex = [
    "${hexAddresses.join('",\n    "')}"
];
`;

    const outputPath = path.join(__dirname, 'poolListHex.ts');
    fs.writeFileSync(outputPath, fileContent);
    console.log('Archivo poolListHex.ts generado exitosamente');
  } catch (error) {
    console.error('Error al generar el archivo:', error);
    process.exit(1);
  }
}

// Si el script se ejecuta directamente desde la línea de comandos
if (require.main === module) {
  generatePoolsHexFile();
}

// Exportar la función para uso en otros módulos
export { addressToHex };
