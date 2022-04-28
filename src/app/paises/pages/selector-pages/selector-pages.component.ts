import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall, Pais } from '../../interfaces/paices.interface';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-pages',
  templateUrl: './selector-pages.component.html'
})
export class SelectorPagesComponent implements OnInit {

  miFormulario: FormGroup=this.formBuilder.group({
    region:['', [Validators.required]],
    pais:['',[Validators.required]],
    frontera:['',[Validators.required]]
  })

  //Llenar Selectores
  regiones:string[]=[];
  paises:PaisSmall[]=[];
  // fronteras:string[]=[]; 
  fronteras:PaisSmall[]=[];

  //UI
  cargando:boolean=false;


  constructor(private formBuilder:FormBuilder,
              private paisesService:PaisesService) { }

  ngOnInit(): void {
    this.regiones=this.paisesService.regiones

    //Cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
   
    .pipe(
      tap(( _ ) =>{
        this.miFormulario.get('pais')?.reset('');
        this.cargando=true;
      }),
      switchMap(region=> this.paisesService.getPaisesporRegion(region)), 
    )
    .subscribe(paises=>{
      this.paises=paises;
      this.cargando=false;
    })


    //Cuando cambie el pais
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap(()=>{
        this.miFormulario.get('frontera')?.reset('')
        this.cargando=true;
      }),
      switchMap(codigo=>this.paisesService.getPaisPorCodigo(codigo)),
      switchMap(pais=>this.paisesService.getPaisesPorCodigos(pais?.borders!))
    )
      .subscribe(paises=>{
      // this.fronteras=pais?.borders||[];
      this.fronteras=paises;
      this.cargando=false;
    })

  }

  guardar(){
    console.log(this.miFormulario.value);
  }

}
