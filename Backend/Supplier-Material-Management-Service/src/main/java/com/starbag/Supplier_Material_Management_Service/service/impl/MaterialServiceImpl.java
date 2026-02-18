package com.starbag.Supplier_Material_Management_Service.service.impl;

import com.starbag.Supplier_Material_Management_Service.dto.MatterialDto;
import com.starbag.Supplier_Material_Management_Service.repository.MaterialRepository;
import com.starbag.Supplier_Material_Management_Service.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository repository;

    @Override
    public List<MatterialDto> getAllMaterials(){
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }
}
