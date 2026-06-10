import "dotenv/config";
import pool from "../../database";

async function migrate() {
  
  await pool.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar_url TEXT,
      bio TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE workspaces (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      deleted_at TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT FALSE,
      workspace_id INTEGER REFERENCES workspaces(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      deleted_at TIMESTAMP
    )
  `);

  await pool.query(`
    DO $$ BEGIN
      CREATE TYPE goal_type AS ENUM ('quantitative', 'qualitative');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  await pool.query(`
    CREATE TABLE goals (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      type goal_type NOT NULL DEFAULT 'quantitative',
      completed BOOLEAN DEFAULT FALSE,
      target_value INTEGER,
      current_value INTEGER DEFAULT 0,
      workspace_id INTEGER REFERENCES workspaces(id) ON DELETE CASCADE,
      expires_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      deleted_at TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE habits (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      streak INTEGER DEFAULT 0,
      workspace_id INTEGER REFERENCES workspaces(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      deleted_at TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE habit_logs (
      id SERIAL PRIMARY KEY,
      habit_id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
      completed_at DATE NOT NULL DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(habit_id, completed_at)
    )
  `);

  console.log("Migration 001_initial concluída.");
  process.exit(0);
}

migrate();
