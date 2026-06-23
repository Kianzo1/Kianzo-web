export type PDFPresupuestoData = {
  proyecto: string
  cliente: string
  empresa: string
  telefono: string
  email: string
  fechaEmision: string
  descripcion: string
  alcanceIncluye: string
  alcanceNoIncluye: string
  fechaInicio: string
  fechaEntrega: string
  duracionEstimada: string
  monto: number | null
  anticipo: number | null
  saldo: number | null
  formaDePago: string
  rondasRevision: number | null
  contrataMantenimiento: boolean
  valorMantenimiento: number | null
  periodicidadMantenimiento: string
  servicio: string
}

export type PresupuestoData = PDFPresupuestoData & {
  id: string
  proyecto: string
  cliente: string
  empresa: string
  telefono: string
  email: string
  fechaEmision: string
  descripcion: string
  alcanceIncluye: string
  alcanceNoIncluye: string
  fechaInicio: string
  fechaEntrega: string
  duracionEstimada: string
  monto: number | null
  anticipo: number | null
  saldo: number | null
  formaDePago: string
  rondasRevision: number | null
  contrataMantenimiento: boolean
  valorMantenimiento: number | null
  periodicidadMantenimiento: string
  servicio: string
  estado: string
  creado: string
}

export type PresupuestoSummary = {
  id: string
  proyecto: string
  cliente: string
  estado: string
  monto: number | null
  servicio: string
  creado: string
}
