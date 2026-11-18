package com.aluguelcarros.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.*;

@Entity
//define essa classe como uma Tabela no banco de dados
public class Cliente {

//Atributos
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    //@define como primary Key no banco de dados, e o segundo @ faz com que o próprio banco crie um id automaticamente
    private Long id;//id único

    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    @Pattern(regexp = "\\d{11}", message = "CPF deve ter 11 números")
    private String cpf;
    private String rg;
    private String endereco;
    private String profissao;
    private String senha;

//Construtor
    public Cliente(){}

//Getters, onde "disponibilizamos/enviamos" um dado
    public Long getId() {
        return this.id;
    }

    public String getNome(){
        return this.nome;
    }

    public String getCpf(){
        return this.cpf;
    }

    public String getRg(){
        return this.rg;
    }

    public String getEndereco(){
        return  this.endereco;
    }

    public String getProfissao(){
        return this.profissao;
    }

    public String getSenha(){
        return this.senha;
    }

//Setters, onde recebemos o que o usuário enviou, precisamos de parametros, correspondente ao que o usuário mandou, e o this.x para especificar que é um atributo dessa classe
    public void setId(Long id) {
        this.id = id;
    }

    public void setNome(String nome){
        this.nome = nome;
    }

    public void setCpf(String cpf){
        this.cpf = cpf;
    }

    public void setRg(String rg){
        this.rg = rg;
    }

    public void setEndereco(String endereco){
        this.endereco = endereco;
    }

    public void setProfissao(String profissao){
        this.profissao = profissao;
    }

    public void setSenha(String senha){
        this.senha = senha;
    }

}

