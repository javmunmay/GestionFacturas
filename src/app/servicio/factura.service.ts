import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Factura } from '../modelos/factura';
import { DetalleFactura } from '../modelos/detalle-factura';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private url: string = "../../../BACKEND/servidor.php";


  constructor(private http: HttpClient) { }


  listarFacturas() {
    let cuerpo = JSON.stringify({
      servicio: "facturas"
    });
    return this.http.post<Factura[]>(this.url, cuerpo);
    //Persona[] al poner esto te va a dar un array de personas y 
    //si no lo pongo esta mal y no me va a dar un array
  }

  detalleFactura(id: number) {
    let cuerpo = JSON.stringify({
      servicio: "detalle",
      id: id
    });
    return this.http.post<DetalleFactura[]>(this.url, cuerpo);
    //Persona[] al poner esto te va a dar un array de personas y 
    //si no lo pongo esta mal y no me va a dar un array
  }

  
  anadirDetalleFactura(detalle: DetalleFactura) {
    let cuerpo = JSON.stringify({
      servicio: "anade",
      detalle: detalle
    });
    return this.http.post<DetalleFactura[]>(this.url, cuerpo);
  }

  
  eliminarDetalleFactura(id: number, id_factura:number) {
    let cuerpo = {
      servicio: "borra",
      id: id,
      id_factura: id_factura
    };
    console.log("Detalle eliminado con ID:", id);
    return this.http.post<DetalleFactura[]>(this.url, cuerpo);
  }


  editarDetalle(detalle: DetalleFactura, id_factura: number) {
    detalle["id_factura"] = id_factura;

    const cuerpo = {
      servicio: "modifica",
      detalle: detalle
      
    };
    return this.http.post<DetalleFactura[]>(this.url, cuerpo);
  }
}
