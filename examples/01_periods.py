"""
Exemplo 01: Gerenciando Períodos Letivos
========================================
Conceitos REST demonstrados:
  POST   /periods      → Criar recurso (status 201 Created)
  GET    /periods      → Listar recursos
  GET    /periods/{id} → Buscar recurso por ID
  PATCH  /periods/{id} → Atualizar parcialmente (só is_active)
  DELETE /periods/{id} → Remover recurso (status 204 No Content)
"""

import requests
from datetime import date, timedelta
from config import BASE_URL

def main():
    print("=" * 55)
    print("  Exemplo 01 — Períodos Letivos")
    print("=" * 55)

    # 1. POST — Criar um novo período
    # O servidor deve retornar status 201 Created
    print("\n[1] Criando período 2025/1...")
    payload = {
        "name": "2025/1",
        "year": 2025,
        "semester": 1,
        "start_date": "2025-02-10",
        "end_date": "2025-06-30",
        "is_active": False
    }
    r = requests.post(f"{BASE_URL}/periods", json=payload)
    r.raise_for_status()  # lança exceção se status >= 400
    assert r.status_code == 201, f"Esperava 201, recebi {r.status_code}"

    period = r.json()
    period_id = period["id"]
    print(f"  ✓ Criado: id={period_id}, nome='{period['name']}'")

    # 2. GET — Listar todos os períodos
    print("\n[2] Listando todos os períodos...")
    r = requests.get(f"{BASE_URL}/periods")
    r.raise_for_status()
    assert r.status_code == 200

    periods = r.json()
    print(f"  ✓ Total de períodos: {len(periods)}")
    for p in periods:
        print(f"     id={p['id']} | {p['name']} | ativo={p['is_active']}")

    # 3. GET — Buscar período por ID
    print(f"\n[3] Buscando período id={period_id}...")
    r = requests.get(f"{BASE_URL}/periods/{period_id}")
    r.raise_for_status()
    print(f"  ✓ Encontrado: {r.json()['name']}")

    # 4. PATCH — Atualização parcial: apenas ativar o período
    # Diferença do PUT: só envio os campos que quero mudar
    print(f"\n[4] Ativando período id={period_id} (PATCH)...")
    r = requests.patch(f"{BASE_URL}/periods/{period_id}", json={"is_active": True})
    r.raise_for_status()
    updated = r.json()
    print(f"  ✓ is_active agora = {updated['is_active']}")

    # 5. GET com filtro — Listar só períodos ativos
    print("\n[5] Listando apenas períodos ativos (query param)...")
    r = requests.get(f"{BASE_URL}/periods", params={"is_active": True})
    r.raise_for_status()
    active = r.json()
    print(f"  ✓ Períodos ativos: {len(active)}")

    # 6. GET stats — Estatísticas do período
    print(f"\n[6] Estatísticas do período id={period_id}...")
    r = requests.get(f"{BASE_URL}/periods/{period_id}/stats")
    r.raise_for_status()
    stats = r.json()
    print(f"  ✓ Alunos: {stats['total_students']}, Disciplinas: {stats['total_subjects']}")

    print("\n  ✅ Todos os testes de períodos passaram!")
    return period_id


if __name__ == "__main__":
    main()
