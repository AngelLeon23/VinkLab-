# VinkLab 🔬🤝💡

**Ciencia que encuentra su inversión.** Marketplace de innovación abierta que vincula proyectos de ciencia y tecnología con empresas e inversionistas, con un **asistente de redacción por IA** (3 mejoras antes de publicar) y un **motor de compatibilidad** (% de coincidencia proyecto ↔ convocatoria).

Proyecto de *Fundamentos de Inteligencia Artificial* — UT Tabasco.
Stack (el de tu documento): **Next.js + Tailwind CSS · Supabase (PostgreSQL) · Groq (GPT-OSS) · Vercel · Git/GitHub**.

---

## Qué incluye (alcances del documento)

| Alcance del documento | Dónde está |
|---|---|
| Vitrina de proyectos + filtros por área y presupuesto | `app/page.js` |
| Doble flujo: creadores publican proyectos / empresas publican convocatorias | `app/proyectos/nuevo`, `app/campanas/nueva` |
| Asistente de redacción con IA (3 recomendaciones) | `app/api/asistente` + `lib/groq.js` |
| Motor de compatibilidad (similitud coseno) con % visual | `lib/matching.js` + `components/MatchBar.js` |
| Contacto directo por correo (sin chat, sin pagos) | botón “Contactar” en las páginas de detalle |
| Base de datos: Usuarios, Proyectos, Campañas, Postulaciones | `supabase/schema.sql` |
| 10 proyectos y 5 convocatorias de prueba | `supabase/seed.sql` |

---

# PASO A PASO DESDE CERO

> Las instrucciones usan **Windows**. En Mac/Linux es igual, solo cambia la forma de instalar (te lo indico donde aplica). Tiempo total aproximado: 1 a 1.5 horas la primera vez.

## Paso 1 · Instalar Node.js (el motor que ejecuta la app)

1. Entra a **https://nodejs.org** y descarga la versión **LTS** (20 o 22).
2. Ejecuta el instalador → *Next, Next, Next* (deja marcadas las opciones por defecto).
3. **Cierra y vuelve a abrir** cualquier terminal. Verifica:
   ```bash
   node -v
   npm -v
   ```
   Deben mostrar números de versión (por ejemplo `v22.x.x` y `10.x.x`).

> Si en PowerShell `npm` marca *“la ejecución de scripts está deshabilitada”*, ejecuta una vez:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` y responde `S`. (O usa el **Símbolo del sistema / CMD**.)

## Paso 2 · Instalar Git

1. Descarga desde **https://git-scm.com/downloads** e instala con opciones por defecto.
2. Configura tu identidad (usa el mismo correo de GitHub):
   ```bash
   git config --global user.name "Tu Nombre"
   git config --global user.email "tu-correo@ejemplo.com"
   git --version
   ```
   *(Mac: `brew install git` o se instala al escribir `git` en la terminal.)*

## Paso 3 · Instalar Visual Studio Code

1. Descarga desde **https://code.visualstudio.com** e instala.
2. (Recomendado) Extensiones: **Tailwind CSS IntelliSense** y **ES7+ React/Redux Snippets**.

## Paso 4 · Crear las cuentas (todas tienen plan gratuito)

| Servicio | Para qué sirve | Enlace |
|---|---|---|
| GitHub | Guardar el código (te lo pide la materia) | https://github.com |
| Supabase | Base de datos PostgreSQL | https://supabase.com |
| Groq | Groq (GPT-OSS) | https://console.groq.com |
| Vercel | Publicar la app en internet | https://vercel.com (entra con tu cuenta de GitHub) |
| Hugging Face *(opcional)* | Embeddings semánticos más precisos | https://huggingface.co |

## Paso 5 · Preparar el proyecto en tu computadora

1. Descomprime el archivo **`VinkLab.zip`** en una carpeta fácil, por ejemplo `C:\proyectos\VinkLab`.
2. Abre VS Code → **File → Open Folder** → selecciona la carpeta `VinkLab`.
3. Abre la terminal integrada: menú **Terminal → New Terminal**.
4. Instala las dependencias (tarda 1–3 min):
   ```bash
   npm install
   ```

## Paso 6 · Crear la base de datos en Supabase

1. En Supabase pulsa **New project**. Nombre: `VinkLab`. Crea y **guarda la contraseña** de la base de datos. Elige la región más cercana (por ejemplo *East US*). Espera ~2 min a que termine de crearse.
2. Menú izquierdo → **SQL Editor** → **New query**.
3. Abre en VS Code el archivo `supabase/schema.sql`, **copia todo**, pégalo en el editor de Supabase y pulsa **Run**. Debe decir *Success*.
4. Nueva query → copia todo `supabase/seed.sql` → **Run**. Esto carga 10 proyectos y 5 convocatorias de prueba.
5. Comprueba en **Table Editor** que existen las tablas `usuarios`, `proyectos`, `campanas`, `postulaciones` y que `proyectos` tiene 10 filas.
6. Copia tus claves: **Project Settings (engrane) → API** (o *API Keys*):
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** (o *publishable key*) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (o *secret key*) → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **secreta**: nunca la subas a GitHub ni la compartas.

## Paso 7 · Obtener la clave de Groq (IA con Llama 3)

1. Entra a **https://console.groq.com** → **API Keys** → **Create API Key**.
2. Copia la clave (empieza con `gsk_`). Solo se muestra una vez.
3. El modelo por defecto es `llama-3.3-70b-versatile`. Si Groq lo renombra, mira **console.groq.com/docs/models** y cambia `GROQ_MODEL`.

*(Opcional)* **Hugging Face**: *Settings → Access Tokens → New token (tipo Read)*. Pon el token en `HF_TOKEN`. Con él, el matching usa embeddings reales; sin él, usa un método de respaldo local que también funciona.

## Paso 8 · Configurar las variables de entorno

1. En la raíz del proyecto, copia `.env.example` como **`.env.local`**:
   ```bash
   copy .env.example .env.local        # Windows (CMD)
   cp .env.example .env.local          # Mac / Linux / PowerShell
   ```
2. Abre `.env.local` y pega tus claves de los pasos 6 y 7. Guarda.

## Paso 9 · Ejecutar la app

```bash
npm run dev
```
Abre **http://localhost:3000**. Verifica este recorrido (sirve también como evidencia para tu documento):

1. Ves la vitrina con 10 proyectos; prueba los filtros por área y presupuesto.
2. Entra a un proyecto → a la derecha aparecen las **convocatorias con % de compatibilidad**. Pulsa **Postular**.
3. Ve a **Publicar** → escribe un proyecto → **✨ Pedir 3 mejoras a la IA** → publícalo.
4. Ve a **Convocatorias → una convocatoria** → ranking de proyectos por compatibilidad.
5. Prueba el botón **Contactar** (abre tu cliente de correo).

Para detener el servidor: `Ctrl + C`.

## Paso 10 · Subir el código a GitHub (entregable)

1. En GitHub: **New repository** → nombre `VinkLab` → *Public* → **sin** README ni .gitignore → **Create**.
2. En la terminal de VS Code:
   ```bash
   git init
   git add .
   git commit -m "VinkLab: primera versión"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/VinkLab.git
   git push -u origin main
   ```
3. Verifica en GitHub que **no** aparezca `.env.local` (el `.gitignore` ya lo excluye). Esa URL del repositorio es la que entregas.

## Paso 11 · Publicarla en internet con Vercel

1. En **https://vercel.com** → **Add New… → Project** → importa el repositorio `VinkLab`.
2. Antes de pulsar *Deploy*, abre **Environment Variables** y agrega **las mismas variables** de tu `.env.local` (una por una): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GROQ_API_KEY`, `GROQ_MODEL` y, si lo usas, `HF_TOKEN` y `HF_MODEL`.
3. Pulsa **Deploy**. En ~1 minuto tendrás un enlace público `https://VinkLab-xxxx.vercel.app`.
4. Cada vez que hagas `git push`, Vercel vuelve a publicar automáticamente.

