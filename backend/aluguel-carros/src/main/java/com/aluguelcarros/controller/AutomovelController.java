package com.aluguelcarros.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.aluguelcarros.model.Automovel;
import com.aluguelcarros.service.AutomovelService;

@RestController
@RequestMapping("/automoveis")
@CrossOrigin("*")
public class AutomovelController {

    @Autowired
    private AutomovelService service;

    @GetMapping
    public List<Automovel> listar() {
        return service.listarTodos();
    }

    @PostMapping
    public Automovel cadastrar(@RequestBody Automovel automovel) {
        return service.salvar(automovel);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.excluir(id);
    }
}