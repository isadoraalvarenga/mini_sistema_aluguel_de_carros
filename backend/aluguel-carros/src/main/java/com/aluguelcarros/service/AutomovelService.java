package com.aluguelcarros.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.aluguelcarros.model.Automovel;
import com.aluguelcarros.repository.AutomovelRepository;

@Service
public class AutomovelService {

    @Autowired
    private AutomovelRepository repository;

    public List<Automovel> listarTodos() {
        return repository.findAll();
    }

    public Automovel salvar(Automovel automovel) {
        return repository.save(automovel);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}