## Paso 12 · Prueba piloto y evidencias (Fases 4 y 5 de tu documento)

- Toma capturas de: vitrina, filtros, detalle con % de compatibilidad, asistente de IA y la URL pública.
- Mide con los datos de prueba: ¿las convocatorias de *Agroindustria* aparecen primero para el sensor de humedad? ¿el asistente devuelve siempre 3 recomendaciones? Anota resultados y errores corregidos.
- Para el video de demostración: graba el recorrido del Paso 9 en la URL de Vercel.

---

# Problemas comunes

| Síntoma | Solución |
|---|---|
| `npm` no se reconoce | Cierra y abre la terminal; si persiste, reinstala Node.js. |
| “Faltan NEXT_PUBLIC_SUPABASE_URL…” | El archivo debe llamarse exactamente `.env.local` y estar en la raíz; reinicia `npm run dev`. |
| La vitrina muestra “No se pudo leer la base de datos” | Ejecuta `schema.sql` (y `seed.sql`) en Supabase; revisa que las claves estén bien copiadas. |
| El asistente dice “Groq respondió 4xx” | Revisa `GROQ_API_KEY` y el nombre en `GROQ_MODEL`. |
| El matching dice “palabras clave (respaldo)” | Normal sin `HF_TOKEN`. Agrega el token para usar embeddings. |
| En Vercel funciona local pero falla en línea | Faltan variables de entorno en Vercel → *Settings → Environment Variables* → *Redeploy*. |

# Estructura

```
VinkLab/
├─ app/                 páginas y rutas API (Next.js App Router)
│  ├─ page.js           vitrina + filtros
│  ├─ proyectos/        nuevo + detalle (con ranking de convocatorias)
│  ├─ campanas/         lista + nueva + detalle (con ranking de proyectos)
│  └─ api/              asistente (Groq), proyectos, campanas, postulaciones
├─ components/          tarjetas, formularios, barra de compatibilidad
├─ lib/                 supabase.js, groq.js, matching.js, constants.js
└─ supabase/            schema.sql, seed.sql
```

# Notas técnicas y límites (para tu documento)

- **Matching:** similitud coseno entre embeddings (Hugging Face, modelo multilingüe) de proyecto y convocatoria; el puntaje final = 85 % similitud semántica + 15 % coincidencia de área. Sin `HF_TOKEN` usa bolsa de palabras + coseno. Con 10–20 proyectos el cálculo se hace en el servidor al consultar; la extensión **pgvector** ya está habilitada en el esquema para escalar a búsqueda vectorial en la base de datos (trabajo futuro).
- **Sin autenticación:** el prototipo no tiene login; cualquiera puede publicar con nombre y correo. Los correos de contacto son públicos por diseño (el contacto es por email). Añadir *Supabase Auth* es un buen trabajo futuro.
- **Seguridad:** las escrituras solo ocurren en rutas `/api` del servidor con la clave `service_role`; el navegador solo puede leer (políticas RLS).
- **Fuera de alcance (según tu documento):** pagos, chat en tiempo real y entrenamiento de modelos propios.
