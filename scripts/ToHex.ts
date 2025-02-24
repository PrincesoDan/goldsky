import { Address } from '@stellar/stellar-sdk';
import { poolsList } from './poolsList';
import { topicsList } from './topicsList';
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
 * Convierte un string a su representación hexadecimal
 * @param str - String a convertir
 * @returns La representación hexadecimal del string
 */
function stringToHex(str: string): string {
  try {
    return Buffer.from(str).toString('hex').toLowerCase();
  } catch (error) {
    throw new Error(`Error al convertir el string a hexadecimal: ${error}`);
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

/**
 * Convierte la lista de topics a formato hexadecimal y genera un nuevo archivo
 */
function generateTopicsHexFile(): void {
  try {
    const hexTopics = topicsList.map(([contract, topic]) => [
      stringToHex(contract),
      stringToHex(topic)
    ]);
    
    const fileContent = `// Archivo generado automáticamente - No editar manualmente
export const topicsListHex = [
    // SoroswapPair events
    ["${hexTopics.slice(0, 5).map(([contract, topic]) => `${contract}", "${topic}`).join('"],\n    ["')}"],
    
    // SoroswapFactory events
    ["${hexTopics.slice(5).map(([contract, topic]) => `${contract}", "${topic}`).join('"],\n    ["')}"]
] as const;

// Tipo para los topics en hex
export type TopicPairHex = typeof topicsListHex[number];

// Helper para obtener todos los topics hex de un contrato específico
export function getHexTopicsForContract(contractHex: string): string[] {
    return topicsListHex
        .filter(([contractName]) => contractName === contractHex)
        .map(([, topic]) => topic);
}
`;

    const outputPath = path.join(__dirname, 'topicsListHex.ts');
    fs.writeFileSync(outputPath, fileContent);
    console.log('Archivo topicsListHex.ts generado exitosamente');
  } catch (error) {
    console.error('Error al generar el archivo:', error);
    process.exit(1);
  }
}

// Si el script se ejecuta directamente desde la línea de comandos
if (require.main === module) {
  generatePoolsHexFile();
  generateTopicsHexFile();
}

// Exportar las funciones para uso en otros módulos
export { addressToHex, stringToHex };
