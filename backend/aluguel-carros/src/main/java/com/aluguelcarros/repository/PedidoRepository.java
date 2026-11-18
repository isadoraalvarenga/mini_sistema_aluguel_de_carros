package com.aluguelcarros.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aluguelcarros.model.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}
