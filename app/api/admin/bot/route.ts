import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/api-auth'
import { listarTareas, crearTarea, eliminarTarea } from '@/lib/tareas-store'
import { setConfig } from '@/lib/config-store'
import { gcalCreate, gcalDelete } from '@/lib/gcal'

const HEADERS_NOTION = {
  'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
}

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const MES_ACTUAL = MESES[new Date().getMonth()]
const AÑO_ACTUAL = new Date().getFullYear()
const HOY_ISO = new Date().toISOString().slice(0, 10)

const SYSTEM_PROMPT = `Sos el asistente interno de Kianzo, una agencia de diseño y desarrollo web.
Tu trabajo es interpretar mensajes en lenguaje natural (español informal rioplatense) y devolver SOLO un JSON con la acción a ejecutar. Sin texto extra, sin markdown, solo JSON válido.

Acciones disponibles:

1. Crear gasto:
{ "accion": "crear_gasto", "nombre": "...", "monto": 40, "categoria": "Software", "mes": "Julio", "fijo": true, "notas": "..." }
Categorías válidas: Hosting, Software, Marketing, Herramientas, Servicios, Impuestos, Educación, Otro
Mes actual si no se especifica: ${MES_ACTUAL}

2. Crear presupuesto:
{ "accion": "crear_presupuesto", "proyecto": "...", "cliente": "...", "monto": 800, "servicio": "Landing Page", "descripcion": "..." }
Servicios válidos: Landing Page, Web Institucional, E-commerce, App Móvil, Mantenimiento, Diseño, Otro

3. Consultar gastos del mes:
{ "accion": "consultar_gastos", "mes": "Julio" }

4. Consultar proyectos activos:
{ "accion": "consultar_proyectos" }

5. Consultar presupuestos pendientes:
{ "accion": "consultar_presupuestos" }

6. Consultar balance financiero (ingresos vs gastos, ganancia neta):
{ "accion": "consultar_balance", "mes": "Julio" }

7. Consultar seguimiento (presupuestos sin respuesta hace varios días):
{ "accion": "consultar_seguimiento" }

8. Editar/actualizar un gasto existente (por nombre). Solo incluí los campos que cambian:
{ "accion": "editar_gasto", "buscar": "Vercel", "monto": 45, "categoria": "Software", "fijo": true, "notas": "..." }

9. Eliminar un gasto (por nombre):
{ "accion": "eliminar_gasto", "buscar": "Vercel" }

10. Cambiar el estado de un presupuesto (por nombre de proyecto o cliente):
{ "accion": "cambiar_estado_presupuesto", "buscar": "Carnicería", "estado": "Aprobado" }
Estados válidos: Borrador, Enviado, En negociacion, En revisión, Aprobado, Cerrado, Rechazado

11. Consultar info de un cliente (sus proyectos y presupuestos):
{ "accion": "consultar_cliente", "nombre": "Juan" }

12. Crear una tarea en la agenda/kanban. Fecha en formato YYYY-MM-DD (hoy si no se especifica). tipo: llamada, videollamada, reunion, proyecto, otro:
{ "accion": "crear_tarea", "titulo": "Llamar a Juan", "fecha": "2026-06-16", "hora": "15:30", "tipo": "llamada" }
Hoy es ${HOY_ISO}. "mañana" = el día siguiente, "el lunes" = próximo lunes, etc. Calculá la fecha real.

13. Eliminar tareas. filtro: "todas" (borra todo), "hoy" (las de hoy), o un texto para buscar por título:
{ "accion": "eliminar_tareas", "filtro": "todas" }

14. Consultar tareas. cuando: "hoy", "semana" o "todas":
{ "accion": "consultar_tareas", "cuando": "hoy" }

15. Respuesta sin acción (preguntas generales, saludos, consultas que no ejecutan nada):
{ "accion": "respuesta", "mensaje": "..." }

16. Alertas proactivas del negocio (qué alertas tengo / novedades / estado del negocio / qué está pendiente):
{ "accion": "alertas" }

17. Crear una nota / idea en el brainstorm. color opcional: Bordeaux, Azul, Esmeralda, Violeta, Ambar, Gris:
{ "accion": "crear_nota", "titulo": "...", "contenido": "...", "color": "Azul" }

18. Eliminar una nota/idea (por texto del título):
{ "accion": "eliminar_nota", "buscar": "..." }

19. Consultar notas/ideas guardadas:
{ "accion": "consultar_notas" }

20. Cambiar el estado de un PROYECTO (por nombre o cliente). Útil para el pipeline de Cobros:
{ "accion": "cambiar_estado_proyecto", "buscar": "...", "estado": "En desarrollo" }
Estados válidos de proyecto: En desarrollo, Activo, En curso, Pausado, Anticipo cobrado, Correcciones, Activo mantenimiento, Cerrado, Cancelado

21. Activar/desactivar mantenimiento de un proyecto (con monto mensual opcional):
{ "accion": "mantenimiento_proyecto", "buscar": "...", "activar": true, "montoUSD": 30 }

22. Configurar el panel (nombre del saludo y/o meta mensual de ingresos USD):
{ "accion": "configurar", "nombre": "Kianzo", "metaMensual": 5000 }

23. Crear un PROYECTO nuevo (cuando un trabajo ya arranca, no es presupuesto). estado por defecto "En desarrollo":
{ "accion": "crear_proyecto", "nombre": "...", "cliente": "...", "monto": 1200, "servicio": "Landing Page", "estado": "En desarrollo" }
Servicios válidos: Landing Page, Web Institucional, E-commerce, App Móvil, Mantenimiento, Diseño, Otro
Estados válidos: En desarrollo, Activo, En curso, Pausado, Anticipo cobrado, Correcciones, Activo mantenimiento, Cerrado, Cancelado

Reglas:
- Si el usuario dice "gasto Vercel $40 fijo" → crear_gasto con nombre Vercel, monto 40, fijo true
- Si dice "presupuesto para Juan, landing $800" → crear_presupuesto
- Si dice "cuánto gasté en julio" → consultar_gastos mes Julio
- Si dice "cómo voy de plata" / "balance" / "cuánto gané" → consultar_balance
- Si dice "subí Vercel a 45" / "cambiá el gasto Vercel a 45" → editar_gasto buscar Vercel monto 45
- Si dice "borrá el gasto Vercel" / "eliminá Netflix" → eliminar_gasto
- Si dice "aprobá el presupuesto de la carnicería" / "marcá como cerrado X" → cambiar_estado_presupuesto
- Si dice "qué tiene Juan" / "info de cliente Juan" → consultar_cliente
- Si dice "agregá tarea llamar a Juan mañana" / "recordame reunión el viernes 16hs" → crear_tarea (calculá la fecha real desde hoy ${HOY_ISO})
- Si dice "borrá todas las tareas" → eliminar_tareas filtro todas. "borrá las tareas de hoy" → filtro hoy. "borrá la tarea de la reunión" → filtro "reunión"
- Si dice "qué tengo hoy" / "tareas de la semana" → consultar_tareas
- Si dice "qué alertas tengo" / "novedades" / "cómo está el negocio" / "resumen" / "qué está pendiente" → alertas
- Si dice "anotá la idea de X" / "guardá una nota X" / "se me ocurre X" → crear_nota
- Si dice "borrá la nota X" / "eliminá la idea X" → eliminar_nota. "qué ideas tengo" / "mostrame las notas" → consultar_notas
- Si dice "pasá el proyecto X a desarrollo" / "marcá X como cobrado" / "mové X a cerrado" → cambiar_estado_proyecto
- Si dice "activá mantenimiento de X a 30" / "sacá el mantenimiento de X" → mantenimiento_proyecto (activar true/false, montoUSD si lo dice)
- Si dice "cambiá mi nombre a X" / "poné la meta del mes en 5000" / "meta mensual 5000" → configurar
- Si dice "creá el proyecto X para Y" / "arrancamos el proyecto X" / "nuevo proyecto X" → crear_proyecto (distinto de presupuesto: el proyecto ya está en marcha)
- Inferí campos faltantes con sentido común. Si algo es ambiguo, creá con lo que tenés.
- monto siempre como número, sin $ ni USD
- fijo: true si dice "fijo", "mensual", "recurrente". false por defecto.
- mes: capitalizá correctamente (Enero, Febrero, etc.). Año actual: ${AÑO_ACTUAL}`

