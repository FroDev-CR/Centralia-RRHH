# Centralia RRHH (Centralia Personas)

RRHH y Nómina para Costa Rica, construido sobre los datos de **Centralia Marcaje**. Parte de la suite Centralia (ChatBot · POS · Marcaje · Personas).

Sitio estático: una **landing** y un **app** funcional (gestión de personal + nómina). Sin backend: los datos se guardan en el navegador (localStorage) y se pueden exportar/importar como JSON.

## Estructura

```
.
├── index.html        # Landing page
├── app/index.html    # App (gestión de personal + nómina)
├── vercel.json        # Config de despliegue (cleanUrls + rewrite /app)
├── package.json
└── README.md
```

## Funcionalidad del app

**Ola 1 — Gestión de personal**
- Expediente del empleado (cédula, puesto, sucursal, salario, ingreso, jornada, contrato).
- Vacaciones calculadas automáticamente (proporcional, 14 días/año — mínimo de ley CR).
- Solicitudes (vacaciones, permisos, incapacidades) con aprobación/rechazo.
- Ausencias (faltas, tardías, incapacidades).
- Alertas automáticas (fin de período de prueba, vacaciones acumuladas, contratos por vencer).

**Ola 2 — Nómina Costa Rica**
- Planilla por período (mensual/quincenal) con horas extra y deducciones.
- Cargas sociales CCSS (obrero/patrono) configurables en Ajustes.
- Colilla de pago imprimible (PDF) y planilla imprimible.
- Aguinaldo proyectado (ciclo dic–nov).
- Calculadora de liquidación (vacaciones, aguinaldo, preaviso y cesantía con tope de 8 años).

> Las cifras regulatorias (CCSS, cesantía, vacaciones) son referencias a 2025-2026 y deben validarse con un asesor laboral antes de un uso en producción.

## Desarrollo local

```bash
npx serve .
# abrí http://localhost:3000  (app en /app)
```

## Despliegue en Vercel

1. Importá este repositorio en https://vercel.com/new
2. Framework Preset: **Other** (sitio estático, sin build).
3. Deploy. La landing queda en `/` y el app en `/app`.

O con la CLI:

```bash
npm i -g vercel
vercel        # preview
vercel --prod # producción
```

---

Hecho en Costa Rica · Centralia.
