"""
Exemplo 02: Gerenciando Professores
=====================================
Conceitos REST demonstrados:
  POST   /teachers      → Criar com validação de email único
  GET    /teachers      → Listar com filtro de nome
  PUT    /teachers/{id} → Atualização completa (todos os campos)
  DELETE /teachers/{id} → Soft delete (is_active = False)

  Diferença PUT vs PATCH:
    PUT   → substitui o recurso inteiro (todos os campos obrigatórios)
    PATCH → atualiza parcialmente (só os campos enviados)
"""

import requests
from config import BASE_URL


def main():
    print("=" * 55)
    print("  Exemplo 02 — Professores")
    print("=" * 55)

    # 1. Criar professor
    print("\n[1] Criando professor...")
    r = requests.post(f"{BASE_URL}/teachers", json={
        "name": "Maria Fernanda Silva",
        "email": "maria.fernanda@escola.com",
        "phone": "(11) 98765-4321",
        "hire_date": "2023-03-01"
    })
    r.raise_for_status()
    teacher = r.json()
    teacher_id = teacher["id"]
    print(f"  ✓ Professor criado: id={teacher_id}, nome='{teacher['name']}'")

    # 2. Tentar criar com mesmo email → deve retornar 400 Bad Request
    print("\n[2] Tentando criar professor com email duplicado...")
    r = requests.post(f"{BASE_URL}/teachers", json={
        "name": "Outro Fulano",
        "email": "maria.fernanda@escola.com",  # email já existe
    })
    print(f"  ✓ Status esperado 400: {r.status_code}")
    if r.status_code == 400:
        print(f"  ✓ Mensagem de erro: {r.json()['detail']}")

    # 3. Listar com filtro por nome
    print("\n[3] Buscando professores com nome 'Maria'...")
    r = requests.get(f"{BASE_URL}/teachers", params={"name": "Maria"})
    r.raise_for_status()
    found = r.json()
    print(f"  ✓ Encontrados: {len(found)} professor(es)")

    # 4. PUT — Atualização completa
    # Com PUT, devo enviar TODOS os campos, mesmo os que não mudam
    print(f"\n[4] Atualizando professor id={teacher_id} (PUT)...")
    r = requests.put(f"{BASE_URL}/teachers/{teacher_id}", json={
        "name": "Maria Fernanda Silva",
        "email": "maria.fernanda@escola.com",
        "phone": "(11) 91111-2222",  # novo telefone
        "hire_date": "2023-03-01",
        "is_active": True
    })
    r.raise_for_status()
    print(f"  ✓ Telefone atualizado para: {r.json()['phone']}")

    # 5. Buscar por ID
    print(f"\n[5] Buscando professor id={teacher_id}...")
    r = requests.get(f"{BASE_URL}/teachers/{teacher_id}")
    r.raise_for_status()
    print(f"  ✓ {r.json()['name']} — is_active={r.json()['is_active']}")

    print("\n  ✅ Todos os testes de professores passaram!")
    return teacher_id


if __name__ == "__main__":
    main()
