# Sistema de Gestão e Segurança - Indústrias Wayne

Sistema interno de gestão e segurança com foco na administração de usuários e recursos (veículos e armas), desenvolvido com Flask (python) e frontend HTML/CSS/JS puro.

## Funcionalidades

- Login com autenticação JWT
- Controle de usuários (Admin/Gerente/Colaborador) <!--Somente o usuário administrador do sistema "admin" tem acesso ao cadastro de usuários  -->
- Cadastro e gestão de recursos (veículos, armas)
- Dashboard com relatórios e gráficos

## Requisitos

- Python 3.10+

## Instalação

1. Clone este repositório
2. Instale os requisitos:

```bash
pip install -r requirements.txt
```

3. Rode a criação do banco de dados:

```bash
python database.py
```

4. Inicie o servidor Flask:

```bash
python app.py
```

Acesse no navegador: `http://127.0.0.1:5000`

## Credenciais de Acesso ((usuário administrador do sistema com acesso total | Somente esse usuário pode criar novos usuários))

- **Usuário:** admin
- **Senha:** 1234

## Token JWT

- **Chave secreta:** segredo_wayne

## Estrutura

```
PROJETO_WAYNE
|-- static/
    |-- css/styles.css
    |-- js/script.js
    |-- images/logotipo.jpg
|-- templates/
    |-- central-operacional.html
    |-- dashboard.html
    |-- index.htm
    |-- recursos.html
    |-- usuarios.html
|-- app.py
|-- database.py
|-- recursos.py
|-- projeto.db
|-- requirements.txt
|-- README.md


```

---

Desenvolvido por Jeferson Cardoso - Desenvolvedor FullStack.
