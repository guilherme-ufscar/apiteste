"""
Exemplo 04: Gerenciando Disciplinas
======================================
Demonstra criação de disciplinas com vínculo a professor.
"""

import requests
from config import BASE_URL
from02_teachers import main as create_teacher


def main():
    print("=" * 55)
    print("  Exemplo 04 — Disciplinas")
    print("=" * 55)

    # Primeiro criar um professor para vincular
    teacher_id = create_teacher()

    disciplinas = [
        {"name": "Matemática", "code": "MAT101", "workload_hours": 80, "teacher_id": teacher_id},
        {"name": "Português", "code": "PORT102", "workload_hours": 80, "teacher_id": teacher_id},
        {"name": "Física", "code": "FIS103", "workload_hours": 60},
        {"name": "História", "code": "HIS104", "workload_hours": 60},
    ]

    print(f"\n[1] Criando {len(disciplinas)} disciplinas...")
    ids = []
    for d in disciplinas:
        r = requests.post(f"{BASE_URL}/subjects", json=d)
        r.raise_for_status()
        subj = r.json()
        teacher_name = subj["teacher"]["name"] if subj.get("teacher") else "—"
        print(f"  ✓ {subj['code']} | {subj['name']} | Prof: {teacher_name}")
        ids.append(subj["id"])

    # Listar
    print("\n[2] Listando todas as disciplinas...")
    r = requests.get(f"{BASE_URL}/subjects")
    r.raise_for_status()
    print(f"  Total: {len(r.json())} disciplinas")

    # Filtrar por professor
    print(f"\n[3] Disciplinas do professor id={teacher_id}...")
    r = requests.get(f"{BASE_URL}/subjects", params={"teacher_id": teacher_id})
    r.raise_for_status()
    print(f"  Encontradas: {[s['name'] for s in r.json()]}")

    print("\n  ✅ Disciplinas criadas com sucesso!")
    return ids


if __name__ == "__main__":
    main()