async function queryDB(dbId: string, body: object) {
  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST', headers: HEADERS_NOTION, body: JSON.stringify(body),
  })
  return res.json()
}

// Normaliza texto: minúsculas y sin acentos, para comparar sin importar tildes
function normalizar(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
}

// Busca una página por texto en su título. Intenta el filtro de Notion y,
// si no hay match (ej. por acentos), hace fallback con comparación normalizada en JS.
async function buscarPorTitulo(dbId: string, prop: string, texto: string) {
  const data = await queryDB(dbId, {
    filter: { property: prop, title: { contains: texto } },
    page_size: 5,
  })
  if ((data.results ?? []).length > 0) return data.results

  // Fallback: traer todo y comparar sin acentos
  const all = await queryDB(dbId, {
    filter: { property: prop, title: { is_not_empty: true } },
    page_size: 100,
  })
  const q = normalizar(texto)
  return (all.results ?? []).filter((p: any) => {
    const t = p.properties?.[prop]?.title?.[0]?.plain_text ?? ''
    return normalizar(t).includes(q)
  })
}

async function ejecutarAccion(accion: any) {
  switch (accion.accion) {

    case 'crear_gasto': {
      const mesGasto = accion.mes ?? MES_ACTUAL  // siempre asignar un mes para que aparezca en el panel
      const res = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST', headers: HEADERS_NOTION,
        body: JSON.stringify({
          parent: { database_id: process.env.NOTION_GASTOS_DB_ID },
          properties: {
            Nombre: { title: [{ text: { content: accion.nombre ?? 'Sin nombre' } }] },
            ...(accion.monto && { Monto: { number: Number(accion.monto) } }),
            ...(accion.categoria && { Categoria: { select: { name: accion.categoria } } }),
            Mes: { select: { name: mesGasto } },
            Fijo: { checkbox: accion.fijo ?? false },
            ...(accion.notas && { Notas: { rich_text: [{ text: { content: accion.notas } }] } }),
          },
        }),
      })
      if (!res.ok) throw new Error('Error al crear gasto en Notion')
      return { ok: true, mensaje: `✓ Gasto **${accion.nombre}** de $${accion.monto ?? 0} registrado en **${mesGasto}**${accion.fijo ? ' (fijo)' : ''}.\n_Ya aparece en Gastos._` }
    }

    case 'crear_presupuesto': {
      const res = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST', headers: HEADERS_NOTION,
        body: JSON.stringify({
          parent: { database_id: process.env.NOTION_PRESUPUESTOS_DB_ID },
          properties: {
            Proyecto: { title: [{ text: { content: accion.proyecto ?? 'Sin nombre' } }] },
            ...(accion.cliente && { Cliente: { rich_text: [{ text: { content: accion.cliente } }] } }),
            ...(accion.monto && { 'Monto USD': { number: Number(accion.monto) } }),
            ...(accion.servicio && { Servicio: { select: { name: accion.servicio } } }),
            Estado: { select: { name: 'Borrador' } },
            ...(accion.descripcion && { Descripción: { rich_text: [{ text: { content: accion.descripcion } }] } }),
          },
        }),
      })
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(`Notion: ${e?.message ?? 'no se pudo crear el presupuesto'}`) }
      return { ok: true, mensaje: `✓ Presupuesto **${accion.proyecto}** para ${accion.cliente ?? 'cliente'} creado como Borrador${accion.monto ? ` · $${accion.monto}` : ''}.` }
    }

    case 'consultar_gastos': {
      const mes = accion.mes ?? MES_ACTUAL
      const res = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_GASTOS_DB_ID}/query`, {
        method: 'POST', headers: HEADERS_NOTION,
        body: JSON.stringify({
          filter: { and: [
            { property: 'Nombre', title: { is_not_empty: true } },
            { property: 'Mes', select: { equals: mes } },
          ]},
          sorts: [{ timestamp: 'created_time', direction: 'descending' }],
        }),
      })
      const data = await res.json()
      const gastos = data.results ?? []
      const total = gastos.reduce((s: number, g: any) => s + (g.properties?.Monto?.number ?? 0), 0)
      const items = gastos.slice(0, 5).map((g: any) => `• ${g.properties?.Nombre?.title?.[0]?.plain_text ?? '?'}: $${g.properties?.Monto?.number ?? 0}`)
      return { ok: true, mensaje: `**Gastos de ${mes}:** $${total} total (${gastos.length} registros)\n${items.join('\n')}${gastos.length > 5 ? `\n…y ${gastos.length - 5} más` : ''}` }
    }

    case 'consultar_proyectos': {
      const res = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_PROYECTOS_DB_ID}/query`, {
        method: 'POST', headers: HEADERS_NOTION,
        body: JSON.stringify({
          filter: { and: [
            { property: 'Name', title: { is_not_empty: true } },
            { property: 'Estado', select: { does_not_equal: 'Cerrado' } },
          ]},
          page_size: 10,
        }),
      })
      const data = await res.json()
      const proyectos = data.results ?? []
      const items = proyectos.map((p: any) => `• ${p.properties?.Name?.title?.[0]?.plain_text ?? '?'} — ${p.properties?.Estado?.select?.name ?? 'Sin estado'}`)
      return { ok: true, mensaje: `**${proyectos.length} proyectos activos:**\n${items.join('\n')}` }
    }

    case 'consultar_presupuestos': {
      const res = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_PRESUPUESTOS_DB_ID}/query`, {
        method: 'POST', headers: HEADERS_NOTION,
        body: JSON.stringify({
          filter: { and: [
            { property: 'Proyecto', title: { is_not_empty: true } },
            { property: 'Estado', select: { does_not_equal: 'Cerrado' } },
          ]},
          sorts: [{ timestamp: 'created_time', direction: 'descending' }],
          page_size: 8,
        }),
      })
      const data = await res.json()
      const presupuestos = data.results ?? []
      const items = presupuestos.map((p: any) => {
        const monto = p.properties?.['Monto USD']?.number
        return `• ${p.properties?.Proyecto?.title?.[0]?.plain_text ?? '?'} — ${p.properties?.Estado?.select?.name ?? '?'}${monto ? ` · $${monto}` : ''}`
      })
      return { ok: true, mensaje: `**${presupuestos.length} presupuestos pendientes:**\n${items.join('\n')}` }
    }

    case 'consultar_balance': {
      const mes = accion.mes ?? MES_ACTUAL
      const mesIdx = MESES.indexOf(mes)
      const año = AÑO_ACTUAL
      const inicioMes = new Date(año, mesIdx, 1).toISOString()
      const finMes = new Date(año, mesIdx + 1, 1).toISOString()

      const [gastosData, proyData, mantData] = await Promise.all([
        queryDB(process.env.NOTION_GASTOS_DB_ID!, {
          filter: { and: [
            { property: 'Nombre', title: { is_not_empty: true } },
            { property: 'Mes', select: { equals: mes } },
          ]},
        }),
        queryDB(process.env.NOTION_PROYECTOS_DB_ID!, {
          filter: { and: [
            { property: 'Estado', select: { equals: 'Cerrado' } },
            { property: 'Fecha entrega', date: { on_or_after: inicioMes } },
            { property: 'Fecha entrega', date: { before: finMes } },
          ]},
        }),
        queryDB(process.env.NOTION_PROYECTOS_DB_ID!, {
          filter: { property: 'Mantenimiento', checkbox: { equals: true } },
        }),
      ])
      const gastos = (gastosData.results ?? []).reduce((s: number, g: any) => s + (g.properties?.Monto?.number ?? 0), 0)
      const ingresos = (proyData.results ?? []).reduce((s: number, p: any) => s + (p.properties?.['Monto Total USD']?.number ?? p.properties?.['Precio USD']?.number ?? 0), 0)
      const mantenimiento = (mantData.results ?? []).reduce((s: number, p: any) => s + (p.properties?.['Mantenimiento USD']?.number ?? 0), 0)
      const neto = ingresos + mantenimiento - gastos
      const signo = neto >= 0 ? '🟢 Ganancia' : '🔴 Pérdida'
      return { ok: true, mensaje: `**Balance de ${mes}:**\n• Proyectos: $${ingresos}\n• Mantenimiento: $${mantenimiento}\n• Gastos: $${gastos}\n• **${signo} neta: $${Math.abs(neto)}**` }
    }

    case 'consultar_seguimiento': {
      const data = await queryDB(process.env.NOTION_PRESUPUESTOS_DB_ID!, {
        filter: { or: [
          { property: 'Estado', select: { equals: 'Enviado' } },
          { property: 'Estado', select: { equals: 'En negociacion' } },
          { property: 'Estado', select: { equals: 'En revisión' } },
        ]},
        sorts: [{ timestamp: 'created_time', direction: 'ascending' }],
      })
      const now = Date.now()
      const pendientes = (data.results ?? []).map((p: any) => {
        const dias = Math.floor((now - new Date(p.created_time).getTime()) / 86400000)
        return { nombre: p.properties?.Proyecto?.title?.[0]?.plain_text ?? '?', cliente: p.properties?.Cliente?.rich_text?.[0]?.plain_text ?? '', dias }
      }).filter((p: any) => p.dias >= 7)
      if (pendientes.length === 0) return { ok: true, mensaje: '✓ No hay presupuestos pendientes de seguimiento. Todo al día.' }
      const items = pendientes.map((p: any) => `• ${p.nombre}${p.cliente ? ` (${p.cliente})` : ''} — hace ${p.dias} días`)
      return { ok: true, mensaje: `**${pendientes.length} presupuesto(s) para hacer follow-up:**\n${items.join('\n')}` }
    }

    case 'editar_gasto': {
      const matches = await buscarPorTitulo(process.env.NOTION_GASTOS_DB_ID!, 'Nombre', accion.buscar ?? '')
      if (matches.length === 0) return { ok: false, mensaje: `No encontré ningún gasto que diga "${accion.buscar}".` }
      const pagina = matches[0]
      const props: any = {}
      if (accion.nombre) props.Nombre = { title: [{ text: { content: accion.nombre } }] }
      if (accion.monto != null) props.Monto = { number: Number(accion.monto) }
      if (accion.categoria) props.Categoria = { select: { name: accion.categoria } }
      if (accion.mes) props.Mes = { select: { name: accion.mes } }
      if (accion.fijo != null) props.Fijo = { checkbox: !!accion.fijo }
      if (accion.notas) props.Notas = { rich_text: [{ text: { content: accion.notas } }] }
      const res = await fetch(`https://api.notion.com/v1/pages/${pagina.id}`, {
        method: 'PATCH', headers: HEADERS_NOTION, body: JSON.stringify({ properties: props }),
      })
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(`Notion: ${e?.message ?? 'no se pudo editar'}`) }
      const nombre = pagina.properties?.Nombre?.title?.[0]?.plain_text ?? accion.buscar
      return { ok: true, mensaje: `✓ Gasto **${nombre}** actualizado.\n_Ya se reflejó en Gastos._` }
    }

    case 'eliminar_gasto': {
      const matches = await buscarPorTitulo(process.env.NOTION_GASTOS_DB_ID!, 'Nombre', accion.buscar ?? '')
      if (matches.length === 0) return { ok: false, mensaje: `No encontré ningún gasto que diga "${accion.buscar}".` }
      const pagina = matches[0]
      const res = await fetch(`https://api.notion.com/v1/pages/${pagina.id}`, {
        method: 'PATCH', headers: HEADERS_NOTION, body: JSON.stringify({ archived: true }),
      })
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(`Notion: ${e?.message ?? 'no se pudo eliminar'}`) }
      const nombre = pagina.properties?.Nombre?.title?.[0]?.plain_text ?? accion.buscar
      return { ok: true, mensaje: `🗑️ Gasto **${nombre}** eliminado.\n_Ya se quitó de Gastos._` }
    }

    case 'cambiar_estado_presupuesto': {
      let matches = await buscarPorTitulo(process.env.NOTION_PRESUPUESTOS_DB_ID!, 'Proyecto', accion.buscar ?? '')
      // Si no encontró por proyecto, buscar por cliente (rich_text)
      if (matches.length === 0) {
        const data = await queryDB(process.env.NOTION_PRESUPUESTOS_DB_ID!, {
          filter: { property: 'Cliente', rich_text: { contains: accion.buscar ?? '' } }, page_size: 5,
        })
        matches = data.results ?? []
      }
      if (matches.length === 0) return { ok: false, mensaje: `No encontré ningún presupuesto que diga "${accion.buscar}".` }
      const pagina = matches[0]
      const res = await fetch(`https://api.notion.com/v1/pages/${pagina.id}`, {
        method: 'PATCH', headers: HEADERS_NOTION,
        body: JSON.stringify({ properties: { Estado: { select: { name: accion.estado } } } }),
      })
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(`Notion: ${e?.message ?? 'no se pudo cambiar el estado'}`) }
      const nombre = pagina.properties?.Proyecto?.title?.[0]?.plain_text ?? accion.buscar
      return { ok: true, mensaje: `✓ Presupuesto **${nombre}** ahora está en estado **${accion.estado}**.\n_Ya se actualizó en Presupuestos._` }
    }

    case 'consultar_cliente': {
      const nombre = accion.nombre ?? ''
      const [presData, proyData] = await Promise.all([
        queryDB(process.env.NOTION_PRESUPUESTOS_DB_ID!, {
          filter: { property: 'Cliente', rich_text: { contains: nombre } }, page_size: 20,
        }),
        queryDB(process.env.NOTION_PROYECTOS_DB_ID!, {
          filter: { property: 'Cliente', rich_text: { contains: nombre } }, page_size: 20,
        }),
      ])
      const pres = presData.results ?? []
      const proy = proyData.results ?? []
      if (pres.length === 0 && proy.length === 0) return { ok: false, mensaje: `No encontré nada de "${nombre}".` }
      const totalProy = proy.reduce((s: number, p: any) => s + (p.properties?.['Monto Total USD']?.number ?? p.properties?.['Precio USD']?.number ?? 0), 0)
      const lineasProy = proy.slice(0, 5).map((p: any) => `• ${p.properties?.Name?.title?.[0]?.plain_text ?? '?'} — ${p.properties?.Estado?.select?.name ?? '?'}`)
      const lineasPres = pres.slice(0, 5).map((p: any) => `• ${p.properties?.Proyecto?.title?.[0]?.plain_text ?? '?'} — ${p.properties?.Estado?.select?.name ?? '?'}`)
      let msg = `**Cliente: ${nombre}**\n${proy.length} proyecto(s) · ${pres.length} presupuesto(s)`
      if (totalProy > 0) msg += ` · facturado: $${totalProy}`
      if (lineasProy.length) msg += `\n\n_Proyectos:_\n${lineasProy.join('\n')}`
      if (lineasPres.length) msg += `\n\n_Presupuestos:_\n${lineasPres.join('\n')}`
      return { ok: true, mensaje: msg }
    }

    case 'crear_tarea': {
      const t = await crearTarea({
        titulo: accion.titulo,
        fecha: accion.fecha || HOY_ISO,
        hora: accion.hora || '',
        tipo: accion.tipo || 'otro',
      })
      gcalCreate(t).catch(() => {}) // sincronizar con Google Calendar
      const fechaTxt = t.fecha === HOY_ISO ? 'hoy' : t.fecha
      return { ok: true, mensaje: `✓ Tarea **${t.titulo}** agregada para ${fechaTxt}${t.hora ? ` a las ${t.hora}` : ''}.\n_Mirá la Agenda._` }
    }

    case 'eliminar_tareas': {
      const filtro = (accion.filtro ?? '').toString().toLowerCase().trim()
      const todas = await listarTareas()
      let aBorrar = todas
      if (filtro === 'hoy') aBorrar = todas.filter(t => t.fecha === HOY_ISO)
      else if (filtro && filtro !== 'todas') aBorrar = todas.filter(t => normalizar(t.titulo).includes(normalizar(filtro)))
      if (aBorrar.length === 0) return { ok: false, mensaje: 'No encontré tareas que borrar con ese criterio.' }
      for (const t of aBorrar) { gcalDelete(t.id).catch(() => {}); await eliminarTarea(t.id) }  // secuencial: evita race del store de archivo
      const detalle = filtro === 'todas' ? 'todas las tareas' : filtro === 'hoy' ? 'las tareas de hoy' : `las que decían "${accion.filtro}"`
      return { ok: true, mensaje: `🗑️ Borré ${detalle} (${aBorrar.length}).\n_Ya se actualizó la Agenda._` }
    }

    case 'consultar_tareas': {
      const cuando = (accion.cuando ?? 'hoy').toString().toLowerCase()
      const todas = (await listarTareas()).filter(t => !t.hecha)
      let lista = todas
      if (cuando === 'hoy') lista = todas.filter(t => t.fecha === HOY_ISO)
      else if (cuando === 'semana') {
        const hoy = new Date(); const fin = new Date(); fin.setDate(hoy.getDate() + 7)
        const finISO = fin.toISOString().slice(0, 10)
        lista = todas.filter(t => t.fecha >= HOY_ISO && t.fecha <= finISO)
      }
      lista.sort((a, b) => (a.fecha + (a.hora || '99')).localeCompare(b.fecha + (b.hora || '99')))
      if (lista.length === 0) return { ok: true, mensaje: cuando === 'hoy' ? '✓ No tenés tareas pendientes para hoy.' : 'No hay tareas pendientes en ese período.' }
      const items = lista.slice(0, 10).map(t => `• ${t.fecha === HOY_ISO ? 'Hoy' : t.fecha}${t.hora ? ` ${t.hora}` : ''} — ${t.titulo}`)
      return { ok: true, mensaje: `**Tareas (${cuando}):**\n${items.join('\n')}${lista.length > 10 ? `\n…y ${lista.length - 10} más` : ''}` }
    }

    case 'alertas': {
      const now = Date.now()
      const hoy = new Date()
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString()

      const [presData, proyData, sinFechaData] = await Promise.all([
        // Presupuestos en seguimiento (enviados/negociación/revisión)
        queryDB(process.env.NOTION_PRESUPUESTOS_DB_ID!, {
          filter: { or: [
            { property: 'Estado', select: { equals: 'Enviado' } },
            { property: 'Estado', select: { equals: 'En negociacion' } },
            { property: 'Estado', select: { equals: 'En revisión' } },
          ]},
          sorts: [{ timestamp: 'created_time', direction: 'ascending' }],
        }),
        // Proyectos cerrados este mes para revenue
        queryDB(process.env.NOTION_PROYECTOS_DB_ID!, {
          filter: { and: [
            { property: 'Estado', select: { equals: 'Cerrado' } },
            { property: 'Fecha entrega', date: { on_or_after: inicioMes } },
          ]},
        }),
        // Proyectos activos sin fecha de entrega
        queryDB(process.env.NOTION_PROYECTOS_DB_ID!, {
          filter: { and: [
            { property: 'Estado', select: { does_not_equal: 'Cerrado' } },
            { property: 'Fecha entrega', date: { is_empty: true } },
            { property: 'Name', title: { is_not_empty: true } },
          ]},
          page_size: 20,
        }),
      ])

      const alertas: string[] = []

      // 1. Presupuestos sin respuesta hace > 7 días
      const sinRespuesta = (presData.results ?? []).map((p: any) => {
        const dias = Math.floor((now - new Date(p.created_time).getTime()) / 86400000)
        return { nombre: p.properties?.Proyecto?.title?.[0]?.plain_text ?? '?', cliente: p.properties?.Cliente?.rich_text?.[0]?.plain_text ?? '', dias, estado: p.properties?.Estado?.select?.name ?? '' }
      }).filter((p: any) => p.dias >= 7).sort((a: any, b: any) => b.dias - a.dias)

      if (sinRespuesta.length > 0) {
        const items = sinRespuesta.map((p: any) => `  • ${p.nombre}${p.cliente ? ` (${p.cliente})` : ''} — **${p.dias} días** sin respuesta`)
        alertas.push(`🔔 **${sinRespuesta.length} presupuesto(s) para hacer follow-up:**\n${items.join('\n')}`)
      }

      // 2. Proyectos activos sin fecha de entrega
      const sinFecha = sinFechaData.results ?? []
      if (sinFecha.length > 0) {
        const items = sinFecha.slice(0, 5).map((p: any) => `  • ${p.properties?.Name?.title?.[0]?.plain_text ?? '?'} — ${p.properties?.Estado?.select?.name ?? 'sin estado'}`)
        alertas.push(`📅 **${sinFecha.length} proyecto(s) sin fecha de entrega:**\n${items.join('\n')}`)
      }

      // 3. Revenue del mes
      const revMes = (proyData.results ?? []).reduce((s: number, p: any) => s + (p.properties?.['Monto Total USD']?.number ?? p.properties?.['Precio USD']?.number ?? 0), 0)
      const cerradosMes = proyData.results?.length ?? 0
      if (cerradosMes > 0) {
        alertas.push(`💰 **${cerradosMes} proyecto(s) cerrado(s) este mes** · $${revMes} facturados`)
      } else {
        alertas.push(`💡 **Todavía no cerraste ningún proyecto este mes.** Buen momento para hacer seguimiento.`)
      }

      if (alertas.length === 0) return { ok: true, mensaje: '✓ Todo en orden. No hay alertas pendientes.' }
      return { ok: true, mensaje: alertas.join('\n\n') }
    }

    case 'crear_nota': {
      if (!process.env.NOTION_NOTAS_DB_ID) return { ok: false, mensaje: 'La sección de Notas todavía no está configurada.' }
      const colores = ['Bordeaux','Azul','Esmeralda','Violeta','Ambar','Gris']
      const color = colores.includes(accion.color) ? accion.color : 'Bordeaux'
      const res = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST', headers: HEADERS_NOTION,
        body: JSON.stringify({
          parent: { database_id: process.env.NOTION_NOTAS_DB_ID },
          properties: {
            Titulo: { title: [{ text: { content: accion.titulo ?? 'Sin título' } }] },
            ...(accion.contenido && { Contenido: { rich_text: [{ text: { content: String(accion.contenido).slice(0, 1900) } }] } }),
            Color: { select: { name: color } },
            Fijada: { checkbox: false },
          },
        }),
      })
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(`Notion: ${e?.message ?? 'no se pudo crear la nota'}`) }
      return { ok: true, mensaje: `💡 Idea **${accion.titulo}** guardada en el brainstorm.\n_Mirala en Ideas & Notas._` }
    }

    case 'eliminar_nota': {
      const matches = await buscarPorTitulo(process.env.NOTION_NOTAS_DB_ID!, 'Titulo', accion.buscar ?? '')
      if (matches.length === 0) return { ok: false, mensaje: `No encontré ninguna nota que diga "${accion.buscar}".` }
      const pagina = matches[0]
      const res = await fetch(`https://api.notion.com/v1/pages/${pagina.id}`, {
        method: 'PATCH', headers: HEADERS_NOTION, body: JSON.stringify({ archived: true }),
      })
      if (!res.ok) throw new Error('No se pudo eliminar la nota')
      const titulo = pagina.properties?.Titulo?.title?.[0]?.plain_text ?? accion.buscar
      return { ok: true, mensaje: `🗑️ Nota **${titulo}** eliminada.` }
    }

    case 'consultar_notas': {
      const data = await queryDB(process.env.NOTION_NOTAS_DB_ID!, {
        sorts: [{ timestamp: 'created_time', direction: 'descending' }], page_size: 10,
      })
      const notas = data.results ?? []
      if (notas.length === 0) return { ok: true, mensaje: 'Todavía no hay ideas guardadas. Decime "anotá la idea de…" y la guardo.' }
      const items = notas.slice(0, 8).map((n: any) => `• ${n.properties?.Titulo?.title?.[0]?.plain_text ?? '?'}${n.properties?.Fijada?.checkbox ? ' 📌' : ''}`)
      return { ok: true, mensaje: `**${notas.length} idea(s) guardada(s):**\n${items.join('\n')}` }
    }

    case 'cambiar_estado_proyecto': {
      let matches = await buscarPorTitulo(process.env.NOTION_PROYECTOS_DB_ID!, 'Name', accion.buscar ?? '')
      if (matches.length === 0) {
        const data = await queryDB(process.env.NOTION_PROYECTOS_DB_ID!, {
          filter: { property: 'Cliente', rich_text: { contains: accion.buscar ?? '' } }, page_size: 5,
        })
        matches = data.results ?? []
      }
      if (matches.length === 0) return { ok: false, mensaje: `No encontré ningún proyecto que diga "${accion.buscar}".` }
      const pagina = matches[0]
      const res = await fetch(`https://api.notion.com/v1/pages/${pagina.id}`, {
        method: 'PATCH', headers: HEADERS_NOTION,
        body: JSON.stringify({ properties: { Estado: { select: { name: accion.estado } } } }),
      })
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(`Notion: ${e?.message ?? 'no se pudo cambiar el estado'}`) }
      const nombre = pagina.properties?.Name?.title?.[0]?.plain_text ?? accion.buscar
      return { ok: true, mensaje: `✓ Proyecto **${nombre}** ahora está en **${accion.estado}**.\n_Se actualizó en Proyectos y Cobros._` }
    }

    case 'mantenimiento_proyecto': {
      let matches = await buscarPorTitulo(process.env.NOTION_PROYECTOS_DB_ID!, 'Name', accion.buscar ?? '')
      if (matches.length === 0) {
        const data = await queryDB(process.env.NOTION_PROYECTOS_DB_ID!, {
          filter: { property: 'Cliente', rich_text: { contains: accion.buscar ?? '' } }, page_size: 5,
        })
        matches = data.results ?? []
      }
      if (matches.length === 0) return { ok: false, mensaje: `No encontré ningún proyecto que diga "${accion.buscar}".` }
      const pagina = matches[0]
      const activar = accion.activar !== false
      const props: any = { Mantenimiento: { checkbox: activar } }
      if (activar && accion.montoUSD != null) props['Mantenimiento USD'] = { number: Number(accion.montoUSD) }
      if (!activar) props['Mantenimiento USD'] = { number: null }
      const res = await fetch(`https://api.notion.com/v1/pages/${pagina.id}`, {
        method: 'PATCH', headers: HEADERS_NOTION, body: JSON.stringify({ properties: props }),
      })
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(`Notion: ${e?.message ?? 'no se pudo actualizar'}`) }
      const nombre = pagina.properties?.Name?.title?.[0]?.plain_text ?? accion.buscar
      return { ok: true, mensaje: activar
        ? `✓ Mantenimiento activado en **${nombre}**${accion.montoUSD != null ? ` · $${accion.montoUSD}/mes` : ''}.`
        : `✓ Mantenimiento desactivado en **${nombre}**.` }
    }

    case 'configurar': {
      const partial: any = {}
      if (accion.nombre !== undefined) partial.nombre = String(accion.nombre).trim() || 'Kianzo'
      if (accion.metaMensual !== undefined) {
        const n = Number(accion.metaMensual)
        partial.metaMensual = isNaN(n) || n < 0 ? 0 : n
      }
      if (Object.keys(partial).length === 0) return { ok: false, mensaje: 'Decime qué querés configurar: el nombre o la meta mensual.' }
      try {
        const c = await setConfig(partial)
        const partes = []
        if (partial.nombre !== undefined) partes.push(`nombre **${c.nombre}**`)
        if (partial.metaMensual !== undefined) partes.push(c.metaMensual > 0 ? `meta mensual **USD ${c.metaMensual.toLocaleString('es-AR')}**` : 'meta mensual desactivada')
        return { ok: true, mensaje: `✓ Listo: ${partes.join(' y ')}.\n_Se ve en el Dashboard y Configuración._` }
      } catch (e: any) {
        return { ok: false, mensaje: `No pude guardar: ${e?.message ?? 'falta configurar la base de Config en Notion'}` }
      }
    }

    case 'crear_proyecto': {
      const estado = accion.estado || 'En desarrollo'
      const res = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST', headers: HEADERS_NOTION,
        body: JSON.stringify({
          parent: { database_id: process.env.NOTION_PROYECTOS_DB_ID },
          properties: {
            Name: { title: [{ text: { content: accion.nombre ?? 'Nuevo proyecto' } }] },
            ...(accion.cliente && { Cliente: { rich_text: [{ text: { content: accion.cliente } }] } }),
            ...(accion.servicio && { Servicio: { select: { name: accion.servicio } } }),
            Estado: { select: { name: estado } },
          },
        }),
      })
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(`Notion: ${e?.message ?? 'no se pudo crear el proyecto'}`) }
      // Monto en patch aparte (nombre de propiedad que puede variar)
      if (accion.monto != null) {
        const page = await res.json()
        await fetch(`https://api.notion.com/v1/pages/${page.id}`, {
          method: 'PATCH', headers: HEADERS_NOTION,
          body: JSON.stringify({ properties: { 'Monto Total USD': { number: Number(accion.monto) } } }),
        }).catch(() => {})
      }
      return { ok: true, mensaje: `✓ Proyecto **${accion.nombre}**${accion.cliente ? ` para ${accion.cliente}` : ''} creado en **${estado}**${accion.monto ? ` · $${accion.monto}` : ''}.\n_Ya aparece en Proyectos._` }
    }

    case 'respuesta':
      return { ok: true, mensaje: accion.mensaje }

    default:
      return { ok: false, mensaje: 'No entendí esa acción.' }
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'API key de Anthropic no configurada. Agregá ANTHROPIC_API_KEY en .env.local' }, { status: 500 })
  }

  const { mensaje, historial = [] } = await request.json()

  // Llamar a Claude
  const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [
        ...historial.slice(-6), // últimos 3 intercambios para contexto
        { role: 'user', content: mensaje },
      ],
    }),
  })

  if (!claudeRes.ok) {
    const err = await claudeRes.json()
    return NextResponse.json({ error: err.error?.message ?? 'Error de Claude' }, { status: 500 })
  }

  const claudeData = await claudeRes.json()
  const rawText = claudeData.content?.[0]?.text ?? '{}'

  // Limpiar posibles code fences de markdown (```json ... ```) que Claude a veces agrega
  let limpio = rawText.trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()

  // Si quedó texto fuera del JSON, extraer solo el objeto { ... }
  const match = limpio.match(/\{[\s\S]*\}/)
  if (match) limpio = match[0]

  let accion: any
  try {
    accion = JSON.parse(limpio)
  } catch {
    accion = { accion: 'respuesta', mensaje: rawText }
  }

  try {
    const resultado = await ejecutarAccion(accion)
    return NextResponse.json({ ...resultado, accion: accion.accion })
  } catch (e: any) {
    return NextResponse.json({ ok: false, mensaje: `⚠️ ${e?.message ?? 'Error al ejecutar la acción en Notion'}` })
  }
}
