from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3
import jwt  # Instale com `pip install pyjwt` ((feito))
import datetime

app = Flask(__name__, template_folder='templates')
CORS(app)
SECRET_KEY = "segredo_wayne"  # Chave secreta para gerar tokens JWT


# função para verificar hierarquia
def verificar_hierarquia(token, pagina):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        if pagina == "usuarios.html" and decoded["hierarquia"] != "admin":
            return jsonify({"message": "Acesso negado"}), 401
        return render_template(pagina)
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expirado, faça login novamente"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Token inválido"}), 401



# carregando as rotas
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/central-operacional")
def central_operacional():
    return render_template("central-operacional.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/usuarios", methods=["GET"])
def usuarios():
  token = request.args.get("token")
  if not token:
    return jsonify({"message": "Token não fornecido"}), 401

  decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
  if decoded["username"] != "admin": # somente o usuário admin do departamento de TI terá acesso a página de usuários e poderá fazer alterações
    return jsonify({"message": "Acesso negado"}), 401

  return render_template("usuarios.html")

    

@app.route('/recursos')
def recursos():
    return render_template('recursos.html')

@app.route("/perfil")
def perfil():
  return render_template("perfil.html")

@app.route("/editar-perfil")
def editar_perfil():
  return render_template("editar-perfil.html")

@app.route('/adicionar-recurso')
def adicionar_recurso():
    return render_template('adicionar-recurso.html')

@app.route('/editar-recurso/<int:id>')
def editar_recurso(id):
    return render_template('editar-recurso.html', id=id)



