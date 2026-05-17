import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_IP ?? "db",
  port: process.env.MYSQL_PORT ?? 3306,
  user: process.env.MYSQL_USER ?? "validate-cert-auth-manager",
  password: process.env.MYSQL_PASSWORD ?? "secretpass",
  database: process.env.MYSQL_DATABASE ?? "validate",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Função para inicializar o banco de dados
export async function initializeDatabase() {
  try {
    // Primeiro, cria o banco de dados se não existir
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_IP ?? "db",
      port: process.env.MYSQL_PORT ?? "3306",
      user: process.env.MYSQL_USER ?? "validate-cert-auth-manager",
      password: process.env.MYSQL_PASSWORD ?? "secretpass",
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE}`,
    );
    await connection.end();

    // Agora cria as tabelas necessárias
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
    ];

    for (const tableQuery of tables) {
      await pool.query(tableQuery);
    }

    console.log("Database initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

export default pool;

//

// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// const pool = mysql.createPool({
//   host: process.env.MYSQL_IP,
//   port: process.env.MYSQL_PORT,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// // Função auxiliar para aguardar a disponibilidade do MySQL com retry
// async function waitForDatabase(maxRetries = 30, delayMs = 1000) {
//   for (let i = 0; i < maxRetries; i++) {
//     try {
//       const testConnection = await mysql.createConnection({
//         host: process.env.MYSQL_IP,
//         port: process.env.MYSQL_PORT,
//         user: process.env.MYSQL_USER,
//         password: process.env.MYSQL_PASSWORD,
//       });
//       await testConnection.end();
//       return true;
//     } catch (error) {
//       if (i === maxRetries - 1) throw error;
//       console.log(`Waiting for MySQL... (attempt ${i + 1}/${maxRetries})`);
//       await new Promise((resolve) => setTimeout(resolve, delayMs));
//     }
//   }
// }

// // Função para inicializar o banco de dados
// export async function initializeDatabase() {
//   try {
//     // Aguarda o MySQL ficar disponível
//     await waitForDatabase();

//     // Primeiro, cria o banco de dados se não existir
//     const connection = await mysql.createConnection({
//       host: process.env.MYSQL_IP,
//       port: process.env.MYSQL_PORT,
//       user: process.env.MYSQL_USER,
//       password: process.env.MYSQL_PASSWORD,
//     });

//     try {
//       await connection.query(
//         `CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DATABASE}\``,
//       );
//     } finally {
//       await connection.end();
//     }

//     // Agora cria as tabelas necessárias
//     const tables = [
//       `CREATE TABLE IF NOT EXISTS users (
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         username VARCHAR(255) NOT NULL UNIQUE,
//         password VARCHAR(255) NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )`,
//     ];

//     for (const tableQuery of tables) {
//       await pool.query(tableQuery);
//     }

//     console.log("Database initialized successfully");
//     return true;
//   } catch (error) {
//     console.error("Error initializing database:", error);
//     throw error;
//   }
// }

// export default pool;
