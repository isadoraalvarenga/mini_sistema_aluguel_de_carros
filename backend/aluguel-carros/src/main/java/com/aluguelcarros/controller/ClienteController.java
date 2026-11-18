package com.aluguelcarros.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.aluguelcarros.model.Cliente;
import com.aluguelcarros.service.ClienteService;
import org.springframework.web.bind.annotation.PutMapping;
import jakarta.validation.Valid;

@RestController//Avisa que essa classe recebe requisições http da web e responde em json
@RequestMapping ("/clientes")//Especifica que tudo chamado na classe abaixo já é a partir do /cliente no caminho.
@CrossOrigin("*")//Libera acesso ao frontend que roda em outra porta(3000 ou a 5173) para o backend(8080)
public class ClienteController {
    @Autowired 
    private ClienteService service;

    @GetMapping 
    public List<Cliente> listar(){
        return service.listarTodosClientes();
    }

    @PostMapping
    public Cliente cadastrar(@Valid @RequestBody Cliente cliente){
        return service.salvarCliente(cliente);
    }

    @PostMapping("/login")
    public Cliente login(@RequestBody Cliente dadosLogin) {
        return service.login(dadosLogin.getCpf(), dadosLogin.getSenha());
}

    @PutMapping("/{id}")
    public Cliente atualizar(@Valid @PathVariable Long id, @RequestBody Cliente dados) {
    return service.atualizarCliente(id, dados);
}

    @DeleteMapping ("/{id}")
    public void deletar(@PathVariable Long id){
        service.excluirCliente(id);
    }

    
}
