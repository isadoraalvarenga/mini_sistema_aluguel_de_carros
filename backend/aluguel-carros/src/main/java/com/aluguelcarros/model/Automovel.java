package com.aluguelcarros.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity 
public class Automovel {
    
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String marca;
    private String modelo;
    private Integer ano;
    private String placa;
    private String matricula;

    public Long getId() {
        return id;
    }

    public String getMarca() {
        return marca;
    }
    
    public String getModelo() {
        return modelo;
    }
    
    public Integer getAno() {
        return ano;
    }
    
    public String getPlaca() {
        return placa;
    }
    
    public String getMatricula() {
        return matricula;
    }


    public void setId(Long id) {
    this.id = id;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }
    
}
