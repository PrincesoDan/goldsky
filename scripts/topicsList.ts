// Archivo generado automáticamente - No editar manualmente
export const topicsList = [
    // SoroswapPair events
    ["SoroswapPair", "sync"], //sync
    ["SoroswapPair", "deposit"], //deposit
    ["SoroswapPair", "swap"], //swap
    ["SoroswapPair", "withdraw"], //withdraw
    ["SoroswapPair", "skim"], //skim
    
    // SoroswapFactory events
    ["SoroswapFactory", "new_pair"],
    ["SoroswapFactory", "fee_to"],
    ["SoroswapFactory", "init"]
] as const;

// Tipo para los topics
export type TopicPair = typeof topicsList[number];

// Helper para obtener todos los topics de un contrato específico
export function getTopicsForContract(contract: string): string[] {
    return topicsList
        .filter(([contractName]) => contractName === contract)
        .map(([, topic]) => topic);
}