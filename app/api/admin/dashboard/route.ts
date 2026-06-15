import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/api-auth'

const NOTION_HEADERS = {
  'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
}

async function queryDB(dbId: string, body: object) {
  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers: NOTION_HEADERS,
    body: JSON.stringify(body),
  })
  return res.json()
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const mesActual = MESES[now.getMonth()]

  // Últimos 12 meses para el revenue chart (el cliente recorta a 3/6/12)
  const mesesHistorial: { label: string; start: string; end: string }[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    mesesHistorial.push({
      label: d.toLocaleDateString('es-AR', { month: 'short' }),
      start: d.toISOString(),
      end: new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString(),
    })
  }

  const [proyectosActivos, proyectosMes, presupuetosPendientes, proyectosRecientes, gastosTodos, conMantenimiento, ...historialResults] = await Promise.all([
    queryDB(process.env.NOTION_PROYECTOS_DB_ID!, {
      filter: { property: 'Estado', select: { does_not_equal: 'Cerrado' } },
    }),
    queryDB(process.env.NOTION_PROYECTOS_DB_ID!, {
      filter: {
        and: [
          { property: 'Estado', select: { equals: 'Cerrado' } },
          { property: 'Fecha entrega', date: { on_or_after: startOfMonth } },
        ],
      },
    }),
    queryDB(process.env.NOTION_PRESUPUESTOS_DB_ID!, {
      filter: {
        or: [
          { property: 'Estado', select: { equals: 'Enviado' } },
          { property: 'Estado', select: { equals: 'En negociacion' } },
          { property: 'Estado', select: { equals: 'En revisión' } },
        ],
      },
      sorts: [{ timestamp: 'created_time', direction: 'ascending' }],
    }),
    queryDB(process.env.NOTION_PROYECTOS_DB_ID!, {
      sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }],
      page_size: 5,
    }),
    queryDB(process.env.NOTION_GASTOS_DB_ID!, {
      filter: {
        and: [
          { property: 'Nombre', title: { is_not_empty: true } },
          { property: 'Mes', select: { equals: mesActual } },
        ],
      },
    }),
    queryDB(process.env.NOTION_PROYECTOS_DB_ID!, {
      filter: { property: 'Mantenimiento', checkbox: { equals: true } },
    }),
    ...mesesHistorial.map(m => queryDB(process.env.NOTION_PROYECTOS_DB_ID!, {
      filter: {
        and: [
          { property: 'Estado', select: { equals: 'Cerrado' } },
          { property: 'Fecha entrega', date: { on_or_after: m.start } },
          { property: 'Fecha entrega', date: { before: m.end } },
        ],
      },
    })),
  ])

  const ingresosMes = proyectosMes.results?.reduce((acc: number, p: any) => {
    return acc + (p.properties?.['Monto Total USD']?.number ?? p.properties?.['Precio USD']?.number ?? 0)
  }, 0) ?? 0

  const gastosMes = gastosTodos.results?.reduce((acc: number, g: any) => {
    return acc + (g.properties?.Monto?.number ?? 0)
  }, 0) ?? 0

  // Ingreso recurrente por mantenimiento (MRR) — plata que entra cada mes
  const mantenimientoMes = conMantenimiento.results?.reduce((acc: number, p: any) => {
    return acc + (p.properties?.['Mantenimiento USD']?.number ?? 0)
  }, 0) ?? 0

  const balanceMes = ingresosMes + mantenimientoMes - gastosMes

  // Seguimiento: presupuestos pendientes sin respuesta hace > 7 días
  const DIAS_ALERTA = 7
  const seguimiento = (presupuetosPendientes.results ?? []).map((p: any) => {
    const dias = Math.floor((now.getTime() - new Date(p.created_time).getTime()) / 86400000)
    return {
      proyecto: p.properties?.Proyecto?.title?.[0]?.plain_text ?? 'Sin nombre',
      cliente: p.properties?.Cliente?.rich_text?.[0]?.plain_text ?? '',
      estado: p.properties?.Estado?.select?.name ?? '',
      monto: p.properties?.['Monto USD']?.number ?? null,
      dias,
    }
  }).filter((p: any) => p.dias >= DIAS_ALERTA)
    .sort((a: any, b: any) => b.dias - a.dias)

  const historialMeses = mesesHistorial.map((m, i) => ({
    label: m.label,
    ingresos: historialResults[i]?.results?.reduce((acc: number, p: any) => acc + (p.properties?.['Monto Total USD']?.number ?? p.properties?.['Precio USD']?.number ?? 0), 0) ?? 0,
  }))

  const recientes = proyectosRecientes.results?.map((p: any) => ({
    nombre: p.properties?.Name?.title?.[0]?.plain_text ?? 'Sin nombre',
    estado: p.properties?.Estado?.select?.name ?? '',
    editado: p.last_edited_time,
  })) ?? []

  return NextResponse.json({
    proyectosActivos: proyectosActivos.results?.length ?? 0,
    cerradosMes: proyectosMes.results?.length ?? 0,
    ingresosMes,
    gastosMes,
    mantenimientoMes,
    balanceMes,
    presupuestosPendientes: presupuetosPendientes.results?.length ?? 0,
    seguimiento,
    recientes,
    historialMeses,
  })
}
