from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
from flask import Flask, request, jsonify, render_template
import dotenv
import os

dotenv.load_dotenv()

# I know you should not commit .env but in case you need to change the variables :)
SYSTEM_PROMPT = os.getenv("SYSTEM_PROMPT")
API_KEY = os.getenv("API_KEY")
MODEL = os.getenv("MODEL")

app = Flask(__name__)
CORS(app) 

@app.route("/")
def index():
    return render_template("index.html")


historico = []

@app.route("/perguntar", methods=["POST"])
def perguntar():
    dados = request.json
    mensagem = dados.get("mensagem", "")
    if not mensagem:
        return jsonify({"erro": "Mensagem vazia"}), 400

    resposta = obter_resposta_ollama(mensagem)
    return jsonify({"resposta": resposta})


def obter_resposta_ollama(mensagem, modelo=MODEL):
    historico.append({"role": "user", "content": mensagem})
    resposta = ""

    system_msg = {
        "role": "system",
        "content": SYSTEM_PROMPT
    }

    mensagens = historico + [system_msg]

    url = API_KEY
    data = {
        "model": modelo,
        "messages": mensagens,
        "stream": True
    }

    try:
        r = requests.post(url, json=data, stream=True)
        r.raise_for_status()
    except requests.RequestException as e:
        return f"Erro: {e}"

    for linha in r.iter_lines():
        if not linha:
            continue
        try:
            parte = linha.decode("utf-8").strip()
            if parte.startswith("data: "):
                parte = parte[len("data: "):]
            if parte == "[DONE]":
                break
            conteudo = json.loads(parte)['message']['content']
            resposta += conteudo
        except (json.JSONDecodeError, KeyError):
            continue

    historico.append({"role": "assistant", "content": resposta})
    return resposta


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=9000, debug=True)
