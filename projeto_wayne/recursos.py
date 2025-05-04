import sqlite3

def adicionar_recurso(nome, descricao):
    conexao = sqlite3.connect("projeto.db")
    cursor = conexao.cursor()

    cursor.execute("INSERT INTO recursos (nome, descricao) VALUES (?, ?)", (nome, descricao))
    conexao.commit()
    conexao.close()

def remover_recurso(id):
    conexao = sqlite3.connect("projeto.db")
    cursor = conexao.cursor()

    cursor.execute("DELETE FROM recursos WHERE id = ?", (id,))
    conexao.commit()
    conexao.close()

def editar_recurso(id, nome, descricao):
    conexao = sqlite3.connect("projeto.db")
    cursor = conexao.cursor()

    cursor.execute("UPDATE recursos SET nome = ?, descricao = ? WHERE id = ?", (nome, descricao, id))
    conexao.commit()
    conexao.close()