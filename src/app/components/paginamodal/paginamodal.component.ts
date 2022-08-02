import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DataTree } from 'src/app/entidades/data-tree';
import { DadosArvoreService } from 'src/app/servicos/dados-arvore.service';
import { IdsSelecionadosService } from 'src/app/servicos/ids-selecionados.service';
import { ArvoreSimpleDataComponent } from '../arvore-simple-data/arvore-simple-data.component';

@Component({
  selector: 'app-paginamodal',
  templateUrl: './paginamodal.component.html',
  styleUrls: ['./paginamodal.component.css']
})
export class PaginamodalComponent implements AfterViewInit {

  mostrar: boolean = true;
  showOverlay: boolean = true;

  @ViewChild('tree_simple') treeSimple: ArvoreSimpleDataComponent | undefined;

  data$: Observable<DataTree[] | undefined> | undefined;
  alldata: DataTree[] | undefined;

  constructor(
    private service: DadosArvoreService,
    private idsSelServ: IdsSelecionadosService
  ) {
    this.data$ = this.service.getInitialData();
    this.alldata = this.service.getData();
  }

  ngAfterViewInit(): void {
    this.loadInitialData();
  }

  toggle() {
    this.mostrar = !this.mostrar;
    if (this.mostrar) { this.loadInitialData(); }
  }

  private loadInitialData(): void {
    this.data$?.subscribe(data => {
      if (data === undefined) { return; }
      this.treeSimple?.setData(data);
    });
  }

  public getSelecionadosServico(): void {
    if (this.idsSelServ === undefined) { return; }
    console.log(this.idsSelServ.getIdsSelecionados());
  }

  public getSelecionadosServicoItemSelecionado(): string[] | undefined {
    if (this.idsSelServ === undefined) { return undefined; }
    return this.idsSelServ.getItemsSelecionados()?.map(item => item.toString());
  }

}