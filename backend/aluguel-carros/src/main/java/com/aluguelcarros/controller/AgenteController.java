package com.aluguelcarros.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.aluguelcarros.model.Agente;
import com.aluguelcarros.service.AgenteService;

@RestController
@RequestMapping("/agentes")
@CrossOrigin("*")
public class AgenteController {

    @Autowired
    private AgenteService service;

    @GetMapping
    public List<Agente> listar() {
        return service.listarTodos();
    }

    @PostMapping
    public Agente cadastrar(@RequestBody Agente agente) {
        return service.salvar(agente);
    }

    @PostMapping("/login")
    public Agente login(@RequestBody Agente dadosLogin) {
        return service.login(dadosLogin.getCnpj(), dadosLogin.getSenha());
    }
}