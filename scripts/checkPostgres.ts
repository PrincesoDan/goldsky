import { Pool } from 'pg';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configurar la conexión con parámetros individuales
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    ssl: {
        rejectUnauthorized: false // Necesario para conexiones SSL a Neon
    },
    port: 5432 // Puerto por defecto de PostgreSQL
});

async function checkDatabase() {
    let client;
    try {
        // Conectar a la base de datos
        client = await pool.connect();
        console.log('✅ Conexión exitosa a PostgreSQL');

        // 1. Obtener la estructura de la tabla
        console.log('\n📋 Estructura de la tabla soroswap_pair_events:');
        const columnsQuery = await client.query(`
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'soroswap_pair_events'
            ORDER BY ordinal_position;
        `);
        
        columnsQuery.rows.forEach(column => {
            console.log(`- ${column.column_name}: ${column.data_type}${column.character_maximum_length ? `(${column.character_maximum_length})` : ''}`);
        });

        // 2. Verificar eventos con contract_id válido
        const validContractsQuery = await client.query(`
            SELECT 
                id,
                transaction_hash,
                topics,
                topics_decoded,
                data,
                data_decoded,
                contract_id,
                COUNT(*) OVER() as total_count
            FROM soroswap_pair_events
            WHERE contract_id IS NOT NULL 
              AND contract_id != ''
              AND contract_id != '0'
            LIMIT 10;
        `);

        // Mostrar total de eventos válidos
        const totalValidEvents = validContractsQuery.rows[0]?.total_count || 0;
        console.log(`\n📊 Total de eventos con contract_id válido: ${totalValidEvents}`);

        // Mostrar los últimos 10 eventos válidos
        console.log('\n🔍 Últimos 10 eventos con contract_id válido:');
        validContractsQuery.rows.forEach((row, index) => {
            console.log(`\n📝 Evento #${index + 1}:`);
            console.log('ID:', row.id);
            console.log('Contract ID:', row.contract_id);
            console.log('Transaction Hash:', row.transaction_hash);
            console.log('Topics:', row.topics);
            console.log('Topics Decoded:', row.topics_decoded);
            console.log('Data:', row.data);
            console.log('Data Decoded:', row.data_decoded);
            console.log('------------------------');
        });

        // 3. Mostrar distribución de eventos por contract_id
        const contractDistributionQuery = await client.query(`
            SELECT 
                contract_id,
                COUNT(*) as event_count
            FROM soroswap_pair_events
            WHERE contract_id IS NOT NULL 
              AND contract_id != ''
              AND contract_id != '0'
            GROUP BY contract_id
            ORDER BY event_count DESC
            LIMIT 10;
        `);

        console.log('\n📊 Distribución de eventos por contract_id:');
        contractDistributionQuery.rows.forEach(row => {
            console.log(`- Contract ${row.contract_id}: ${row.event_count} eventos`);
        });

    } catch (error) {
        console.error('❌ Error al consultar la base de datos:', error);
        if (error) {
            console.error('Código de error:', error);
        }
        process.exit(1);
    } finally {
        // Asegurarse de cerrar la conexión incluso si hay errores
        if (client) {
            client.release();
        }
        await pool.end();
    }
}

// Ejecutar la función
checkDatabase().catch(error => {
    console.error('Error no manejado:', error);
    process.exit(1);
});
