// Archivo generado automáticamente - No editar manualmente
export const topicsListHex = [
    // SoroswapPair events
    ["536f726f7377617050616972", "73796e63"], //sync
    ["536f726f7377617050616972", "6465706f736974"], //deposit
    ["536f726f7377617050616972", "73776170"], //swap
    ["536f726f7377617050616972", "7769746864726177"], //withdraw
    ["536f726f7377617050616972", "736b696d"], //skim    
    
    // SoroswapFactory events
    ["536f726f73776170466163746f7279", "6e65775f70616972"], //new_pair
    ["536f726f73776170466163746f7279", "6665655f746f"], //fee_to
    ["536f726f73776170466163746f7279", "696e6974"] //init
] as const;

// Tipo para los topics en hex
export type TopicPairHex = typeof topicsListHex[number];

// Helper para obtener todos los topics hex de un contrato específico
export function getHexTopicsForContract(contractHex: string): string[] {
    return topicsListHex
        .filter(([contractName]) => contractName === contractHex)
        .map(([, topic]) => topic);
}
