"""
Exemplo 03: Gerenciando Alunos
================================
Conceitos REST demonstrados:
  POST   /students             → Criar aluno
  GET    /students             → Listar com busca e paginação
  GET    /students/{id}        → Buscar por ID
  PATCH  /students/{id}        → Atualizar parcialmente
  GET    /students/{id}/report-card → Sub-recurso (boletim)

  Paginação com query params: ?skip=0&limit=10
"""

import requests
from config import BASE_URL


def create_student(name: str, email: str, registration: str) -> dict:
    r = requests.post(f"{BASE_URL}/students", json={
        "name": name,
        "email": email,
        "registration": registration,
        "is_active": True
    })
    r.raise_for_status()
    return r.json()


def main():
    print("=" * 55)
    print("  Exemplo 03 — Alunos")
    print("=" * 55)

    # 1. Criar 3 alunos
    print("\n[1] Criando alunos...")
    alunos = [
        create_student("João Pedro Santos", "joao.pedro@email.com", "2025001"),
        create_student("Ana Carolina Lima", "ana.carolina@email.com", "2025002"),
        create_student("Rafael Oliveira", "rafael.oli@email.com", "2025003"),
    ]
    for a in alunos:
        print(f"  ✓ id={a['id']} | {a['name']} | matrícula={a['registration']}")

    # 2. Listar com paginação
    print("\n[2] Listando alunos com paginação (limit=2, skip=0)...")
    r = requests.get(f"{BASE_URL}/students", params={"limit": 2, "skip": 0})
    r.raise_for_status()
    page1 = r.json()
    print(f"  Página 1: {[a['name'] for a in page1]}")

    r = requests.get(f"{BASE_URL}/students", params={"limit": 2, "skip": 2})
    r.raise_for_status()
    page2 = r.json()
    print(f"  Página 2: {[a['name'] for a in page2]}")

    # 3. Busca por nome
    print("\n[3] Buscando aluno por nome 'Ana'...")
    r = requests.get(f"{BASE_URL}/students", params={"name": "Ana"})
    r.raise_for_status()
    print(f"  Encontrados: {[a['name'] for a in r.json()]}")

    # 4. PATCH — Atualizar só o telefone
    student_id = alunos[0]["id"]
    print(f"\n[4] Atualizando telefone do aluno id={student_id} (PATCH)...")
    r = requests.patch(f"{BASE_URL}/students/{student_id}", json={
        "phone": "(11) 99999-0001"
    })
    r.raise_for_status()
    print(f"  ✓ Telefone: {r.json()['phone']}")

    # 5. Desativar aluno (soft delete)
    last_id = alunos[-1]["id"]
    print(f"\n[5] Desativando aluno id={last_id}...")
    r = requests.delete(f"{BASE_URL}/students/{last_id}")
    r.raise_for_status()
    print(f"  ✓ is_active agora = {r.json()['is_active']}")

    # 6. Boletim (sub-recurso)
    print(f"\n[6] Boletim do aluno id={student_id}...")
    r = requests.get(f"{BASE_URL}/students/{student_id}/report-card")
    r.raise_for_status()
    boletim = r.json()
    print(f"  Aluno: {boletim['student']['name']}")
    print(f"  Matrículas: {len(boletim['report'])}")

    print("\n  ✅ Todos os testes de alunos passaram!")
    return [a["id"] for a in alunos[:2]]


if __name__ == "__main__":
    main()
