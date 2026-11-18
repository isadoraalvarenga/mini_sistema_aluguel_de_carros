package com.aluguelcarros.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity 
public class Pedido {
    
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;
    @ManyToOne @JoinColumn(name = "cliente_id")
    private Cliente cliente;
    @ManyToOne @JoinColumn(name = "automovel_id")
    private Automovel automovel;
    private String dataPedido;
    private String status;

    public Long getId() {
        return id;
    }
    public Cliente getCliente() {
        return cliente;
    }
    public Automovel getAutomovel() {
        return automovel;
    }
    public String getDataPedido() {
        return dataPedido;
    }
    public String getStatus() {
        return status;
    }


    public void setId(Long id) {
        this.id = id;
    }
    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
    public void setAutomovel(Automovel automovel) {
        this.automovel = automovel;
    }
    public void setDataPedido(String dataPedido) {
        this.dataPedido = dataPedido;
    }
    public void setStatus(String status) {
        this.status = status;
    }

}
