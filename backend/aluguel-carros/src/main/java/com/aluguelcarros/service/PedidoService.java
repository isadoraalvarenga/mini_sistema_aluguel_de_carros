package com.aluguelcarros.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.aluguelcarros.model.Pedido;
import com.aluguelcarros.repository.PedidoRepository;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository repository;

    public List<Pedido> listarTodos() {
        return repository.findAll();
    }

    public Pedido criar(Pedido pedido) {
        if (pedido.getStatus() == null || pedido.getStatus().isEmpty()) {
            pedido.setStatus("PENDENTE");
        }
        return repository.save(pedido);
    }

    public Pedido atualizarStatus(Long id, String novoStatus) {
        Pedido pedido = repository.findById(id).orElseThrow();
        pedido.setStatus(novoStatus.replace("\"", ""));
        return repository.save(pedido);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}