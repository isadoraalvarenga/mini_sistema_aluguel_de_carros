package com.aluguelcarros.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.aluguelcarros.model.Agente;
import com.aluguelcarros.repository.AgenteRepository;

@Service
public class AgenteService {

    @Autowired
    private AgenteRepository repository;

    public List<Agente> listarTodos() {
        return repository.findAll();
    }

    public Agente salvar(Agente agente) {
        return repository.save(agente);
    }

    public Agente login(String cnpj, String senha) {
        return repository.findByCnpjAndSenha(cnpj, senha);
    }
}