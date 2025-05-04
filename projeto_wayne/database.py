import sqlite3

def criar_tabela_usuarios():
    conexao = sqlite3.connect("projeto.db")
    cursor = conexao.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS usuarios_auth (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    """)

    # Adicionar um usuário (admin padrão) - Esse é o admin do departamento de TI de todo o sistema
    cursor.execute("INSERT OR IGNORE INTO usuarios_auth (username, password) VALUES ('admin', '1234')") 

    # Adicionar a coluna hierarquia
    cursor.execute("ALTER TABLE usuarios_auth ADD COLUMN hierarquia TEXT NOT NULL DEFAULT 'usuario'")

    # Atualizar o registro do admin com a hierarquia
    cursor.execute("UPDATE usuarios_auth SET hierarquia = 'admin' WHERE username = 'admin'")

    conexao.commit()
    conexao.close()

def criar_tabela_recursos():
    conexao = sqlite3.connect("projeto.db")
    cursor = conexao.cursor()

    # Criar uma nova tabela com a estrutura correta
    cursor.execute("""
    CREATE TABLE recursos_nova (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT,
        placa TEXT UNIQUE,
        marca TEXT,
        modelo TEXT,
        ano INTEGER,
        quantidade INTEGER,
        valor REAL,
        local_operacao TEXT
    )
    """)

    # Migrar os dados da tabela antiga para a nova
    cursor.execute("SELECT * FROM recursos")
    recursos = cursor.fetchall()

    for recurso in recursos:
        cursor.execute("INSERT OR IGNORE INTO recursos_nova (placa, marca, modelo, ano, quantidade, valor, local_operacao) VALUES (?, ?, ?, ?, ?, ?, ?)", (recurso[1], recurso[2], recurso[3], recurso[4], recurso[5], recurso[6], recurso[7]))

    # Excluir a tabela antiga
    cursor.execute("DROP TABLE recursos")
 
    # Renomear a nova tabela para o nome original
    cursor.execute("ALTER TABLE recursos_nova RENAME TO recursos")

    conexao.commit()
    conexao.close()

if __name__ == "__main__":
    criar_tabela_usuarios()
    criar_tabela_recursos()