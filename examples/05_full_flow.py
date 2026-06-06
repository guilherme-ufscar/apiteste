"""
Exemplo 05: Fluxo Completo — Do Período ao Boletim
=====================================================
Demonstra o fluxo completo de um sistema escolar:
  1. Criar período letivo
  2. Criar professor e disciplina
  3. Criar aluno
  4. Matricular aluno na disciplina
  5. Lançar notas
  6. Consultar boletim

Conceitos REST avançados:
  - Recursos aninhados: POST /enrollments/{id}/grades
  - Representação de estado: boletim calculado pelo servidor
  - Idempotência: POST em /grades faz upsert (cria ou atualiza)
"""

import requests
from config import BASE_URL


def post(path: str, data: dict) -> dict:
    """Helper: POST e retorna JSON ou lança erro com mensagem clara."""
    r = requests.post(f"{BASE_URL}{path}", json=data)
    if not r.ok:
        print(f"  ✗ ERRO em POST {path}: {r.status_code} — {r.text[:200]}")
        r.raise_for_status()
    return r.json()


def get(path: str, **params) -> dict | list:
    r = requests.get(f"{BASE_URL}{path}", params=params)
    r.raise_for_status()
    return r.json()


def main():
    print("=" * 60)
    print("  Exemplo 05 — Fluxo Completo")
    print("=" * 60)

    # 1. Criar período
    print("\n[1] Criando período...")
    period = post("/periods", {
        "name": "2025/2", "year": 2025, "semester": 2,
        "start_date": "2025-07-28", "end_date": "2025-12-15",
        "is_active": True
    })
    print(f"  ✓ Período: {period['name']} (id={period['id']})")

    # 2. Criar professor
    print("\n[2] Criando professor...")
    import time
    teacher = post("/teachers", {
        "name": "Carlos Eduardo",
        "email": f"carlos.edu.{int(time.time())}@escola.com"
    })
    print(f"  ✓ Professor: {teacher['name']} (id={teacher['id']})")

    # 3. Criar disciplina com vínculo ao professor
    print("\n[3] Criando disciplina...")
    subject = post("/subjects", {
        "name": "Cálculo I",
        "code": f"CAL{int(time.time()) % 10000}",
        "workload_hours": 80,
        "teacher_id": teacher["id"]
    })
    print(f"  ✓ Disciplina: {subject['name']} ({subject['code']})")

    # 4. Criar aluno
    print("\n[4] Criando aluno...")
    student = post("/students", {
        "name": "Fernanda Ribeiro",
        "email": f"fernanda.{int(time.time())}@email.com",
        "registration": f"2025{int(time.time()) % 10000:04d}"
    })
    print(f"  ✓ Aluno: {student['name']} — matrícula {student['registration']}")

    # 5. Matricular aluno na disciplina/período
    print("\n[5] Matriculando aluno...")
    enrollment = post("/enrollments", {
        "student_id": student["id"],
        "subject_id": subject["id"],
        "period_id": period["id"]
    })
    print(f"  ✓ Matrícula criada (id={enrollment['id']}, status={enrollment['status']})")

    # 6. Lançar notas
    print("\n[6] Lançando notas...")
    grades_to_add = [
        {"grade_type": "AV1", "value": 8.5, "notes": "Boa prova"},
        {"grade_type": "AV2", "value": 7.0},
        {"grade_type": "Final", "value": 7.75},
    ]
    for grade_data in grades_to_add:
        g = post(f"/enrollments/{enrollment['id']}/grades", grade_data)
        print(f"  ✓ {g['grade_type']}: {float(g['value']):.1f}")

    # 7. Verificar notas da matrícula
    print(f"\n[7] Notas da matrícula id={enrollment['id']}...")
    grades = get(f"/enrollments/{enrollment['id']}/grades")
    for g in grades:
        print(f"  {g['grade_type']}: {float(g['value']):.1f}")

    avg = sum(float(g["value"]) for g in grades) / len(grades)
    print(f"  Média calculada localmente: {avg:.2f}")

    # 8. Boletim completo pelo servidor
    print(f"\n[8] Boletim do aluno id={student['id']}...")
    boletim = get(f"/students/{student['id']}/report-card")
    for entry in boletim["report"]:
        situacao = "APROVADO ✓" if entry["passed"] else "REPROVADO ✗"
        print(f"  Disciplina: {entry['subject']['name']}")
        print(f"  Média: {entry['average_grade']:.2f} — {situacao}")
        print(f"  Notas: {entry['grades']}")

    # 9. Dashboard
    print("\n[9] Dashboard geral...")
    dash = get("/dashboard/stats")
    print(f"  Alunos: {dash['total_students']}")
    print(f"  Professores: {dash['total_teachers']}")
    print(f"  Disciplinas: {dash['total_subjects']}")
    print(f"  Matrículas ativas: {dash['active_enrollments']}")
    print(f"  Média geral: {dash['average_grade']}")

    print("\n  🎉 Fluxo completo executado com sucesso!")


if __name__ == "__main__":
    main()
