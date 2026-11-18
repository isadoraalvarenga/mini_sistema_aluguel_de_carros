package com.aluguelcarros.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aluguelcarros.model.Agente;

public interface AgenteRepository extends JpaRepository<Agente, Long> {
    Agente findByCnpjAndSenha(String cnpj, String senha);

} 