@app.route('/recursos', methods=['POST'])
def adicionar_recurso_post():
    dados = request.json
    tipo = dados.get("tipo")
    placa = dados.get("placa")
    marca = dados.get("marca")
    modelo = dados.get("modelo")
    ano = dados.get("ano")
    quantidade = dados.get("quantidade")
    valor = dados.get("valor")
    local_operacao = dados.get("local_operacao")

    try:
        conexao = sqlite3.connect("projeto.db")
        cursor = conexao.cursor()
        cursor.execute("INSERT INTO recursos (tipo, placa, marca, modelo, ano, quantidade, valor, local_operacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (tipo, placa, marca, modelo, ano, quantidade, valor, local_operacao))
        conexao.commit()
        conexao.close()
        return jsonify({"message": "Recurso adicionado com sucesso!"}), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Erro ao adicionar recurso: " + str(e)}), 500


@app.route('/editar-recurso/<int:id>', methods=['PUT'])
def editar_recurso_put(id):
    dados = request.json
    tipo = dados.get("tipo")
    placa = dados.get("placa")
    marca = dados.get("marca")
    modelo = dados.get("modelo")
    ano = dados.get("ano")
    quantidade = dados.get("quantidade")
    valor = dados.get("valor")
    local_operacao = dados.get("local_operacao")

    conn = sqlite3.connect("projeto.db")
    cursor = conn.cursor()
    cursor.execute("UPDATE recursos SET tipo = ?, placa = ?, marca = ?, modelo = ?, ano = ?, quantidade = ?, valor = ?, local_operacao = ? WHERE id = ?", (tipo, placa, marca, modelo, ano, quantidade, valor, local_operacao, id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Recurso editado com sucesso!"}), 200

@app.route('/excluir-recurso/<int:id>', methods=['DELETE'])
def excluir_recurso(id):
    conn = sqlite3.connect("projeto.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM recursos WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Recurso excluído com sucesso!"}), 200

@app.route('/recursos/listar')
def carregar_recursos():
  conn = sqlite3.connect("projeto.db")
  cursor = conn.cursor()
  cursor.execute("SELECT * FROM recursos")
  recursos = cursor.fetchall()
  conn.close()
  return jsonify({"recursos": [{"id": r[0], "tipo": r[1], "placa": r[2], "marca": r[3], "modelo": r[4], "ano": r[5], "quantidade": r[6], "valor": r[7], "local_operacao": r[8]} for r in recursos]})

# recursos removidos para o painel da dashboard
@app.route('/recursos/removidos/listar')
def carregar_recursos_removidos():
    conn = sqlite3.connect("projeto.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM recursos WHERE quantidade = 0")
    recursos = cursor.fetchall()
    conn.close()
    return jsonify({"recursos": [{"id": r[0], "tipo": r[1], "placa": r[2], "marca": r[3], "modelo": r[4], "ano": r[5], "quantidade": r[6], "valor": r[7], "local_operacao": r[8]} for r in recursos]})

@app.route('/recursos/<int:id>')
def carregar_recurso(id):
    conn = sqlite3.connect("projeto.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM recursos WHERE id = ?", (id,))
    recurso = cursor.fetchone()
    conn.close()
    return jsonify({"recurso": {"id": recurso[0], "tipo": recurso[1], "placa": recurso[2], "marca": recurso[3], "modelo": recurso[4], "ano": recurso[5], "quantidade": recurso[6], "valor": recurso[7], "local_operacao": recurso[8]}}), 200


@app.route("/adicionar-usuario", methods=["POST"])
def adicionar_usuario():
    dados = request.json
    novo_usuario = dados.get("novoUsuario")
    nova_senha = dados.get("novaSenha")
    hierarquia = dados.get("hierarquia", "usuario")  # Adicione um valor padrão para a hierarquia

    with sqlite3.connect("projeto.db") as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO usuarios_auth (username, password, hierarquia) VALUES (?, ?, ?)", (novo_usuario, nova_senha, hierarquia))
        conn.commit()
    return jsonify({"message": "Usuário adicionado com sucesso!"}), 200


@app.route("/carregar-usuarios", methods=["GET"])
def carregar_usuarios():
  conn = sqlite3.connect("projeto.db")
  cursor = conn.cursor()
  cursor.execute("SELECT * FROM usuarios_auth")
  usuarios = cursor.fetchall()
  conn.close()
  return jsonify({
      "usuarios": [
          {"id": u[0], "nome": u[1], "hierarquia": u[3]} for u in usuarios
      ]
  }), 200


  

@app.route("/editar-usuario/<int:id>", methods=["POST"])
def editar_usuario(id):
  dados = request.json
  novo_nome = dados.get("novoNome")
  nova_senha = dados.get("novaSenha")

  conn = sqlite3.connect("projeto.db")
  cursor = conn.cursor()
  cursor.execute("UPDATE usuarios_auth SET username = ?, password = ? WHERE id = ?", (novo_nome, nova_senha, id))
  conn.commit()
  conn.close()
  return jsonify({"message": "Usuário editado com sucesso!"}), 200

@app.route("/excluir-usuario/<int:id>", methods=["DELETE"])
def excluir_usuario(id):
  conn = sqlite3.connect("projeto.db")
  cursor = conn.cursor()
  cursor.execute("DELETE FROM usuarios_auth WHERE id = ?", (id,))
  conn.commit()
  conn.close()
  return jsonify({"message": "Usuário excluído com sucesso!"}), 200



# Função para verificar usuário no banco
def validar_usuario(username, password):
    conn = sqlite3.connect("projeto.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM usuarios_auth WHERE username=? AND password=?", (username, password))
    user = cursor.fetchone()
    conn.close()
    return user

@app.route("/login", methods=["POST"])
def login():
    dados = request.json
    username = dados.get("username")
    password = dados.get("password")

    if validar_usuario(username, password):
        conn = sqlite3.connect("projeto.db")
        cursor = conn.cursor()
        cursor.execute("SELECT hierarquia FROM usuarios_auth WHERE username = ?", (username,))
        hierarquia = cursor.fetchone()[0]
        conn.close()

        token = jwt.encode(
            {
                "username": username,
                "hierarquia": hierarquia,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            },
            SECRET_KEY, algorithm="HS256"
        )

        return jsonify({
            "message": "Login bem-sucedido",
            "token": token,
            "redirect": "/central-operacional"
        }), 200
    else:
        return jsonify({"message": "Usuário ou senha incorretos"}), 401
    


@app.route("/verificar-token", methods=["GET"])
def verificar_token():
    token = request.headers.get("Authorization")

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        if decoded["username"] == "admin":
            return jsonify({"message": f"Bem-vindo, {decoded['username']} ao sistema Wayne!"})
        else:
            return jsonify({"message": "Área restrita, você não tem permissão para acessar!"}), 401
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expirado, faça login novamente"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Token inválido"}), 401

if __name__ == "__main__":
    app.run(debug=True)