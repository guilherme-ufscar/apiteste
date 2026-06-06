"""
Exemplo 06: Tratamento de Erros HTTP
=======================================
A biblioteca requests não lança exceções automaticamente para erros HTTP.
Você precisa chamar r.raise_for_status() ou verificar r.status_code.

Códigos HTTP importantes:
  200 OK           — sucesso em GET, PUT, PATCH
  201 Created      — sucesso em POST (recurso criado)
  204 No Content   — sucesso em DELETE (sem corpo na resposta)
  400 Bad Request  — dados inválidos ou regra de negócio violada
  404 Not Found    — recurso não existe
  422 Unprocessable Entity — validação do Pydantic falhou (campos errados)
"""

import requests
from config import BASE_URL


def demo_404():
    print("\n--- 404 Not Found ---")
    r = requests.get(f"{BASE_URL}/students/999999")
    print(f"Status: {r.status_code}")
    if r.status_code == 404:
        print(f"Detalhe: {r.json()['detail']}")


def demo_422():
    print("\n--- 422 Unprocessable Entity (validação) ---")
    # email inválido → Pydantic rejeita
    r = requests.post(f"{BASE_URL}/students", json={
        "name": "Teste",
        "email": "nao-é-um-email"
    })
    print(f"Status: {r.status_code}")
    if r.status_code == 422:
        errors = r.json()["detail"]
        for err in errors:
            print(f"  Campo: {err['loc']} — {err['msg']}")


def demo_400():
    print("\n--- 400 Bad Request (email duplicado) ---")
    import time
    email = f"duplicado.{int(time.time())}@test.com"
    # Criar o primeiro
    r1 = requests.post(f"{BASE_URL}/students", json={"name": "A", "email": email})
    r1.raise_for_status()

    # Tentar criar com mesmo email
    r2 = requests.post(f"{BASE_URL}/students", json={"name": "B", "email": email})
    print(f"Status: {r2.status_code}")
    if r2.status_code == 400:
        print(f"Detalhe: {r2.json()['detail']}")


def demo_safe_request():
    print("\n--- Usando raise_for_status() ---")
    try:
        r = requests.get(f"{BASE_URL}/students/0")
        r.raise_for_status()  # lança requests.exceptions.HTTPError se 4xx/5xx
    except requests.exceptions.HTTPError as e:
        print(f"Erro HTTP capturado: {e.response.status_code}")
        print(f"Detalhe: {e.response.json()['detail']}")


def demo_response_inspection():
    print("\n--- Inspecionando a resposta ---")
    r = requests.get(f"{BASE_URL}/students")
    print(f"Status code: {r.status_code}")
    print(f"Content-Type: {r.headers.get('content-type')}")
    print(f"Tempo de resposta: {r.elapsed.total_seconds():.3f}s")
    data = r.json()
    print(f"Total de alunos: {len(data)}")


def main():
    print("=" * 55)
    print("  Exemplo 06 — Tratamento de Erros HTTP")
    print("=" * 55)

    demo_404()
    demo_422()
    demo_400()
    demo_safe_request()
    demo_response_inspection()

    print("\n  ✅ Demos de erro concluídas!")


if __name__ == "__main__":
    main()
