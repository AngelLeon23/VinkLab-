# VinkLab

**Ciencia que encuentra a quien la financie.**

VinkLab es un marketplace de innovación abierta que conecta proyectos de ciencia y tecnología con empresas e inversionistas. Un asistente con IA sugiere mejoras a cada propuesta antes de publicarla y un motor de compatibilidad calcula qué tan bien encaja un proyecto con cada convocatoria.

## Características

- Vitrina de proyectos con búsqueda y filtros por área y presupuesto.
- Publicación de proyectos (creadores) y de convocatorias o retos (empresas e inversionistas).
- Asistente de redacción con IA: 3 recomendaciones antes de publicar.
- Porcentaje de compatibilidad entre proyectos y convocatorias.
- Contacto directo por correo electrónico.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Interfaz | Next.js + Tailwind CSS |
| Base de datos | Supabase (PostgreSQL) |
| IA | API de Groq (GPT-OSS) |
| Despliegue | Vercel |



## Limitaciones

- Sin inicio de sesión: cualquiera puede publicar con nombre y correo.
- Sin pagos ni chat; el contacto se hace por correo.
- Usa modelos preentrenados mediante API, no entrena modelos propios.
