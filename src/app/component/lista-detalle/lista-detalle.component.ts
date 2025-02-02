import { Component } from '@angular/core';
import { DetalleFactura } from '../../modelos/detalle-factura';
import { Factura } from '../../modelos/factura';
import { Router, ActivatedRoute } from '@angular/router';
import { FacturaService } from '../../servicio/factura.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-detalle',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lista-detalle.component.html',
  styleUrl: './lista-detalle.component.css'
})
export class ListaDetalleComponent {

  
  detallesFactura: DetalleFactura[] = [];
  idFactura: number = 0;
  numeroFactura: string = "";
  totalIVA: number = 0;
  totalGeneral: number = 0;
  mostrarFormulario: boolean = false;
  textoBoton!: string;
  detalleFactura: DetalleFactura = <DetalleFactura>{}
  //defino un objeto de tipo detalle factura

  detalle = {
    cantidad: 1,
    concepto: '',
    precio: 0,
    tipo_iva: 0
  };





  constructor(
    private route: ActivatedRoute,
    private facturaService: FacturaService,
    private peticion: FacturaService,
    private ruta: Router
  ) {

    this.detalleFactura = {
      id: 0,
      id_factura: 0,
      cantidad: 0,
      concepto: "",
      precio: 0,
      tipo_iva: 0,
      iva: 0,
      total: 0
    }
  }



  ngOnInit() {
    const params = this.route.snapshot.params;

    this.idFactura = Number(params['id']);
    this.numeroFactura = params['numero'];

    console.log("IdFactura Capturada: " + this.idFactura);

    this.facturaService.detalleFactura(this.idFactura).subscribe(datos => {
      console.log("Datos de la factura: ", datos);

      this.detallesFactura = datos.map((detalle: DetalleFactura) => { // Especificar el tipo
        const iva = this.calcularIVA(detalle.precio, detalle.cantidad, detalle.tipo_iva);
        const total = this.calcularTotal(detalle.precio, detalle.cantidad, detalle.tipo_iva);

        this.totalIVA += iva;
        this.totalGeneral += total;

        return {
          ...detalle,
          iva: iva,
          total: total
        };
      });
    });

  }


  calcularIVA(precio: number, cantidad:number, tipoIVA: number): number {
    return parseFloat(((precio *  cantidad) *(tipoIVA / 100)).toFixed(2));
  }


  calcularTotal(precio: number, cantidad:number, tipoIVA: number): number {
    return parseFloat(((precio *cantidad) + this.calcularIVA(precio, cantidad, tipoIVA)).toFixed(2));
  }


  private actualizarTotales() {
    this.totalIVA = this.detallesFactura.reduce((sum, d) => sum + d.iva, 0);
    this.totalGeneral = this.detallesFactura.reduce((sum, d) => sum + d.total, 0);
  }

  anadirDetalleFactura() {

  }

  abrirCerrarFormulario(valor: number, detalle: DetalleFactura) {

    if (valor == 0) {
      this.textoBoton = "Añadir línea de detalle"
      this.mostrarFormulario = !this.mostrarFormulario;
      this.detalleFactura = {
        id: 0,
        id_factura: 0,
        cantidad: 0,
        concepto: "",
        precio: 0,
        tipo_iva: 0,
        iva: 0,
        total: 0
      }

    } else if (valor == 1) {
      this.textoBoton = "Modificar línea de detalle"
      if (this.mostrarFormulario == false) {
        this.mostrarFormulario = !this.mostrarFormulario; //true
      }

      this.detalleFactura = detalle


    }


  }


  onSubmit(form: DetalleFactura) {

    console.log("form: ", form);
    console.log("this.detallesFactura: ", this.detallesFactura);
    console.log(" Factura: ", this.detallesFactura, " en proceso de ser añadida o modificada. ");
    console.log("form.id: " + form);

    form["id_factura"] = this.idFactura;
    //al no traer del form el id factura hay que ponerlo

    if (form.id == 0) {
      this.peticion.anadirDetalleFactura(form).subscribe(data => {
        console.log("DATA. " + data);
        console.log('Factura actualizada:', data);
        this.detallesFactura = data.map((detalle: DetalleFactura) => {
          return {
            ...detalle,
            iva: this.calcularIVA(detalle.precio, detalle.cantidad, detalle.tipo_iva),
            total: this.calcularTotal(detalle.precio,detalle.cantidad, detalle.tipo_iva)
          };
        });
        this.actualizarTotales();
      });
    }else{

      this.peticion.editarDetalle(this.detalleFactura, this.idFactura).subscribe({
        next: res => {
          this.detallesFactura = res.map((detalle: DetalleFactura) => {
            return {
              ...detalle,
              iva: this.calcularIVA(detalle.precio,detalle.cantidad, detalle.tipo_iva),
              total: this.calcularTotal(detalle.precio,detalle.cantidad, detalle.tipo_iva)
            };
          });
          this.actualizarTotales();
          this.abrirCerrarFormulario(0,this.detalleFactura);
        },
        error: err => console.error('Error al modificar detalle', err)
      });
    }


    

  }

  eliminarDetalle(id: number, id_factura: number) {
    if (confirm('¿Estás seguro de eliminar este Detalle?')) {
      this.peticion.eliminarDetalleFactura(id, id_factura).subscribe({
        next: res => {
          console.log('Detalle eliminado:', res);
          this.detallesFactura = res.map((detalle: DetalleFactura) => {
            return {
              ...detalle,
              iva: this.calcularIVA(detalle.precio,detalle.cantidad, detalle.tipo_iva),
              total: this.calcularTotal(detalle.precio,detalle.cantidad, detalle.tipo_iva)
            };
          });
          this.actualizarTotales();
          console.log("this.detallesFactura: " + this.detallesFactura);


        },
        error: err => console.error('Error al eliminar detalle:', err)
      });
    }
  }




}
