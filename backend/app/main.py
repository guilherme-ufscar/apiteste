from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import periods, teachers, subjects, students, enrollments, grades, attendance, dashboard, reports

app = FastAPI(
    title="Sistema de Gestão Escolar",
    description="""
API REST para gerenciamento escolar completo.

## Recursos disponíveis
- **Períodos** — semestres/anos letivos
- **Professores** — cadastro e gestão de docentes
- **Disciplinas** — matérias com vínculo a professor
- **Alunos** — cadastro completo com matrícula
- **Matrículas** — vínculo aluno ↔ disciplina ↔ período
- **Notas** — lançamento por tipo (AV1, AV2, Final...)
- **Frequência** — registro de presença por aula
- **Dashboard** — estatísticas gerais
- **Relatórios** — resumos de desempenho

## Aprendendo REST API
Use o Swagger UI abaixo para testar todos os endpoints interativamente.
Cada operação mostra o método HTTP, URL, body esperado e resposta.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(periods.router, prefix="/v1/periods", tags=["Períodos"])
app.include_router(teachers.router, prefix="/v1/teachers", tags=["Professores"])
app.include_router(subjects.router, prefix="/v1/subjects", tags=["Disciplinas"])
app.include_router(students.router, prefix="/v1/students", tags=["Alunos"])
app.include_router(enrollments.router, prefix="/v1/enrollments", tags=["Matrículas"])
app.include_router(grades.router, prefix="/v1/grades", tags=["Notas"])
app.include_router(attendance.router, prefix="/v1/attendance", tags=["Frequência"])
app.include_router(dashboard.router, prefix="/v1/dashboard", tags=["Dashboard"])
app.include_router(reports.router, prefix="/v1/reports", tags=["Relatórios"])


@app.get("/", tags=["Root"])
def root():
    return {"message": "Sistema de Gestão Escolar API", "docs": "/docs", "version": "1.0.0"}
