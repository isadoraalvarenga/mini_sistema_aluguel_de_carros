package com.aluguelcarros.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.aluguelcarros.model.Cliente;
import com.aluguelcarros.repository.ClienteRepository;
import java.util.List;

@Service 
public class ClienteService{
    @Autowired 
    private ClienteRepository repository;

    public Cliente salvarCliente(Cliente cliente){
        return repository.save(cliente);
    }

    public List<Cliente> listarTodosClientes(){
        return repository.findAll();
    }

    public void excluirCliente(Long id){
        repository.deleteById(id);
    }

    public Cliente login(String cpf, String senha) {
    return repository.findByCpfAndSenha(cpf, senha);
}

public Cliente atualizarCliente(Long id, Cliente dados) {
    Cliente existente = repository.findById(id).orElseThrow();
    existente.setNome(dados.getNome());
    existente.setCpf(dados.getCpf());
    existente.setRg(dados.getRg());
    existente.setEndereco(dados.getEndereco());
    existente.setProfissao(dados.getProfissao());
    return repository.save(existente);
}

}

