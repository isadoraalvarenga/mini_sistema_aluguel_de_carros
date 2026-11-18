package com.aluguelcarros.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aluguelcarros.model.Automovel;

public interface AutomovelRepository extends JpaRepository<Automovel, Long>{

}
